import { trpc } from "../trpc";

export function useCreateComment() {
  // Implementation goes here
  const utils = trpc.useUtils();

  return trpc.comment.create.useMutation({
    onMutate: async ({ feedbackId, content }) => {
      // 1. Cancel any outgoing fetches
      await utils.comment.listByFeedbackId.cancel({ feedbackId });

      // 2. Snapshot the previous value (for rollback)
      const prevComments = utils.comment.listByFeedbackId.getData({
        feedbackId,
      });

      // 3. Optimistically update the comments cache
      utils.comment.listByFeedbackId.setData({ feedbackId }, (old) => {
        const newComment = {
          id: `temp-${Date.now()}`, // Temporary ID TODO test removal
          feedbackId,
          content,
          createdAt: new Date().toISOString(),
        };
        console.log("Optimistically adding comment:", newComment);
        return old ? [...old, newComment] : [newComment];
      });

      // 4. Return context with the previous value (see onError())
      return { prevComments };
    },
    onError: (_err, { feedbackId }, ctx) => {
      if (ctx?.prevComments) {
        utils.comment.listByFeedbackId.setData(
          { feedbackId },
          ctx.prevComments,
        );
      }
      utils.comment.listByFeedbackId.invalidate({ feedbackId });
    },
    onSettled: (_data, _err, { feedbackId }) => {
      utils.comment.listByFeedbackId.invalidate({ feedbackId });
    },
  });
}
