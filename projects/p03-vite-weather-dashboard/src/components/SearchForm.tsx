import { useState } from "react";
import type { Unit } from "../lib/weather.js";

interface SearchFormProps {
  onSearch: (query: string) => void;
  unit: Unit;
  onToggleUnit: () => void;
}

/** A controlled search box plus a unit toggle. */
export function SearchForm({ onSearch, unit, onToggleUnit }: SearchFormProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <label htmlFor="city">City</label>
      <input
        id="city"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a city…"
      />
      <button type="submit" disabled={query.trim().length === 0}>
        Search
      </button>
      <button type="button" onClick={onToggleUnit} aria-label="Toggle temperature unit">
        °{unit === "celsius" ? "C" : "F"}
      </button>
    </form>
  );
}
