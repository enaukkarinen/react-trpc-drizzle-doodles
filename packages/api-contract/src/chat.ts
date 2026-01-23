import { z } from "zod";

/**
 * Tool traces returned by /api/chat.
 */
export const ToolTraceSchema = z.object({
  name: z.string(),
  args: z.unknown(),
  output: z.unknown(),
});

export type ToolTrace = z.infer<typeof ToolTraceSchema>;

/**
 * POST /api/chat request body
 */
export const ChatRequestSchema = z.object({
  input: z.string().min(1),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

/**
 * POST /api/chat response body
 */
export const ChatResponseSchema = z.object({
  reply: z.string(),
  data: z.array(ToolTraceSchema).optional(),
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;
