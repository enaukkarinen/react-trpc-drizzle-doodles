import { describe, expect, it, vi, beforeEach } from "vitest";
import { feedbackRouter } from "../routers/feedback";
import { makeCtx } from "./helpers";

function makeDbMock() {
  const selectChain = {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
  };

  const deleteChain = {
    where: vi.fn().mockReturnThis(),
    returning: vi.fn(),
  };

  const insertChain = {
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
  };

  const updateChain = {
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    returning: vi.fn(),
  };

  const db = {
    select: vi.fn(() => selectChain),
    delete: vi.fn(() => deleteChain),
    insert: vi.fn(() => insertChain),
    update: vi.fn(() => updateChain),
  };

  return { db, selectChain, deleteChain, insertChain, updateChain };
}

type Ctx = { db: any; user?: any };

function callResolver<TInput>(proc: any, ctx: Ctx, input: TInput) {
  return proc._def.resolver({
    ctx,
    input,
    type: "query",
    path: "test",
    rawInput: input,
  });
}

describe("feedbackRouter", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("list", () => {
    it("builds base query when input is undefined", () => {
      const { db, selectChain } = makeDbMock();
      const ctx = { db };

      const result = callResolver(
        feedbackRouter._def.procedures.list,
        ctx,
        undefined,
      );

      expect(db.select).toHaveBeenCalledTimes(1);
      expect(selectChain.from).toHaveBeenCalledTimes(1);
      expect(selectChain.where).not.toHaveBeenCalled();
      expect(selectChain.orderBy).toHaveBeenCalledTimes(1);
      expect(selectChain.limit).toHaveBeenCalledWith(100);

      expect(result).toBe(selectChain);
    });

    it("adds where() when search has text (trimmed)", () => {
      const { db, selectChain } = makeDbMock();
      const ctx = { db };

      const result = callResolver(feedbackRouter._def.procedures.list, ctx, {
        search: " hello ",
      });

      expect(db.select).toHaveBeenCalledTimes(2);

      expect(selectChain.where).toHaveBeenCalledTimes(1);
      expect(selectChain.limit).toHaveBeenCalledWith(100);
      expect(result).toBe(selectChain);
    });

    it("rejects numeric input", async () => {
      const caller = feedbackRouter.createCaller(makeCtx());

      await expect(caller.list({ search: 123 as any })).rejects.toMatchObject({
        code: "BAD_REQUEST",
      });
    });
  });

  describe("byId", () => {
    it("returns first row", async () => {
      const { db, selectChain } = makeDbMock();
      const ctx = { db };

      selectChain.limit.mockResolvedValueOnce([{ id: "x" }]);

      const res = await callResolver(feedbackRouter._def.procedures.byId, ctx, {
        id: "00000000-0000-0000-0000-000000000000",
      });

      expect(db.select).toHaveBeenCalledTimes(1);
      expect(selectChain.where).toHaveBeenCalledTimes(1);
      expect(selectChain.limit).toHaveBeenCalledWith(1);
      expect(res).toEqual({ id: "x" });
    });

    it("returns null when no data found", async () => {
      const { db, selectChain } = makeDbMock();
      const ctx = { db };

      selectChain.limit.mockResolvedValueOnce([]);

      const res = await callResolver(feedbackRouter._def.procedures.byId, ctx, {
        id: "some-id",
      });

      expect(res).toBeNull();
    });

    it("rejects invalid uuid", async () => {
      const caller = feedbackRouter.createCaller(makeCtx());

      await expect(caller.byId({ id: 123 as any })).rejects.toMatchObject({
        code: "BAD_REQUEST",
      });
    });
  });

  describe("create", () => {
    it("inserts and returns first row", async () => {
      const { db, insertChain } = makeDbMock();
      const ctx = { db };

      insertChain.returning.mockResolvedValueOnce([{ id: "new" }]);

      const mockRecord = { title: "ViTest Title", summary: "ViTest Summary" };
      const res = await callResolver(
        feedbackRouter._def.procedures.create,
        ctx,
        mockRecord,
      );

      expect(db.insert).toHaveBeenCalledTimes(1);
      expect(insertChain.values).toHaveBeenCalledWith(mockRecord);
      expect(res).toEqual({ id: "new" });
    });

    it("validates title length", async () => {
      const caller = feedbackRouter.createCaller(makeCtx());

      await expect(
        caller.create({ title: "", summary: "ok" }),
      ).rejects.toMatchObject({
        code: "BAD_REQUEST",
      });
    });
  });

  describe("delete", () => {
    it("returns deleted id or null", async () => {
      const { db, deleteChain } = makeDbMock();
      const ctx = { db };

      const mockRecord = { id: "to-be-deleted" };
      deleteChain.returning.mockResolvedValueOnce([mockRecord]);

      const res = await callResolver(
        feedbackRouter._def.procedures.delete,
        ctx,
        mockRecord,
      );

      expect(db.delete).toHaveBeenCalledTimes(1);
      expect(deleteChain.where).toHaveBeenCalledTimes(1);
      expect(res).toEqual(mockRecord);
    });
  });

  describe("updates", () => {
    it("updateTitle updates title and returns row", async () => {
      const { db, updateChain } = makeDbMock();
      const ctx = { db };

      const mockRecord = { id: "some-id", title: "Some Title" };
      updateChain.returning.mockResolvedValueOnce([mockRecord]);

      const res = await callResolver(
        feedbackRouter._def.procedures.updateTitle,
        ctx,
        mockRecord,
      );

      expect(db.update).toHaveBeenCalledTimes(1);
      expect(updateChain.set).toHaveBeenCalledWith({ title: mockRecord.title });
      expect(res).toEqual(mockRecord);
    });

    it("updateSummary validates max length", async () => {
      const caller = feedbackRouter.createCaller(makeCtx());

      await expect(
        caller.updateSummary({
          id: "00000000-0000-0000-0000-000000000000",
          summary: "a".repeat(2001),
        }),
      ).rejects.toMatchObject({
        code: "BAD_REQUEST",
      });
    });

    it("updateStatus rejects invalid enum", async () => {
      const caller = feedbackRouter.createCaller(makeCtx());

      await expect(
        caller.updateStatus({
          id: "00000000-0000-0000-0000-000000000000",
          status: "Einari" as any,
        }),
      ).rejects.toMatchObject({
        code: "BAD_REQUEST",
      });
    });
  });
});
