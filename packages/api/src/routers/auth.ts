import { router, protectedProcedure } from "../trpc";

export const authRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    return {
      user: ctx.user,
    };
  }),
});
