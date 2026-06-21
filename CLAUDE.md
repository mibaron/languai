# Langu-AI - German Language Learning Platform

## Project Overview

A full-stack German language learning application built as a monorepo:
- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Django + Django REST Framework + SQLite (migrating to PostgreSQL later)
- **Reference**: `german-cheatsheet.jsx` contains the original data model and UI concept

## Monorepo Structure

```
languai/
├── frontend/          # Next.js application
├── backend/           # Django application (uv-managed)
├── docs/              # Architecture decisions, design docs, brainstorming records
├── Makefile           # All dev commands (make help for list)
├── german-cheatsheet.jsx  # Original reference (do not modify)
```

### Documentation (`docs/`)
- Architecture decisions, design documents, and brainstorming records go in `docs/`
- These are committed to the repo so future conversations can catch up on context
- Name files descriptively in kebab-case: `learning-engine-architecture.md`, `onboarding-flow.md`
- When the user says "write it down" or "save this for later", this is the place

## Quick Start
```bash
make install           # Install all dependencies
make dev               # Run both servers (backend :8000, frontend :3000)
make help              # Show all available commands
```

## Shared Conventions

### Git
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`
- Scope with area: `feat(frontend):`, `fix(backend):`, `feat(api):`
- Branch naming: `feat/short-description`, `fix/short-description`
- Never commit secrets, `.env` files, `db.sqlite3`, or `node_modules`

### Naming
- **Files/directories**: kebab-case (`grammar-section.tsx`, `verb_conjugation.py`)
- **React components**: PascalCase (`GrammarTable.tsx`)
- **Python modules**: snake_case (`grammar_views.py`)
- **API endpoints**: plural nouns, kebab-case (`/api/v1/grammar-sections/`)
- **Database tables**: snake_case, prefixed with app name (Django default)

### Code Quality
- Frontend: ESLint + Prettier (auto-format on save)
- Backend: Ruff (linting + formatting) + mypy (type checking)
- No `any` types in TypeScript — use proper types or `unknown`
- No `# type: ignore` in Python without explanation

## Frontend Architecture

### Component Layers (strict hierarchy)

```
src/components/
├── ui/              # Layer 0: shadcn/ui primitives — NEVER modify
├── kit/             # Layer 1: Project UI kit — wrappers, typography, layout
└── composites/      # Layer 2: Multi-kit reusable blocks (PackCard, EmptyState, etc.)
```

**Layer 0 — Primitives** (`components/ui/`): shadcn/ui components installed via CLI. Pure, untouched, upgradeable. Never edit these files.

**Layer 1 — Kit** (`components/kit/`): Project-level wrappers and design tokens. This is where we eliminate Tailwind repetition:
- `typography.tsx` — `PageTitle`, `SectionTitle`, `SectionHeader`, `Label`, `Caption`, `Muted` etc.
- `layout.tsx` — `Stack`, `Container`, `PageSection`, `Spacer`, etc.
- Feature wrappers — e.g., `icon-button.tsx`, `status-badge.tsx` (wrap shadcn Button/Badge with project-specific variants)
- All colors, spacing, and font tokens live in `tailwind.config.ts` as semantic variables — never hardcode hex values in components

**Layer 2 — Composites** (`components/composites/`): Reusable blocks that compose multiple kit components. Used across pages. Examples:
- `pack-card.tsx` — title + subtitle + description + badges + action button
- `empty-state.tsx` — icon + title + description + optional badge/CTA (e.g., the Explain tab placeholder)
- `bottom-tab-bar.tsx` — navigation bar with icon tabs
- `progress-ring.tsx` — circular progress indicator

**Page sections** — colocated with the page in `_components/`:
- Each visual section of a page is its own component
- Page-specific hooks live in `_hooks/`
- Page `page.tsx` files are **pure composition** — no raw HTML, no Tailwind classes, no business logic

