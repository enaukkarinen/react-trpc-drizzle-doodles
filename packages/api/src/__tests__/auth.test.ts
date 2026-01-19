import { describe, expect, it } from "vitest";
import { appRouter } from "../router"; // wherever you export appRouter
import { makeCtx } from "./helpers";

describe("auth router", () => {
  it("auth.me throws UNAUTHORIZED when no user in ctx", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: null }));
    await expect(caller.auth.me()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("auth.me returns user when authenticated", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: { id: "demo-user" } }));
    const res = await caller.auth.me();
    expect(res.user).toEqual({ id: "demo-user" });
  });
});