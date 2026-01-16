import { z } from "zod";
import { router, publicProcedure } from "./trpc";

export const appRouter = router({
  health: publicProcedure.query(() => ({ ok: true })),
  echo: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .query(({ input }) => ({ text: input.text })),
});

export type AppRouter = typeof appRouter;
