import express, { Router } from "express";
import { runChat } from "../ai/runChat.js";
import { ChatRequest, ChatRequestSchema } from "@einari/api-contract";

import { validateBody } from "../middleware/validateBody.js";

export const chatRouter = Router();
chatRouter.use(express.json());

chatRouter.post<{}, any, ChatRequest>("/chat", validateBody(ChatRequestSchema), async (req, res) => {
  try {
    const { reply, traces } = await runChat(req.body.message);

    const payload = {
      reply,
      data: traces.length ? traces : undefined,
    };

    return res.json(payload);
  } catch (err) {
    console.error("POST /api/chat failed:", err);
    return res.status(502).json({ error: "LLM chat failed" });
  }
});
