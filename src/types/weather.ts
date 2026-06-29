export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  timezone: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
}

export interface CurrentWeatherData {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  precipitation_probability: number;
  weather_code: number;
  precipitation: number;
}

export interface CurrentWeatherUnits {
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  is_day: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
  precipitation_probability: string;
  weather_code: string;
  precipitation: string;
}

export interface ForecastResponse {
  current?: CurrentWeatherData;
  current_units?: CurrentWeatherUnits;
}

export interface CombinedWeatherData extends GeocodingResult {
  current: CurrentWeatherData;
  current_units: CurrentWeatherUnits;
}
