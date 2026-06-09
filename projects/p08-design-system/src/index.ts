export { cn } from "./cn.js";
export type { ClassValue, ClassDict } from "./cn.js";
export { cva } from "./variants.js";
export type { VariantShape, VariantSelection, VariantProps, CvaConfig } from "./variants.js";

/**
 * Example: a Button's styles encoded as type-safe variants — exactly how a
 * design system (shadcn/ui + CVA) defines a component's look.
 */
import { cva } from "./variants.js";

export const buttonVariants = cva("btn", {
  variants: {
    intent: {
      primary: "btn-primary",
      secondary: "btn-secondary",
      ghost: "btn-ghost",
    },
    size: { sm: "btn-sm", md: "btn-md", lg: "btn-lg" },
  },
  defaultVariants: { intent: "primary", size: "md" },
  compoundVariants: [{ intent: "ghost", size: "lg", class: "btn-ghost-lg" }],
});
