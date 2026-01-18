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
    }
  });
  const { data } = trpc.feedback.byId.useQuery(
    { id: id ?? "" },
    { enabled: Boolean(id) },
  );

  if (!id) {
    return <Navigate to="..." replace />;
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <Link className="text-sm text-brand-500 hover:underline" to="/">
          ← Back to feedback
        </Link>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">Not found</h1>
          <p className="mt-2 text-sm text-slate-600">
            No feedback item exists with id{" "}
            <span className="font-mono text-slate-700">{id}</span>.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <Link className="text-sm text-brand-500 hover:underline" to="/">
          ← Back to feedback
        </Link>

        <div className="flex items-center gap-2">
          <h1 className="truncate text-2xl font-semibold text-slate-900">
            {data.title}
          </h1>

          <button
            type="button"
            onClick={() =>
              updateStatus.mutate({
                id: data.id,
                status: getNextStatus(data.status as FeedbackStatus),
              })
            }
          >
            <StatusPill status={data.status as FeedbackStatus} />
          </button>

          <span className="text-xs text-slate-400">
            {formatDateTime(data.createdAt)}
          </span>
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
