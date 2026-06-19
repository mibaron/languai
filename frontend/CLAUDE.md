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
- **Never modify files in `src/components/ui/`** — these are pure shadcn/ui components and must stay untouched. Newly added shadcn components depend on the originals for styles. To customize behavior or styling, create a wrapper component in the relevant feature directory (e.g., `components/ai/model-select.tsx` wraps `DropdownMenu`, `components/ui/confirm-dialog.tsx` wraps `Dialog`). Custom types for wrapper components go in a co-located `types.ts`.
- Server Components by default; add `"use client"` only when needed (interactivity, hooks, browser APIs)
- Keep components small and focused — extract when a component exceeds ~100 lines
- Use `cn()` utility (from shadcn) for conditional class merging — never string concatenation
- **Destructive/modifying user actions (delete, regenerate, overwrite, etc.) must always require explicit confirmation via a `ConfirmDialog`** (`src/components/ui/confirm-dialog.tsx`). Never execute these actions on a single click.
- **Every async operation must have a loading state** — show a spinner, skeleton, or progress indicator while the operation is in progress. Disable all CTAs/buttons that could conflict with the in-flight request to prevent double-submissions or race conditions. This applies to API calls, form submissions, AI generation, navigation triggers — any async function. No silent waiting.

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

### Testing

**Stack**: Vitest 4.x + React Testing Library + @testing-library/user-event + jsdom 25

**Config**: `vitest.config.mts` (ESM — must use `.mts` extension). Setup file: `tests/setup.ts`.

#### Test file placement
- Test files live **next to the code they test**, named `<module>.test.ts` or `<component>.test.tsx`
- For pure logic tests (no JSX), use `.test.ts`
- For component render tests, use `.test.tsx`
- If a component file has both a pure function export and a component export, write separate test files: `<name>.test.ts` for the function, `<name>.component.test.tsx` for the component

#### What to test and when
- **Every new feature or bug fix must include tests** — no exceptions
- **Pure functions** (utils, helpers, selectors): unit test all branches and edge cases
- **Components**: test rendering, user interactions, conditional rendering, and error states
- **Middleware/routing logic**: test all path combinations (public, protected, auth-only) and redirect behavior
- **Hooks**: test via components that use them, or with `renderHook` for standalone logic
- **Do NOT test**: shadcn/ui primitives (`components/ui/`), Orval-generated code, CSS/styling details, implementation internals

#### Testing patterns

**Component tests** — test behavior, not implementation:
```tsx
// DO: test what the user sees and does
expect(screen.getByText("Welcome back")).toBeInTheDocument();
await user.click(screen.getByRole("button", { name: /submit/i }));
await waitFor(() => expect(onSuccess).toHaveBeenCalled());

// DON'T: test internal state, CSS classes, or implementation
expect(component.state.isLoading).toBe(true);  // ❌
expect(el).toHaveClass("bg-brand");             // ❌ (unless testing a kit component)
```

**Mocking external dependencies**:
```tsx
// Mock API calls (Orval-generated)
vi.mock("@/lib/api/orval/api/generated/auth/auth", () => ({
  authLoginCreate: vi.fn(),
}));

// Mock cookie/storage utils
vi.mock("@/lib/utils/auth/cookie-utils", () => ({
  setUserToken: vi.fn(),
}));

// Mock complex child components to isolate the component under test
vi.mock("./google-sign-in-button", () => ({
  GoogleSignInButton: (props) => <button data-testid="google-btn">Google</button>,
}));
```

**Text split by `<br>` or nested elements** — use container queries:
```tsx
const { container } = render(<Component />);
const h1 = container.querySelector("h1");
expect(h1?.textContent).toContain("First line");
```

**Multiple elements with same text** — use exact matchers or `getAllBy`:
```tsx
screen.getByRole("button", { name: /^sign in$/i });  // exact match
screen.getAllByText(/Free forever/);                   // when duplicates expected
```

#### Testing rules
1. **No `any` in tests** — same TypeScript rules as production code
2. **No snapshot tests** — they break on every UI change and provide no signal
3. **Test user-visible behavior** — not implementation details, not internal state
4. **Mock at module boundaries** — mock API calls, cookies, and router; don't mock internal functions
5. **Each test must be independent** — no shared mutable state between tests; use `beforeEach` for setup
6. **Use `userEvent` over `fireEvent`** — `userEvent` simulates real browser behavior (typing, clicking)
7. **Use `waitFor` for async assertions** — never `setTimeout` or manual delays
8. **Kit component tests may assert classes** — since kit components exist to enforce styling patterns, testing their CSS output is valid

### Commands (via Makefile from project root)
```bash
make frontend-dev         # Start dev server (port 3000)
make frontend-build       # Production build
make frontend-lint        # ESLint check
make frontend-format      # Prettier format
make frontend-test        # Vitest
make frontend-typecheck   # TypeScript check
```
