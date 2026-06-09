# Deployment Guide — LinguAI

## Architecture

```
langu-ai.de (Hetzner Cloud VPS — CX22, 2 vCPU, 4GB RAM, ~€4.50/mo)
│
├── Caddy (reverse proxy, auto-HTTPS via Let's Encrypt)
│   ├── langu-ai.de, www.langu-ai.de → Next.js (:3000)
│   │   └── /api/*, /swagger/*, /redoc/*, /static/* → Django (:8000)
│   └── admin.langu-ai.de → Django (:8000)
│
├── Django + gunicorn (backend container, port 8000)
├── Next.js standalone (frontend container, port 3000)
└── PostgreSQL 16 (database container, port 5432, data on named volume)
```

## What Was Done

### 1. Backend Changes

- **`pyproject.toml`** — Added `psycopg[binary]>=3.2` (PostgreSQL driver) and `whitenoise>=6.8` (static file serving) to `[project.optional-dependencies.prod]`
- **`uv.lock`** — Regenerated with `uv lock` to include the new prod dependencies
- **`config/settings/production.py`** — Added PostgreSQL database config (reads `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT` from env), WhiteNoise middleware and storage backend

### 2. Frontend Changes

- **`next.config.ts`** — Added `output: "standalone"` for optimized Docker image (self-contained Node.js server without full `node_modules`)
- **`react-markdown` + `remark-gfm`** — Installed for rendering markdown in AI explanation views
- **`src/components/ai/ai-explanation-view.tsx`** — Updated to use `<ReactMarkdown>` instead of plain text

### 3. Docker Setup (all new files)

- **`Dockerfile.backend`** — Python 3.12 slim, installs deps via `uv` with `--extra prod`, runs `collectstatic` at build time (using base settings to avoid needing DB), serves via gunicorn
- **`Dockerfile.frontend`** — Multi-stage build (node:22-alpine), accepts `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` as build args, copies standalone output to minimal runtime image
- **`docker-compose.yml`** — Four services (db, backend, frontend, caddy) on a shared `languai` bridge network. PostgreSQL data persisted via `pgdata` volume. Caddy certs persisted via `caddy_data` volume
- **`Caddyfile`** — Routes `/api/*`, `/swagger/*`, `/redoc/*`, `/static/*` to backend, everything else to frontend. `admin.langu-ai.de` proxies entirely to Django. Handles `langu-ai.de`, `www.langu-ai.de`, and `admin.langu-ai.de`
- **`.dockerignore`** — Excludes `.git`, `.env`, `node_modules`, `__pycache__`, `.next`, `db.sqlite3`, etc.
- **`.env.production.example`** — Template with all required env vars (committed to repo, actual `.env.production` is gitignored)

### 4. Auth Guard

- **`frontend/src/middleware.ts`** — Next.js middleware redirects unauthenticated users to `/login`. Public paths: `/login`, `/register`. Saves original path as `?next=` param
- **`frontend/src/app/(auth)/login/page.tsx`** — Reads `?next=` param to redirect back after login. Wrapped in `<Suspense>` (required by Next.js for `useSearchParams`)
- **`frontend/src/lib/api/orval/client.ts`** — 401 interceptor clears token and redirects to `/login?next=<current-path>`

### 5. DNS

- Hetzner DNS: `langu-ai.de` (A record) → VPS IP
- Hetzner DNS: `www.langu-ai.de` (A record) → VPS IP
- Hetzner DNS: `admin.langu-ai.de` (A record) → VPS IP

## Deploy Steps (first time on a new VPS)

