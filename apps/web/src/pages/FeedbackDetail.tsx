import { Link, useNavigate, useParams } from "react-router-dom";

import { trpc } from "../trpc";
import { StatusPill } from "../components/StatusPill";
import { EditableTitle } from "../components/EditableTitle";
import { formatDateTime } from "../utils/formatDateTime";
import { getNextStatus } from "../utils/getNextStatus";

import { useUpdateSummary, useUpdateTitle, useUpdateStatus } from "../hooks";
import { EditableSummary } from "../components/EditableSummary";

import { DeleteButton } from "../components/DeleteButton";
import { CommentInput } from "../components/CommentInput";

export function FeedbackDetail() {
  const { id } = useParams<{ id: string }>();
  const utils = trpc.useUtils();

  const { data: feedback } = trpc.feedback.byId.useQuery(
    { id: id ?? "" },
    { enabled: Boolean(id) },
  );

  const { data: comments } = trpc.comment.listByFeedbackId.useQuery(
    { feedbackId: id ?? "" },
    { enabled: Boolean(id) },
  );
  const createComment = trpc.comment.create.useMutation({
    onSuccess: () => {
      utils.comment.listByFeedbackId.invalidate();
    },
  });

  const navigate = useNavigate();
  const updateStatus = useUpdateStatus();
  const updateTitle = useUpdateTitle();
  const updateSummary = useUpdateSummary();

  if (!id || !feedback) {
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
      id: feedback.id,
      status: getNextStatus(feedback.status),
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
            value={feedback.title}
            isSaving={updateTitle.isPending}
            onSave={(next) =>
              updateTitle.mutate({ id: feedback.id, title: next })
            }
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
                <StatusPill status={feedback.status} />
              </button>

              <span className="text-xss text-slate-400 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
                Click to change
              </span>
            </div>

            <div className="shrink-0 text-xs text-slate-500">
              {formatDateTime(feedback.createdAt)}
            </div>
          </div>
        </div>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-4 py-4">
          <EditableSummary
            value={feedback.summary}
            isSaving={updateSummary.isPending}
            onSave={(next) =>
              updateSummary.mutate({ id: feedback.id, summary: next })
            }
          />
        </div>
      </section>

      <DeleteButton
        id={feedback.id}
        onDeleted={() => navigate("/", { replace: true })}
      />

      <section className="rounded-xl  border border-slate-200 bg-white shadow-sm">
        <div className="px-4 py-4">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Comments
          </h2>

          {/* Comment input component */}
          <div className="mb-4">
            <CommentInput
              onSave={(value) => {
                createComment.mutate({
                  feedbackId: feedback.id,
                  content: value,
                });
              }}
            />
          </div>

          {/* Comments list */}
          <div className="space-y-4">
            {/* Example comment */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              {comments?.map((comment) => (
                <div
                  key={comment.id}
                  className="mb-4 rounded-lg border border-slate-200 bg-white p-4"
                >
                  <p className="text-sm text-slate-700">{comment.content}</p>
                  <div className="mt-2 text-xs text-slate-500">
                    Posted on {formatDateTime(comment.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
