# Project P02 — Type-Safe Schema Validator (a mini-Zod)

A from-scratch, **type-safe runtime validator** built in advanced TypeScript.
A single schema declaration is **both** the runtime validator **and** the source
of the static type — "parse, don't validate" in action. This is the project for
Part 2 (Advanced TypeScript): generics, conditional types, mapped types with key
remapping, `infer`, and `const` type parameters, all working together.

## The one-declaration superpower

```ts
import { v, type Infer } from "./src/index.js";

const User = v.object({
  id: v.number().int().positive(),
  name: v.string().min(1),
  email: v.string().email(),
  role: v.union(v.literal("admin"), v.literal("user")),
  bio: v.string().optional(),               // optional KEY, inferred as bio?:
});

type User = Infer<typeof User>;
// ^ { id: number; name: string; email: string; role: "admin" | "user"; bio?: string }

const user = User.parse(await res.json());  // validated AND fully typed
const safe = User.safeParse(unknownInput);  // { success: true; data } | { success: false; error }
```

## How the magic works

| Concern | Where | Technique |
| --- | --- | --- |
| Derive the static type from a schema | `types.ts` | `Infer<S> = S extends Schema<infer T> ? T : never` |
| Split required vs optional object keys | `types.ts` | mapped types + key remapping (`as`) + conditional types |
| Narrow literals (`"admin"` not `string`) | `schemas.ts` | `const` type parameters |
| Keep `Schema<string>` assignable to `Schema<unknown>` | `schemas.ts` | type-erased refinements (variance control) |
| Aggregate errors with paths | `error.ts` | `ValidationError` + `Issue[]` |

## Run it (hard evidence)

```bash
pnpm install
pnpm typecheck     # strict tsc --noEmit → clean
pnpm test          # 14 runtime tests → all green
pnpm test:types    # 6 TYPE-LEVEL inference proofs (vitest --typecheck) → no type errors
pnpm build         # emits dist/ with .d.ts files (the library ships its types)
```

## What it validates

Primitives (`string`, `number`, `boolean`, `literal`) with refinements
(`.min`, `.max`, `.email`, `.regex`, `.int`, `.positive`), plus `array`,
`object` (unknown keys stripped, optional keys omitted), `union`, `optional`,
`nullable`, and a generic `.refine()` escape hatch. Errors aggregate across the
whole structure with paths like `members[1].age`.
