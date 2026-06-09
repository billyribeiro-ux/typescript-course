# Project P05 — Redux Toolkit Enterprise Admin

A users-admin dashboard built with **Redux Toolkit + React-Redux + TypeScript**,
demonstrating the enterprise state pattern: normalized entities, typed slices,
memoized selectors, and pure reducers that are trivial to test. **14 tests**.

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm typecheck    # strict tsc → clean
pnpm test         # 14 tests (slices, selectors, components) → green
pnpm build        # tsc -b && vite build
```

Search/filter users, add users, change roles, toggle active, remove.

## Architecture

```
src/
  features/users/usersSlice.ts   → createEntityAdapter (normalized), pure reducers
  features/users/filtersSlice.ts → search + role filter state
  features/auth/authSlice.ts     → current user
  store.ts                       → configureStore, derived RootState/AppDispatch,
                                    pre-typed hooks, memoized createSelector(s),
                                    a makeStore() factory for isolated tests
  components/                    → UsersTable, AddUserForm, FiltersBar (typed hooks)
  test/utils.tsx                 → renderWithStore() (Provider + fresh store)
```

## What it teaches

- **createEntityAdapter** for normalized entity state (O(1) lookups, sorted selectors).
- **Immer-powered reducers** — write "mutating" code, get immutable updates.
- **Deriving types from the store** (`RootState = ReturnType<typeof store.getState>`).
- **Memoized selectors** (`createSelector`) for derived data (filtered/visible users).
- **Testing Redux**: pure slice/selector tests via a `makeStore()` factory, plus
  component tests rendered inside a `<Provider>` with a fresh, preloaded store.
