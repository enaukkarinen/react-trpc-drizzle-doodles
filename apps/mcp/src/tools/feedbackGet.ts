import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { eq } from "drizzle-orm";
import z from "zod";

import { feedback } from "@einari/db";
import { db } from "@einari/db-client";

export function registerFeedbackGetTool(mcp: McpServer) {
  mcp.registerTool(
    "feedback_get",
    {
      description:
        "Get a single feedback item by its id. Use after you already have an id (e.g. from feedback_list). Read-only.",
      inputSchema: z.object({ id: z.string().min(1) }),
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
}
