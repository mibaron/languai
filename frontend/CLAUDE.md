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
- Use shadcn/ui components as the base — customize via Tailwind, don't override internals
- Server Components by default; add `"use client"` only when needed (interactivity, hooks, browser APIs)
- Keep components small and focused — extract when a component exceeds ~100 lines
- Props interfaces defined inline for simple components, extracted to `types/` when shared
- Use `cn()` utility (from shadcn) for conditional class merging — never string concatenation

### Data Fetching
- Server Components: fetch directly in the component (with `cache` and `revalidate`)
- Client Components: React Query (TanStack Query) for server state
- API client in `lib/api/` — typed request/response, centralized error handling
- Never fetch in `useEffect` — use React Query or Server Components

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
