export function About() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">About</h1>
        <p className="text-sm text-slate-600">
          A small demo app for collecting and browsing feedback.
        </p>
      </header>

      {/* Main card */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4">
          <div className="text-sm font-medium text-slate-900">What this is</div>
          <div className="mt-1 text-sm text-slate-600">
            React Router + Tailwind + tRPC. The goal is a simple, modern UI with
            end-to-end types and a clean list/detail flow.
          </div>
        </div>

        <div className="grid gap-4 px-4 py-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">UI</div>
            <p className="mt-1 text-sm text-slate-600">
              Tailwind-based layout, brand accents, and reusable components.
            </p>
            <div className="mt-3 inline-flex items-center rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-500 ring-1 ring-brand-200">
              Brand: purple
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">API</div>
            <p className="mt-1 text-sm text-slate-600">
              tRPC for typed queries and mutations. Easy to add auth + DB later.
            </p>
            <div className="mt-3 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
              End-to-end types
            </div>
          </div>
        </div>
      </section>

      {/* Secondary cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">
            What’s next
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
              Add create/update feedback (mutations)
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
              Loading states, empty states, error states
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
              Real persistence (SQLite/Postgres) + filtering
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Notes</div>
          <p className="mt-3 text-sm text-slate-600">
            This is intentionally lightweight: a clean shell, strong typing, and
            a UI that feels current without pulling in a heavy component
            library.
          </p>
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            Tip: keep pages using the same{" "}
            <span className="font-medium">max-w-5xl</span> container so the
            whole app stays visually aligned.
          </div>
        </section>
      </div>
    </div>
  );
}
