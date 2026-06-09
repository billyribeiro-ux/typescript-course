# Project P04 — Kanban Board (Zustand)

A Kanban board built with **React 19 + Zustand 5 + TypeScript**, with a fully
unit-tested store and component tests via React Testing Library. **15 tests**.

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm typecheck    # strict tsc → clean
pnpm test         # 15 tests (store + components) → all green
pnpm build        # tsc -b && vite build
```

Add cards, move them between columns, rename and delete — all backed by a
normalized Zustand store.

## Architecture

```
src/
  store/board.ts   → Zustand store: normalized cards + columns, immutable actions
                     (addCard/moveCard/deleteCard/renameCard) — heavily unit-tested
  components/       → Column, CardItem, AddCardForm — tested with RTL + user-event
  App.tsx          → composes the columns + a reset button
```

State is **normalized** (cards keyed by id, columns hold ordered card-id lists)
— the same shape Redux/RTK uses (Part 6), which makes moves and lookups O(1) and
the store trivial to test.

## Key lesson: the Zustand v5 selector pitfall

Returning a **new array/object** from a Zustand selector creates a fresh snapshot
on every call, which `useSyncExternalStore` sees as a change → **infinite
re-render loop**. The fix: select stable references (e.g. the `cards` record) and
derive arrays in render, or use `useShallow`. See `components/Column.tsx`.

## Extending it (covered in the lesson)

- **Drag and drop** with `@dnd-kit/core` (replace the move buttons).
- **Animations** with **Motion** (`motion.li` + `AnimatePresence`) for card
  enter/leave and reordering.
- **TanStack Table** for a table view of all cards.
- Persist the board to `localStorage` with Zustand's `persist` middleware.
