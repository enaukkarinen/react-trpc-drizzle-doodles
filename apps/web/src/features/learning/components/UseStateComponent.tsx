import { useState } from "react";

export function UseStateComponent() {
  const [state, setState] = useState<string | null>(null);
  return (
    <div className="space-y-6 border-spacing-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div>UseStateComponent</div>
      <button
        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-brand-100"
        onClick={() => setState("Hello, World!")}
      >
        Set State
      </button>
      <div>This is my state: {state}</div>
    </div>
  );
}
