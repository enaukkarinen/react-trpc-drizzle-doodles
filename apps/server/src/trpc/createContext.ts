import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { Context } from "@einari/api";
import { db } from "../db/client";

export async function createContext({ req }: CreateExpressContextOptions): Promise<Context> {
  const userId = req.header("x-user-id");

  return {
    db,
    user: userId ? { id: userId } : null,
    req
  };
}