### Component Rules
1. **One component per .tsx file** — no exceptions
2. **All types in dedicated .ts files** — `types.ts` for local, `src/types/` for shared. Never inline type definitions in .tsx
3. **Page components must be Tailwind-free** — pages compose kit/composite/section components only. A `div` for layout is fine; Tailwind utility soup is not
4. **DRY typography** — never write `className="text-lg font-bold tracking-tight"` in multiple places. Use kit typography components instead
5. **DRY colors** — all colors defined as CSS variables or Tailwind config tokens. Never repeat hex values across files

### Logic Extraction
- **Custom hooks for all logic** — form state, validation, side effects, API calls, multi-state coordination → extract to dedicated hook files
- **API calls** — Orval generates the client; wrap Orval hooks in page-specific hooks to add loading/error/transform logic
- **Page hooks** live in `_hooks/` next to the page. Shared hooks live in `src/hooks/`
- **Goal**: page components read like a wireframe — declarative JSX with no business logic, no `useEffect`, no `fetch`

### File Structure (frontend)
```
src/
├── app/
│   ├── (public)/              # Landing page, public routes
│   │   └── page.tsx
│   ├── (auth)/                # Login, register, onboarding
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── onboarding/page.tsx
│   ├── (app)/                 # Authenticated app (bottom tabs)
│   │   ├── layout.tsx         # Bottom tab bar layout
│   │   ├── learn/
│   │   │   ├── page.tsx       # Pure composition
│   │   │   ├── _components/   # Page-specific section components
│   │   │   └── _hooks/        # Page-specific hooks
│   │   ├── explain/
│   │   ├── practice/
│   │   └── profile/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                    # shadcn/ui (DO NOT MODIFY)
│   ├── kit/                   # Project UI kit
│   └── composites/            # Reusable composite components
├── hooks/                     # Shared hooks
├── lib/                       # Utilities, helpers
├── types/                     # Shared TypeScript types
└── data/                      # Static data (books.ts, etc.)
```

**Colocation rule**: If a component/hook is used by only one page, it lives in that page's `_components/` or `_hooks/`. If used by 2+ pages, promote to `components/composites/` or `hooks/`.

## Backend Architecture

### Design Principles
- **SOLID** — Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **Service Layer Pattern** — views are thin HTTP handlers; business logic lives in services
- **DRY** — shared utilities, base classes, and mixins for common patterns
- **Security-first** — permissions on every endpoint, input validation, no mass-assignment vulnerabilities
- **Production-ready** — structured logging, proper exception handling, database indexing

### Django App Structure
Each Django app follows this layout:
```
apps/<app_name>/
├── models.py           # Data models + constraints only, no business logic
├── services.py         # Write operations (create, update, delete, side effects)
├── selectors.py        # Read-only query functions (annotated querysets, filters)
├── serializers.py      # DRF serializers for input validation and output formatting
├── views.py            # Thin views: parse request → call service/selector → return response
├── permissions.py      # Custom DRF permission classes (IsPackOwner, CanSubscribe, etc.)
├── exceptions.py       # Domain-specific exceptions (PackNotFound, AlreadySubscribed, etc.)
├── constants.py        # Choices, magic numbers, configuration values
├── admin.py            # Django admin configuration
├── urls.py             # URL routing
├── signals.py          # Signal handlers (if needed)
└── tests/
    ├── test_services.py
    ├── test_selectors.py
    ├── test_views.py
    └── factories.py    # Test factories (factory_boy)
```

### Backend Rules
1. **Views are thin** — max ~15 lines. Parse request, call service/selector, return serialized response. No QuerySet chains, no business logic, no side effects in views
2. **Services own business logic** — all writes, validation beyond serializer-level, cross-model operations, side effects (emails, notifications, credit deduction). Services call other services, never views
3. **Selectors are pure reads** — return QuerySets or computed values. No side effects. Annotate and filter here, not in views or serializers
4. **Models are data** — fields, constraints, indexes, `__str__`, `Meta`. No business methods. Use model properties only for trivial computed fields
5. **Permissions are granular** — custom permission classes per action. Never rely on `is_staff` checks scattered in views. Role-based access via permission classes
6. **Exceptions are domain-specific** — raise `PackNotFound`, `InsufficientCredits` etc. in services, catch and map to HTTP status in views or a shared exception handler
7. **Logging** — structured logging with `structlog` or Python's `logging`. Log business events (user subscribed, credit deducted, AI generation triggered), not just errors
8. **Database design** — proper indexes on filtered/sorted fields, unique constraints for business rules, `created_at`/`updated_at` on all models via a `TimeStampedModel` base class

