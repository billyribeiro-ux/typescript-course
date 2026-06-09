/* ==========================================================================
   COURSE MANIFEST — the single source of truth for the whole curriculum.
   Drives the sidebar table-of-contents, Next/Previous navigation, progress
   tracking and the home-page syllabus.

   Each lesson has a `status`:
     "available" → the page exists and is linkable
     "soon"      → planned, shown in the TOC but greyed out
   As each batch of the course is authored, lessons flip from "soon" to
   "available". Paths are relative to the repository root; course.js rewrites
   them with the correct prefix depending on the current page's depth.
   ========================================================================== */
window.COURSE = {
  title: "The Ultimate TypeScript + React Engineering Course",
  tagline: "From your first line of code to Principal Engineer (L7++).",
  edition: "2026 Edition · TypeScript 5.9 / 7 · React 19",
  parts: [
    {
      num: "0",
      id: "part-00",
      dir: "part-00-foundations",
      title: "Foundations: From Absolute Zero",
      icon: "🧱",
      subtitle: "No coding assumed. The web, the terminal, Git & JavaScript.",
      lessons: [
        { id: "00-01", title: "How Computers & the Web Really Work", file: "lessons/part-00-foundations/00-01-how-the-web-works.html", status: "available" },
        { id: "00-02", title: "Setting Up Your Professional Dev Environment", file: "lessons/part-00-foundations/00-02-dev-environment.html", status: "available" },
        { id: "00-03", title: "The Command Line From Zero", file: "lessons/part-00-foundations/00-03-the-command-line.html", status: "available" },
        { id: "00-04", title: "Git & GitHub: Version Control Foundations", file: "lessons/part-00-foundations/00-04-git-and-github.html", status: "available" },
        { id: "00-05", title: "How JavaScript Runs: Engines, Node & Browser", file: "lessons/part-00-foundations/00-05-how-javascript-runs.html", status: "available" },
        { id: "00-06", title: "Values, Variables & Types in JavaScript", file: "lessons/part-00-foundations/00-06-values-variables-types.html", status: "available" },
        { id: "00-07", title: "Operators, Conditionals & Control Flow", file: "lessons/part-00-foundations/00-07-control-flow.html", status: "available" },
        { id: "00-08", title: "Functions, Scope & Closures", file: "lessons/part-00-foundations/00-08-functions-scope-closures.html", status: "available" },
        { id: "00-09", title: "Arrays, Objects, Destructuring & Spread", file: "lessons/part-00-foundations/00-09-arrays-objects-destructuring.html", status: "available" },
        { id: "00-10", title: "Iteration, Array Methods & Immutability", file: "lessons/part-00-foundations/00-10-array-methods-immutability.html", status: "available" },
        { id: "00-11", title: "Async JavaScript: Promises & async/await", file: "lessons/part-00-foundations/00-11-async-javascript.html", status: "available" },
        { id: "00-12", title: "Modules, the DOM & fetch — Project P01 Kickoff", file: "lessons/part-00-foundations/00-12-modules-dom-fetch.html", status: "available" }
      ]
    },
    {
      num: "1",
      id: "part-01",
      dir: "part-01-typescript-core",
      title: "TypeScript Core",
      icon: "🔷",
      subtitle: "The language, the compiler, and types that catch bugs.",
      lessons: [
        { id: "01-01", title: "Why TypeScript? The Type-Safety Mindset", file: "lessons/part-01-typescript-core/01-01-why-typescript.html", status: "available" },
        { id: "01-02", title: "Installing TS, tsc & tsconfig.json", file: "lessons/part-01-typescript-core/01-02-tsc-and-tsconfig.html", status: "available" },
        { id: "01-03", title: "Primitives, Arrays, Tuples & Enums", file: "lessons/part-01-typescript-core/01-03-primitives-arrays-tuples.html", status: "available" },
        { id: "01-04", title: "Object Types: interface vs type", file: "lessons/part-01-typescript-core/01-04-interface-vs-type.html", status: "available" },
        { id: "01-05", title: "Union & Intersection Types", file: "lessons/part-01-typescript-core/01-05-union-intersection.html", status: "available" },
        { id: "01-06", title: "Literal Types, Narrowing & Type Guards", file: "lessons/part-01-typescript-core/01-06-narrowing-type-guards.html", status: "available" },
        { id: "01-07", title: "Functions: Parameters, Overloads & this", file: "lessons/part-01-typescript-core/01-07-functions.html", status: "available" },
        { id: "01-08", title: "Generics From First Principles", file: "lessons/part-01-typescript-core/01-08-generics.html", status: "available" },
        { id: "01-09", title: "Classes & OOP in TypeScript", file: "lessons/part-01-typescript-core/01-09-classes-oop.html", status: "available" },
        { id: "01-10", title: "Modules, Namespaces & Declaration Files", file: "lessons/part-01-typescript-core/01-10-modules-declarations.html", status: "available" },
        { id: "01-11", title: "unknown, any, never & Type Assertions", file: "lessons/part-01-typescript-core/01-11-unknown-any-never.html", status: "available" },
        { id: "01-12", title: "Project P01: The Type-Safe CLI Task Manager", file: "lessons/part-01-typescript-core/01-12-project-cli-task-manager.html", status: "available" }
      ]
    },
    {
      num: "2",
      id: "part-02",
      dir: "part-02-advanced-typescript",
      title: "Advanced TypeScript",
      icon: "🧠",
      subtitle: "Type-level programming: conditional, mapped & template types.",
      lessons: [
        { id: "02-01", title: "Conditional Types & infer", file: "lessons/part-02-advanced-typescript/02-01-conditional-types.html", status: "available" },
        { id: "02-02", title: "Mapped Types & Key Remapping", file: "lessons/part-02-advanced-typescript/02-02-mapped-types.html", status: "available" },
        { id: "02-03", title: "Template Literal Types", file: "lessons/part-02-advanced-typescript/02-03-template-literal-types.html", status: "available" },
        { id: "02-04", title: "The Utility Type Catalog", file: "lessons/part-02-advanced-typescript/02-04-utility-types.html", status: "available" },
        { id: "02-05", title: "Building Your Own Utility Types", file: "lessons/part-02-advanced-typescript/02-05-custom-utility-types.html", status: "available" },
        { id: "02-06", title: "Recursive Types & Type-Level Programming", file: "lessons/part-02-advanced-typescript/02-06-recursive-types.html", status: "available" },
        { id: "02-07", title: "Discriminated Unions & Exhaustiveness", file: "lessons/part-02-advanced-typescript/02-07-discriminated-unions.html", status: "available" },
        { id: "02-08", title: "Branded & Nominal Types", file: "lessons/part-02-advanced-typescript/02-08-branded-types.html", status: "available" },
        { id: "02-09", title: "Variadic Tuples & Function Composition", file: "lessons/part-02-advanced-typescript/02-09-variadic-tuples.html", status: "available" },
        { id: "02-10", title: "satisfies, const Type Params & using", file: "lessons/part-02-advanced-typescript/02-10-satisfies-const-using.html", status: "available" },
        { id: "02-11", title: "Decorators, Module Augmentation & Ambient Types", file: "lessons/part-02-advanced-typescript/02-11-decorators-augmentation.html", status: "available" },
        { id: "02-12", title: "Project P02: A Type-Safe Schema Validator", file: "lessons/part-02-advanced-typescript/02-12-project-schema-validator.html", status: "available" }
      ]
    },
    {
      num: "3",
      id: "part-03",
      dir: "part-03-tooling-and-engineering",
      title: "Professional Tooling & Engineering",
      icon: "🛠️",
      subtitle: "pnpm, monorepos, Vite, ESLint, Vitest, CI and TS 7 'tsgo'.",
      lessons: [
        { id: "03-01", title: "Package Managers & pnpm Workspaces", file: "lessons/part-03-tooling-and-engineering/03-01-pnpm-workspaces.html", status: "available" },
        { id: "03-02", title: "Monorepos with Turborepo", file: "lessons/part-03-tooling-and-engineering/03-02-turborepo.html", status: "available" },
        { id: "03-03", title: "Vite Deep Dive", file: "lessons/part-03-tooling-and-engineering/03-03-vite-deep-dive.html", status: "available" },
        { id: "03-04", title: "ESLint Flat Config & Prettier", file: "lessons/part-03-tooling-and-engineering/03-04-eslint-prettier.html", status: "available" },
        { id: "03-05", title: "Testing with Vitest", file: "lessons/part-03-tooling-and-engineering/03-05-vitest.html", status: "available" },
        { id: "03-06", title: "Project References & Build Performance", file: "lessons/part-03-tooling-and-engineering/03-06-project-references.html", status: "available" },
        { id: "03-07", title: "TypeScript 7 'tsgo': The Native Compiler", file: "lessons/part-03-tooling-and-engineering/03-07-typescript-7-tsgo.html", status: "available" },
        { id: "03-08", title: "Git Workflows, Conventional Commits & Releases", file: "lessons/part-03-tooling-and-engineering/03-08-git-workflows.html", status: "available" },
        { id: "03-09", title: "CI/CD with GitHub Actions", file: "lessons/part-03-tooling-and-engineering/03-09-github-actions.html", status: "available" },
        { id: "03-10", title: "Project: Publish P02 as a Monorepo", file: "lessons/part-03-tooling-and-engineering/03-10-project-monorepo.html", status: "available" }
      ]
    },
    {
      num: "4",
      id: "part-04",
      dir: "part-04-react-core",
      title: "React Core (with TypeScript)",
      icon: "⚛️",
      subtitle: "Components, hooks, React 19 Actions and the React Compiler.",
      lessons: [
        { id: "04-01", title: "Thinking in React & the Component Model", file: "lessons/part-04-react-core/04-01-thinking-in-react.html", status: "available" },
        { id: "04-02", title: "JSX In Depth", file: "lessons/part-04-react-core/04-02-jsx-in-depth.html", status: "available" },
        { id: "04-03", title: "Components, Props & Typing Them", file: "lessons/part-04-react-core/04-03-props-and-typing.html", status: "available" },
        { id: "04-04", title: "State with useState", file: "lessons/part-04-react-core/04-04-usestate.html", status: "available" },
        { id: "04-05", title: "Lists, Keys & Conditional Rendering", file: "lessons/part-04-react-core/04-05-lists-keys-conditionals.html", status: "available" },
        { id: "04-06", title: "Handling Events & Forms", file: "lessons/part-04-react-core/04-06-events-and-forms.html", status: "available" },
        { id: "04-07", title: "Side Effects with useEffect", file: "lessons/part-04-react-core/04-07-useeffect.html", status: "available" },
        { id: "04-08", title: "Refs & the DOM with useRef", file: "lessons/part-04-react-core/04-08-useref.html", status: "available" },
        { id: "04-09", title: "useReducer & useContext", file: "lessons/part-04-react-core/04-09-usereducer-usecontext.html", status: "available" },
        { id: "04-10", title: "Memoization & the React Compiler", file: "lessons/part-04-react-core/04-10-memoization-react-compiler.html", status: "available" },
        { id: "04-11", title: "Building Custom Hooks", file: "lessons/part-04-react-core/04-11-custom-hooks.html", status: "available" },
        { id: "04-12", title: "React 19 Actions & New Hooks", file: "lessons/part-04-react-core/04-12-react-19-actions.html", status: "available" },
        { id: "04-13", title: "Project P03: The Vite Weather Dashboard", file: "lessons/part-04-react-core/04-13-project-weather-dashboard.html", status: "available" }
      ]
    },
    {
      num: "5",
      id: "part-05",
      dir: "part-05-advanced-react",
      title: "Advanced React",
      icon: "🚀",
      subtitle: "Rendering, Suspense, concurrency, patterns and testing.",
      lessons: [
        { id: "05-01", title: "Reconciliation & How React Renders", file: "lessons/part-05-advanced-react/05-01-reconciliation.html", status: "available" },
        { id: "05-02", title: "Performance Profiling & Optimization", file: "lessons/part-05-advanced-react/05-02-performance.html", status: "available" },
        { id: "05-03", title: "Suspense & Data Fetching Patterns", file: "lessons/part-05-advanced-react/05-03-suspense.html", status: "available" },
        { id: "05-04", title: "Error Boundaries & Resilience", file: "lessons/part-05-advanced-react/05-04-error-boundaries.html", status: "available" },
        { id: "05-05", title: "Concurrent Features & Transitions", file: "lessons/part-05-advanced-react/05-05-concurrency-transitions.html", status: "available" },
        { id: "05-06", title: "Portals, Refs & Imperative Handles", file: "lessons/part-05-advanced-react/05-06-portals-imperative.html", status: "available" },
        { id: "05-07", title: "Component Patterns: Compound & Provider", file: "lessons/part-05-advanced-react/05-07-compound-provider.html", status: "available" },
        { id: "05-08", title: "Headless Components & Render Props", file: "lessons/part-05-advanced-react/05-08-headless-render-props.html", status: "available" },
        { id: "05-09", title: "Accessibility (a11y) Done Right", file: "lessons/part-05-advanced-react/05-09-accessibility.html", status: "available" },
        { id: "05-10", title: "Testing React: Testing Library & Playwright", file: "lessons/part-05-advanced-react/05-10-testing-react.html", status: "available" },
        { id: "05-11", title: "Project P04: The Kanban Board", file: "lessons/part-05-advanced-react/05-11-project-kanban.html", status: "available" }
      ]
    },
    {
      num: "6",
      id: "part-06",
      dir: "part-06-the-ecosystem",
      title: "The React Ecosystem",
      icon: "🧩",
      subtitle: "Routing, TanStack Query, Zustand, Redux, forms, styling, motion.",
      lessons: [
        { id: "06-01", title: "Routing with React Router 7", file: "lessons/part-06-the-ecosystem/06-01-react-router.html", status: "soon" },
        { id: "06-02", title: "Type-Safe Routing with TanStack Router", file: "lessons/part-06-the-ecosystem/06-02-tanstack-router.html", status: "soon" },
        { id: "06-03", title: "Server State with TanStack Query", file: "lessons/part-06-the-ecosystem/06-03-tanstack-query.html", status: "soon" },
        { id: "06-04", title: "Advanced TanStack Query", file: "lessons/part-06-the-ecosystem/06-04-tanstack-query-advanced.html", status: "soon" },
        { id: "06-05", title: "Client State with Zustand", file: "lessons/part-06-the-ecosystem/06-05-zustand.html", status: "soon" },
        { id: "06-06", title: "Atomic State with Jotai", file: "lessons/part-06-the-ecosystem/06-06-jotai.html", status: "soon" },
        { id: "06-07", title: "Redux Toolkit Fundamentals", file: "lessons/part-06-the-ecosystem/06-07-redux-toolkit.html", status: "soon" },
        { id: "06-08", title: "RTK Query for Data Fetching", file: "lessons/part-06-the-ecosystem/06-08-rtk-query.html", status: "soon" },
        { id: "06-09", title: "Forms at Scale: React Hook Form + Zod", file: "lessons/part-06-the-ecosystem/06-09-react-hook-form-zod.html", status: "soon" },
        { id: "06-10", title: "Styling: Tailwind v4, shadcn/ui & CVA", file: "lessons/part-06-the-ecosystem/06-10-tailwind-shadcn-cva.html", status: "soon" },
        { id: "06-11", title: "Animation with Motion & TanStack Table", file: "lessons/part-06-the-ecosystem/06-11-motion-tanstack-table.html", status: "soon" },
        { id: "06-12", title: "Project P05: The Redux Enterprise Admin", file: "lessons/part-06-the-ecosystem/06-12-project-redux-admin.html", status: "soon" }
      ]
    },
    {
      num: "7",
      id: "part-07",
      dir: "part-07-fullstack-and-type-safety",
      title: "Full-Stack & End-to-End Type Safety",
      icon: "🌐",
      subtitle: "Next.js 15, Server Components, Drizzle, tRPC and auth.",
      lessons: [
        { id: "07-01", title: "Next.js 15: The App Router Mental Model", file: "lessons/part-07-fullstack-and-type-safety/07-01-app-router.html", status: "soon" },
        { id: "07-02", title: "Server Components vs Client Components", file: "lessons/part-07-fullstack-and-type-safety/07-02-server-vs-client.html", status: "soon" },
        { id: "07-03", title: "Data Fetching, Caching & PPR", file: "lessons/part-07-fullstack-and-type-safety/07-03-data-caching-ppr.html", status: "soon" },
        { id: "07-04", title: "Server Actions & Mutations", file: "lessons/part-07-fullstack-and-type-safety/07-04-server-actions.html", status: "soon" },
        { id: "07-05", title: "Route Handlers & APIs", file: "lessons/part-07-fullstack-and-type-safety/07-05-route-handlers.html", status: "soon" },
        { id: "07-06", title: "Databases with Drizzle ORM", file: "lessons/part-07-fullstack-and-type-safety/07-06-drizzle-orm.html", status: "soon" },
        { id: "07-07", title: "End-to-End Type Safety with tRPC v11", file: "lessons/part-07-fullstack-and-type-safety/07-07-trpc.html", status: "soon" },
        { id: "07-08", title: "Authentication & Sessions", file: "lessons/part-07-fullstack-and-type-safety/07-08-authentication.html", status: "soon" },
        { id: "07-09", title: "File Uploads, Emails & Background Jobs", file: "lessons/part-07-fullstack-and-type-safety/07-09-uploads-emails-jobs.html", status: "soon" },
        { id: "07-10", title: "Environment, Secrets & Configuration", file: "lessons/part-07-fullstack-and-type-safety/07-10-env-secrets.html", status: "soon" },
        { id: "07-11", title: "Deployment & Observability", file: "lessons/part-07-fullstack-and-type-safety/07-11-deployment.html", status: "soon" },
        { id: "07-12", title: "Project P07: The Next.js SaaS Starter", file: "lessons/part-07-fullstack-and-type-safety/07-12-project-saas-starter.html", status: "soon" }
      ]
    },
    {
      num: "8",
      id: "part-08",
      dir: "part-08-architecture-and-principal",
      title: "Architecture & The Principal Engineer",
      icon: "🏛️",
      subtitle: "System design, design systems, security and L7++ leadership.",
      lessons: [
        { id: "08-01", title: "SOLID & Design Patterns in TypeScript", file: "lessons/part-08-architecture-and-principal/08-01-solid-patterns.html", status: "soon" },
        { id: "08-02", title: "Building a Design System", file: "lessons/part-08-architecture-and-principal/08-02-design-system.html", status: "soon" },
        { id: "08-03", title: "Frontend System Design & Scalability", file: "lessons/part-08-architecture-and-principal/08-03-system-design.html", status: "soon" },
        { id: "08-04", title: "Micro-Frontends & Module Federation", file: "lessons/part-08-architecture-and-principal/08-04-micro-frontends.html", status: "soon" },
        { id: "08-05", title: "Performance Budgets & Core Web Vitals", file: "lessons/part-08-architecture-and-principal/08-05-performance-budgets.html", status: "soon" },
        { id: "08-06", title: "Observability, Logging & Error Tracking", file: "lessons/part-08-architecture-and-principal/08-06-observability.html", status: "soon" },
        { id: "08-07", title: "Feature Flags & Progressive Delivery", file: "lessons/part-08-architecture-and-principal/08-07-feature-flags.html", status: "soon" },
        { id: "08-08", title: "Security: XSS, CSRF, Auth & Supply Chain", file: "lessons/part-08-architecture-and-principal/08-08-security.html", status: "soon" },
        { id: "08-09", title: "i18n & Accessibility at Scale", file: "lessons/part-08-architecture-and-principal/08-09-i18n-a11y-scale.html", status: "soon" },
        { id: "08-10", title: "API Design, Contracts & Versioning", file: "lessons/part-08-architecture-and-principal/08-10-api-design.html", status: "soon" },
        { id: "08-11", title: "The Principal Engineer: RFCs, ADRs & Strategy", file: "lessons/part-08-architecture-and-principal/08-11-principal-engineer.html", status: "soon" }
      ]
    },
    {
      num: "9",
      id: "part-09",
      dir: "part-09-capstone",
      title: "Capstone: ProjectHub",
      icon: "🎓",
      subtitle: "Build a production full-stack SaaS end-to-end. Graduation.",
      lessons: [
        { id: "09-01", title: "ProjectHub: Architecture & Planning", file: "lessons/part-09-capstone/09-01-architecture-planning.html", status: "soon" },
        { id: "09-02", title: "Building the Data Layer & Auth", file: "lessons/part-09-capstone/09-02-data-layer-auth.html", status: "soon" },
        { id: "09-03", title: "The Application Core & Design System", file: "lessons/part-09-capstone/09-03-app-core-design-system.html", status: "soon" },
        { id: "09-04", title: "Real-Time, Roles & Permissions", file: "lessons/part-09-capstone/09-04-realtime-roles.html", status: "soon" },
        { id: "09-05", title: "Testing, CI/CD & Observability", file: "lessons/part-09-capstone/09-05-testing-cicd.html", status: "soon" },
        { id: "09-06", title: "Deployment & Course Conclusion", file: "lessons/part-09-capstone/09-06-deployment-conclusion.html", status: "soon" }
      ]
    }
  ]
};

/* Flattened, ordered list of every AVAILABLE lesson (for Next/Prev chaining). */
window.COURSE_FLAT = window.COURSE.parts.flatMap(function (p) {
  return p.lessons.map(function (l) {
    return { partNum: p.num, partTitle: p.title, partDir: p.dir, partId: p.id, partIcon: p.icon, id: l.id, title: l.title, file: l.file, status: l.status };
  });
});
