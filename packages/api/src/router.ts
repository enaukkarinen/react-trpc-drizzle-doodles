import { z } from "zod";
import { desc, ilike, and } from "drizzle-orm";
import { feedback } from "@einari/db";
import { router, publicProcedure } from "./trpc";

export const appRouter = router({
  health: publicProcedure.query(() => ({ ok: true })),
  echo: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .query(({ input }) => ({ text: input.text })),
  feedback: router({
    list: publicProcedure
      .input(z.object({ search: z.string().optional() }).optional())
      .query(({ ctx, input }) => {
        const search = input?.search?.trim();

        return ctx.db
          .select()
          .from(feedback)
          .where(and(search ? ilike(feedback.title, `%${search}%`) : undefined))
          .orderBy(desc(feedback.createdAt))
          .limit(100);
      }),
  }),
});

export type AppRouter = typeof appRouter;
