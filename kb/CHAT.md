## Chat Flow
- **Entry**: Client POSTs `/api/chat` with `message` and optional `context`.
- **Loop**: Server builds `instructions`, includes context, provides tools, and calls the OpenAI Responses API.
- **Tools**: If the model requests a tool, the server runs it and feeds a `function_call_output` back to the model.
- **Result**: Server returns the final `reply` and collected `traces` to the client.

## Tool Calling
- **Definitions**: Tools are declared with names, descriptions, and parameter schemas and are provided to the model.
- **Execution**: The server maps a tool `name` from the model to an implementation and invokes it.
- **MCP**: Implementations call the MCP tool server, which queries Postgres and returns JSON (in a text content block).

## What a Tool Call Looks Like
- **Model → Server**: The model emits a `function_call` with a `name` and JSON `arguments`.
- **Server → Model**: After running the tool, the server appends a `function_call_output` containing the result JSON.
- **Observability**: Each call is captured as a trace for the client.

## MCP vs Server Responsibilities
- **Server (apps/server)**:
  - Hosts `/api/chat` and validates requests.
  - Builds conversation `instructions`, translates UI context, and provides tool definitions to the model.
  - Orchestrates the tool-calling loop and aggregates traces.
  - Translates MCP outputs to JSON for the model and client.
- **MCP (apps/mcp)**:
  - Hosts the MCP HTTP endpoint (`/mcp`) using `McpServer` + `StreamableHTTPServerTransport`.
  - Registers read-only tools backed by Postgres via Drizzle ORM.
  - Enforces optional bearer auth (`MCP_AUTH_TOKEN`).
  - Returns results as MCP content blocks (JSON in `text`).

## Trust Boundaries
- **Data authority**:
  - Feedback and LAD data come from Postgres via MCP tools; the model should treat these as the source of truth.
  - UI labels for LAD are explicitly non-authoritative; `contextToInput` instructs the model to call `lad_by_ref` before answering district facts.
- **Read-only guarantees**:
  - Tools are read-only; `buildInstructions` clarifies the model must not claim writes.
- **Validation and safety**:
  - Request bodies are validated by Zod; tool parameters have explicit schemas in server tool definitions and MCP input schemas.
  - The server limits tool-call recursion via `MAX_TOOL_CALL_STEPS`.
- **Auth boundary**:
  - MCP server supports bearer auth. The server supplies `Authorization` when configured.

## Where Traces Come From
- Traces are assembled during tool execution in the chat loop: the server pushes `{ name, args, output }` per call into an array and returns it to the client.
