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

### Testing

**Stack**: pytest + pytest-django

**Config**: `pyproject.toml` under `[tool.pytest.ini_options]`. Settings module: `config.settings.development`.

#### Test file placement
Each Django app has a `tests/` directory mirroring the app's modules:
```
apps/<app_name>/tests/
├── __init__.py
├── test_services.py      # Service layer logic (the most important tests)
├── test_selectors.py     # Read queries and filters
├── test_views.py         # API endpoint integration tests
├── test_models.py        # Model constraints, validations, properties
└── factories.py          # Factory Boy factories for test data
```

#### What to test and when
- **Every new feature or bug fix must include tests** — no exceptions
- **Services** (highest priority): test all business logic, validation rules, side effects, error cases, and cross-model operations. Services are where bugs hide
- **Views/API endpoints**: test request/response cycle — status codes, response shape, auth/permissions, error responses. Use `APIClient`
- **Selectors**: test filtering, annotations, edge cases (empty results, boundary conditions)
- **Models**: test constraints (unique, not-null), custom properties, `__str__`, and any model-level validation
- **Permissions**: test that unauthorized users get 403, that object-level permissions work
- **Do NOT test**: Django/DRF internals, ORM behavior, admin config, migrations

#### Testing patterns

**Use `pytest.mark.django_db`** for any test that touches the database:
```python
@pytest.mark.django_db
def test_subscribe_to_pack(user, pack):
    subscription = subscribe_to_pack(user=user, pack=pack)
    assert subscription.status == "active"
```

**Use fixtures and factories** — never create test data manually:
```python
# factories.py
class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.LazyAttribute(lambda o: f"{o.username}@example.com")

# conftest.py
@pytest.fixture
def user():
    return UserFactory()
```

**API tests** — use DRF's `APIClient`:
```python
@pytest.mark.django_db
def test_list_packs_requires_auth(api_client):
    response = api_client.get("/api/v1/packs/")
    assert response.status_code == 401

@pytest.mark.django_db
def test_list_packs_returns_active(auth_client, pack):
    response = auth_client.get("/api/v1/packs/")
    assert response.status_code == 200
    assert len(response.data["results"]) == 1
```

**Service tests** — test happy path, edge cases, and errors:
```python
@pytest.mark.django_db
def test_deduct_credit_insufficient_balance(user):
    user.credit_balance = Decimal("0.00")
    user.save()
    with pytest.raises(InsufficientCredits):
        deduct_credit(user=user, amount=Decimal("0.10"))
```

**Test external services** — mock at the boundary:
```python
@patch("apps.ai_content.services.openai_client.chat.completions.create")
def test_generate_content_calls_openrouter(mock_create, user, item):
    mock_create.return_value = MockCompletion(content='{"examples": []}')
    result = generate_ai_content(user=user, item=item, action="examples")
    assert result.action_type == "examples"
    mock_create.assert_called_once()
```

#### Testing rules
1. **Test behavior, not implementation** — assert on outcomes (DB state, response data, side effects), not internal function calls
2. **Each test must be independent** — no ordering dependencies, no shared mutable state. Use fixtures for setup
3. **Use factories for all test data** — never hardcode IDs, never rely on migration seed data
4. **Name tests descriptively** — `test_subscribe_to_pack_already_subscribed_raises` not `test_subscribe_2`
5. **Mock at boundaries only** — mock external APIs (OpenRouter, Google OAuth), never mock internal services or the ORM
6. **Test error paths** — every service that raises a domain exception needs a test for that exception
7. **Test permissions** — every endpoint needs at least one auth test (401 for unauthenticated, 403 for unauthorized)
8. **Keep tests fast** — use `@pytest.mark.django_db(transaction=False)` when you don't need transactions, prefer `create()` over `save()` in factories
9. **Shared fixtures** go in `conftest.py` at the `tests/` level or project root. App-specific fixtures go in the app's `conftest.py`

#### Common fixtures (define in root `conftest.py`)
```python
@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user():
    return UserFactory()

@pytest.fixture
def auth_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client
```

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
