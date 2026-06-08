import type { Unit, Weather } from "../lib/weather.js";
import { describeCode, formatTemp, windDirection } from "../lib/weather.js";

interface WeatherCardProps {
  weather: Weather;
  unit: Unit;
}

/** Shows the current conditions for a location. */
export function WeatherCard({ weather, unit }: WeatherCardProps) {
  const { current, location } = weather;
  const { label, icon } = describeCode(current.code);

  return (
    <section className="weather-card" aria-label={`Current weather in ${location}`}>
      <h2>{location}</h2>
      <p className="temp">
        <span className="icon" aria-hidden>
          {icon}
        </span>
        <span>{formatTemp(current.tempC, unit)}</span>
      </p>
      <p className="condition">{label}</p>
      <p className="wind">
        Wind {Math.round(current.windKph)} km/h {windDirection(current.windDeg)}
      </p>
    </section>
  );
}
