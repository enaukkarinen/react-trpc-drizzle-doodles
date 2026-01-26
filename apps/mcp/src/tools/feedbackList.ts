import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { and, desc, eq, ilike } from "drizzle-orm";
import { z } from "zod";

import { db } from "@einari/db-client";
import { feedback, FEEDBACK_STATUSES } from "@einari/db";

export function registerFeedbackListTool(mcp: McpServer) {
  mcp.registerTool(
    "feedback_list",
    {
      description: "List feedback items (newest first) with optional status filter and text search. Read-only.",
      inputSchema: z.object({
        limit: z.number().int().min(1).max(50).default(20),
        offset: z.number().int().min(0).default(0),
        status: z.enum(FEEDBACK_STATUSES).optional(),
        query: z.string().min(1).max(200).optional(),
      }),
    },
    async ({ limit, offset, status, query }: any) => {
      const where = and(
        status ? eq(feedback.status, status) : undefined,
        query ? ilike(feedback.summary, `%${query}%`) : undefined,
      );

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
            text: JSON.stringify({ count: rows.length, limit, offset, items: rows }, null, 2),
          },
        ],
      };
    },
  );
}
