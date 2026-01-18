import { useEffect, useState } from "react";

type Props = {
  value: string;
  onSave: (next: string) => void | Promise<void>;
  isSaving?: boolean;

  placeholder?: string;
  rows?: number;
};

export function EditableSummary({
  value,
  onSave,
  isSaving = false,
  placeholder = "Write a summary…",
  rows = 6,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (!isEditing) setDraft(value);
  }, [value, isEditing]);

  const start = () => setIsEditing(true);

  const cancel = () => {
    setDraft(value);
    setIsEditing(false);
  };

  const save = () => {
    const next = draft.trim();
    if (!next || next === value) {
      setIsEditing(false);
      setDraft(value);
      return;
    }

    onSave(next);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="space-y-3">
        <div className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {value}
        </div>

        <button
          type="button"
          onClick={start}
          className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-100"
        >
          Edit summary
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") cancel();
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") save();
        }}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
        autoFocus
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={save}
          disabled={isSaving}
          className="rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:opacity-60"
        >
          Save
        </button>

        <button
          type="button"
          onClick={cancel}
          className="rounded-md px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-100"
        >
          Cancel
        </button>

        <span className="text-xs text-slate-400">
          Esc to cancel · Ctrl/⌘ + Enter to save
        </span>
      </div>
    </div>
  );
}