### API Contract
- OpenAPI schema generated by drf-spectacular (backend is the single source of truth)
- Frontend API client auto-generated via Orval from the OpenAPI schema
- **Never hand-write API types or fetch calls in the frontend** — always regenerate with `make generate-api`
- After any serializer/viewset change in the backend, run `make generate-api` to update the frontend
- API versioning via URL prefix: `/api/v1/`
- Authentication: Token-based (Django REST Framework TokenAuthentication)
- Schema URLs: `/api/schema/` (raw), `/swagger/` (Swagger UI), `/redoc/` (ReDoc)

### Data Model Reference
The `german-cheatsheet.jsx` file defines the core domain:
- **Books/Levels**: A1.1, A1.2, A2.1, A2.2 (expandable to B1, B2, C1, C2)
- **Categories**: grammar, vocab, verbs, phrases
- **Content types**: table (headers + rows), notes (bullet list), grid (matrix layout)
- Each section has: title, type, optional note/note2, and type-specific data

### AI-Powered Learning Assistance

The app provides AI help for every learning item (verbs, grammar, phrases). Users click an AI button next to any item to open a modal where they can request examples, quizzes, or explanations.

#### Architecture
- **LLM Provider**: OpenRouter.ai (OpenAI-compatible SDK with custom `base_url`)
- **Backend service**: `apps/ai_content/services.py` — builds prompts, calls OpenRouter, parses JSON responses
- **Model catalog**: `LLMModel` table synced from OpenRouter's `/api/v1/models` endpoint via `python manage.py sync_models`. Admin enables specific models (`is_active=True`) and sets one as platform default (`is_default=True`)
- **Caching/dedup**: Content-addressable fingerprinting (SHA-256 of `level_code + category + section_title + sorted(item_cells)`). Unique constraint on `(fingerprint, action_type, model_used)` — same item can have responses from different models without collision
- **Prompt storage**: Every OpenRouter call saves the exact `messages` array (`prompt_messages` JSONField on `AIContent`) for analysis
- **Cost tracking**: OpenRouter returns `usage.cost` (USD) in response body. Stored on both `AIContent` (generation cost) and `AIInteraction` (per-request cost, 0 for cache hits). Credit deducted in EUR using `USD_TO_EUR_RATE`

#### Credit System
- Users get `WELCOME_CREDIT_EUR` (default €0.50) on registration (both regular and Google OAuth)
- `User.credit_balance` (EUR) deducted on each non-cached AI generation
- Frontend shows "~N prompts left" based on selected model's `approx_cost_eur` (estimated from avg 500 input + 1500 output tokens)
- Users can still click action buttons with 0 credit — cache hits are free. Only blocked (402) when a fresh generation is needed and credit is 0
- Credit top-up/purchase flow is not yet implemented — admin can manually edit `credit_balance` in Django admin

#### Key Design Decisions
- **Static frontend data**: Learning content comes from `src/data/books.ts`, not from the API. Item identification uses SHA-256 fingerprints rather than database IDs
- **Model selection**: Users choose LLM model per-request in the modal, with "save as default" option. Resolution order: request param → `user.preferred_model` → platform default (`LLMModel.is_default`) → `OPENROUTER_DEFAULT_MODEL` setting
- **shadcn/ui wrappers**: Never modify `src/components/ui/` files. Create wrapper components in feature directories (e.g., `components/ai/model-select.tsx` wraps `DropdownMenu`)
- **base-ui quirk**: `DropdownMenuLabel` (`MenuPrimitive.GroupLabel`) must be inside a `DropdownMenuGroup` — it crashes without `MenuGroupContext`

