import { ToolDefinition } from "../types";

// OpenAI tool descriptions are more instructional than MCP tool descriptions.
// MCP tools are the canonical interface; these descriptions are optimized for model routing.
export const ladTools: ToolDefinition[] = [
  {
    type: "function",
    name: "lad_by_ref",
    description:
      "Fetch the authoritative UK Local Authority District (LAD) record by reference code. " +
      "Use BEFORE answering any factual district questions (name, dates, area/size, bbox, boundary). " +
      "Use when chat is opened from the map (LAD context). " +
      "Do not rely on the UI district label; it is not authoritative. " +
      "Returns LAD metadata + computed areaKm2 + bbox.",
    parameters: {
      type: "object",
      properties: {
        ref: {
          type: "string",
          minLength: 1,
          description: "The LAD reference code (e.g. E06000019).",
        },
      },
      required: ["ref"],
      additionalProperties: false,
    },
    strict: false,
  },
];
