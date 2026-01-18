import { z } from "zod";
import { desc, eq, ilike } from "drizzle-orm";
import { feedback, FEEDBACK_STATUSES } from "@einari/db";
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
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const rows = await ctx.db
        .delete(feedback)
        .where(eq(feedback.id, input.id))
        .returning({ id: feedback.id });

      return rows[0] ?? null;
    }),
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(120),
        summary: z.string().min(1).max(2000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await ctx.db
        .insert(feedback)
        .values({
          title: input.title,
          summary: input.summary,
          // Use default values for status and createdAt
        })
        .returning();

      return rows[0] ?? null;
    }),

  updateTitle: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1).max(120),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await ctx.db
        .update(feedback)
        .set({ title: input.title })
        .where(eq(feedback.id, input.id))
        .returning();

      return rows[0] ?? null;
    }),
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z.enum(FEEDBACK_STATUSES),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await ctx.db
        .update(feedback)
        .set({ status: input.status })
        .where(eq(feedback.id, input.id))
        .returning();

      return rows[0] ?? null;
    }),
  updateSummary: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        summary: z.string().min(1).max(2000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await ctx.db
        .update(feedback)
        .set({ summary: input.summary })
        .where(eq(feedback.id, input.id))
        .returning();

      return rows[0] ?? null;
    }),
});
