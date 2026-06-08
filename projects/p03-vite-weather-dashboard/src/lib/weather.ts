/**
 * The PURE core of the weather dashboard: domain types + transformations.
 * No React, no network — just data in, data out. Heavily unit-tested.
 */

export type Unit = "celsius" | "fahrenheit";

export interface DailyForecast {
  readonly date: string; // ISO date (YYYY-MM-DD)
  readonly code: number; // WMO weather code
  readonly maxC: number;
  readonly minC: number;
}

export interface CurrentWeather {
  readonly tempC: number;
  readonly windKph: number;
  readonly windDeg: number;
  readonly code: number;
}

export interface Weather {
  readonly location: string;
  readonly current: CurrentWeather;
  readonly daily: readonly DailyForecast[];
}

/** Map a WMO weather code to a human label + emoji. */
export function describeCode(code: number): { label: string; icon: string } {
  if (code === 0) return { label: "Clear sky", icon: "☀️" };
  if (code <= 2) return { label: "Partly cloudy", icon: "🌤️" };
  if (code === 3) return { label: "Overcast", icon: "☁️" };
  if (code <= 48) return { label: "Fog", icon: "🌫️" };
  if (code <= 67) return { label: "Rain", icon: "🌧️" };
  if (code <= 77) return { label: "Snow", icon: "❄️" };
  if (code <= 82) return { label: "Rain showers", icon: "🌦️" };
  if (code <= 86) return { label: "Snow showers", icon: "🌨️" };
  if (code >= 95) return { label: "Thunderstorm", icon: "⛈️" };
  return { label: "Unknown", icon: "❓" };
}

/** Convert Celsius to the requested unit. */
export function convertTemp(celsius: number, unit: Unit): number {
  return unit === "fahrenheit" ? celsius * (9 / 5) + 32 : celsius;
}

/** Format a temperature for display, rounded, with the unit symbol. */
export function formatTemp(celsius: number, unit: Unit): string {
  const value = Math.round(convertTemp(celsius, unit));
  return `${value}°${unit === "fahrenheit" ? "F" : "C"}`;
}

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;
export type Compass = (typeof COMPASS)[number];

/** Convert a wind bearing in degrees to a compass direction. */
export function windDirection(deg: number): Compass {
  const normalized = ((deg % 360) + 360) % 360;
  const index = Math.round(normalized / 45) % 8;
  return COMPASS[index]!;
}

/** Short weekday label for an ISO date, e.g. "2026-06-08" -> "Mon". */
export function weekday(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
}

/** The warmest upcoming day in a forecast (or null if empty). */
export function warmestDay(daily: readonly DailyForecast[]): DailyForecast | null {
  if (daily.length === 0) return null;
  return daily.reduce((warmest, day) => (day.maxC > warmest.maxC ? day : warmest));
}

/** Average of the daily highs, rounded — a simple trend summary. */
export function averageHigh(daily: readonly DailyForecast[]): number {
  if (daily.length === 0) return 0;
  const sum = daily.reduce((total, day) => total + day.maxC, 0);
  return Math.round(sum / daily.length);
}