```bash
# 1. Install Docker (one-time)
apt update && apt install -y docker.io docker-compose-plugin

# 2. Clone repo
git clone <repo-url> ~/langu-ai-website/languai && cd ~/langu-ai-website/languai

# 3. Create env file from template
cp .env.production.example .env.production
# Fill in: SECRET_KEY, POSTGRES_PASSWORD, OPENROUTER_API_KEY, GOOGLE_CLIENT_ID,
#          ALLOWED_HOSTS, CORS_ALLOWED_ORIGINS, CSRF_TRUSTED_ORIGINS

# 4. Build and launch (--env-file is required for build-time arg interpolation)
docker compose --env-file .env.production up -d --build

# 5. Initialize database (one-time)
docker compose --env-file .env.production exec backend uv run python manage.py migrate
docker compose --env-file .env.production exec backend uv run python manage.py seed_content --clear
docker compose --env-file .env.production exec backend uv run python manage.py sync_models
docker compose --env-file .env.production exec backend uv run python manage.py createsuperuser
```

## Updating After Code Changes

Use the Makefile from your local machine (runs commands over SSH):

```bash
make deploy              # Pull + rebuild all containers
make deploy-backend      # Pull + rebuild backend only
make deploy-frontend     # Pull + rebuild frontend only
make deploy-caddy        # Pull + restart Caddy only (no rebuild)
make prod-migrate        # Run Django migrations on production
make prod-logs           # Tail all logs (make prod-logs s=backend for one service)
make prod-status         # Show container status
make prod-shell          # Open bash in backend container
```

> **Important:** All `make deploy-*` commands use `docker compose --env-file .env.production`
> to ensure build-time args (like `NEXT_PUBLIC_GOOGLE_CLIENT_ID`) are interpolated correctly.
> Docker Compose only reads `.env` by default — not `.env.production`.

## Environment Variables

| Variable | Where | Description |
|---|---|---|
| `SECRET_KEY` | Backend | Django secret key (generate a long random string) |
| `POSTGRES_DB` | Backend + DB | Database name (default: `languai`) |
| `POSTGRES_USER` | Backend + DB | Database user (default: `languai`) |
| `POSTGRES_PASSWORD` | Backend + DB | Database password |
| `OPENROUTER_API_KEY` | Backend | API key for AI content generation |
| `GOOGLE_CLIENT_ID` | Backend + Frontend | Google OAuth client ID |
| `ALLOWED_HOSTS` | Backend | `langu-ai.de,www.langu-ai.de,admin.langu-ai.de` |
| `CORS_ALLOWED_ORIGINS` | Backend | `https://langu-ai.de` |
| `CSRF_TRUSTED_ORIGINS` | Backend | `https://admin.langu-ai.de` |
| `NEXT_PUBLIC_API_URL` | Frontend (build-time) | `https://langu-ai.de` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Frontend (build-time) | Same as `GOOGLE_CLIENT_ID` |

## Troubleshooting

### Check container status
```bash
make prod-status
```

### View logs
```bash
make prod-logs              # all services
make prod-logs s=backend    # backend only
make prod-logs s=frontend   # frontend only
make prod-logs s=caddy      # caddy only
```

### Test internal connectivity
```bash
# DNS resolution between containers
docker compose exec caddy nslookup backend

# Backend reachable from Caddy
docker compose exec caddy wget -qO- http://backend:8000/api/v1/ai/models/
# (returns 400 Bad Request = OK, that's ALLOWED_HOSTS rejecting the hostname)

# Frontend reachable from Caddy
docker compose exec caddy wget -qO- http://frontend:3000/
```

### Test Caddy serving correctly (from VPS)
```bash
curl -k --resolve langu-ai.de:443:127.0.0.1 https://langu-ai.de
```

### Known Issue: Hetzner Web Hosting Proxy

If you see "Apache Server at langu-ai.de" responses from external requests, a Hetzner web hosting package is intercepting traffic before it reaches the VPS. Check [konsole.hetzner.de](https://konsole.hetzner.de) for any web hosting product tied to this domain and remove/disable it.

## Google OAuth

After deployment, update the Google Cloud Console:
- Add `https://langu-ai.de` to authorized JavaScript origins
- Add `https://langu-ai.de` to authorized redirect URIs
