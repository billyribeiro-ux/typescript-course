# Project P01 — Type-Safe CLI Task Manager

The first real project of the course: a command-line task manager written in
**strict TypeScript**, with a **pure, fully-tested core** and **35 Vitest tests**.
You build this across Part 1, line by line, as you learn the language.

## Architecture (why it's shaped this way)

```
src/
  types.ts   → the domain types (Task, Priority, …) — the single source of truth
  tasks.ts   → PURE functions on task lists (add/toggle/remove/…); no I/O
  store.ts   → load/save tasks to JSON (the only file system code)
  cli.ts     → runCommand(): PURE command logic returning {tasks, output, changed}
  index.ts   → the entry point: the only place that touches disk + the console
```

The golden rule: **keep logic pure, push side-effects to the edges.** `tasks.ts`
and `cli.ts` are pure, so the entire app's behaviour is tested without ever
touching the disk or the console.

## Run it

```bash
pnpm install
pnpm typecheck     # strict tsc --noEmit (passes clean)
pnpm test          # 35 Vitest tests (all green)
pnpm build         # compile to dist/
node dist/index.js help

# Try it (data is stored at ~/.tasks/tasks.json, or set TASKS_FILE):
node dist/index.js add "Learn TypeScript" --priority high
node dist/index.js add "Build a project"
node dist/index.js list
node dist/index.js done 1
node dist/index.js summary
```

During development you can skip the build step with `pnpm dev -- add "Quick task"`
(uses `tsx` to run the TypeScript directly).

## What this project teaches

- Strict compiler settings: `strict`, `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, `verbatimModuleSyntax`.
- Modeling a domain with `interface`, union literal types, and `readonly`.
- Immutable updates (`map`/`filter`/spread) — the same patterns you'll use for
  React state.
- Type guards (`isPriority`) to safely narrow `unknown` data from disk.
- Designing for testability by separating pure logic from I/O.
