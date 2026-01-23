import { Router } from "express";
import { getLadTilePbf } from "../tiles/datasets/lad/ladIndex";
import { gzipSync } from "node:zlib";

export const tilesRouter = Router();

// /tiles/lad/6/32/21.pbf
tilesRouter.get("/lad/:z/:x/:y.pbf", (req, res) => {
  const z = Number(req.params.z);
  const x = Number(req.params.x);
  const y = Number(req.params.y);

  if (!Number.isInteger(z) || !Number.isInteger(x) || !Number.isInteger(y)) {
    return res.status(400).send("Invalid tile coords");
  }

  try {
    const pbf = getLadTilePbf(z, x, y);
    if (!pbf) return res.status(204).end();

    res.setHeader("Content-Type", "application/x-protobuf");
    res.setHeader("Cache-Control", "public, max-age=3600");

    const acceptEncoding = String(req.headers["accept-encoding"] ?? "");
    const acceptsGzip = acceptEncoding.includes("gzip");

    // We gzip tiles ourselves. If you later add app.use(compression()),
    // remove this block to avoid double-compression.
    if (acceptsGzip) {
      res.setHeader("Content-Encoding", "gzip");
      return res.status(200).send(gzipSync(new Uint8Array(pbf)));
    }

    return res.status(200).send(pbf);
  } catch (e) {
    console.error("tile error", e);
    return res.status(500).send("Tile error");
  }
});
