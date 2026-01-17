import { Link } from "react-router-dom";

type FeedbackItem = {
  id: string;
  title: string;
  summary: string;
  status: "open" | "planned" | "done";
  createdAt: string; // ISO or display string
};

const mock: FeedbackItem[] = [
  {
    id: "123",
    title: "Add keyboard shortcuts",
    summary: "Support j/k navigation and quick actions for power users.",
    status: "planned",
    createdAt: "2026-01-12",
  },
  {
    id: "124",
    title: "Improve map load performance",
    summary: "Reduce initial tile fetch and defer heavy layers.",
    status: "open",
    createdAt: "2026-01-10",
  },
  {
    id: "125",
    title: "Dark mode (proper)",
    summary: "Persist theme preference and improve contrast across views.",
    status: "done",
    createdAt: "2026-01-02",
  },
];

function StatusPill({ status }: { status: FeedbackItem["status"] }) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1";

  const styles: Record<FeedbackItem["status"], string> = {
    open: "bg-slate-100 text-slate-700 ring-slate-200",
    planned: "bg-brand-100 text-brand-500 ring-brand-200",
    done: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };

  const label: Record<FeedbackItem["status"], string> = {
    open: "Open",
    planned: "Planned",
    done: "Done",
  };

  return (
    <span className={[base, styles[status]].join(" ")}>{label[status]}</span>
  );
}

export function Home() {
  // Later: wire to tRPC and set search to input filter.
  const items = mock;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Feedback</h1>
        <p className="text-sm text-slate-600">
          All suggestions, bugs, and ideas in one place.
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
            placeholder="Search feedback…"
          />
        </div>

        <button
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-brand-100"
          type="button"
        >
          New feedback
        </button>
      </div>

      {/* List container */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="text-sm font-medium text-slate-900">All feedback</div>
          <div className="text-xs text-slate-500">{items.length} items</div>
        </div>

        <ul className="divide-y divide-slate-100">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                to={`/feedback/${item.id}`}
                className="block px-4 py-4 transition hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-sm font-semibold text-slate-900">
                        {item.title}
                      </h2>
                      <StatusPill status={item.status} />
                    </div>

                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                      {item.summary}
                    </p>
                  </div>

                  <div className="shrink-0 text-xs text-slate-500">
                    {item.createdAt}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
