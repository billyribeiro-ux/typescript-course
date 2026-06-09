import { describe, it, expectTypeOf } from "vitest";
import { cva, type VariantProps } from "./index.js";

const button = cva("btn", {
  variants: { intent: { primary: "a", ghost: "b" }, size: { sm: "c", lg: "d" } },
});
type ButtonProps = VariantProps<typeof button>;

describe("variant prop inference", () => {
  it("extracts the typed, optional variant selection", () => {
    expectTypeOf<ButtonProps>().toEqualTypeOf<{
      intent?: "primary" | "ghost";
      size?: "sm" | "lg";
    }>();
  });
});
