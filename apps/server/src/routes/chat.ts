import express, { Router } from "express";
import { runChat } from "../ai/runChat.js";

export const chatRouter = Router();
chatRouter.use(express.json());

chatRouter.post("/chat", async (req, res) => {
  const message = String(req.body?.message ?? "").trim();
  if (!message) return res.status(400).json({ error: "message is required" });

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not set" });
  }

  try {
    const { reply, traces } = await runChat(message);
    return res.json({
      reply,
      data: traces.length ? traces : undefined,
    });
  } catch (err) {
    console.error("POST /api/chat failed:", err);
    return res.status(502).json({ error: "LLM chat failed" });
  }
});
