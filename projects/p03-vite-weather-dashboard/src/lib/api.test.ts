import { describe, it, expect } from "vitest";
import { parseWeather } from "./api.js";

const validPayload = {
  current: {
    temperature_2m: 21.3,
    wind_speed_10m: 12,
    wind_direction_10m: 270,
    weather_code: 3,
  },
  daily: {
    time: ["2026-06-08", "2026-06-09"],
    weather_code: [0, 61],
    temperature_2m_max: [22, 19],
    temperature_2m_min: [14, 12],
  },
};

describe("parseWeather", () => {
  it("parses a valid payload into the domain model", () => {
    const weather = parseWeather("Lisbon", validPayload);
    expect(weather.location).toBe("Lisbon");
    expect(weather.current.tempC).toBe(21.3);
    expect(weather.current.windDeg).toBe(270);
    expect(weather.daily).toHaveLength(2);
    expect(weather.daily[0]).toEqual({ date: "2026-06-08", code: 0, maxC: 22, minC: 14 });
  });

  it("throws on a non-object payload", () => {
    expect(() => parseWeather("X", null)).toThrow(/Malformed/);
    expect(() => parseWeather("X", "nope")).toThrow(/Malformed/);
  });

  it("throws when required arrays are missing", () => {
    expect(() => parseWeather("X", { current: validPayload.current, daily: {} })).toThrow(
      /Expected array/,
    );
  });

  it("throws when a numeric field is the wrong type", () => {
    const bad = {
      ...validPayload,
      current: { ...validPayload.current, temperature_2m: "warm" },
    };
    expect(() => parseWeather("X", bad)).toThrow(/Expected number/);
  });
});
