import { ToolDefinition } from "../types";

export const feedbackTools: ToolDefinition[] = [
  {
    type: "function",
    name: "feedback_recent",
    description:
      "Get the most recent feedback items (newest first). Use for 'what’s new', 'latest items', or 'recent open items'. NOT for searching by keyword (use feedback_search for that). Returns items: id, title, summary, status, createdAt.",
    parameters: {
      type: "object",
      properties: {
        limit: { type: "integer", minimum: 1, maximum: 50, description: "Max items to return." },
        status: { type: "string", description: "Optional status filter: open/planned/done." },
      },
      additionalProperties: false,
    },
    strict: false,
  },
  {
    type: "function",
    name: "feedback_search",
    description:
      "Search feedback by keyword text (matches summary). Use for 'find feedback about X' or 'search for X'. NOT for 'what’s new' (use feedback_recent). Returns items: id, summary, status, createdAt.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", minLength: 1, description: "Search text (required)." },
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
      "Get one feedback item by id (UUID). Use only when the user provides an id or asks for details of a specific item. Returns full details for that item.",
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
    name: "feedback_stats",
    description:
      "Return counts of feedback items grouped by status. Use for 'how many open/planned/done?' or 'summary counts'.",
    parameters: { type: "object", properties: {}, additionalProperties: false },
    strict: false,
  },
  {
    type: "function",
    name: "feedback_list",
    description:
      "List feedback items with pagination (offset/limit). Use ONLY when the user explicitly asks for paging like 'next 20', 'offset 40', or 'show 10 open items'. For keyword search use feedback_search. For latest items use feedback_recent.",
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
];
