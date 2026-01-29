import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../trpc";

const FEEDBACK_LIST_KEY = ["feedback", "list"] as const;

export function useUpdateSummary() {
  const utils = trpc.useUtils();
  const qc = useQueryClient();

  return trpc.feedback.updateSummary.useMutation({
    onMutate: async ({ id, summary }) => {
      // 1. Cancel any outgoing fetches
      await utils.feedback.byId.cancel({ id });

      // 2. Snapshot the previous value (for rollback)
      const prevById = utils.feedback.byId.getData({ id });

      // 3. Optimistically update the byId cache
      utils.feedback.byId.setData({ id }, (old) =>
        old ? { ...old, summary } : old,
      );

      // 4. Update list cache: find and update the summary in the feedback list
      qc.setQueriesData({ queryKey: FEEDBACK_LIST_KEY }, (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.map((item: any) =>
          item.id === id ? { ...item, summary } : item,
        );
      });

      // 5. Return context with the previous value (see onError())
      return { prevById };
    },

    onError: (_err, { id }, ctx) => {
      if (ctx?.prevById) utils.feedback.byId.setData({ id }, ctx.prevById);
      utils.feedback.list.invalidate();
    },

    onSettled: (_data, _err, { id }) => {
      utils.feedback.byId.invalidate({ id });
      utils.feedback.list.invalidate();
    },
  });
}
