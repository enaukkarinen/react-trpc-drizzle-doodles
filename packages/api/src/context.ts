import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "@einari/db";

export type SessionUser = {
  id: string;
  role?: "user" | "admin";
};

export type Context = {
  db: PostgresJsDatabase<typeof schema>;
  user: SessionUser | null;

  req?: {
    originalUrl?: string;
    method?: string;
  };
};
