import { useMemo } from "react";
import type { SelectedDistrict } from "../types";
import { formatDate } from "../../../utils/formatDate";

function asString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v : undefined;
}

function FieldRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="min-w-0 text-right text-xs text-slate-800">{value}</div>
    </div>
  );
}

export function DistrictDetailsPanel({
  selected,
  onClear,
  onAskChat,
  onCopyReference,
}: {
  selected: SelectedDistrict;
  onClear: () => void;
  onAskChat: () => void;
  onCopyReference: () => void;
}) {
  const props = selected?.properties ?? {};

  const dataset = useMemo(() => asString(props["dataset"]), [props]);
  const entryDate = useMemo(() => asString(props["entry-date"]), [props]);
  const startDate = useMemo(() => asString(props["start-date"]), [props]);
  const endDate = useMemo(() => asString(props["end-date"]), [props]);
  const quality = useMemo(() => asString(props["quality"]), [props]);

  return (
    <aside className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">District details</div>
      </div>

      <div className="p-4">
        {!selected ? (
          <div className="text-sm text-slate-600">
            Click a local authority district on the map to see its properties.
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-base font-semibold text-slate-900">
                  {selected.name ?? "Selected district"}
                </div>
                {selected.reference ? (
                  <div className="mt-1 font-mono text-xs text-slate-600">{selected.reference}</div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={onClear}
                className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Clear
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={onAskChat}
                disabled={!selected.name && !selected.reference}
                className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:opacity-90 disabled:opacity-60"
              >
                Ask chat about this area
              </button>

              {selected.reference ? (
                <button
                  type="button"
                  onClick={onCopyReference}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Copy code
                </button>
              ) : null}
            </div>

            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <FieldRow label="Reference" value={selected.reference} />
              <FieldRow label="Entity" value={selected.entity} />
              <FieldRow label="Dataset" value={dataset} />
              <FieldRow label="Entry date" value={formatDate(entryDate)} />
              <FieldRow label="Start date" value={formatDate(startDate)} />
              <FieldRow label="End date" value={formatDate(endDate)} />
              <FieldRow label="Quality" value={quality} />
            </div>

            <details className="mt-4">
              <summary className="cursor-pointer select-none text-xs font-medium text-slate-600 hover:text-slate-800">
                Raw properties
              </summary>
              <pre className="mt-2 max-h-[260px] overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800">
                {JSON.stringify(selected.properties, null, 2)}
              </pre>
            </details>
          </>
        )}
      </div>
    </aside>
  );
}
