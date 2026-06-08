import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WeatherCard } from "./WeatherCard.js";
import type { Weather } from "../lib/weather.js";

const weather: Weather = {
  location: "Lisbon",
  current: { tempC: 20, windKph: 12, windDeg: 270, code: 0 },
  daily: [],
};

describe("<WeatherCard>", () => {
  it("renders the location, condition and wind direction", () => {
    render(<WeatherCard weather={weather} unit="celsius" />);
    expect(screen.getByRole("heading", { name: "Lisbon" })).toBeInTheDocument();
    expect(screen.getByText("Clear sky")).toBeInTheDocument();
    expect(screen.getByText(/Wind 12 km\/h W/)).toBeInTheDocument();
  });

  it("formats the temperature in the chosen unit", () => {
    const { rerender } = render(<WeatherCard weather={weather} unit="celsius" />);
    expect(screen.getByText("20°C")).toBeInTheDocument();
    rerender(<WeatherCard weather={weather} unit="fahrenheit" />);
    expect(screen.getByText("68°F")).toBeInTheDocument();
  });
});
