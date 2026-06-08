# Backend — Django + DRF + SQLite

@../CLAUDE.md

## Tech Stack
- Python 3.12+
- Django 5.x
- Django REST Framework
- SQLite (development) — designed for easy PostgreSQL migration
- pytest + pytest-django

## Architecture

### Directory Structure
```
backend/
├── config/               # Django project settings
│   ├── settings/
│   │   ├── base.py       # Shared settings
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py           # Root URL config
│   └── wsgi.py
├── apps/
│   ├── content/          # Core learning content (books, sections, items)
│   ├── users/            # Custom user model, auth, credit balance, preferred LLM
│   ├── progress/         # User learning progress tracking
│   └── ai_content/       # AI-generated content, LLM model catalog, interactions
├── api/
│   └── v1/               # API version 1 (ViewSets, serializers, urls)
├── tests/                # Test directory mirroring apps structure
├── manage.py
├── pyproject.toml        # Dependencies + tool config (uv-managed)
└── uv.lock               # Locked dependency versions
```

### Django Conventions
- Custom User model from day one (AbstractUser in `apps/users/`)
- Apps in `apps/` directory — each app is a self-contained domain
- Settings split by environment (base/development/production)
- Models: verbose `Meta` class with `ordering`, `verbose_name`, `verbose_name_plural`
- Always add `__str__` method to models
- Use `TimeStampedModel` base (created_at, updated_at) for all models

### DRF Conventions
- ViewSets + Routers for CRUD endpoints
- Serializers: separate `List` and `Detail` serializers when field sets differ
- Permissions: default `IsAuthenticated`, override per-view as needed
- Pagination: `PageNumberPagination`, page_size=20
- Filtering: django-filter for list endpoints

### OpenAPI Schema (drf-spectacular)
- Schema is the single source of truth — the frontend API client is generated from it
- Use `@extend_schema` and `@extend_schema_view` on all viewsets for accurate schema
- Use `@extend_schema_field` on SerializerMethodField to explicitly type JSON fields
- Always use `tags` in schema decorators to organize endpoints (Orval splits by tag)
- After any serializer/viewset change, run `make generate-api` to update the frontend
- Verify schema with `make schema` — must produce 0 warnings, 0 errors
- For auth-gated viewsets, add `swagger_fake_view` guard in `get_queryset()`

### Database & Models
- SQLite for now — avoid PostgreSQL-specific features (ArrayField, JSONField with lookups)
- Use Django's built-in JSONField for flexible content storage (tables, notes, grids)
- Indexes on frequently queried fields (level, category)
- No raw SQL — use the ORM exclusively
- Always create data migrations for seed data, never manual DB edits

### Python Style
- Type hints on all function signatures
- Ruff for linting and formatting (replaces flake8/black/isort)
- mypy for static type checking
- Docstrings only for non-obvious public APIs
- Imports: stdlib, third-party, local (Ruff handles ordering)

### Security
- Never expose internal IDs in URLs — use UUIDs or slugs for public-facing resources
- Validate all input through DRF serializers
- CORS configured for frontend origin only
- Rate limiting on auth endpoints
- No `DEBUG=True` in production settings

### Package Management
- Use `uv` for all dependency management (NOT pip or poetry)
- Dependencies defined in `pyproject.toml` under `[project.dependencies]`
- Dev dependencies under `[project.optional-dependencies.dev]`
- Always run `uv lock` after changing dependencies
- Use `uv run` to execute commands in the venv (or activate with `source .venv/bin/activate`)

### Commands (via Makefile from project root)
```bash
make backend-dev          # Start dev server (port 8000)
make makemigrations       # Create migrations
make migrate              # Apply migrations
make createsuperuser      # Create admin user
make seed                 # Load initial German content
make backend-test         # Run tests
make backend-lint         # Lint with Ruff
make backend-format       # Format with Ruff
make backend-typecheck    # Type check with mypy
```
