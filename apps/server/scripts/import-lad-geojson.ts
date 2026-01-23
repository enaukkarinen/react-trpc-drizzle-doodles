#!/usr/bin/env tsx
import fs from "node:fs/promises";
import path from "node:path";
import { sql } from "drizzle-orm";
import { lad } from "@einari/db";
import { db } from "@einari/db-client";
import { FeatureCollection, Polygon, MultiPolygon } from "geojson";

type LadGeoJsonProps = {
  reference?: string;
  name?: string;
  entity?: string;
  dataset?: string;
  quality?: string;
  "entry-date"?: string;
  "start-date"?: string;
  "end-date"?: string;
};

type FeatureRow = {
  reference: string;
  name: string;
  entity: string | null;
  dataset: string | null;
  quality: string | null;
  entry: string;
  start: string;
  end: string;
  geom: string;
};

const file = path.resolve(
  process.cwd(),
  process.env.LAD_GEOJSON_PATH?.trim() || "apps/server/static/local-authority-district.geojson",
);
const BATCH = Number(process.env.IMPORT_BATCH_SIZE ?? "200");

const s = (v: unknown) => (v == null ? "" : String(v).trim());
const d = (v: string) => sql`NULLIF(${v}, '')::date`;

const errMsg = (e: unknown) => {
  const x = e as any;
  const msg = String(x?.message ?? e);
  return msg.length > 160 ? msg.slice(0, 160) + "…" : msg;
};

const upsert = (values: any) => sql`
  INSERT INTO ${lad} (
    reference, name, entity, dataset, quality,
    entry_date, start_date, end_date, geom
  )
  VALUES ${values}
`;

const valuesOf = (rows: FeatureRow[]) =>
  sql.join(
    rows.map(
      (r) => sql`(
        ${r.reference},
        ${r.name},
        ${r.entity},
        ${r.dataset},
        ${r.quality},
        ${d(r.entry)},
        ${d(r.start)},
        ${d(r.end)},
        ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON(${r.geom}), 4326))
      )`,
    ),
    sql`,`,
  );

async function main() {
  await db.execute(sql`TRUNCATE TABLE ${lad}`);

  const geo = JSON.parse(await fs.readFile(file, "utf8")) as FeatureCollection<MultiPolygon | Polygon, LadGeoJsonProps>;

  const rows: FeatureRow[] = geo.features.map((f, i) => {
    const p = f.properties ?? {};
    const reference = s(p.reference);
    const name = s(p.name);
    if (!reference) throw new Error(`feature ${i} missing reference`);
    if (!name) throw new Error(`feature ${i} missing name`);
    return {
      reference,
      name,
      entity: s(p.entity) || null,
      dataset: s(p.dataset) || null,
      quality: s(p.quality) || null,
      entry: s(p["entry-date"]),
      start: s(p["start-date"]),
      end: s(p["end-date"]),
      geom: JSON.stringify(f.geometry),
    };
  });

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    try {
      await db.execute(upsert(valuesOf(batch)));
      ok += batch.length;
    } catch (e) {
      console.error(`[import] batch ${i / BATCH + 1} failed: ${errMsg(e)} (fallback row-by-row)`);
      for (const r of batch) {
        try {
          await db.execute(upsert(valuesOf([r])));
          ok++;
        } catch (e2) {
          fail++;
          console.error(`[import] ref=${r.reference} failed: ${errMsg(e2)}`);
        }
      }
    }
  }

  console.log(`[import] ok=${ok} fail=${fail} total=${rows.length}`);
  if (fail) process.exitCode = 2;
}

main().catch((e) => {
  console.error("[import] failed:", errMsg(e));
  process.exitCode = 1;
});
