import { initTRPC } from "@trpc/server";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "@einari/db";

export type Context = {
  db: PostgresJsDatabase<typeof schema>;
};

const t = initTRPC.context<Context>().create();
    
export const router = t.router;
export const publicProcedure = t.procedure;