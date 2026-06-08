import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchForm } from "./SearchForm.js";

describe("<SearchForm>", () => {
  it("disables submit until there is a non-empty query", async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={vi.fn()} unit="celsius" onToggleUnit={vi.fn()} />);
    const submit = screen.getByRole("button", { name: "Search" });
    expect(submit).toBeDisabled();
    await user.type(screen.getByLabelText("City"), "London");
    expect(submit).toBeEnabled();
  });

  it("calls onSearch with the trimmed query on submit", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchForm onSearch={onSearch} unit="celsius" onToggleUnit={vi.fn()} />);
    await user.type(screen.getByLabelText("City"), "  Tokyo  ");
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(onSearch).toHaveBeenCalledWith("Tokyo");
  });

  it("calls onToggleUnit and shows the current unit", async () => {
    const user = userEvent.setup();
    const onToggleUnit = vi.fn();
    render(<SearchForm onSearch={vi.fn()} unit="fahrenheit" onToggleUnit={onToggleUnit} />);
    const toggle = screen.getByRole("button", { name: "Toggle temperature unit" });
    expect(toggle).toHaveTextContent("°F");
    await user.click(toggle);
    expect(onToggleUnit).toHaveBeenCalledOnce();
  });
});
