import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useWeather } from "./useWeather.js";
import type { GeoPoint } from "../lib/api.js";
import type { Weather } from "../lib/weather.js";

// Mock the network boundary so the hook test is fast + deterministic.
vi.mock("../lib/api.js", () => ({
  fetchWeather: vi.fn(),
}));
import { fetchWeather } from "../lib/api.js";
const mockFetch = vi.mocked(fetchWeather);

const lisbon: GeoPoint = { name: "Lisbon", latitude: 38.72, longitude: -9.14 };
const weather: Weather = {
  location: "Lisbon",
  current: { tempC: 21, windKph: 12, windDeg: 270, code: 0 },
  daily: [{ date: "2026-06-08", code: 0, maxC: 22, minC: 14 }],
};

beforeEach(() => mockFetch.mockReset());

describe("useWeather", () => {
  it("is idle when no point is provided", () => {
    const { result } = renderHook(() => useWeather(null));
    expect(result.current.status).toBe("idle");
  });

  it("transitions loading → success", async () => {
    mockFetch.mockResolvedValueOnce(weather);
    const { result } = renderHook(() => useWeather(lisbon));
    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status === "success") {
      expect(result.current.weather.location).toBe("Lisbon");
    }
  });

  it("transitions loading → error on failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Weather request failed: 500"));
    const { result } = renderHook(() => useWeather(lisbon));
    await waitFor(() => expect(result.current.status).toBe("error"));
    if (result.current.status === "error") {
      expect(result.current.message).toMatch(/500/);
    }
  });
});
