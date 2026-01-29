import { useState } from "react";

type CommentInputParams = {
  onSave: (value: string) => void;
};

export function CommentInput({ onSave }: CommentInputParams) {
  const [draft, setDraft] = useState("");

  const save = () => {
    const next = draft.trim();
    if (!next) {
      return;
    }
    onSave(next);
    setDraft("");
  };

  return (
    <div className="space-y-3 flex flex-col">
      <textarea
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
        value={draft}
        placeholder="Add a comment…"
        onChange={(e) => setDraft(e.target.value)}
      ></textarea>
      <button
        /* disabled={isSaving} */
        className="rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:opacity-60 w-16"
        type="button"
        onClick={save}
      >
        Save
      </button>
    </div>
  );
}
