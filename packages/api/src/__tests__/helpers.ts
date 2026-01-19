import type { Context } from "../context";

export function makeCtx(overrides?: Partial<Context>): Context {
  const dbStub = {} as unknown as Context["db"];

  return {
    db: dbStub,
    user: null,
    ...overrides,
  };
}
