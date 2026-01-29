import { z } from "zod";
import { kbSearch } from "@einari/kb";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerKbSearchTool(mcp: McpServer) {
  mcp.registerTool(
    "kb_search",
    {
      description: "Search the knowledge base for relevant articles.",
      inputSchema: z.object({
        query: z.string().min(2),
        topK: z.number().int().min(1).max(10).optional(),
      }),
    },
    async (args) => {
      const { query, topK = 5 } = args;
      const results = await kbSearch(query, topK);

      const text = results.length
        ? results
            .map(
              (r, i) => `${i + 1}. ${r.title} (${r.source})\n${r.snippet}\n(distance: ${r.cosineDistance.toFixed(4)})`,
            )
            .join("\n\n")
        : "No results found.";

      return {
        content: [{ type: "text", text }],
        // do something with this
        _meta: {
          results: results.map((r) => ({
            title: r.title,
            source: r.source,
            snippet: r.snippet,
            cosineDistance: r.cosineDistance,
            chunkId: r.chunkId,
          })),
        },
      };
    },
  );
}
