import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Column } from "./Column.js";
import { useBoard, resetBoard } from "../store/board.js";

const columnIds = ["todo", "doing", "done"] as const;
const renderColumn = (id: string) => {
  const column = useBoard.getState().columns.find((c) => c.id === id)!;
  return render(<Column column={column} columnIds={columnIds} />);
};

beforeEach(() => resetBoard());

describe("<Column>", () => {
  it("renders its cards and the count", () => {
    renderColumn("todo");
    const region = screen.getByRole("region", { name: "To Do" });
    expect(within(region).getByText("Design the schema")).toBeInTheDocument();
    expect(within(region).getByText("1")).toBeInTheDocument();
  });

  it("moves a card right via its button", async () => {
    const user = userEvent.setup();
    renderColumn("todo");
    await user.click(screen.getByRole("button", { name: /move "design the schema" right/i }));
    const todo = useBoard.getState().columns.find((c) => c.id === "todo")!;
    const doing = useBoard.getState().columns.find((c) => c.id === "doing")!;
    expect(todo.cardIds).toEqual([]);
    expect(doing.cardIds).toContain("a1");
  });

  it("disables Move-left in the first column", () => {
    renderColumn("todo");
    expect(screen.getByRole("button", { name: /move "design the schema" left/i })).toBeDisabled();
  });

  it("deletes a card", async () => {
    const user = userEvent.setup();
    renderColumn("todo");
    await user.click(screen.getByRole("button", { name: /delete "design the schema"/i }));
    expect(useBoard.getState().cards.a1).toBeUndefined();
  });
});
