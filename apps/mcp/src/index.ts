import express from "express";
import { z } from "zod";
import { randomUUID } from "node:crypto";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { db } from "@einari/db-client";
import { feedback, FEEDBACK_STATUSES } from "@einari/db";
import { and, desc, eq, ilike } from "drizzle-orm";

/* ------------------ config ------------------ */

const PORT = Number(process.env.PORT ?? 3333);
const MCP_AUTH_TOKEN = (process.env.MCP_AUTH_TOKEN ?? "").trim();

/* ------------------ MCP server ------------------ */

const mcp = new McpServer({
  name: "feedback-readonly-http",
  version: "1.0.0",
});

/* -------- tools -------- */

mcp.registerTool(
  "feedback_list",
  {
    description: "List feedback items (read-only).",
    inputSchema: {
      limit: z.number().int().min(1).max(50).default(20),
      offset: z.number().int().min(0).default(0),
      status: z.enum(FEEDBACK_STATUSES).optional(),
      query: z.string().min(1).max(200).optional(),
    },
  },
  async ({ limit, offset, status, query }) => {
    const where = and(
      status ? eq(feedback.status, status) : undefined,
      query ? ilike(feedback.summary, `%${query}%`) : undefined,
    );

    const rows = await db
      .select({
        id: feedback.id,
        summary: feedback.summary,
        status: feedback.status,
        createdAt: feedback.createdAt,
      })
      .from(feedback)
      .where(where)
      .orderBy(desc(feedback.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            { count: rows.length, limit, offset, items: rows },
            null,
            2,
          ),
        },
      ],
    };
  },
);

mcp.registerTool(
  "feedback_get",
  {
    description: "Get a feedback item by id (read-only).",
    inputSchema: { id: z.string().min(1) },
  },
  async ({ id }) => {
    const rows = await db
      .select({
        id: feedback.id,
        summary: feedback.summary,
        status: feedback.status,
        createdAt: feedback.createdAt,
      })
      .from(feedback)
      .where(eq(feedback.id, id))
      .limit(1);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(rows[0] ?? null, null, 2),
        },
      ],
    };
  },
);

/* ------------------ Express app ------------------ */

const app = express();

/**
 * IMPORTANT:
 * Do NOT use express.json() on /mcp routes.
 * StreamableHTTPServerTransport reads the raw request stream.
 */

/* -------- auth helper -------- */

function requireAuth(req: express.Request, res: express.Response): boolean {
  if (!MCP_AUTH_TOKEN) return true; // auth disabled in dev

  const auth = (req.header("authorization") ?? "").trim();

  // Accept both:
  //  - "Bearer dev"
  //  - "dev"
  const token = auth.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : auth;

  if (token === MCP_AUTH_TOKEN) return true;

  res.status(401).send("Unauthorized");
  return false;
}

/* ------------------ Transport ------------------ */

/**
 * ONE transport instance per server.
 * The transport manages sessions internally.
 */
const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: () => randomUUID(),
});

await mcp.connect(transport);

/* ------------------ Routes ------------------ */

app.get("/mcp", async (req, res) => {
  if (!requireAuth(req, res)) return;

  try {
    await transport.handleRequest(req, res);
  } catch (err) {
    console.error("GET /mcp failed:", err);
    if (!res.headersSent) res.status(500).send("MCP GET failed");
  }
});

app.post("/mcp", async (req, res) => {
  if (!requireAuth(req, res)) return;

  try {
    await transport.handleRequest(req, res);
  } catch (err) {
    console.error("POST /mcp failed:", err);
    if (!res.headersSent) res.status(500).send("MCP POST failed");
  }
});

/* ------------------ Start ------------------ */

app.listen(PORT, () => {
  console.log(`MCP HTTP server listening on http://localhost:${PORT}/mcp`);
});
