# ecommerce-shop-be

REST API backend for the ecommerce shop. Part of a multi-repo project:

| Repo                                                                         | Purpose                                        |
| ---------------------------------------------------------------------------- | ---------------------------------------------- |
| [ecommerce-shop-be](https://github.com/KristijanJ/ecommerce-shop-be)         | **This repo** - Express.js REST API            |
| [ecommerce-shop-fe](https://github.com/KristijanJ/ecommerce-shop-fe)         | Next.js frontend                               |
| [ecommerce-shop-gitops](https://github.com/KristijanJ/ecommerce-shop-gitops) | Kubernetes manifests, ArgoCD, platform tooling |
| [ecommerce-infra](https://github.com/KristijanJ/ecommerce-infra)             | Local Docker Compose for PostgreSQL and Redis  |

---

## Stack

| Technology     | Role                       | Why                                                               |
| -------------- | -------------------------- | ----------------------------------------------------------------- |
| **Express.js** | HTTP server                | Lightweight, straightforward for a REST API                       |
| **Prisma**     | ORM + migrations           | Type-safe DB access, migration files tracked in Git               |
| **PostgreSQL** | Database                   | Primary data store                                                |
| **Zod**        | Request validation         | Schema validation at API boundaries                               |
| **bcrypt**     | Password hashing           | Secure credential storage                                         |
| **jose**       | JWT signing + verification | Cookie-based session auth                                         |
| **pino**       | Structured logging         | JSON logs to stdout — compatible with Loki log aggregation in k8s |

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

### Auth

JWT is issued on login/register and expected as `Authorization: Bearer <token>`. The frontend stores it in an `httpOnly` cookie and forwards it on server-side API calls.

### RBAC

Permissions are role-based (`buyer`, `seller`, `admin`). The `requirePermission` middleware loads role permissions from the DB and attaches them to the request. Controllers check specific permissions (e.g. `product:update:own` vs `product:update:any`).

---

## Local Development

### Prerequisites

Start PostgreSQL (and Redis for the frontend) via the infra repo:

```bash
# in ecommerce-infra
make start-local
```

### Setup

```bash
cp .env.example .env    # fill in DATABASE_URL and JWT_SECRET
npm install
npm run dev             # starts with hot reload (tsx --watch)
```

### Database

```bash
npx prisma migrate dev --name <name>    # create + apply a new migration
npx prisma migrate deploy               # apply pending migrations (used in k8s)
npx prisma generate                     # regenerate client after schema changes
npx prisma studio                       # open database GUI at localhost:5555
npx prisma migrate reset                # wipe DB and re-run all migrations
npm run db:seed                         # seed roles, permissions, users, products
```

### Build

```bash
npm run build    # compile TypeScript to dist/
npm start        # run the compiled build
```

---

## Seed Users

All seed users share the password `Password123!`.

| Email            | Role   |
| ---------------- | ------ |
| admin@shop.com   | admin  |
| seller1@shop.com | seller |
| seller2@shop.com | seller |
| buyer1@shop.com  | buyer  |
| buyer2@shop.com  | buyer  |

---

## Logging

Structured JSON logging via [pino](https://getpino.io). Every log line is a JSON object written to stdout — ready for Loki to ingest in Kubernetes.

HTTP request/response logging is handled automatically by `pino-http`. Health check endpoints (`/health`, `/ready`) are excluded to reduce noise from k8s probes.

Log level is controlled by the `LOG_LEVEL` environment variable (default: `info`).

```bash
# Pretty-print logs locally
node dist/src/index.js | npx pino-pretty

# In k8s, query logs in Grafana → Loki:
# {namespace="local-backend"} | json | level="error"
```

---

## Docker

```bash
docker build -t ecommerce-shop-be:local .
docker run -p 3000:3000 --env-file .env ecommerce-shop-be:local
```

The image is published to Docker Hub at `kristijan92/ecommerce-shop-be` and loaded into the KinD cluster via `make load-backend-image` in the gitops repo.

---

## Environment Variables

| Variable       | Description                      |
| -------------- | -------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string     |
| `JWT_SECRET`   | Secret key for signing JWTs      |
| `PORT`         | HTTP port (default: `3000`)      |
| `LOG_LEVEL`    | Pino log level (default: `info`) |
