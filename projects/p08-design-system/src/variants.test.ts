import { describe, it, expect } from "vitest";
import { cva } from "./variants.js";
import { buttonVariants } from "./index.js";

const box = cva("box", {
  variants: {
    color: { red: "text-red", blue: "text-blue" },
    size: { sm: "p-1", lg: "p-4" },
  },
  defaultVariants: { color: "red", size: "sm" },
  compoundVariants: [{ color: "blue", size: "lg", class: "shadow-xl" }],
});

describe("cva", () => {
  it("applies the base + default variants when nothing is passed", () => {
    expect(box()).toBe("box text-red p-1");
  });
  it("overrides defaults with passed variants", () => {
    expect(box({ color: "blue", size: "lg" })).toBe("box text-blue p-4 shadow-xl");
  });
  it("applies a compound variant only when all conditions match", () => {
    expect(box({ color: "blue", size: "sm" })).toBe("box text-blue p-1"); // no shadow
    expect(box({ color: "blue", size: "lg" })).toContain("shadow-xl");
  });
  it("works with the exported buttonVariants", () => {
    expect(buttonVariants()).toBe("btn btn-primary btn-md");
    expect(buttonVariants({ intent: "ghost", size: "lg" })).toBe(
      "btn btn-ghost btn-lg btn-ghost-lg",
    );
  });
});
