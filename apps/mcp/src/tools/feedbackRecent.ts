import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { eq, desc } from "drizzle-orm";
import z from "zod";

import { FEEDBACK_STATUSES, feedback } from "@einari/db";
import { db } from "@einari/db-client";
import { title } from "node:process";

export function registerFeedbackRecentTool(mcp: McpServer) {
  mcp.registerTool(
    "feedback_recent",
    {
      description: "Get the most recent feedback items (newest first). Optional status filter. Read-only.",
      inputSchema: z.object({
        limit: z.number().int().min(1).max(50).default(10),
        status: z.enum(FEEDBACK_STATUSES).optional(),
      }),
    },
    async ({ limit, status }) => {
      const where = status ? eq(feedback.status, status) : undefined;

      const rows = await db
        .select({
          id: feedback.id,
          title: feedback.title,
          summary: feedback.summary,
          status: feedback.status,
          createdAt: feedback.createdAt,
        })
        .from(feedback)
        .where(where)
        .orderBy(desc(feedback.createdAt))
        .limit(limit);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ count: rows.length, limit, items: rows }, null, 2),
          },
        ],
      };
    },
  );
}
