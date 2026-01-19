## Quick start

### Prerequisites

- Node.js (LTS recommended)
- pnpm
- Docker (for Postgres)

### 1) Install dependencies

```bash
pnpm install
```

### 2) Start Postgres

```bash
docker compose up -d
```

### 3) Create server env file

Copy the example and adjust if needed:

```bash
cp env/server.env.example env/server.env
```

Example `env/server.env.example`:

```bash
# Postgres (Docker)
DATABASE_URL=postgresql://feedback:feedback@localhost:5432/feedback

# Server
PORT=3001
```

### 4) Run database migrations

```bash
pnpm db:migrate
```

### 5) Run the app (web + server)

```bash
pnpm dev
```

Open:

- Web: [http://localhost:5173](http://localhost:5173)
- API (tRPC): [http://localhost:3001/trpc](http://localhost:3001/trpc)


## Troubleshooting

### Postgres auth errors on first run

If you see password authentication failed, check that no other Postgres container is running on the same port and run:

`docker compose down -v`

`docker compose up -d`

## Repo structure

* apps/web/
    * Vite + React UI
    * Calls the API via tRPC + TanStack Query
    * Tailwind for styling
* apps/server/
    * Express + tRPC server
    * Owns DB connection + server runtime config (DATABASE_URL, PORT)
    * Runs Drizzle migrations (migrations committed under apps/server/drizzle/)
* packages/api/
    * tRPC router/procedure definitions (feature routers mounted under appRouter
    * Uses shared types/schema from @einari/db
* packages/db/
    * Drizzle schema and shared DB types (source of truth for enums like FeedbackStatus)
    * Depends on drizzle-orm (and drizzle-orm/pg-core)
* env/
    * Local dev env files (e.g. env/server.env)
    * env/server.env.example is committed; env/server.env is ignored