import { sql } from "drizzle-orm";
import { db } from "@einari/db-client";
import { lad } from "@einari/db";

export type LadTileArgs = {
  z: number;
  x: number;
  y: number;
  extent?: number;
  buffer?: number;
};

export async function fetchLadTile({ z, x, y, extent = 4096, buffer = 256 }: LadTileArgs) {
  const bounds = sql`ST_TileEnvelope(${z}, ${x}, ${y})`;
  const geom3857 = sql`ST_Transform(${lad.geom}, 3857)`;
  const geomMvt = sql`
  (ST_AsMVTGeom(${geom3857}, ${bounds}, ${extent}, ${buffer}, true))::geometry
`.as("geom");

  const q = db
    .select({
      reference: lad.reference,
      name: lad.name,
      entity: lad.entity,
      dataset: lad.dataset,
      quality: lad.quality,
      entry_date: lad.entryDate,
      start_date: lad.startDate,
      end_date: lad.endDate,
      geom: geomMvt,
    })
    .from(lad)
    .where(sql`ST_Intersects(${geom3857}, ${bounds})`)
    .as("q");

  const result = await db
    .select({
      tile: sql`ST_AsMVT(q, 'lad', ${extent}, 'geom')`.as("tile"),
    })
    .from(q);

  const row = result?.[0];

  const tile = row?.tile;
  if (!tile) return null;

  return tile;
}
