import express, { Router } from "express";
import { runChat } from "../ai/runChat.js";
import { ChatResponseSchema } from "@einari/api-contract";

export const chatRouter = Router();
chatRouter.use(express.json());

chatRouter.post("/chat", async (req, res) => {
  const message = String(req.body?.message ?? "").trim();
  if (!message) return res.status(400).json({ error: "message is required" });

  try {
    const { reply, traces } = await runChat(message);

    const payload = {
      reply,
      data: traces.length ? traces : undefined,
    };

    ChatResponseSchema.parse({
      reply: payload.reply,
      data: payload.data ?? [],
    });

    return res.json(payload);
  } catch (err) {
    console.error("POST /api/chat failed:", err);
    return res.status(502).json({ error: "LLM chat failed" });
  }
});
