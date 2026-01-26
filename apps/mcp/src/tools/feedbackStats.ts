import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { feedback } from "@einari/db";
import { db } from "@einari/db-client";
import { sql } from "drizzle-orm";

export function registerFeedbackStatsTool(mcp: McpServer) {
  mcp.registerTool(
    "feedback_stats",
    {
      description: "Get counts of feedback items grouped by status. Read-only.",
      inputSchema: {},
    },
    async () => {
      const rows = await db
        .select({
          status: feedback.status,
          count: sql<number>`cast(count(${feedback.id}) as int)`,
        })
        .from(feedback)
        .groupBy(feedback.status);

      return {
        content: [
          { type: "text", text: JSON.stringify({ counts: rows }, null, 2) },
        ],
      };
    },
  );
}
