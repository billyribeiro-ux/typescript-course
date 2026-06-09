/**
 * The users feature slice, built with Redux Toolkit's createEntityAdapter for
 * normalized, performant entity state. Reducers are pure (Immer-powered) and
 * therefore trivially unit-testable without any store or UI.
 */
import { createSlice, createEntityAdapter, nanoid, type PayloadAction } from "@reduxjs/toolkit";

export type Role = "admin" | "editor" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}

const usersAdapter = createEntityAdapter<User>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState = usersAdapter.getInitialState({}, [
  { id: "u1", name: "Ada Lovelace", email: "ada@acme.io", role: "admin", active: true },
  { id: "u2", name: "Linus Torvalds", email: "linus@acme.io", role: "editor", active: true },
  { id: "u3", name: "Grace Hopper", email: "grace@acme.io", role: "viewer", active: false },
]);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: {
      reducer: usersAdapter.addOne,
      // `prepare` lets us generate the id before the reducer runs:
      prepare: (input: { name: string; email: string; role: Role }) => ({
        payload: { id: nanoid(), active: true, ...input } satisfies User,
      }),
    },
    removeUser: usersAdapter.removeOne, // payload: id
    setRole: (state, action: PayloadAction<{ id: string; role: Role }>) => {
      const user = state.entities[action.payload.id];
      if (user) user.role = action.payload.role; // Immer "mutation"
    },
    toggleActive: (state, action: PayloadAction<string>) => {
      const user = state.entities[action.payload];
      if (user) user.active = !user.active;
    },
    renameUser: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const user = state.entities[action.payload.id];
      const name = action.payload.name.trim();
      if (user && name) user.name = name;
    },
  },
});

export const { addUser, removeUser, setRole, toggleActive, renameUser } = usersSlice.actions;
export default usersSlice.reducer;

// Adapter selectors, parameterized over the root state shape (set in store.ts).
export const usersAdapterSelectors = usersAdapter.getSelectors;
