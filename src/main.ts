import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')

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
}
