import type { ToolTrace } from "@einari/api-contract";
import { ToolResultsList } from "./ToolResultsList";

export function ToolTracePanel({
  trace,
  open = true,
  onGet,
}: {
  trace: ToolTrace;
  open?: boolean;
  onGet: (id: string) => void;
}) {
  return (
    <details className="rounded-lg border border-slate-200 bg-slate-50" open={open}>
      <summary className="cursor-pointer select-none px-3 py-2 text-xs font-medium text-slate-700">
        Tool: <span className="font-mono">{trace.name}</span>
      </summary>

      <div className="px-3 pb-3">
        <ToolResultsList output={trace.output} onGet={onGet} />

        <details className="mt-3">
          <summary className="cursor-pointer select-none text-xs font-medium text-slate-600 hover:text-slate-800">
            Raw tool trace
          </summary>
          <pre className="mt-2 overflow-auto rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-800">
            {JSON.stringify(trace, null, 2)}
          </pre>
        </details>
      </div>
    </details>
  );
}
