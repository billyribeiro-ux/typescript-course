import { describe, it, expect } from "vitest";
import { cn } from "./cn.js";

describe("cn", () => {
  it("joins truthy strings", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });
  it("ignores falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });
  it("handles conditional objects", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });
  it("flattens arrays", () => {
    expect(cn(["a", ["b", { c: true }]], "d")).toBe("a b c d");
  });
  it("de-duplicates tokens, keeping the last occurrence's position", () => {
    expect(cn("p-2", "m-1", "p-2")).toBe("m-1 p-2");
  });
});
