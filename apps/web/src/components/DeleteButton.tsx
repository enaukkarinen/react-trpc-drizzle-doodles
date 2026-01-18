import { useState } from "react";
import { Trash2 } from "lucide-react";

import { useDelete } from "../hooks/useDelete";

type Props = {
  id: string;
  onDeleted?: () => void;
};

export function DeleteButton({ id, onDeleted }: Props) {
  const del = useDelete();
  const [confirming, setConfirming] = useState(false);

  const isBusy = del.isPending;

  const startConfirm = () => setConfirming(true);

  const cancel = () => {
    if (isBusy) return;
    setConfirming(false);
  };

  const confirmDelete = () => {
    del.mutate(
      { id },
      {
        onSuccess: () => {
          setConfirming(false);
          onDeleted?.();
        },
      },
    );
  };

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={startConfirm}
        className="
          inline-flex items-center gap-2 rounded-lg
          bg-slate-800 px-3 py-2
          text-sm font-medium text-slate-200
          shadow-sm transition
          hover:bg-slate-700 hover:text-white
          focus:outline-none focus:ring-4 focus:ring-red-200
        "
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={confirmDelete}
        disabled={isBusy}
        className="
          inline-flex items-center gap-2 rounded-lg
          bg-slate-900 px-3 py-2
          text-sm font-medium text-red-300
          shadow-sm transition
          hover:bg-slate-800
          focus:outline-none focus:ring-4 focus:ring-red-300
          disabled:cursor-not-allowed disabled:opacity-60
        "
      >
        <Trash2 className="h-4 w-4 text-red-400" />
        Confirm delete
      </button>

      <button
        type="button"
        onClick={cancel}
        disabled={isBusy}
        className="
          rounded-lg border border-slate-200
          bg-white px-3 py-2
          text-sm font-medium text-slate-700
          shadow-sm transition
          hover:bg-slate-50
          focus:outline-none focus:ring-4 focus:ring-brand-100
          disabled:cursor-not-allowed disabled:opacity-60
        "
      >
        Cancel
      </button>
    </div>
  );
}
