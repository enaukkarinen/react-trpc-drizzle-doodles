import { FeatureCollection } from "geojson";

export type LadProps = {
  dataset?: string;
  entity?: string;
  "entry-date"?: string;
  "start-date"?: string;
  "end-date"?: string;
  name?: string;
  reference?: string;
  quality?: string;
  layerName?: string;
  [k: string]: unknown;
};

export type LadContext = {
  name: string;
  reference: string;
  entity?: string;
  entryDate?: string;
  startDate?: string;
  endDate?: string;
  quality?: string;
  dataset?: string;
};

export function buildLadLookup(geojson: FeatureCollection): Map<string, LadProps> {
  const map = new Map<string, LadProps>();
  const features = geojson?.features ?? [];

  for (const f of features) {
    const p = (f?.properties ?? {}) as LadProps;
    const ref = p.reference;
    if (!ref) continue;

    // Keep "first wins" to make it deterministic.
    if (!map.has(ref)) map.set(ref, p);
  }

  return map;
}

export function toLadContext(props: LadProps): LadContext {
  const name = String(props.name ?? "");
  const reference = String(props.reference ?? "");

  return {
    name,
    reference,
    entity: props.entity ? String(props.entity) : undefined,
    entryDate: props["entry-date"] ? String(props["entry-date"]) : undefined,
    startDate: props["start-date"] ? String(props["start-date"]) : undefined,
    endDate: props["end-date"] ? String(props["end-date"]) : undefined,
    quality: props.quality ? String(props.quality) : undefined,
    dataset: props.dataset ? String(props.dataset) : undefined,
  };
}

export function formatLadContextBlock(ctx: LadContext): string {
  // Keep it short, factual, and easy for an LLM to use.
  const lines = [`Selected UK Local Authority District (LAD):`, `- name: ${ctx.name}`, `- reference: ${ctx.reference}`];

  if (ctx.entity) lines.push(`- entity: ${ctx.entity}`);
  if (ctx.entryDate) lines.push(`- entry-date: ${ctx.entryDate}`);
  if (ctx.startDate) lines.push(`- start-date: ${ctx.startDate}`);
  if (ctx.endDate) lines.push(`- end-date: ${ctx.endDate}`);
  if (ctx.quality) lines.push(`- quality: ${ctx.quality}`);
  if (ctx.dataset) lines.push(`- dataset: ${ctx.dataset}`);

  return lines.join("\n");
}
