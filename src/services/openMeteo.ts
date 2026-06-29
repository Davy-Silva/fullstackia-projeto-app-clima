import type {
  CombinedWeatherData,
  CurrentWeatherData,
  CurrentWeatherUnits,
  ForecastResponse,
  GeocodingResponse,
  GeocodingResult,
} from '../types/weather';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

function isValidCityName(cityName: string | null | undefined): cityName is string {
  return typeof cityName === 'string' && cityName.trim().length > 0;
}

function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isValidGeocodingResult(result: unknown): result is GeocodingResult {
  if (typeof result !== 'object' || result === null) {
    return false;
  }

  const candidate = result as Partial<GeocodingResult>;

  return (
    typeof candidate.name === 'string' &&
    isValidNumber(candidate.latitude) &&
    isValidNumber(candidate.longitude) &&
    typeof candidate.country_code === 'string' &&
    typeof candidate.timezone === 'string'
  );
}

function isValidCurrentWeatherData(data: unknown): data is CurrentWeatherData {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const candidate = data as Partial<CurrentWeatherData>;

  return (
    isValidNumber(candidate.temperature_2m) &&
    isValidNumber(candidate.relative_humidity_2m) &&
    isValidNumber(candidate.apparent_temperature) &&
    isValidNumber(candidate.is_day) &&
    isValidNumber(candidate.wind_speed_10m) &&
    isValidNumber(candidate.wind_direction_10m) &&
    isValidNumber(candidate.precipitation_probability) &&
    isValidNumber(candidate.weather_code) &&
    isValidNumber(candidate.precipitation)
  );
}

function isValidCurrentWeatherUnits(data: unknown): data is CurrentWeatherUnits {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const candidate = data as Partial<CurrentWeatherUnits>;

  return (
    typeof candidate.temperature_2m === 'string' &&
    typeof candidate.relative_humidity_2m === 'string' &&
    typeof candidate.apparent_temperature === 'string' &&
    typeof candidate.is_day === 'string' &&
    typeof candidate.wind_speed_10m === 'string' &&
    typeof candidate.wind_direction_10m === 'string' &&
    typeof candidate.precipitation_probability === 'string' &&
    typeof candidate.weather_code === 'string' &&
    typeof candidate.precipitation === 'string'
  );
}

export async function searchCity(cityName: string): Promise<GeocodingResult | null> {
  const normalizedCityName = typeof cityName === 'string' ? cityName.trim() : '';

  if (!isValidCityName(normalizedCityName)) {
    return null;
  }

  const url = new URL(GEOCODING_API_URL);
  url.searchParams.set('name', normalizedCityName);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'pt');
  url.searchParams.set('format', 'json');

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      return null;
    }

    const data: GeocodingResponse = await response.json();
    const firstResult = data.results?.[0];

    if (!firstResult || !isValidGeocodingResult(firstResult)) {
      return null;
    }

    return firstResult;
  } catch {
    return null;
  }
}

export async function getWeather(
  latitude: number,
  longitude: number,
  timezone: string,
): Promise<ForecastResponse | null> {
  const normalizedTimezone = typeof timezone === 'string' ? timezone.trim() : '';

  if (!isValidNumber(latitude) || !isValidNumber(longitude) || !isValidCityName(normalizedTimezone)) {
    return null;
  }

  const url = new URL(FORECAST_API_URL);
  url.searchParams.set('latitude', latitude.toString());
  url.searchParams.set('longitude', longitude.toString());
  url.searchParams.set(
    'current',
    'precipitation_probability,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,wind_direction_10m,precipitation,weather_code',
  );
  url.searchParams.set('timezone', normalizedTimezone);

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      return null;
    }

    const data: ForecastResponse = await response.json();

    if (!isValidCurrentWeatherData(data.current) || !isValidCurrentWeatherUnits(data.current_units)) {
      return null;
    }

    return {
      current: data.current,
      current_units: data.current_units,
    };
  } catch {
    return null;
  }
}

export async function searchWeather(cityName: string): Promise<CombinedWeatherData | null> {
  const geocodingResult = await searchCity(cityName);

  if (!geocodingResult) {
    return null;
  }

  const forecast = await getWeather(geocodingResult.latitude, geocodingResult.longitude, geocodingResult.timezone);

  if (!forecast || !forecast.current || !forecast.current_units) {
    return null;
  }

  return {
    ...geocodingResult,
    current: forecast.current,
    current_units: forecast.current_units,
  };
}
