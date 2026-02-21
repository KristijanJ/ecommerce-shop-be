# ecommerce-shop-be

REST API backend for the ecommerce shop.

## Stack

- **Express** — HTTP server
- **Prisma** — ORM and migrations
- **PostgreSQL** — database
- **bcrypt** — password hashing
- **jose** — JWT signing and verification
- **Zod** — request validation

## Development

Copy the example env and fill in the values:

```bash
cp .env.example .env
```

```bash
npm run dev       # start with hot reload
npm run build     # compile to dist/
npm start         # run compiled build
```

## Database

```bash
npm run db:seed                                    # seed roles, permissions, users, products

npx prisma migrate dev --name <name>              # create + apply migration
npx prisma migrate deploy                         # apply migrations (production)
npx prisma generate                               # regenerate client after schema change
npx prisma studio                                 # open database GUI
npx prisma migrate reset                          # reset DB and re-run all migrations
```

## Seed users

All seed users share the password `Password123!`.

| Email            | Role   |
| ---------------- | ------ |
| admin@shop.com   | admin  |
| seller1@shop.com | seller |
| seller2@shop.com | seller |
| buyer1@shop.com  | buyer  |
| buyer2@shop.com  | buyer  |
