import { useMemo, useState } from "react";
import type { GeoPoint } from "./lib/api.js";
import type { Unit } from "./lib/weather.js";
import { useWeather } from "./hooks/useWeather.js";
import { SearchForm } from "./components/SearchForm.js";
import { WeatherCard } from "./components/WeatherCard.js";
import { ForecastList } from "./components/ForecastList.js";

/** A tiny built-in gazetteer so the demo needs no geocoding API. */
const CITIES: Record<string, GeoPoint> = {
  lisbon: { name: "Lisbon", latitude: 38.72, longitude: -9.14 },
  london: { name: "London", latitude: 51.51, longitude: -0.13 },
  tokyo: { name: "Tokyo", latitude: 35.68, longitude: 139.69 },
  "new york": { name: "New York", latitude: 40.71, longitude: -74.01 },
};

export function App() {
  const [point, setPoint] = useState<GeoPoint | null>(CITIES.lisbon ?? null);
  const [unit, setUnit] = useState<Unit>("celsius");
  const [notFound, setNotFound] = useState<string | null>(null);
  const state = useWeather(point);

  const handleSearch = (query: string) => {
    const match = CITIES[query.toLowerCase()];
    if (match) {
      setNotFound(null);
      setPoint(match);
    } else {
      setNotFound(query);
    }
  };

  const toggleUnit = () => setUnit((u) => (u === "celsius" ? "fahrenheit" : "celsius"));

  const knownCities = useMemo(() => Object.values(CITIES).map((c) => c.name).join(", "), []);

  return (
    <main className="app">
      <h1>🌦️ Weather Dashboard</h1>
      <SearchForm onSearch={handleSearch} unit={unit} onToggleUnit={toggleUnit} />
      {notFound && (
        <p role="alert">
          Couldn’t find “{notFound}”. Try one of: {knownCities}.
        </p>
      )}

      {state.status === "loading" && <p>Loading weather…</p>}
      {state.status === "error" && <p role="alert">Error: {state.message}</p>}
      {state.status === "success" && (
        <>
          <WeatherCard weather={state.weather} unit={unit} />
          <ForecastList daily={state.weather.daily} unit={unit} />
        </>
      )}
    </main>
  );
}
