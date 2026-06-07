# Frontend — Next.js + TypeScript + shadcn/ui

@../CLAUDE.md

## Tech Stack
- Next.js 15 (App Router)
- TypeScript (strict mode)
- Tailwind CSS v4
- shadcn/ui component library
- Vitest + React Testing Library

## Architecture

### Directory Structure
```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   │   ├── (auth)/       # Auth-related routes (login, register)
│   │   ├── learn/        # Learning content routes
│   │   └── layout.tsx    # Root layout
│   ├── components/
│   │   ├── ui/           # shadcn/ui components (DO NOT manually edit)
│   │   └── ...           # Custom components grouped by feature
│   ├── lib/
│   │   ├── api/          # API client, endpoints, types
│   │   └── utils.ts      # Shared utilities (cn helper lives here)
│   ├── hooks/            # Custom React hooks
│   ├── types/            # Shared TypeScript types/interfaces
│   └── styles/           # Global styles, Tailwind config
├── public/               # Static assets
└── tests/                # Test utilities and setup
```

### Component Guidelines
- **One component per .tsx file** — no exceptions. File name matches component name in kebab-case.
- Use shadcn/ui components as the base — customize via Tailwind, don't override internals
- Server Components by default; add `"use client"` only when needed (interactivity, hooks, browser APIs)
- Keep components small and focused — extract when a component exceeds ~100 lines
- Use `cn()` utility (from shadcn) for conditional class merging — never string concatenation
- **Destructive/modifying user actions (delete, regenerate, overwrite, etc.) must always require explicit confirmation via a `ConfirmDialog`** (`src/components/ui/confirm-dialog.tsx`). Never execute these actions on a single click.

### TypeScript Types
- **All types must be in dedicated .ts files** — never define interfaces/types inline in .tsx files
- Component-local types: `types.ts` file next to the component (e.g., `components/learning/types.ts`)
- Shared types used across pages/features: `src/types/*.ts`
- **Never use `any`** — every value must have an explicit type. Use `unknown` + type guards if truly dynamic.

### Styling Architecture
- **Page components (`src/app/**/page.tsx`) must be Tailwind-free** — pure composition of UI components
  - If a page needs custom Tailwind, it requires explicit permission (rare exception)
  - Pages should only compose existing components — all styling lives in the components themselves
- Feature components (`src/components/**`) use Tailwind freely
- Follow DRY: if the same Tailwind pattern appears 3+ times, extract a component

### API Client (Orval — auto-generated)
- **All API types, hooks, and Zod schemas are auto-generated** from the backend OpenAPI schema
- Generated files live in `src/lib/api/orval/api/generated/` — NEVER edit these manually
- Run `make generate-api` (backend must be running) after any backend API change
- Orval generates: React Query hooks, TypeScript types, Zod validation schemas
- Custom axios client with auth interceptor in `src/lib/api/orval/client.ts`

### Data Fetching
- Server Components: fetch directly in the component (with `cache` and `revalidate`)
- Client Components: use the Orval-generated React Query hooks (e.g., `useSectionsList()`)
- Never hand-write fetch calls or API types — use the generated hooks
- Never fetch in `useEffect` — use the generated React Query hooks or Server Components

### State Management
- URL state (search params) for shareable/bookmarkable state (current book, tab, search)
- React Query for server state (content data, user progress)
- React context only for truly global client state (theme, auth)
- Local `useState` for ephemeral UI state (open/close, hover, form inputs)

### Styling Rules
- Tailwind utility classes only — no custom CSS unless absolutely necessary
- Follow shadcn/ui theming system (CSS variables in globals.css)
- Responsive: mobile-first (`sm:`, `md:`, `lg:` breakpoints)
- Dark mode support via shadcn/ui theme provider
- No inline `style={{}}` objects — always Tailwind classes

### TypeScript Rules
- Strict mode enabled — no implicit any
- Use `interface` for object shapes, `type` for unions/intersections
- API response types in `types/api.ts`, component prop types co-located
- Prefer `as const` assertions over enums
- Zod schemas for runtime validation of API responses

### Performance
- Use Next.js `<Image>` for all images
- Dynamic imports (`next/dynamic`) for heavy components not needed on initial load
- Minimize client-side JavaScript — prefer Server Components

### Commands (via Makefile from project root)
```bash
make frontend-dev         # Start dev server (port 3000)
make frontend-build       # Production build
make frontend-lint        # ESLint check
make frontend-format      # Prettier format
make frontend-test        # Vitest
make frontend-typecheck   # TypeScript check
```
