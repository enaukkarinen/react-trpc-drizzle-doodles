import { Router } from "express";
import { sql } from "drizzle-orm";
import { db } from "@einari/db-client";

export const tilesLadRouter = Router();

/**
 * MVT tiles from PostGIS.
 * GET /tiles/lad/:z/:x/:y.pbf
 */
tilesLadRouter.get("/lad/:z/:x/:y.pbf", async (req, res) => {
  const z = Number(req.params.z);
  const x = Number(req.params.x);
  const y = Number(req.params.y);

  if (!Number.isInteger(z) || !Number.isInteger(x) || !Number.isInteger(y)) {
    return res.status(400).send("Invalid tile coordinates");
  }

  // Tile extent. 4096 is standard for MVT.
  const extent = 4096;
  const buffer = 256; // pixels in tile coordinate space

  const result = await db.execute(sql`
  WITH bounds AS (
    SELECT ST_TileEnvelope(${z}, ${x}, ${y}) AS tile_bounds
  )
  SELECT ST_AsMVT(q, 'lad', ${extent}, 'geom') AS tile
  FROM (
    SELECT
      lad.reference,
      lad.name,
      lad.entity,
      lad.dataset,
      lad.quality,
      lad.entry_date,
      lad.start_date,
      lad.end_date,
      ST_AsMVTGeom(
        ST_Transform(lad.geom, 3857),
        bounds.tile_bounds,
        ${extent},
        ${buffer},
        true
      ) AS geom
    FROM lad
    CROSS JOIN bounds
    WHERE ST_Intersects(ST_Transform(lad.geom, 3857), bounds.tile_bounds)
  ) AS q;
`);

  console.log(`Served LAD tile z=${z} x=${x} y=${y}`);

  const row = result?.[0];

  const tile = row?.tile;

  if (!tile) {
    // Empty tile
    res.status(204).end();
    return;
  }

  res.setHeader("Content-Type", "application/x-protobuf");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(tile);
});
