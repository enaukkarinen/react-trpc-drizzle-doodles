export function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

export function getName(props: Record<string, unknown>): string | undefined {
  const v = props["name"];
  return typeof v === "string" && v.trim() ? v : undefined;
}

export function getReference(props: Record<string, unknown>): string | undefined {
  const v = props["reference"];
  return typeof v === "string" && v.trim() ? v : undefined;
}

export function getEntity(props: Record<string, unknown>): string | undefined {
  const v = props["entity"];
  return typeof v === "string" && v.trim() ? v : undefined;
}

export function getFeatureKey(obj: any): string {
  const props = asRecord(obj?.properties);

  const ref = getReference(props);
  if (ref) return `ref:${ref}`;

  const ent = getEntity(props);
  if (ent) return `entity:${ent}`;

  const id = obj?.id;
  if (id != null) return `id:${String(id)}`;

  const name = getName(props) ?? "unknown";
  return `name:${name}`;
}
