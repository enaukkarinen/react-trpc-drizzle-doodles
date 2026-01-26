export type Hover = { x: number; y: number; name?: string } | null;

export type SelectedDistrict = {
  key: string;
  name?: string;
  reference?: string; // E06000019
  entity?: string; // 8600018
  properties: Record<string, unknown>;
} | null;
