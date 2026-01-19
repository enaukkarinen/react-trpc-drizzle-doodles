import { loggingMiddleware } from "./middleware/logging";
import { authMiddleware } from "./middleware/auth";
import { t } from "./trpcBase";

export const router = t.router;
export const publicProcedure = t.procedure.use(loggingMiddleware);
export const protectedProcedure = t.procedure
  .use(loggingMiddleware)
  .use(authMiddleware);
