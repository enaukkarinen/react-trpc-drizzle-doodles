import { useEffect, useState } from "react";

type Props = {
  value: string;
  onSave: (next: string) => void | Promise<void>;
  isSaving?: boolean;

  className?: string; // wrapper
  inputClassName?: string; // input overrides
};

export function EditableTitle({
  value,
  onSave,
  isSaving = false,
  className,
  inputClassName,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  // Keep draft in sync if value changes (server refetch / optimistic update)
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
      <div
        className={["flex min-w-0 items-center gap-2", className]
          .filter(Boolean)
          .join(" ")}
      >
        <h1 className="truncate text-2xl font-semibold text-slate-900">
          {value}
        </h1>

        <button
          type="button"
          onClick={start}
          className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-100"
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <div
      className={["flex min-w-0 items-center gap-2", className]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") cancel();
        }}
        className={[
          "w-full min-w-[240px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100",
          inputClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        autoFocus
      />

      <button
        type="button"
        onClick={save}
        disabled={isSaving}
        className="shrink-0 rounded-md bg-slate-900 px-2 py-2 text-xs font-medium text-white hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:opacity-60"
      >
        Save
      </button>

      <button
        type="button"
        onClick={cancel}
        className="shrink-0 rounded-md px-2 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-100"
      >
        Cancel
      </button>
    </div>
  );
}
