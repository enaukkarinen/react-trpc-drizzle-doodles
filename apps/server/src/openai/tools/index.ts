import { toolRegistry } from "./toolRegistry";

export const tools = Object.values(toolRegistry).map((t) => t.openai);
