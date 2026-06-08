import { describe, it, expect } from "vitest";
import {
  averageHigh,
  convertTemp,
  describeCode,
  formatTemp,
  warmestDay,
  weekday,
  windDirection,
  type DailyForecast,
} from "./weather.js";

describe("describeCode", () => {
  it("maps known WMO codes to label + icon", () => {
    expect(describeCode(0).label).toBe("Clear sky");
    expect(describeCode(3).label).toBe("Overcast");
    expect(describeCode(61).label).toBe("Rain");
    expect(describeCode(95).label).toBe("Thunderstorm");
  });
  it("falls back to Unknown for unmapped codes (the 87–94 gap)", () => {
    expect(describeCode(90).label).toBe("Unknown");
  });
});

describe("convertTemp / formatTemp", () => {
  it("leaves celsius unchanged", () => {
    expect(convertTemp(20, "celsius")).toBe(20);
  });
  it("converts to fahrenheit", () => {
    expect(convertTemp(0, "fahrenheit")).toBe(32);
    expect(convertTemp(100, "fahrenheit")).toBe(212);
  });
  it("formats with rounding and the right symbol", () => {
    expect(formatTemp(20.4, "celsius")).toBe("20°C");
    expect(formatTemp(20.6, "celsius")).toBe("21°C");
    expect(formatTemp(0, "fahrenheit")).toBe("32°F");
  });
});

describe("windDirection", () => {
  it("maps bearings to compass points", () => {
    expect(windDirection(0)).toBe("N");
    expect(windDirection(90)).toBe("E");
    expect(windDirection(180)).toBe("S");
    expect(windDirection(270)).toBe("W");
  });
  it("rounds to the nearest 45° and wraps", () => {
    expect(windDirection(22)).toBe("N"); // 22 < 22.5 → N
    expect(windDirection(23)).toBe("NE"); // 23 > 22.5 → NE
    expect(windDirection(360)).toBe("N");
    expect(windDirection(-90)).toBe("W");
  });
});

describe("weekday", () => {
  it("returns a short weekday for an ISO date", () => {
    // 2026-06-08 is a Monday
    expect(weekday("2026-06-08")).toBe("Mon");
    expect(weekday("2026-06-07")).toBe("Sun");
  });
});

const sample: DailyForecast[] = [
  { date: "2026-06-08", code: 0, maxC: 22, minC: 14 },
  { date: "2026-06-09", code: 3, maxC: 28, minC: 16 },
  { date: "2026-06-10", code: 61, maxC: 19, minC: 12 },
];

describe("warmestDay", () => {
  it("finds the warmest day", () => {
    expect(warmestDay(sample)?.date).toBe("2026-06-09");
  });
  it("returns null for an empty forecast", () => {
    expect(warmestDay([])).toBeNull();
  });
});

describe("averageHigh", () => {
  it("averages the daily highs, rounded", () => {
    expect(averageHigh(sample)).toBe(23); // (22+28+19)/3 = 23
  });
  it("is 0 for an empty forecast", () => {
    expect(averageHigh([])).toBe(0);
  });
});
