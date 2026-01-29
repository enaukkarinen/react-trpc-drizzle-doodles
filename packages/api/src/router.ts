import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "./trpc";
import { feedbackRouter } from "./routers/feedback";
import { healthRouter } from "./routers/health";
import { authRouter } from "./routers/auth";
import { commentRouter } from "./routers/comment";

export const appRouter = router({
  health: healthRouter,
  feedback: feedbackRouter,
  comment: commentRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
