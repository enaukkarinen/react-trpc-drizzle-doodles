import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { and, eq, ilike, desc } from "drizzle-orm";
import z from "zod";

import { FEEDBACK_STATUSES, feedback } from "@einari/db";
import { db } from "@einari/db-client";

export function registerFeedbackSearchTool(mcp: McpServer) {
  mcp.registerTool(
    "feedback_search",
    {
      description: "Search feedback by text query (matches summary). Optional status filter and pagination. Read-only.",
      inputSchema: z.object({
        query: z.string().min(1).max(200),
        limit: z.number().int().min(1).max(50).default(20),
        offset: z.number().int().min(0).default(0),
        status: z.enum(FEEDBACK_STATUSES).optional(),
      }),
    },
    async ({ query, limit, offset, status }) => {
      const where = and(status ? eq(feedback.status, status) : undefined, ilike(feedback.summary, `%${query}%`));

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
        .limit(limit)
        .offset(offset);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ count: rows.length, limit, offset, query, items: rows }, null, 2),
          },
        ],
      };
    },
  );
}
