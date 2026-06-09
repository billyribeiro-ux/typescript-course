import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddCardForm } from "./AddCardForm.js";
import { useBoard, resetBoard } from "../store/board.js";

beforeEach(() => resetBoard());

describe("<AddCardForm>", () => {
  it("disables Add until the input is non-empty", async () => {
    const user = userEvent.setup();
    render(<AddCardForm columnId="todo" />);
    const add = screen.getByRole("button", { name: "Add" });
    expect(add).toBeDisabled();
    await user.type(screen.getByLabelText(/add a card/i), "Buy milk");
    expect(add).toBeEnabled();
  });

  it("adds a card to the store and clears the input on submit", async () => {
    const user = userEvent.setup();
    render(<AddCardForm columnId="todo" />);
    const input = screen.getByLabelText(/add a card/i);
    await user.type(input, "Write tests");
    await user.click(screen.getByRole("button", { name: "Add" }));

    const todo = useBoard.getState().columns.find((c) => c.id === "todo")!;
    expect(todo.cardIds).toHaveLength(2);
    expect(input).toHaveValue(""); // cleared after submit
  });
});
