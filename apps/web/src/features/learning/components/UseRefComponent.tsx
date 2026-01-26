import { useRef } from "react";

export function UseRefComponent() {
  const renders = useRef(0);
  renders.current++;

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-6 border-spacing-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div>UseRefComponent</div>

      <div>Render count: {renders.current}</div>
      <input
        ref={inputRef}
        className="rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-4 focus:ring-brand-100"
        type="text"
        placeholder="Type something..."
      />
      <button
        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-brand-100"
        onClick={() => {
          if (inputRef.current) {
            alert(`Input value: ${inputRef.current.value}`);
          }
        }}
      >
        Show Input Value
      </button>
    </div>
  );
}
