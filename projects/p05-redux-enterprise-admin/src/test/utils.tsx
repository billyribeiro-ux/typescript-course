import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore, type RootState } from "../store.js";

/** Render a component wrapped in a fresh Redux Provider; returns the store too. */
export function renderWithStore(ui: ReactElement, preloaded?: Partial<RootState>) {
  const store = makeStore(preloaded);
  return { store, ...render(<Provider store={store}>{ui}</Provider>) };
}
