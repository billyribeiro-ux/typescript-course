# The Ultimate TypeScript + React Engineering Course

### 2026 Edition · From your first line of code → Principal Engineer (L7++)

A complete, hands-on, **university-grade** curriculum that takes an absolute
beginner (no coding experience required) all the way to a distinguished
principal-level engineer who can architect and ship anything in TypeScript and
React. Every section is taught in plain English, to deep engineering rigor, with
the **latest tools and syntax as of June 2026**.

This is a **follow-along** course: you read the lessons, copy/run the code in live
editors, and build a real project in every part — line by line.

> ✅ **Status: complete.** All **111 lessons** across **10 parts** are live, plus
> **8 hands-on projects** with **132 passing tests** (unit, component, and
> type-level). Every lesson page is render-audited (Monaco editors mount, 0 page
> errors); every project's `pnpm typecheck` + `pnpm test` pass.

---

## ✨ What makes this course different

- **Truly offline.** Every lesson is a self-contained HTML page with live,
  editable code editors powered by a **locally-bundled Monaco** (the engine
  behind VS Code). No internet, no accounts, no build step to *read* the course.
- **Next / Previous navigation, a full table of contents, dark mode, and saved
  progress** — all built in.
- **Real projects, not toy snippets.** Nine projects plus a capstone full-stack
  SaaS, using the exact stack a modern team ships with.
- **Current.** TypeScript 5.9 → 7 (`tsgo`), React 19 + the React Compiler,
  Next.js 15, Tailwind v4, TanStack, Drizzle, tRPC, and more.

---

## 🚀 Getting started

### Option A — just open it (zero setup)
Double-click **`index.html`** (or any lesson under `lessons/`). It works
immediately offline: full syntax highlighting, copy/paste, navigation, and
progress tracking.

> Browsers block Web Workers on `file://`, so the editors won't show live red
> type-error squiggles in this mode — but everything else works.

### Option B — run a local server (unlocks live type-checking)
Serve the folder over `http://localhost` to turn on Monaco's full TypeScript
language service (live errors, autocomplete, hover docs). Still 100% local.

```bash
# Node 20+ (no dependencies needed)
node tools/serve.mjs
# then open http://localhost:5173/index.html
```

---

## 🗂️ Repository layout

```
index.html              → course home + full syllabus
assets/
  css/course.css        → the shared university theme (light/dark)
  js/lessons.js         → the curriculum manifest (single source of truth)
  js/course.js          → runtime: Monaco, TOC, navigation, progress
  monaco/               → vendored Monaco editor (offline)
lessons/                → every lesson, organised by part
projects/               → the runnable real-world projects (Vite / Next.js)
tools/
  serve.mjs             → zero-dependency local static server
  validate.mjs          → integrity check for the manifest + assets
  new-lesson.mjs        → scaffolds a new lesson page from the template
```

---

## 📚 The curriculum (10 parts · 100+ lessons · 9 projects)

| Part | Title | You'll build |
| ---- | ----- | ------------ |
| 0 | Foundations: From Absolute Zero | (warm-up) a hand-written web page |
| 1 | TypeScript Core | **P01** — a type-safe CLI task manager |
| 2 | Advanced TypeScript | **P02** — a mini-Zod schema validator |
| 3 | Professional Tooling & Engineering | publish P02 as a Turborepo monorepo |
| 4 | React Core (with TypeScript) | **P03** — a Vite weather dashboard |
| 5 | Advanced React | **P04** — a Kanban board |
| 6 | The React Ecosystem | **P05** — a Redux enterprise admin |
| 7 | Full-Stack & End-to-End Type Safety | **P07** — a Next.js SaaS starter |
| 8 | Architecture & The Principal Engineer | **P08** — a design-system package |
| 9 | Capstone: ProjectHub | a production full-stack SaaS, end to end |

Open `index.html` for the clickable, always-up-to-date syllabus.

---

## 🛠️ The 2026 stack you'll master

**Language & tooling:** TypeScript 5.9 / 7 (`tsgo`), Node 24, pnpm 10, Vite 7,
Vitest 3, ESLint flat config, Prettier, Turborepo, Playwright.

**React:** React 19 + React Compiler, React Router 7, TanStack Router / Query /
Table, Zustand, Jotai, Redux Toolkit + RTK Query, React Hook Form + Zod.

**Styling & UI:** Tailwind CSS v4, shadcn/ui, CVA, Motion.

**Full-stack:** Next.js 15 (App Router, Server Components, Server Actions),
Drizzle ORM, tRPC v11.

---

## 🧭 For authors / maintainers

```bash
node tools/validate.mjs          # check manifest + assets integrity
node tools/new-lesson.mjs 00-02  # scaffold a lesson from the template
```

The curriculum is data-driven: add or edit lessons in `assets/js/lessons.js`,
then flip a lesson's `status` from `"soon"` to `"available"` once its page
exists. The sidebar, navigation, home page, and progress bar all update
automatically.

---

*Built to be the last TypeScript + React course you'll ever need.*
