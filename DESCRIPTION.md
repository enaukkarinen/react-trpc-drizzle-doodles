# Repository Description

This monorepo is a full-stack demo that combines:
- A React web app with a map UI and a chat assistant
- An Express + tRPC backend that orchestrates OpenAI tool calls
- An MCP (Model Context Protocol) tool server exposing read-only data tools
- A Postgres/PostGIS + pgvector database with Drizzle ORM schemas and migrations
- A tiny knowledge base pipeline that ingests Markdown, generates embeddings, and enables semantic search

The intent is to explore a practical workflow where a chat assistant can answer user questions by calling authoritative, read-only tools backed by a database (feedback items, UK Local Authority Districts, and knowledge base docs), with a map-driven context and transparent tool-call traces.


**Apps**
- **Server**: Express + tRPC API, OpenAI Responses loop, vector tile endpoint.
  - Entrypoint: [apps/server/src/index.ts](apps/server/src/index.ts)
  - Chat API: [apps/server/src/routes/chat.ts](apps/server/src/routes/chat.ts)
  - Tool orchestration: [runChat](apps/server/src/openai/runChat.ts#L1-L110) uses `tools`, iterates on tool calls, and returns a reply + traces.
  - Tool registry: [apps/server/src/openai/tools/toolRegistry.ts](apps/server/src/openai/tools/toolRegistry.ts)
  - MCP client: [apps/server/src/mcp/getMcpClient.ts](apps/server/src/mcp/getMcpClient.ts), tool invocations at [apps/server/src/mcp/index.ts](apps/server/src/mcp/index.ts)
  - Vector tiles: [apps/server/src/routes/tiles.ts](apps/server/src/routes/tiles.ts) serves LAD tiles from PostGIS.
- **MCP**: HTTP MCP server registering read-only tools that hit Postgres via Drizzle.
  - Entrypoint: [apps/mcp/src/index.ts](apps/mcp/src/index.ts)
  - Tools registered: [apps/mcp/src/tools/index.ts](apps/mcp/src/tools/index.ts)
  - Feedback tools: list/search/recent/get/stats
  - LAD tool: authoritative lookup by district `ref`
  - KB search tool: semantic search over ingested Markdown
- **Web**: Vite + React app with pages for Chat and Map.
  - Entrypoint: [apps/web/src/main.tsx](apps/web/src/main.tsx)
  - Router: [apps/web/src/App.tsx](apps/web/src/App.tsx)
  - Chat page: [apps/web/src/features/chat/pages/ChatPage.tsx](apps/web/src/features/chat/pages/ChatPage.tsx), UI component: [Chat](apps/web/src/features/chat/components/Chat.tsx#L1-L220)
  - Map page: [apps/web/src/features/map/pages/MapPage.tsx](apps/web/src/features/map/pages/MapPage.tsx), LAD layer: [apps/web/src/features/map/lib/ladLayer.ts](apps/web/src/features/map/lib/ladLayer.ts)


**Core Features**
- **Chat Assistant with Tools**: The assistant answers by calling tools when helpful.
  - `feedback_recent`, `feedback_search`, `feedback_get`, `feedback_list`, `feedback_stats`
  - `lad_by_ref` for authoritative district facts
  - `kb_search` for repo knowledge base snippets
  - Client sees a reply and tool-call traces, improving transparency.
- **Map + District Context**: Selecting a district passes a `lad` chat context with `ref` and optional UI label.
  - The assistant is instructed to validate district facts by calling `lad_by_ref` instead of trusting UI labels.
- **Vector Tiles**: Server generates MVT tiles from PostGIS for UK LAD polygons and properties.
- **Feedback CRUD via tRPC**: Basic routes for listing, reading, creating, updating, deleting feedback.
- **Knowledge Base**: Markdown files under `kb/` are chunked, embedded (OpenAI), stored with pgvector, and searchable.


**Architecture & Data Flow**
- **Frontend → Backend**
  - Web calls `/api/chat` with a message and optional context; receives `reply` + optional `data` (traces).
  - Web consumes tRPC at `/trpc` for feedback operations.
  - Map requests vector tiles from `/tiles/lad/{z}/{x}/{y}.pbf`.
- **Backend → MCP Tools**
  - `runChat()` provides `tools` to the OpenAI Responses API. When the model calls a tool, the server maps the tool `name` to an implementation that delegates to the MCP server.
  - MCP server hits Postgres via Drizzle and returns JSON wrapped in MCP text content blocks.
  - Server converts MCP outputs to plain JSON, appends them as `function_call_output`, and continues the loop.
- **OpenAI Loop**
  - The server maintains `input` history and adds tool outputs; it caps recursion (`MAX_TOOL_CALL_STEPS`) for safety.
- **Data Sources**
  - Feedback and LAD are authoritative in Postgres.
  - Knowledge Base embeddings are generated via OpenAI and stored in pgvector for cosine-distance search.


**tRPC API (packages/api)**
- Router: [packages/api/src/router.ts](packages/api/src/router.ts)
- Feedback routes: [packages/api/src/routers/feedback.ts](packages/api/src/routers/feedback.ts)
  - `list`, `byId`, `delete`, `create`, `updateTitle`, `updateStatus`, `updateSummary`
- Middleware: [logging](packages/api/src/middleware/logging.ts), [auth](packages/api/src/middleware/auth.ts)
- Context typing: [packages/api/src/context.ts](packages/api/src/context.ts)


**MCP Tools (apps/mcp)**
- Feedback list/search/get/stats/recent: [apps/mcp/src/tools](apps/mcp/src/tools)
- LAD lookup by `ref`: [apps/mcp/src/tools/ladByRef.ts](apps/mcp/src/tools/ladByRef.ts)
- KB semantic search: [apps/mcp/src/tools/kbSearch.ts](apps/mcp/src/tools/kbSearch.ts)
- Auth (optional): Bearer token checked in [apps/mcp/src/index.ts](apps/mcp/src/index.ts)


**Database & Schemas (packages/db)**
- Feedback: [packages/db/src/schema/feedback.ts](packages/db/src/schema/feedback.ts)
- LAD geometry & metadata: [packages/db/src/schema/lad.ts](packages/db/src/schema/lad.ts)
- Knowledge Base: documents + chunks + `vector(1536)`: [packages/db/src/schema/knowledgeBase.ts](packages/db/src/schema/knowledgeBase.ts)
  - Foreign key: `kb_chunk.document_id` references `kb_document.id` with cascade on delete/update.
- Vector type: [packages/db/src/types/vector.ts](packages/db/src/types/vector.ts)
- Drizzle config: [drizzle.config.ts](drizzle.config.ts) outputs migrations into `apps/server/drizzle/`
- pgvector extension migration: [apps/server/drizzle/0003_vector_extension.sql](apps/server/drizzle/0003_vector_extension.sql)


**Vector Tiles (LAD)**
- Route: [apps/server/src/routes/tiles.ts](apps/server/src/routes/tiles.ts)
- Cache: In-memory LRU to avoid repeated work; empty tiles return 204.
- Geometry pipeline: PostGIS generating MVT with tile envelope, buffer, `extent=4096`.
- Frontend consumption: Deck.gl `MVTLayer` over MapLibre basemap.


**Knowledge Base Pipeline (packages/kb + scripts)**
- Ingest Markdown from `kb/` and upsert into `kb_document` + `kb_chunk`.
- Generate embeddings via OpenAI `text-embedding-3-small`.
- Store embeddings in pgvector; search ranks by cosine distance.
- Code: [kbSearch](packages/kb/src/kbSearch.ts), ingest: [apps/server/scripts/kb-ingest.ts](apps/server/scripts/kb-ingest.ts), test: [apps/server/scripts/kb-search-test.ts](apps/server/scripts/kb-search-test.ts)
  - Transactions: embeddings are computed first; document and its chunks are upserted within a single DB transaction per file to keep data consistent and transactions short.


**Safety & Trust Boundaries**
- Tools are read-only; the assistant is instructed not to claim writes.
- District facts must be fetched via `lad_by_ref` (UI labels are non-authoritative).
- Request validation: Zod schemas at [packages/api-contract/src/chat.ts](packages/api-contract/src/chat.ts) and in MCP input schemas.
- Tool-call depth capped by `MAX_TOOL_CALL_STEPS` in [runChat](apps/server/src/openai/runChat.ts#L37-L39).
- MCP auth: Optional bearer token boundary at `/mcp`.


**Operational Setup**
- Postgres with PostGIS + pgvector via Docker Compose.
  - Compose: [docker/docker-compose.yml](docker/docker-compose.yml)
  - Base image: [docker/Dockerfile](docker/Dockerfile)
- Drizzle migrations and scripts are run via root `package.json` scripts.
  - See [README.md](README.md) for quickstart, migrations, and ingest commands.


**How Pieces Work Together**
- A user selects a district on the map → the UI passes `lad` context (`ref`) into Chat → the assistant calls `lad_by_ref` → returns authoritative facts (name, dates, bbox, areaKm2) → the assistant summarises.
- A user asks for recent feedback → the assistant calls `feedback_recent` → the client shows reply + tool-call items; selecting one can drive a `get <id>` follow-up.
- A user asks “what’s wired in?” → the assistant uses `kb_search` to fetch relevant docs (e.g., architecture/map notes) and cites sources.


**Configuration & Env**
- Server env: `apps/server/env/server.env` (see example file).
- MCP env: `apps/mcp/env/mcp.env.example` for `MCP_AUTH_TOKEN`.
- Web env: `apps/web/.env` injected at build (`VITE_TRPC_URL`).


**Notable Design Choices**
- Separation of responsibilities: Backend orchestrates model + tools; MCP owns data access.
- Transparency by design: Tool-call traces returned with the reply.
- Read-only tools: Safe exploration without unintended writes.
- Map-driven context: Encourages grounded, location-specific answers.
