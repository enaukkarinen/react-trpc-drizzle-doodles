# Feedback Doodles

For an end-to-end architecture and feature overview, see [DESCRIPTION.md](DESCRIPTION.md).

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

### 3) Create env files (3)

This project uses three env files:
- Server runtime (Node, loaded via dotenv)
- Web app (Vite, injected at build time)
- MCP tool server (Node, loaded via dotenv)

Copy the examples and adjust if needed (ensure `OPENAI_API_KEY` is set in the server env):

```bash
cp apps/server/env/server.env.example apps/server/env/server.env
cp apps/web/.env.example apps/web/.env
cp apps/mcp/env/mcp.env.example apps/mcp/env/mcp.env
```

### 4) Run database migrations

```bash
pnpm db:migrate
```

### 5) Run the app (web + server + MCP)

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
- MCP (HTTP): [http://localhost:3333/mcp](http://localhost:3333/mcp)

## Useful scripts

- Build/start Postgres via Docker: `pnpm db:build`
- Generate/migrate schema (Drizzle): `pnpm db:generate` / `pnpm db:migrate`
- Populate LAD polygons/metadata: `pnpm db:populate`
- Ingest KB markdown + embeddings: `pnpm kb:ingest`
- Test KB search locally: `pnpm kb:test`

## Troubleshooting

### Postgres auth errors on first run

If you see password authentication failed, check that no other Postgres container is running on the same port and run:

`docker compose down -v`

`docker compose up -d`

### Chat or KB errors

- Ensure `OPENAI_API_KEY` is set in `apps/server/env/server.env`.
- Ensure the MCP server is running (it starts via `pnpm dev`) and that `MCP_URL` and `MCP_AUTH_TOKEN` in the server env match `apps/mcp/env/mcp.env`.

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
