import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const MCP_URL = process.env.MCP_URL ?? "http://localhost:3333/mcp";
const MCP_AUTH_TOKEN = (process.env.MCP_AUTH_TOKEN ?? "").trim();

function authHeaders() {
  if (!MCP_AUTH_TOKEN) return {};
  return { Authorization: `Bearer ${MCP_AUTH_TOKEN}` };
}

let clientPromise: Promise<Client> | null = null;

async function connectOnce(): Promise<Client> {
  const transport = new StreamableHTTPClientTransport(new URL(MCP_URL), {
    requestInit: { headers: authHeaders() },
  } as any);

  const client = new Client({ name: "express-bff", version: "1.0.0" });
  await client.connect(transport);
  return client;
}

export async function getMcpClient(): Promise<Client> {
  if (!clientPromise) {
    clientPromise = connectOnce().catch((err) => {
      // If connect fails, allow retry next time
      clientPromise = null;
      throw err;
    });
  }
  return clientPromise;
}

/**
 * Use this if a request fails with "already initialized" or session errors:
 * it will force a fresh client/transport on the next call.
 */
export function resetMcpClient() {
  clientPromise = null;
}
