# Project P07 — Next.js SaaS Starter (type-safe server core)

The **type-safe server core** of a multi-tenant SaaS: role-based permissions,
billing rules, and a miniature tRPC-style typed procedure layer — all pure and
**fully tested (14 tests)**. This is the heart that a Next.js App Router UI
(Server Components + Server Actions + Drizzle + Auth.js) wraps around.

## Run it

```bash
pnpm install
pnpm typecheck    # strict tsc → clean
pnpm test         # 14 tests across permissions, billing, and the API layer
```

## What's here

```
src/server/
  permissions.ts  → RBAC: roles, an action→min-role matrix, can()/authorize()/
                    canActOnMember() — the security rules every action consults
  billing.ts      → plan limits, seat/project gating, proration math (no money bugs!)
  api.ts          → a mini, fully-typed tRPC-style procedure builder:
                    publicProcedure / protectedProcedure, .input(zodSchema),
                    .query/.mutation, with auth gating + Zod input validation
```

`api.test.ts` shows the whole stack working together: a `createProject`
procedure that **requires auth** (UNAUTHORIZED if not), **validates input** with
Zod (BAD_REQUEST on failure), and **authorizes** inside the resolver
(ForbiddenError for a viewer) — the exact security model of a real SaaS.

## How it maps to the full Next.js app (covered in the lesson)

- `permissions.ts` / `api.ts` → consulted by **Server Actions** (07-04) and **tRPC
  procedures** (07-07).
- `billing.ts` → enforced before seat/project mutations; wired to Stripe.
- A real app adds: **Drizzle** schema + queries (07-06), **Auth.js** sessions
  (07-08), the **App Router** UI (07-01/02), and **deployment + Sentry** (07-11).

The pure core is what you test exhaustively; the framework glue is thin.
