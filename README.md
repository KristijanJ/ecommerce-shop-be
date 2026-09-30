# ecommerce-shop-be

REST API backend for the ecommerce shop. Part of a multi-repo project:

| Repo                                                                         | Purpose                                             |
| ---------------------------------------------------------------------------- | --------------------------------------------------- |
| [ecommerce-shop-be](https://github.com/KristijanJ/ecommerce-shop-be)         | **This repo** - NestJS REST API                     |
| [ecommerce-shop-fe](https://github.com/KristijanJ/ecommerce-shop-fe)         | Next.js frontend                                    |
| [ecommerce-shop-gitops](https://github.com/KristijanJ/ecommerce-shop-gitops) | Kubernetes manifests, ArgoCD, platform tooling      |
| [ecommerce-infra](https://github.com/KristijanJ/ecommerce-infra)             | Local Docker Compose for PostgreSQL, Redis and LGTM |

---

## Stack

| Technology          | Role                       | Why                                                               |
| ------------------- | -------------------------- | ----------------------------------------------------------------- |
| **NestJS**          | HTTP server + framework    | Modular, decorator-based architecture with built-in DI            |
| **TypeORM**         | ORM + migrations           | Type-safe DB access, migration files tracked in Git               |
| **PostgreSQL**      | Database                   | Primary data store                                                |
| **class-validator** | Request validation         | DTO-based validation at API boundaries                            |
| **bcrypt**          | Password hashing           | Secure credential storage                                         |
| **@nestjs/jwt**     | JWT signing + verification | Bearer token auth via Passport                                    |
| **pino**            | Structured logging         | JSON logs to stdout — compatible with Loki log aggregation in k8s |
| **OpenTelemetry**   | Traces, metrics, logs      | Auto-instrumented, exported over OTLP to the local LGTM stack     |

---

## API Endpoints

| Method   | Path             | Auth     | Description                                    |
| -------- | ---------------- | -------- | ---------------------------------------------- |
| `POST`   | `/auth/register` | —        | Register a new user                            |
| `POST`   | `/auth/login`    | —        | Login, returns JWT                             |
| `GET`    | `/products`      | —        | List products (filter by `?category=&search=`) |
| `GET`    | `/products/:id`  | —        | Get product by ID                              |
| `GET`    | `/products/mine` | ✓ seller | Get authenticated seller's products            |
| `POST`   | `/products`      | ✓ seller | Create product                                 |
| `PUT`    | `/products/:id`  | ✓ seller | Update product (own only, unless admin)        |
| `DELETE` | `/products/:id`  | ✓ seller | Delete product (own only, unless admin)        |
| `GET`    | `/categories`    | —        | List categories                                |
| `GET`    | `/purchases`     | ✓ buyer  | List purchases for authenticated user          |
| `GET`    | `/purchases/:id` | ✓ buyer  | Get purchase by ID                             |
| `POST`   | `/purchases`     | ✓ buyer  | Create purchase from cart items                |
| `POST`   | `/payments`      | ✓ buyer  | Process payment for a purchase                 |
| `GET`    | `/health`        | —        | Liveness probe                                 |
| `GET`    | `/ready`         | —        | Readiness probe (checks DB connectivity)       |

Interactive API docs (Swagger UI) available at `/api/docs`.

### Auth

JWT is issued on login/register and expected as `Authorization: Bearer <token>`. The frontend stores it in an `httpOnly` cookie and forwards it on server-side API calls.

### RBAC

Permissions are role-based (`buyer`, `seller`, `admin`). The `PermissionsGuard` loads role permissions from the DB on each request. Controllers declare required permissions via `@RequirePermissions()` (e.g. `product:update:own` vs `product:update:any`).

---

## Local Development

### Prerequisites

Start PostgreSQL and the LGTM observability stack via the infra repo:

```bash
# in ecommerce-infra
make start-local
```

### Setup

```bash
cp .env.example .env    # fill in DB credentials and JWT_SECRET
npm install
npm run start:dev       # starts with hot reload
```

### Database

```bash
npm run migration:generate -- src/database/migrations/<name>  # generate a new migration
npm run migration:run                                          # apply pending migrations
npm run migration:revert                                       # revert last migration
npm run db:seed                                                # seed roles, permissions, users, products
```

### Build

```bash
npm run build       # compile TypeScript to dist/
npm run start:prod  # run the compiled build
```

---

## Seed Users

All seed users share the password `Password123!`.

| Email              | Role   |
| ------------------ | ------ |
| <admin@shop.com>   | admin  |
| <seller1@shop.com> | seller |
| <seller2@shop.com> | seller |
| <buyer1@shop.com>  | buyer  |
| <buyer2@shop.com>  | buyer  |

---

## Logging

Structured JSON logging via [pino](https://getpino.io). Every log line is a JSON object written to stdout — ready for Loki to ingest in Kubernetes.

Logs are JSON by default. Set `LOG_PRETTY=true` in `.env` to get colorized `pino-pretty` output in your terminal. Production never uses it.

HTTP request/response logging is handled automatically by `pino-http`. Log level is controlled by the `LOG_LEVEL` environment variable (default: `info`).

```bash
# In k8s, query logs in Grafana → Loki:
# {namespace="local-backend"} | json | level="error"
```

---

## Observability

`src/tracing.ts` starts the OpenTelemetry SDK with Node auto-instrumentation for HTTP, Express, NestJS, Postgres and pino. `main.ts` imports it on its first line. The instrumentation hooks each library as it loads, so any library loaded before it goes untraced. `tracing.ts` also loads `.env` itself, because Nest reads `.env` only after the SDK has started.

The SDK takes its settings from environment variables and sends traces, metrics and logs over OTLP. Locally, the LGTM stack from `ecommerce-infra` receives them on `localhost:4318`. To see them, open Grafana at <http://localhost:3300> (`admin` / `admin`) and look for the `ecommerce-be` service in Tempo, Prometheus and Loki.

The Proxmox and KinD clusters have no OTLP endpoint yet, so the gitops deployment sets `OTEL_SDK_DISABLED=true`.

---

## Docker

```bash
docker build -t kristijan92/ecommerce-shop-be:latest .

docker run -p 3000:3000 \
  --add-host=host.docker.internal:host-gateway \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_USER=postgres \
  -e DB_PASS=postgres \
  -e DB_DATABASE=ecommerce \
  -e JWT_SECRET=change-me \
  -e NODE_ENV=production \
  kristijan92/ecommerce-shop-be:latest
```

---

## Environment Variables

| Variable                      | Description                                       |
| ----------------------------- | ------------------------------------------------- |
| `DB_HOST`                     | PostgreSQL host                                   |
| `DB_PORT`                     | PostgreSQL port (default: `5432`)                 |
| `DB_USER`                     | PostgreSQL username                               |
| `DB_PASS`                     | PostgreSQL password                               |
| `DB_DATABASE`                 | PostgreSQL database name                          |
| `JWT_SECRET`                  | Secret key for signing JWTs                       |
| `PORT`                        | HTTP port (default: `3000`)                       |
| `LOG_LEVEL`                   | Pino log level (default: `info`)                  |
| `LOG_PRETTY`                  | `true` for pretty terminal logs, otherwise JSON   |
| `OTEL_SERVICE_NAME`           | Service name shown in Grafana (`ecommerce-be`)    |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP endpoint (local: `http://localhost:4318`)    |
| `OTEL_SDK_DISABLED`           | `true` turns telemetry off (used in the clusters) |
