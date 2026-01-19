import { TRPCError } from "@trpc/server";

import { t } from "../trpcBase";

export const authMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // narrows type
    },
  });
});
