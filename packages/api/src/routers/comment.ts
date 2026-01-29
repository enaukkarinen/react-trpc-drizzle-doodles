import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { comment } from "@einari/db";
import { router, publicProcedure } from "../trpc";

export const commentRouter = router({
  listByFeedbackId: publicProcedure
    .input(z.object({ feedbackId: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(comment)
        .where(eq(comment.feedbackId, input.feedbackId))
        .orderBy(desc(comment.createdAt))
        .limit(100);
    }),
  create: publicProcedure
    .input(
      z.object({
        feedbackId: z.string().uuid(),
        content: z.string().min(1).max(2000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await ctx.db
        .insert(comment)
        .values({
          feedbackId: input.feedbackId,
          content: input.content,
        })
        .returning({ id: comment.id });

      return rows[0] ?? null;
    }),
});
