import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useDebounce } from "../hooks/useDebounce";
import { trpc } from "../trpc";
import { StatusPill } from "../components/StatusPill";
import { formatDateTime } from "../utils/formatDateTime";

export function Home() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 100);

  const {
    data = [],
    isLoading,
    isFetching,
    error,
  } = trpc.feedback.list.useQuery(
    { search: debouncedSearch.trim() || undefined },
    {
      placeholderData: (prev) => prev, // Reminder: keep previous data while searching
    },
  );

  const [showUpdating, setShowUpdating] = useState(false);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    if (isFetching) {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      setShowUpdating(true);
      return;
    }

    hideTimer.current = window.setTimeout(() => {
      setShowUpdating(false);
    }, 300);

    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [isFetching]);

  if (isLoading) {
    return <div className="text-sm text-slate-600">Loading feedback…</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">Error loading feedback.</div>;
  }

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
            placeholder="Search feedback…"
          />

          {showUpdating && !isLoading && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 px-2 py-0.5 text-xs font-medium text-brand-200 ring-1 ring-white/10">
              Updating…
            </span>
          )}
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
          <div className="text-xs text-slate-500">{data.length} items</div>
        </div>

        <ul className="divide-y divide-slate-100">
          {data.map((item) => (
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
                    {formatDateTime(item.createdAt)}
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
