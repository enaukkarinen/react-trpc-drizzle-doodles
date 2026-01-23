import { feedbackList, feedbackGet, feedbackRecent, feedbackSearch, feedbackStats } from "../mcp/feedback";
import { ToolDefinition } from "./types";

export const tools: ToolDefinition[] = [
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
    description: "Return counts of feedback items grouped by status. Use for 'how many open/planned/done?'",
    parameters: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    strict: false,
  },
];

export async function runTool(name: string, args: any) {
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
