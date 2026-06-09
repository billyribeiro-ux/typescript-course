import { configureStore, createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import usersReducer, { usersAdapterSelectors } from "./features/users/usersSlice.js";
import filtersReducer from "./features/users/filtersSlice.js";
import authReducer from "./features/auth/authSlice.js";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    filters: filtersReducer,
    auth: authReducer,
  },
});

// Types derived from the store (lesson 02-04: derive types from implementation).
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// A factory so tests can spin up fresh, isolated stores.
export function makeStore(preloaded?: Partial<RootState>) {
  return configureStore({
    reducer: { users: usersReducer, filters: filtersReducer, auth: authReducer },
    preloadedState: preloaded as RootState | undefined,
  });
}

// Pre-typed hooks for the whole app.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// Base entity selectors bound to this store's shape.
const usersSelectors = usersAdapterSelectors((state: RootState) => state.users);
export const selectAllUsers = usersSelectors.selectAll;
export const selectUserById = usersSelectors.selectById;

/** Memoized derived selector: users filtered by the search + role filters. */
export const selectVisibleUsers = createSelector(
  [selectAllUsers, (state: RootState) => state.filters],
  (users, filters) => {
    const q = filters.search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesRole = filters.role === "all" || u.role === filters.role;
      const matchesSearch =
        q === "" || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  },
);

export const selectCurrentUser = createSelector(
  [selectAllUsers, (state: RootState) => state.auth.currentUserId],
  (users, id) => users.find((u) => u.id === id) ?? null,
);
