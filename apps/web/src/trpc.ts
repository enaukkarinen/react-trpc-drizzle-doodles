import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@einari/api";

export const trpc = createTRPCReact<AppRouter>({});
