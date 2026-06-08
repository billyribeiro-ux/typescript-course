# Project P03 — Vite Weather Dashboard

The first **React** project of the course: a typed weather dashboard built with
**Vite + React 19 + TypeScript**, with a pure tested core, a custom data-fetching
hook, and components verified with **React Testing Library**. **24 tests** cover
the lib, the API parser, the hook, and the UI.

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm typecheck    # strict tsc --noEmit → clean
pnpm test         # 24 tests across 5 files → all green
pnpm build        # tsc -b && vite build → dist/
```

Search a city (Lisbon, London, Tokyo, New York) and toggle °C/°F. Live data comes
from the free Open-Meteo API (no key needed).

## Architecture (the same discipline as P01/P02)

```
src/
  lib/weather.ts   → PURE domain logic (conversions, formatting, summaries) — tested
  lib/api.ts       → network boundary: fetch + parse untrusted JSON (parseWeather is pure/tested)
  hooks/useWeather.ts → custom hook; request modeled as a discriminated union (idle/loading/success/error)
  components/      → WeatherCard, ForecastList, SearchForm (controlled) — tested with RTL
  App.tsx          → composition + unit toggle + city lookup
  test/setup.ts    → jest-dom matchers for Vitest
```

## What it demonstrates (Part 4 concepts)

- Typed props & components (04-03), `useState` (04-04), lists + keys (04-05),
  controlled forms & events (04-06), `useEffect` with cleanup + a race guard
  (04-07), and a custom hook (04-11).
- A **discriminated-union** request state (02-07) so the UI renders each state exactly.
- Untrusted JSON validated at the boundary with hand-written guards (01-11/02-08 ideas).
- **Testing patterns**: pure-function unit tests, `renderHook` with a mocked
  network module, and component tests with `@testing-library/react` +
  `user-event` under jsdom.
