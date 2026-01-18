import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../trpc";

const FEEDBACK_LIST_KEY = ["feedback", "list"] as const;

export function useUpdateStatus() {
  const utils = trpc.useUtils();
  const qc = useQueryClient();

  return trpc.feedback.updateStatus.useMutation({
    onMutate: async ({ id, status }) => {
      await utils.feedback.byId.cancel({ id });

      const prevById = utils.feedback.byId.getData({ id });

      utils.feedback.byId.setData({ id }, (old) =>
        old ? { ...old, status } : old,
      );

      qc.setQueriesData({ queryKey: FEEDBACK_LIST_KEY }, (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((item) => (item.id === id ? { ...item, status } : item));
      });

      return { prevById };
    },

    onSettled: (_data, _err, { id }) => {
      utils.feedback.byId.invalidate({ id });
      utils.feedback.list.invalidate();
    },
  });
}
