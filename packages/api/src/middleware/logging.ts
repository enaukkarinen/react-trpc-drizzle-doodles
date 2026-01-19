import { t } from "../trpcBase";

const loggingEnabled = !!process.env.TRPC_LOGGING;

export const loggingMiddleware = t.middleware(async ({ ctx, type, next }) => {
  if (!loggingEnabled) return next();

  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;
  const method = ctx.req?.method?.toUpperCase() ?? "UNKNOWN";

  console.log(`[${method}] - ${ctx.req?.originalUrl} (${duration}ms)`);

  return result;
});
