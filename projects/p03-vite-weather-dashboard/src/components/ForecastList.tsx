import type { DailyForecast, Unit } from "../lib/weather.js";
import { averageHigh, describeCode, formatTemp, weekday } from "../lib/weather.js";

interface ForecastListProps {
  daily: readonly DailyForecast[];
  unit: Unit;
}

/** A multi-day forecast strip with a small average-high summary. */
export function ForecastList({ daily, unit }: ForecastListProps) {
  if (daily.length === 0) return <p>No forecast available.</p>;

  return (
    <section aria-label="Forecast">
      <p className="summary">Average high: {formatTemp(averageHigh(daily), unit)}</p>
      <ul className="forecast">
        {daily.map((day) => {
          const { icon, label } = describeCode(day.code);
          return (
            <li key={day.date} className="forecast-day">
              <span className="day">{weekday(day.date)}</span>
              <span className="icon" title={label} aria-hidden>
                {icon}
              </span>
              <span className="hi">{formatTemp(day.maxC, unit)}</span>
              <span className="lo">{formatTemp(day.minC, unit)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
