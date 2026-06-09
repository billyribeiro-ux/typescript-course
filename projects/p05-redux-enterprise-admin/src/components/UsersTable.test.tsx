import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UsersTable } from "./UsersTable.js";
import { renderWithStore } from "../test/utils.js";

describe("<UsersTable>", () => {
  it("renders a row per seeded user", () => {
    renderWithStore(<UsersTable />);
    expect(screen.getAllByTestId("user-row")).toHaveLength(3);
    expect(screen.getByText("ada@acme.io")).toBeInTheDocument();
  });

  it("removes a user when its remove button is clicked", async () => {
    const user = userEvent.setup();
    renderWithStore(<UsersTable />);
    await user.click(screen.getByRole("button", { name: "Remove Ada Lovelace" }));
    expect(screen.getAllByTestId("user-row")).toHaveLength(2);
    expect(screen.queryByText("ada@acme.io")).not.toBeInTheDocument();
  });

  it("changes a role via the select", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<UsersTable />);
    await user.selectOptions(screen.getByLabelText("Role for Linus Torvalds"), "admin");
    expect(store.getState().users.entities.u2?.role).toBe("admin");
  });

  it("respects a preloaded role filter", () => {
    renderWithStore(<UsersTable />, { filters: { search: "", role: "admin" } });
    expect(screen.getAllByTestId("user-row")).toHaveLength(1);
  });
});
