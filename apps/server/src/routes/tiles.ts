import { Router } from "express";
import { LRUCache } from "lru-cache";
import { fetchLadTile } from "../queries/fetchLadTile";

export const tilesRouter = Router();

const tileCache = new LRUCache<string, Buffer>({
  max: 10_000,
  ttl: 10 * 60 * 1000, // 10 minutes
  sizeCalculation: (v) => (v ? v.length : 1),
  maxSize: 64 * 1024 * 1024, // 64MB
});

/**
 * MVT tiles from PostGIS.
 * GET /tiles/lad/:z/:x/:y.pbf
 */
tilesRouter.get("/lad/:z/:x/:y.pbf", async (req, res) => {
  const z = Number(req.params.z);
  const x = Number(req.params.x);
  const y = Number(req.params.y);

  if (!Number.isInteger(z) || !Number.isInteger(x) || !Number.isInteger(y)) {
    return res.status(400).send("Invalid tile coordinates");
  }

  // Tile extent. 4096 is standard for MVT.
  const extent = 4096;
  const buffer = 256; // pixels in tile coordinate space

  const key = `lad/${z}/${x}/${y}?e=${extent}&b=${buffer}`;

  const cached = tileCache.get(key);
  if (cached !== undefined) {
    if (cached === null) return res.status(204).end();
    res.setHeader("Content-Type", "application/x-protobuf");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("X-Tile-Cache", "HIT");
    return res.send(cached);
  }

  const tile = await fetchLadTile({ z, x, y, extent, buffer });

  if (!tile) {
    // Empty tile
    res.status(204).end();
    return;
  }

  tileCache.set(key, Buffer.isBuffer(tile) ? tile : Buffer.from(tile as any));
  res.setHeader("X-Tile-Cache", "MISS");
  res.setHeader("Content-Type", "application/x-protobuf");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(tile);
});
