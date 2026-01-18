import { Link, Navigate, useParams } from "react-router-dom";

import { trpc } from "../trpc";
import { StatusPill } from "../components/StatusPill";
import { formatDateTime } from "../utils/formatDateTime";
import type { FeedbackStatus } from "@einari/db";
import { getNextStatus } from "../utils/getNextStatus";

export function FeedbackDetail() {
  const { id } = useParams<{ id: string }>();

  const utils = trpc.useUtils();
  const updateStatus = trpc.feedback.updateStatus.useMutation({
    onSuccess: () => {
      utils.feedback.byId.invalidate({ id: id ?? "" });
      utils.feedback.list.invalidate();
    },
  });
  const { data } = trpc.feedback.byId.useQuery(
    { id: id ?? "" },
    { enabled: Boolean(id) },
  );

  if (!id || !data) {
    return (
      <div className="space-y-6">
        <Link className="text-sm text-brand-500 hover:underline" to="/">
          ← Back to feedback
        </Link>
        <p className="text-sm text-slate-600">Not found.</p>
      </div>
    );
  }

  const handleStatusClick = () => {
    updateStatus.mutate({
      id: data.id,
      status: getNextStatus(data.status),
    });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <Link className="text-sm text-brand-500 hover:underline" to="/">
          ← Back to feedback
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex flex-wrap items-center gap-2">
            <h1 className="truncate text-2xl font-semibold text-slate-900">
              {data.title}
            </h1>

            <div className="group inline-flex items-center gap-2">
              <button
                type="button"
                onClick={handleStatusClick}
                disabled={updateStatus.isPending}
                className="inline-flex cursor-pointer items-center rounded-full focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60 hover:ring-2 hover:ring-slate-300"
                aria-label="Change status"
                title="Click to change status"
              >
                <StatusPill status={data.status} />
              </button>

              <span className="text-xs text-slate-400 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
                Click to change
              </span>
            </div>
          </div>

          <div className="shrink-0 text-xs text-slate-500 mt-2">
            {formatDateTime(data.createdAt)}
          </div>
        </div>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-4 py-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {data.summary}
        </div>
      </section>
    </div>
  );
}
