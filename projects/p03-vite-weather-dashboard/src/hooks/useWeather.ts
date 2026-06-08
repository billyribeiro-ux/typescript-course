/**
 * A custom hook that loads weather for a location. It models the request as a
 * discriminated union (lesson 02-07) so the UI can render each state exactly.
 * In Part 6 we replace this hand-rolled fetching with TanStack Query — but the
 * fundamentals (effect + cleanup + race guard) live here.
 */
import { useEffect, useState } from "react";
import { fetchWeather, type GeoPoint } from "../lib/api.js";
import type { Weather } from "../lib/weather.js";

export type WeatherState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; weather: Weather }
  | { status: "error"; message: string };

export function useWeather(point: GeoPoint | null): WeatherState {
  const [state, setState] = useState<WeatherState>({ status: "idle" });

  useEffect(() => {
    if (!point) {
      setState({ status: "idle" });
      return;
    }
    const controller = new AbortController();
    setState({ status: "loading" });

    fetchWeather(point, controller.signal)
      .then((weather) => {
        if (!controller.signal.aborted) setState({ status: "success", weather });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return; // ignore cancelled requests
        setState({ status: "error", message: err instanceof Error ? err.message : "Unknown error" });
      });

    return () => controller.abort(); // cancel on unmount / point change
  }, [point]);

  return state;
}
