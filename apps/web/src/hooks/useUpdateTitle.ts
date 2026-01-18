import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../trpc";

const FEEDBACK_LIST_KEY = ["feedback", "list"] as const;

export function useUpdateTitle() {
  const utils = trpc.useUtils();
  const qc = useQueryClient();

  return trpc.feedback.updateTitle.useMutation({
    onMutate: async ({ id, title }) => {
      await utils.feedback.byId.cancel({ id });

      const prevById = utils.feedback.byId.getData({ id });

      utils.feedback.byId.setData({ id }, (old) =>
        old ? { ...old, title } : old,
      );

      qc.setQueriesData({ queryKey: FEEDBACK_LIST_KEY }, (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.map((item: any) =>
          item.id === id ? { ...item, title } : item,
        );
      });

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
