/**
 * The network boundary: fetch weather and parse untrusted JSON into our typed
 * domain model. `parseWeather` is pure and tested; `fetchWeather` does the I/O.
 */
import type { DailyForecast, Weather } from "./weather.js";

/** Narrow an unknown value to a finite number, or throw. */
function num(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Expected number for "${field}"`);
  }
  return value;
}

function arr(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`Expected array for "${field}"`);
  return value;
}

/**
 * Parse an Open-Meteo-shaped response into our Weather model.
 * Throws a descriptive Error if the shape is invalid (untrusted-data safety).
 */
export function parseWeather(location: string, data: unknown): Weather {
  if (data === null || typeof data !== "object") {
    throw new Error("Malformed weather payload");
  }
  const root = data as Record<string, unknown>;
  const current = (root.current ?? {}) as Record<string, unknown>;
  const daily = (root.daily ?? {}) as Record<string, unknown>;

  const dates = arr(daily.time, "daily.time");
  const codes = arr(daily.weather_code, "daily.weather_code");
  const maxs = arr(daily.temperature_2m_max, "daily.temperature_2m_max");
  const mins = arr(daily.temperature_2m_min, "daily.temperature_2m_min");

  const forecast: DailyForecast[] = dates.map((date, i) => {
    if (typeof date !== "string") throw new Error("Invalid daily.time entry");
    return {
      date,
      code: num(codes[i], "daily.weather_code[]"),
      maxC: num(maxs[i], "daily.temperature_2m_max[]"),
      minC: num(mins[i], "daily.temperature_2m_min[]"),
    };
  });

  return {
    location,
    current: {
      tempC: num(current.temperature_2m, "current.temperature_2m"),
      windKph: num(current.wind_speed_10m, "current.wind_speed_10m"),
      windDeg: num(current.wind_direction_10m, "current.wind_direction_10m"),
      code: num(current.weather_code, "current.weather_code"),
    },
    daily: forecast,
  };
}

export interface GeoPoint {
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
}

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

/** Fetch + parse the weather for a coordinate. Uses the global fetch. */
export async function fetchWeather(point: GeoPoint, signal?: AbortSignal): Promise<Weather> {
  const params = new URLSearchParams({
    latitude: String(point.latitude),
    longitude: String(point.longitude),
    current: "temperature_2m,wind_speed_10m,wind_direction_10m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
  });
  const res = await fetch(`${FORECAST_URL}?${params}`, signal ? { signal } : {});
  if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);
  return parseWeather(point.name, await res.json());
}
