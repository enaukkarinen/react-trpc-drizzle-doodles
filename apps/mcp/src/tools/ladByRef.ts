import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { eq, sql } from "drizzle-orm";
import z from "zod";

import { db } from "@einari/db-client";
import { lad } from "@einari/db";

export async function registerLadByRefTool(mcp: McpServer) {
  mcp.registerTool(
    "lad_by_ref",
    {
      description: "Get a single LAD (Local Administrative Division) by its reference. Read-only.",
      inputSchema: z.object({ ref: z.string().min(1) }),
    },
    async ({ ref }) => {
      const lad = await ladByRef(ref);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(lad),
          },
        ],
      };
    },
  );
}

async function ladByRef(ref: string) {
  const rows = await db
    .select({
      reference: lad.reference,
      name: lad.name,
      entity: lad.entity,
      dataset: lad.dataset,
      quality: lad.quality,
      entryDate: lad.entryDate,
      startDate: lad.startDate,
      endDate: lad.endDate,

      bbox: sql<string>`ST_AsGeoJSON(ST_Envelope(${lad.geom}))`.as("bbox"),
      areaKm2: sql<number>`ST_Area(ST_Transform(${lad.geom}, 3857)) / 1000000.0`.as("areaKm2"),
    })
    .from(lad)
    .where(eq(lad.reference, ref))
    .limit(1);

  return rows[0] ?? null;
}
