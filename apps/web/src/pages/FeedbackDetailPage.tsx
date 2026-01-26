import { Link, useNavigate, useParams } from "react-router-dom";

import { trpc } from "../trpc";
import { StatusPill } from "../components/StatusPill";
import { EditableTitle } from "../components/EditableTitle";
import { formatDateTime } from "../utils/formatDateTime";
import { getNextStatus } from "../utils/getNextStatus";

import { useUpdateSummary, useUpdateTitle, useUpdateStatus } from "../hooks";
import { EditableSummary } from "../components/EditableSummary";

import { DeleteButton } from "../components/DeleteButton";

export function FeedbackDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data } = trpc.feedback.byId.useQuery(
    { id: id ?? "" },
    { enabled: Boolean(id) },
  );

  const navigate = useNavigate();
  const updateStatus = useUpdateStatus();
  const updateTitle = useUpdateTitle();
  const updateSummary = useUpdateSummary();

  if (!id || !data) {
    return (
      <div className="space-y-6">
        <Link className="text-sm text-brand-500 hover:underline" to="/">
          ← Back to feedback
        </Link>

        <p className="text-sm text-slate-600">Feedback not found.</p>
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

        <div className="min-w-0 space-y-2">
          <EditableTitle
            value={data.title}
            isSaving={updateTitle.isPending}
            onSave={(next) => updateTitle.mutate({ id: data.id, title: next })}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="group inline-flex items-center gap-2">
              <button
                type="button"
                onClick={handleStatusClick}
                disabled={updateStatus.isPending}
                aria-label="Change status"
                title="Click to change status"
                className="
          inline-flex cursor-pointer items-center rounded-full p-0.5
          transition
          hover:ring-2 hover:ring-slate-300
          focus:outline-none focus:ring-4 focus:ring-brand-100
          disabled:cursor-not-allowed disabled:opacity-60
        "
              >
                <StatusPill status={data.status} />
              </button>

              <span className="text-xs text-slate-400 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
                Click to change
              </span>
            </div>

            <div className="shrink-0 text-xs text-slate-500">
              {formatDateTime(data.createdAt)}
            </div>
          </div>
        </div>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-4 py-4">
          <EditableSummary
            value={data.summary}
            isSaving={updateSummary.isPending}
            onSave={(next) =>
              updateSummary.mutate({ id: data.id, summary: next })
            }
          />
        </div>
      </section>

      <DeleteButton
        id={data.id}
        onDeleted={() => navigate("/", { replace: true })}
      />
    </div>
  );
}
