import { feedbackTools } from "./feedbackTools";
import { ladTools } from "./ladTools";
import { ToolDefinition } from "../types";

export const tools: ToolDefinition[] = [...feedbackTools, ...ladTools];
