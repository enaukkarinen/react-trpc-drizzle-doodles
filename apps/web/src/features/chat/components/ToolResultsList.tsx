import { StatusPill } from "../../../components/StatusPill";
import { formatDateTime } from "../../../utils/formatDateTime";
import type { ToolOutputList } from "../lib/types";

function isToolOutputList(x: unknown): x is ToolOutputList {
  if (!x || typeof x !== "object") return false;
  const items = (x as any).items;
  return Array.isArray(items);
}

export function ToolResultsList({ output, onGet }: { output: unknown; onGet: (id: string) => void }) {
  if (!isToolOutputList(output)) return null;

  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Results</div>
        <div className="text-xs text-slate-500">{output.items.length} items</div>
      </div>

      <ul className="divide-y divide-slate-200">
        {output.items.map((it) => (
          <li key={it.id} className="px-3 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="truncate text-sm font-semibold text-slate-900">{it.summary ?? it.id}</div>
                  {it.status ? <StatusPill status={it.status} /> : null}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <code className="text-xs text-slate-600">{it.id}</code>

                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(String(it.id))}
                    className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    Copy ID
                  </button>

                  <button
                    type="button"
                    onClick={() => onGet(String(it.id))}
                    className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    Get
                  </button>
                </div>
              </div>

              <div className="shrink-0 text-xs text-slate-500">
                {it.createdAt ? formatDateTime(new Date(it.createdAt)) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
