import { useMemo, useState } from "react";

export function UseMemoComponent() {
  const [counter, setCounter] = useState(0);

  const expensiveComputation = useMemo(() => {
    console.log("Running expensive computation...");
    return counter * 100000;
  }, [counter]);
  return (
    <div className="space-y-6 border-spacing-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div>UseMemoComponent</div>

      <button
        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-brand-100"
        onClick={() => setCounter(counter + 1)}
      >
        Increment Counter
      </button>
      <div>Expensive Computation Result: {expensiveComputation}</div>
    </div>
  );
}
