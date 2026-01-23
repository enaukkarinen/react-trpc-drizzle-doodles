import fs from "node:fs/promises";
import geojsonvt from "geojson-vt";
import vtpbf from "vt-pbf";
import { LRUCache } from "lru-cache";
import { ensureFileFromUrl } from "../../common/ensureFile";
import { LAD_GEOJSON_PATH, LAD_GEOJSON_URL } from "./config";

type TileIndex = ReturnType<typeof geojsonvt>;
let index: TileIndex | null = null;

const tileCache = new LRUCache<string, Buffer>({
  max: 500,
  ttl: 1000 * 60 * 10,
});

export async function initLadTileIndex() {
  await ensureFileFromUrl({
    url: LAD_GEOJSON_URL,
    destPath: LAD_GEOJSON_PATH,
    logPrefix: "[tiles:LAD]",
    validateText: (t) => {
      if (!t.trim().startsWith("{")) {
        throw new Error("Downloaded data did not look like JSON");
      }
    },
  });

  const raw = await fs.readFile(LAD_GEOJSON_PATH, "utf8");
  const geojson = JSON.parse(raw);

  index = geojsonvt(geojson, {
    maxZoom: 12,
    indexMaxZoom: 5,
    indexMaxPoints: 0,
    tolerance: 3,
    extent: 4096,
    buffer: 64,
    lineMetrics: false,
    generateId: true,
  });

  console.log("[tiles:LAD] tile index ready");
}

type GeoJsonVtTile = { features: any[] };

export function getLadTilePbf(z: number, x: number, y: number): Buffer | null {
  if (!index) throw new Error("LAD tile index not initialised");

  const key = `${z}/${x}/${y}`;
  const cached = tileCache.get(key);
  if (cached) return cached;

  const tile = index.getTile(z, x, y) as GeoJsonVtTile | null;
  if (!tile?.features?.length) return null;

  const pbf = vtpbf.fromGeojsonVt({ lad: tile as any });
  const buf = Buffer.isBuffer(pbf) ? pbf : Buffer.from(pbf);

  tileCache.set(key, buf);
  return buf;
}
