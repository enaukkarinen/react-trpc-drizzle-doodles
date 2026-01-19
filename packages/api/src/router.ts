import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "./trpc";
import { feedbackRouter } from "./routers/feedback";
import { healthRouter } from "./routers/health";
import { authRouter } from "./routers/auth";

export const appRouter = router({
  health: healthRouter,
  feedback: feedbackRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
