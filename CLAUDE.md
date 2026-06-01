# LinguAI - German Language Learning Platform

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
├── Makefile           # All dev commands (make help for list)
├── german-cheatsheet.jsx  # Original reference (do not modify)
```

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

### API Contract
- All API responses follow: `{ data: T, meta?: { pagination } }` for lists
- Error responses: `{ error: { code: string, message: string, details?: object } }`
- API versioning via URL prefix: `/api/v1/`
- Authentication: Token-based (Django REST Framework TokenAuthentication)

### Data Model Reference
The `german-cheatsheet.jsx` file defines the core domain:
- **Books/Levels**: A1.1, A1.2, A2.1, A2.2 (expandable to B1, B2, C1, C2)
- **Categories**: grammar, vocab, verbs, phrases
- **Content types**: table (headers + rows), notes (bullet list), grid (matrix layout)
- Each section has: title, type, optional note/note2, and type-specific data

### Environment Variables
- Frontend `.env.local`: `NEXT_PUBLIC_API_URL`
- Backend `.env`: `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `DATABASE_URL`
- Never hardcode URLs — always use environment variables for API base URL

### Testing
- Frontend: Vitest + React Testing Library
- Backend: pytest + pytest-django
- Test files live next to the code they test (frontend) or in `tests/` dirs (backend)
