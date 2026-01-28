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

### 3) Create env files (2)

This project uses two separate env files:
- one for the server runtime (Node, loaded via dotenv)
- one for the web app (Vite, injected at build time)

Copy the examples and adjust if needed:

```bash
cp apps/server/env/server.env.example apps/server/env/server.env
cp apps/web/.env.example apps/web/.env
```

### 4) Run database migrations

```bash
pnpm db:migrate
```

### 5) Run the app (web + server)

```bash
pnpm dev
```

### 6) Populate database (map tiles)

```bash
pnpm db:populate
```

### 7) Create and store embeddings 

```bash
pnpm kb:ingest
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

- apps/web/
  - Vite + React UI
  - Calls the API via tRPC + TanStack Query
- apps/server/
  - Express + tRPC server
  - DB connection
  - Drizzle migrations
- packages/api/
  - tRPC router, procedure & context definitions
- packages/db/
  - Drizzle schema and shared DB types, and other domain definitions
