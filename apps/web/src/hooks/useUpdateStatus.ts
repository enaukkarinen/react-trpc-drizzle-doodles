import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../trpc";

const FEEDBACK_LIST_KEY = ["feedback", "list"] as const;

export function useUpdateStatus() {
  const utils = trpc.useUtils();
  const qc = useQueryClient();

  return trpc.feedback.updateStatus.useMutation({
    onMutate: async ({ id, status }) => {
      await utils.feedback.byId.cancel({ id });
      await utils.feedback.list.cancel();

      const prevById = utils.feedback.byId.getData({ id });
      const prevLists = qc.getQueriesData({ queryKey: FEEDBACK_LIST_KEY });

      utils.feedback.byId.setData({ id }, (old) =>
        old ? { ...old, status } : old,
      );

      qc.setQueriesData({ queryKey: FEEDBACK_LIST_KEY }, (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.map((item: any) =>
          item.id === id ? { ...item, status } : item,
        );
      });

      return { prevById, prevLists };
    },

    onError: (_err, { id }, ctx) => {
      if (ctx?.prevById) utils.feedback.byId.setData({ id }, ctx.prevById);
      if (ctx?.prevLists)
        ctx.prevLists.forEach(([key, data]) => qc.setQueryData(key, data));
    },

    onSettled: (_data, _err, { id }) => {
      utils.feedback.byId.invalidate({ id });
      utils.feedback.list.invalidate();
    },
  });
}
