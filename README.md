# ecommerce-shop-be

REST API for the ecommerce shop. Part of a multi-repo project:

| Repo                                                                         | Purpose                                                             |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [ecommerce-shop-be](https://github.com/KristijanJ/ecommerce-shop-be)         | This repo. NestJS REST API                                          |
| [ecommerce-shop-fe](https://github.com/KristijanJ/ecommerce-shop-fe)         | Next.js frontend                                                    |
| [ecommerce-shop-gitops](https://github.com/KristijanJ/ecommerce-shop-gitops) | Kubernetes manifests, ArgoCD, platform tooling                      |
| [ecommerce-infra](https://github.com/KristijanJ/ecommerce-infra)             | Terraform for AWS, Docker Compose and Ansible for Proxmox and local |

---

## Stack

| Technology      | Role                      | Notes                                            |
| --------------- | ------------------------- | ------------------------------------------------ |
| NestJS 11       | HTTP server and framework | Modules, decorators and dependency injection     |
| TypeORM         | ORM and migrations        | Migration files are in `src/database/migrations` |
| PostgreSQL      | Database                  |                                                  |
| class-validator | Request validation        | DTOs validate input at the API boundary          |
| bcrypt          | Password hashing          |                                                  |
| @nestjs/jwt     | JWT signing and checking  | Bearer tokens through Passport                   |
| pino            | Logging                   | JSON on stdout                                   |
| OpenTelemetry   | Traces, metrics, logs     | Exported over OTLP                               |

---

## API endpoints

| Method   | Path             | Auth     | Description                                      |
| -------- | ---------------- | -------- | ------------------------------------------------ |
| `POST`   | `/auth/register` | none     | Register a new user                              |
| `POST`   | `/auth/login`    | none     | Log in, returns a JWT                            |
| `PATCH`  | `/auth/me`       | any user | Update the authenticated user's profile          |
| `GET`    | `/products`      | none     | List products (filter with `?category=&search=`) |
| `GET`    | `/products/:id`  | none     | Get a product                                    |
| `GET`    | `/products/mine` | seller   | List the authenticated seller's products         |
| `POST`   | `/products`      | seller   | Create a product                                 |
| `PUT`    | `/products/:id`  | seller   | Update a product (own only, unless admin)        |
| `DELETE` | `/products/:id`  | seller   | Delete a product (own only, unless admin)        |
| `GET`    | `/categories`    | none     | List categories                                  |
| `GET`    | `/purchases`     | buyer    | List the authenticated user's purchases          |
| `GET`    | `/purchases/:id` | buyer    | Get a purchase                                   |
| `POST`   | `/purchases`     | buyer    | Create a purchase from cart items                |
| `POST`   | `/payments`      | buyer    | Pay for a purchase                               |
| `GET`    | `/health`        | none     | Liveness probe                                   |
| `GET`    | `/ready`         | none     | Readiness probe, checks the database             |

Swagger UI is at `/api/docs`.

### Auth

Login and register return a JWT. Send it as `Authorization: Bearer <token>`. The frontend keeps it in an `httpOnly` cookie and forwards it on its server-side calls.

### Permissions

Roles are `buyer`, `seller` and `admin`. The `PermissionsGuard` loads the role's permissions from the database on each request. Controllers declare what they need with `@RequirePermissions()`, for example `product:update:own` or `product:update:any`. The `user` and `rbac` modules have no public routes.

---

## Local development

Start PostgreSQL and the LGTM stack from the infra repo:

```bash
# in ecommerce-infra
make start-local
```

Then:

```bash
cp .env.example .env    # fill in DB_USER, DB_PASS, DB_DATABASE and JWT_SECRET
npm install
npm run start:dev       # hot reload on port 3000
```

### Database

```bash
npm run migration:generate -- src/database/migrations/<name>   # generate a migration
npm run migration:run                                          # apply pending migrations
npm run migration:revert                                       # revert the last migration
npm run db:seed                                                # roles, permissions, users, products
```

`db:seed` runs the TypeScript source with ts-node, so it works only from a checkout. Inside a container the compiled build has the same script:

```bash
kubectl exec -n <namespace> deploy/<name> -- node dist/database/seed.js
```

In the clusters, a Job runs `npm run migration:run:prod` before each rollout (see the gitops repo).

### Scripts

```bash
npm run build       # compile to dist/
npm run start:prod  # run the compiled build
npm run lint        # eslint with --fix
npm run lint:ci     # eslint without --fix, used by CI
npm test            # unit tests
npm run test:e2e    # needs a running database
```

---

## Seed users

All seed users have the password `Password123!`.

| Email              | Role   |
| ------------------ | ------ |
| <admin@shop.com>   | admin  |
| <seller1@shop.com> | seller |
| <seller2@shop.com> | seller |
| <buyer1@shop.com>  | buyer  |
| <buyer2@shop.com>  | buyer  |

---

## Logging

The API logs JSON with [pino](https://getpino.io) to stdout, and `pino-http` logs each request and response. `LOG_LEVEL` sets the level (default `info`). Set `LOG_PRETTY=true` in `.env` for readable terminal output. Do not use it in a cluster.

In the clusters, logs reach Loki through the OpenTelemetry Collector. Query them in Grafana under Explore with the Loki datasource:

```logql
{service_name="ecommerce-be"} | json | level="error"
```

---

## Observability

`src/tracing.ts` starts the OpenTelemetry SDK with Node auto-instrumentation for HTTP, Express, NestJS, Postgres and pino. `main.ts` imports it on its first line. The instrumentation hooks each library as it loads, so a library loaded earlier is not traced. `tracing.ts` loads `.env` itself, because Nest reads `.env` only after the SDK has started.

The SDK reads its settings from environment variables and sends traces, metrics and logs over OTLP.

- Locally, the LGTM stack from `ecommerce-infra` receives them on `localhost:4318`. Open Grafana at <http://localhost:3300> (`admin` / `admin`) and look for the service `ecommerce-be`.
- In the clusters, the Deployment points `OTEL_EXPORTER_OTLP_ENDPOINT` at the collector in the `monitoring` namespace (`opentelemetry-collector.monitoring:4318`). The collector forwards to Tempo, Loki and Prometheus.

---

## Docker

```bash
docker build -t kristijan92/ecommerce-shop-be:local .

docker run -p 3000:3000 \
  --add-host=host.docker.internal:host-gateway \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_USER=postgres \
  -e DB_PASS=postgres \
  -e DB_DATABASE=ecommerce \
  -e JWT_SECRET=change-me \
  -e NODE_ENV=production \
  kristijan92/ecommerce-shop-be:local
```

---

## CI/CD

A push to `main` runs `.github/workflows/release.yaml`:

1. `test` runs `npm ci`, `npm run lint:ci` and `npm test`.
2. `build` builds the image and pushes it to Docker Hub as `kristijan92/ecommerce-shop-be:<first 7 characters of the commit SHA>`.
3. `bump-gitops` sets `newTag` in `apps/backend/envs/homelab/kustomization.yaml` in the gitops repo with `yq`, commits to `main` and pushes. ArgoCD on the homelab then deploys the new image.

The workflow needs these in the repo settings:

| Name                   | Kind     | Use                                                        |
| ---------------------- | -------- | ---------------------------------------------------------- |
| `DOCKERHUB_USERNAME`   | variable | Docker Hub login                                           |
| `DOCKERHUB_TOKEN`      | secret   | Docker Hub access token                                    |
| `GITOPS_APP_CLIENT_ID` | variable | Client ID of the GitHub App that writes to the gitops repo |
| `GITOPS_APP_KEY`       | secret   | Private key of that App                                    |

The workflow updates only the homelab overlay. The aws-prod overlay keeps its pinned tag until it is changed in the gitops repo. The e2e test needs a database and does not run in CI. Dependabot checks the GitHub Actions versions weekly.

---

## Environment variables

| Variable                      | Description                                             |
| ----------------------------- | ------------------------------------------------------- |
| `DB_HOST`                     | PostgreSQL host                                         |
| `DB_PORT`                     | PostgreSQL port (default `5432`)                        |
| `DB_USER`                     | PostgreSQL user                                         |
| `DB_PASS`                     | PostgreSQL password                                     |
| `DB_DATABASE`                 | PostgreSQL database name                                |
| `JWT_SECRET`                  | Secret for signing JWTs                                 |
| `PORT`                        | HTTP port (default `3000`)                              |
| `LOG_LEVEL`                   | pino log level (default `info`)                         |
| `LOG_PRETTY`                  | `true` for readable terminal logs, otherwise JSON       |
| `OTEL_SERVICE_NAME`           | Service name in Grafana (`ecommerce-be`)                |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP endpoint (locally `http://localhost:4318`)         |
| `OTEL_SDK_DISABLED`           | Standard OpenTelemetry flag, `true` turns telemetry off |
