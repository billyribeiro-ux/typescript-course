import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddUserForm } from "./AddUserForm.js";
import { renderWithStore } from "../test/utils.js";
import { selectAllUsers } from "../store.js";

describe("<AddUserForm>", () => {
  it("disables submit until name + valid email are present", async () => {
    const user = userEvent.setup();
    renderWithStore(<AddUserForm />);
    const submit = screen.getByRole("button", { name: "Add user" });
    expect(submit).toBeDisabled();
    await user.type(screen.getByLabelText("Name"), "Margaret");
    await user.type(screen.getByLabelText("Email"), "not-an-email");
    expect(submit).toBeDisabled();
    await user.clear(screen.getByLabelText("Email"));
    await user.type(screen.getByLabelText("Email"), "maggie@acme.io");
    expect(submit).toBeEnabled();
  });

  it("dispatches addUser and clears the form", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<AddUserForm />);
    await user.type(screen.getByLabelText("Name"), "Margaret Hamilton");
    await user.type(screen.getByLabelText("Email"), "maggie@acme.io");
    await user.selectOptions(screen.getByLabelText("Role"), "editor");
    await user.click(screen.getByRole("button", { name: "Add user" }));

    const users = selectAllUsers(store.getState());
    expect(users.some((u) => u.email === "maggie@acme.io" && u.role === "editor")).toBe(true);
    expect(screen.getByLabelText("Name")).toHaveValue("");
  });
});
