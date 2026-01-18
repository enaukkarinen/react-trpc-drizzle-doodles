import { router } from "./trpc";
import { feedbackRouter } from "./routers/feedback";
import { healthRouter } from "./routers/health";

export const appRouter = router({
  health: healthRouter,
  feedback: feedbackRouter,
});

export type AppRouter = typeof appRouter;
