# ──────────────────────────────────────────────
# Langu-AI — Development Commands
# ──────────────────────────────────────────────

SSH := ssh languai-prod
REMOTE_DIR := /home/aron/langu-ai-website/languai
DC := docker compose --env-file .env.production

.PHONY: help install frontend-install backend-install \
        dev frontend-dev backend-dev \
        build frontend-build \
        lint frontend-lint backend-lint \
        format frontend-format backend-format \
        test frontend-test backend-test \
        migrate makemigrations init-db createsuperuser \
        generate-api schema \
        clean \
        deploy deploy-backend deploy-frontend deploy-caddy \
        prod-logs prod-status prod-migrate prod-shell

# ── Help ──────────────────────────────────────

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}'

# ── Install ───────────────────────────────────

install: backend-install frontend-install ## Install all dependencies

frontend-install: ## Install frontend dependencies
	cd frontend && npm install

backend-install: ## Install backend dependencies (uv)
	cd backend && uv sync --extra dev

# ── Dev Servers ───────────────────────────────

dev: ## Run both frontend and backend dev servers
	@echo "Starting backend on :8000 and frontend on :3000..."
	@$(MAKE) backend-dev & $(MAKE) frontend-dev & wait

frontend-dev: ## Start Next.js dev server (port 3000)
	cd frontend && npm run dev

backend-dev: ## Start Django dev server (port 8000)
	cd backend && uv run python manage.py runserver

# ── Build ─────────────────────────────────────

build: frontend-build ## Build for production

frontend-build: ## Build Next.js for production
	cd frontend && npm run build

# ── Lint ──────────────────────────────────────

lint: frontend-lint backend-lint ## Lint everything

frontend-lint: ## Run ESLint on frontend
	cd frontend && npm run lint

backend-lint: ## Run Ruff on backend
	cd backend && uv run ruff check .

# ── Format ────────────────────────────────────

format: frontend-format backend-format ## Format everything

frontend-format: ## Run Prettier on frontend
	cd frontend && npm run format

backend-format: ## Run Ruff formatter on backend
	cd backend && uv run ruff format .

# ── Test ──────────────────────────────────────

test: frontend-test backend-test ## Run all tests

frontend-test: ## Run frontend tests (Vitest)
	cd frontend && npm run test

backend-test: ## Run backend tests (pytest)
	cd backend && uv run pytest

# ── Django Management ─────────────────────────

migrate: ## Apply Django migrations
	cd backend && uv run python manage.py migrate

makemigrations: ## Create new Django migrations
	cd backend && uv run python manage.py makemigrations

init-db: ## Initialize database with base data (levels, goals, LLM models, superuser)
	cd backend && uv run python manage.py migrate
	cd backend && uv run python manage.py init_db

createsuperuser: ## Create Django admin superuser
	cd backend && uv run python manage.py createsuperuser

# ── API Generation ────────────────────────────

generate-api: ## Download OpenAPI schema and generate typed API client (backend must be running)
	cd frontend && npm run generate-api

schema: ## Export OpenAPI schema to file (no server needed)
	cd backend && uv run python manage.py spectacular --color --file schema.yaml

# ── Type Check ────────────────────────────────

typecheck: frontend-typecheck backend-typecheck ## Type check everything

frontend-typecheck: ## Run TypeScript compiler check
	cd frontend && npx tsc --noEmit

backend-typecheck: ## Run mypy on backend
	cd backend && uv run mypy .

# ── Clean ─────────────────────────────────────

clean: ## Remove build artifacts and caches
	rm -rf frontend/.next frontend/out
	find backend -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find backend -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find backend -type d -name .mypy_cache -exec rm -rf {} + 2>/dev/null || true

# ── Deployment ───────────────────────────────

deploy: ## Pull latest code and rebuild all containers on production
	$(SSH) "cd $(REMOTE_DIR) && git pull && $(DC) up -d --build"

deploy-backend: ## Rebuild and restart only the backend container
	$(SSH) "cd $(REMOTE_DIR) && git pull && $(DC) up -d --build backend"

deploy-frontend: ## Rebuild and restart only the frontend container
	$(SSH) "cd $(REMOTE_DIR) && git pull && $(DC) up -d --build frontend"

deploy-caddy: ## Restart Caddy (picks up Caddyfile changes, no rebuild needed)
	$(SSH) "cd $(REMOTE_DIR) && git pull && $(DC) restart caddy"

prod-migrate: ## Run Django migrations on production
	$(SSH) "cd $(REMOTE_DIR) && $(DC) exec backend uv run python manage.py migrate"

prod-logs: ## Tail production logs (usage: make prod-logs or make prod-logs s=backend)
	$(SSH) "cd $(REMOTE_DIR) && $(DC) logs --tail 50 -f $(s)"

prod-status: ## Show production container status
	$(SSH) "cd $(REMOTE_DIR) && $(DC) ps"

prod-shell: ## Open a shell in the backend container
	$(SSH) -t "cd $(REMOTE_DIR) && $(DC) exec backend bash"
