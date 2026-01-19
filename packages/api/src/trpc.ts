import { initTRPC } from "@trpc/server";

import { Context } from "./context";
import { loggingMiddleware } from "./middleware/logging";
import { authMiddleware } from "./middleware/auth";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure.use(loggingMiddleware);
export const protectedProcedure = t.procedure
  .use(loggingMiddleware)
  .use(authMiddleware);
