import type { Hover } from "../types";

export function HoverTooltip({ hover }: { hover: Hover }) {
  if (!hover) return null;

  return (
    <div
      className="pointer-events-none absolute z-10 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs text-slate-800 shadow-sm"
      style={{ left: hover.x + 12, top: hover.y + 12 }}
    >
      <div className="font-medium">{hover.name ?? "District"}</div>
      <div className="text-slate-500">Click to view details</div>
    </div>
  );
}
