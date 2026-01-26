import { useState, useEffect } from "react";

export function UseEffectComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count === 0) return;
    alert(`Count has changed to: ${count}`);
  }, [count]);

  useEffect(() => {
    const handler = () => console.log("resize");
    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  return (
    <div className="space-y-6 border-spacing-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div>UseEffectComponent</div>
      <button
        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-brand-100"
        onClick={() => setCount(count + 1)}
      >
        Increment Count
      </button>
      <div>Current count: {count}</div>
    </div>
  );
}
