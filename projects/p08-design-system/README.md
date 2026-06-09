# Project P08 — Design System Core

The type-safe foundation of a component library: a class combiner (`cn`) and a
variant API (`cva`) — the same primitives behind **shadcn/ui + CVA** (lesson
06-10). Pure, dependency-free, and **fully tested (9 runtime + type-level
inference proofs)**.

## Run it

```bash
pnpm install
pnpm typecheck    # strict tsc → clean
pnpm test         # 9 runtime tests
pnpm test:types   # type-level VariantProps inference proof (vitest --typecheck)
```

## What's here

```
src/
  cn.ts        → clsx-style class combiner (strings/arrays/objects, de-duped)
  variants.ts  → cva(): base + variant groups + defaults + compound variants,
                 plus VariantProps<F> to extract a component's typed props
  index.ts     → re-exports + an example buttonVariants()
```

```ts
import { cva, type VariantProps } from "./src/index.js";

const button = cva("btn", {
  variants: { intent: { primary: "btn-primary", ghost: "btn-ghost" },
              size:   { sm: "btn-sm", lg: "btn-lg" } },
  defaultVariants: { intent: "primary", size: "sm" },
});
type ButtonProps = VariantProps<typeof button>;
// ^ { intent?: "primary" | "ghost"; size?: "sm" | "lg" }  — proven by a type test

button({ intent: "ghost", size: "lg" }); // "btn btn-ghost btn-lg"
```

`VariantProps<F>` uses a conditional type + `infer` (Part 2) to extract the
component's prop type from the variant function — one declaration, both the
runtime styling and the static props. In a real design system you'd wrap this in
a monorepo package (Part 3) and pair it with Radix primitives + Tailwind.
