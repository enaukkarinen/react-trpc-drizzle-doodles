import { z } from "zod";

export const ToolTraceSchema = z.object({
  name: z.string(),
  args: z.unknown(),
  output: z.unknown(),
});

export type ToolTrace = z.infer<typeof ToolTraceSchema>;

export const LadContextSchema = z.object({
  type: z.literal("lad"),
  ref: z.string().min(1),
  district: z.string().min(1).optional(),
});

export const ChatContextSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("none") }),
  LadContextSchema,
]);

export type ChatContext = z.infer<typeof ChatContextSchema>;

/**
 * POST /api/chat request body
 */
export const ChatRequestSchema = z.object({
  message: z.string().min(1),
  context: ChatContextSchema.optional(),
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
