import './style.css'
import { searchWeather } from './services/openMeteo'
import { weatherCodeToPortuguese } from './utils/weatherCode'
import { getWindDirection } from './utils/windDirection'
import type { CombinedWeatherData } from './types/weather'

const sunIcon = new URL('./assets/sun.svg', import.meta.url).href
const moonIcon = new URL('./assets/moon.svg', import.meta.url).href

const app = document.querySelector<HTMLDivElement>('#app')

function formatLocalDate(timezone: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: timezone,
  }).format(new Date())
}

function renderEmptyState(sidebarContent: HTMLDivElement, mainContent: HTMLDivElement) {
  sidebarContent.innerHTML = `
    <div class="empty-state">
      <p>Pesquise uma cidade para ver o clima.</p>
    </div>
  `

  mainContent.innerHTML = `
    <div class="empty-state">
      <p>Os dados da cidade aparecerão aqui após a busca.</p>
    </div>
  `
}

function renderLoadingState(sidebarContent: HTMLDivElement, mainContent: HTMLDivElement) {
  const loadingMarkup = `
    <div class="loading-state">
      <div class="loader" aria-hidden="true"></div>
      <p>Buscando previsão...</p>
    </div>
  `

  sidebarContent.innerHTML = loadingMarkup
  mainContent.innerHTML = loadingMarkup
}

function renderResultState(data: CombinedWeatherData, sidebarContent: HTMLDivElement, mainContent: HTMLDivElement) {
  const { current, current_units, timezone } = data
  const weatherDescription = weatherCodeToPortuguese(current.weather_code)
  const dayPeriod = current.is_day === 1 ? 'Dia' : 'Noite'
  const dayIcon = current.is_day === 1 ? sunIcon : moonIcon
  const windCardinal = getWindDirection(current.wind_direction_10m)

  sidebarContent.innerHTML = `
    <div class="weather-summary">
      <div class="weather-main-info">
        <div class="weather-temperature">
          <span class="temperature-value">${current.temperature_2m.toFixed(1)}</span>
          <span class="temperature-unit">${current_units.temperature_2m}</span>
        </div>
        <div class="weather-location">
          <strong>${data.name}, ${data.country_code}</strong>
          <span>${formatLocalDate(timezone)}</span>
        </div>
      </div>

      <div class="weather-extra">
        <div class="day-period">
          <img src="${dayIcon}" alt="${dayPeriod}" />
          <span>${dayPeriod}</span>
        </div>
        <p class="weather-description">${weatherDescription}</p>
      </div>
    </div>
  `

  mainContent.innerHTML = `
    <div class="weather-metrics">
      <div class="metric-item">
        <span class="metric-label">Umidade</span>
        <strong class="metric-value">${current.relative_humidity_2m}${current_units.relative_humidity_2m}</strong>
      </div>
      <div class="metric-item">
        <span class="metric-label">Sensação térmica</span>
        <strong class="metric-value">${current.apparent_temperature.toFixed(1)}${current_units.apparent_temperature}</strong>
      </div>
      <div class="metric-item">
        <span class="metric-label">Precipitação</span>
        <strong class="metric-value">${current.precipitation_probability}${current_units.precipitation_probability}</strong>
      </div>
      <div class="metric-item">
        <span class="metric-label">Vento</span>
        <strong class="metric-value">${current.wind_speed_10m.toFixed(1)} ${current_units.wind_speed_10m} · ${current.wind_direction_10m.toFixed(0)}° (${windCardinal})</strong>
      </div>
    </div>
  `
}

function updateControls(input: HTMLInputElement, button: HTMLButtonElement, isLoading: boolean) {
  input.disabled = isLoading
  button.disabled = isLoading

  if (isLoading) {
    input.classList.add('disabled')
    button.classList.add('disabled')
  } else {
    input.classList.remove('disabled')
    button.classList.remove('disabled')
  }
}

async function handleSearch(
  cityName: string,
  sidebarContent: HTMLDivElement,
  mainContent: HTMLDivElement,
  input: HTMLInputElement,
  button: HTMLButtonElement,
) {
  const normalizedName = cityName.trim()

  if (normalizedName.length === 0) {
    renderEmptyState(sidebarContent, mainContent)
    return
  }

  renderLoadingState(sidebarContent, mainContent)
  updateControls(input, button, true)

  const weatherData = await searchWeather(normalizedName)

  updateControls(input, button, false)

  if (!weatherData) {
    renderEmptyState(sidebarContent, mainContent)
    return
  }

  renderResultState(weatherData, sidebarContent, mainContent)
}

if (app) {
  app.innerHTML = `
    <main class="app-shell">
      <header class="app-header">
        <h1>Clima</h1>
      </header>

      <section class="search-area" aria-label="Busca de cidade">
        <input type="text" placeholder="Digite o nome da cidade" aria-label="Nome da cidade" />
        <button type="button">Buscar</button>
      </section>

      <section class="weather-card" aria-label="Previsão do tempo">
        <aside class="weather-sidebar" aria-label="Resumo do tempo">
          <div class="sidebar-content" data-sidebar="content"></div>
        </aside>
        <section class="weather-main" aria-label="Detalhes do tempo">
          <div class="main-content" data-main="content"></div>
        </section>
      </section>
    </main>
  `

  const input = app.querySelector<HTMLInputElement>('.search-area input')
  const button = app.querySelector<HTMLButtonElement>('.search-area button')
  const sidebarContent = app.querySelector<HTMLDivElement>('[data-sidebar="content"]')
  const mainContent = app.querySelector<HTMLDivElement>('[data-main="content"]')

  if (input && button && sidebarContent && mainContent) {
    const search = () => handleSearch(input.value, sidebarContent, mainContent, input, button)

    button.addEventListener('click', search)
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        search()
      }
    })

    renderEmptyState(sidebarContent, mainContent)
  }
}
