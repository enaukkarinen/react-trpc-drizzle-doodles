import { z } from "zod";
import { desc, eq, ilike } from "drizzle-orm";
import { feedback } from "@einari/db";
import { router, publicProcedure } from "../trpc";

export const feedbackRouter = router({
  list: publicProcedure
    .input(z.object({ search: z.string().optional() }).optional())
    .query(({ ctx, input }) => {
      const search = input?.search?.trim();

      const base = ctx.db
        .select()
        .from(feedback)
        .orderBy(desc(feedback.createdAt))
        .limit(100);

      if (!search) return base;

      return ctx.db
        .select()
        .from(feedback)
        .where(ilike(feedback.title, `%${search}%`))
        .orderBy(desc(feedback.createdAt))
        .limit(100);
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select()
        .from(feedback)
        .where(eq(feedback.id, input.id))
        .limit(1);

      return rows[0] ?? null;
    }),
});
