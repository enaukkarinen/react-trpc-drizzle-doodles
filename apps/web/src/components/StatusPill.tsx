import type { FeedbackItem } from "../types/FeedbackItem";

export function StatusPill({ status }: { status: FeedbackItem["status"] }) {
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
