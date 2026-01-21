import express, { Router } from "express";
import OpenAI from "openai";

import {
  feedbackRecent,
  feedbackSearch,
  feedbackGet,
  feedbackList,
  feedbackStats,
} from "../mcp/feedback";

export const chatRouter = Router();
chatRouter.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o"; // pick what you want

// Function tool definitions (JSON Schema)
const tools: any[] = [
  {
    type: "function",
    name: "feedback_recent",
    description:
      "Get the most recent feedback items (newest first). Use for questions like 'what’s new?' or 'recent open items'. Returns items with id, summary, status, createdAt.",
    parameters: {
      type: "object",
      properties: {
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 50,
          description: "Max number of items to return.",
        },
        status: {
          type: "string",
          description: "Optional status filter, e.g. open/planned/done.",
        },
      },
      additionalProperties: false,
    },
    strict: false,
  },
  {
    type: "function",
    name: "feedback_search",
    description:
      "Search feedback by text query (matches summary). Use for 'find feedback about X'. Returns items with id, summary, status, createdAt.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          minLength: 1,
          description: "Search text (required).",
        },
        limit: { type: "integer", minimum: 1, maximum: 50 },
        offset: { type: "integer", minimum: 0 },
        status: { type: "string", description: "Optional status filter." },
      },
      required: ["query"],
      additionalProperties: false,
    },
    strict: false,
  },
  {
    type: "function",
    name: "feedback_get",
    description:
      "Get one feedback item by id. Use when the user references an id or asks for details of a specific item.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string", minLength: 1, description: "Feedback UUID." },
      },
      required: ["id"],
      additionalProperties: false,
    },
    strict: false,
  },
  {
    type: "function",
    name: "feedback_list",
    description:
      "List feedback items with optional filters and pagination. Use when the user asks for a list with offset/limit, status filter, or a simple query.",
    parameters: {
      type: "object",
      properties: {
        limit: { type: "integer", minimum: 1, maximum: 50 },
        offset: { type: "integer", minimum: 0 },
        status: { type: "string" },
        query: { type: "string", minLength: 1 },
      },
      additionalProperties: false,
    },
    strict: false,
  },
  {
    type: "function",
    name: "feedback_stats",
    description:
      "Return counts of feedback items grouped by status. Use for 'how many open/planned/done?'",
    parameters: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    strict: false,
  },
];

// Dispatch tool calls -> your MCP-backed functions
async function runTool(name: string, args: any) {
  switch (name) {
    case "feedback_recent":
      return feedbackRecent(args ?? {});
    case "feedback_search":
      return feedbackSearch(args);
    case "feedback_get":
      return feedbackGet(args?.id);
    case "feedback_list":
      return feedbackList(args ?? {});
    case "feedback_stats":
      return feedbackStats();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

chatRouter.post("/chat", async (req, res) => {
  const message = String(req.body?.message ?? "").trim();
  if (!message) return res.status(400).json({ error: "message is required" });

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not set" });
  }

  try {
    // Running input list; we append model outputs + tool outputs just like the docs describe.
    // (Start minimal: one user message.)
    const input: any[] = [{ role: "user", content: message }];

    const instructions = `
You are a helpful assistant for a feedback tracker app.

You have read-only tools to query feedback items.

IMPORTANT UI RULE:
- The UI will render tool results as a list automatically.
- Do NOT repeat / enumerate feedback items in your text response.
- Instead, write a short summary (1–2 sentences), e.g.:
  "Here are the most recent items. Click 'Get' for details or ask to filter."
- If the user asks for an explanation or recommendations, then you may refer to items by number (first/second) or by short summary, but avoid dumping the full list.

Never claim you created/edited/deleted data; tools are read-only.
`.trim();

    const toolTraces: Array<{
      name: string;
      args: any;
      output: any;
    }> = [];

    let response = await openai.responses.create({
      model: MODEL,
      instructions,
      tools,
      input,
    });

    // Tool-call loop (cap to avoid infinite loops)
    for (let step = 0; step < 5; step++) {
      // Append model output items into the running input
      input.push(...(response as any).output);

      const functionCalls = ((response as any).output ?? []).filter(
        (item: any) => item.type === "function_call",
      );

      if (functionCalls.length === 0) break;

      // Execute each tool call and append function_call_output
      for (const call of functionCalls) {
        const name = call.name as string;
        const args = call.arguments ? JSON.parse(call.arguments) : {};

        const result = await runTool(name, args);

        toolTraces.push({ name, args, output: result });

        input.push({
          type: "function_call_output",
          call_id: call.call_id,
          output: JSON.stringify(result),
        });
      }

      // Ask model again, now with tool outputs included
      response = await openai.responses.create({
        model: MODEL,
        instructions,
        tools,
        input,
      });
    }

    return res.json({
      reply: (response as any).output_text ?? "",
      data: toolTraces.length ? toolTraces : undefined,
      // optional: useful for debugging while you iterate
      // raw: response,
    });
  } catch (err) {
    console.error("POST /api/chat failed:", err);
    return res.status(502).json({ error: "LLM chat failed" });
  }
});