#### AI API Endpoints
```
GET    /api/v1/ai/models/              # Active models (public, no auth)
GET    /api/v1/ai/credit/              # User credit balance (auth required)
POST   /api/v1/ai/generate/            # Generate content (auth, accepts model + save_as_default + regenerate)
POST   /api/v1/ai/item-content/        # List all AI content for a specific item (by fingerprint)
DELETE /api/v1/ai/content/<uuid>/      # Delete AI content (admin)
POST   /api/v1/ai/<uuid>/save/         # Save to user collection
GET    /api/v1/ai/saved/               # List saved content
DELETE /api/v1/ai/saved/<uuid>/        # Remove from saved
POST   /api/v1/ai/saved/<uuid>/share/  # Generate share key
GET    /api/v1/ai/shared/<key>/        # View shared content (public)
```

#### Management Commands
```bash
python manage.py sync_models       # Fetch/update models from OpenRouter (new models default to is_active=False)
```

### Auth Guard
- **Next.js middleware** (`frontend/src/middleware.ts`) blocks all unauthenticated access, redirecting to `/login?next=<path>`
- Public (no-auth) paths: `/login`, `/register`. Update the middleware's `PUBLIC_PATHS` array when adding new public routes
- 401 API responses clear the token and redirect to `/login?next=<current-path>` (see `frontend/src/lib/api/orval/client.ts`)
- `useSearchParams()` requires a `<Suspense>` boundary in Next.js — any page using it must wrap the component

### Deployment
- Deploy from local machine via Makefile: `make deploy`, `make deploy-backend`, `make deploy-frontend`, `make deploy-caddy`
- All deploy commands use `docker compose --env-file .env.production` — this is required because Docker Compose only reads `.env` by default, not `.env.production`
- Django admin is on a separate subdomain: `admin.langu-ai.de` (not `/admin` on the main site)
- See `DEPLOYMENT.md` for full setup guide, env vars, and troubleshooting

### Production Infrastructure
- **Server**: SSH alias `languai-prod`, project at `/home/aron/langu-ai-website/languai`
- **Database**: PostgreSQL 16 (`postgres:16-alpine`), persisted in Docker named volume `pgdata`
- **Backend container**: uses `uv` for package management — **all commands must use `uv run`**
- **Dev uses SQLite**, production uses PostgreSQL — never assume SQLite on the server

#### Running commands on the server
```bash
# The pattern — always use `uv run`:
docker compose --env-file .env.production exec backend uv run python manage.py <command>

# Examples:
docker compose --env-file .env.production exec backend uv run python manage.py migrate
docker compose --env-file .env.production exec backend uv run python manage.py init_db
docker compose --env-file .env.production exec backend uv run python manage.py createsuperuser
```

**NEVER** suggest bare `python manage.py` for the production container — Django is only available inside the uv virtualenv.

#### Fresh database initialization
```bash
# 1. Drop and recreate the schema
docker compose --env-file .env.production exec db psql -U languai -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
# 2. Run migrations + seed base data (levels, goals, LLM models, superuser)
docker compose --env-file .env.production exec backend uv run python manage.py init_db
# 3. Import content packs via Django admin (Content > Content imports)
```

### Environment Variables
- Frontend `.env.local`: `NEXT_PUBLIC_API_URL`
- Backend `.env`: `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `DATABASE_URL`
- Never hardcode URLs — always use environment variables for API base URL

### Testing
- **Every new feature or bug fix must include tests** — this is a hard requirement, not optional
- Frontend: Vitest + React Testing Library (test files colocated next to source, `*.test.ts(x)`)
- Backend: pytest + pytest-django (test files in `apps/<app>/tests/`, factories for test data)
- Test behavior, not implementation — assert on what users see or what data changes, not internal state
- Mock at boundaries only — external APIs, cookies, storage. Never mock internal functions or the ORM
- No snapshot tests — they break on every UI change and provide no signal
- See `frontend/CLAUDE.md` and `backend/CLAUDE.md` for stack-specific testing patterns and rules
