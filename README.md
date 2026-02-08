# E-Commerce Shop Backend

## Setup

### Prisma Setup

Initial Prisma setup was done using the [Prisma PostgreSQL Quickstart Guide](https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/postgresql).

Commands used:

```bash
# Initialize Prisma with PostgreSQL
npx prisma init --datasource-provider postgresql --output ../generated/prisma

# Update your .env file with your PostgreSQL connection string:
# DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"

# Create initial migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Database Commands

```bash
# Create a new migration
npx prisma migrate dev --name <migration_name>

# Generate Prisma Client (after schema changes)
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (careful!)
npx prisma migrate reset
```
