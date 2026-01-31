import { registerFeedbackListTool } from "./feedbackList";
import { registerFeedbackGetTool } from "./feedbackGet";
import { registerFeedbackRecentTool } from "./feedbackRecent";
import { registerFeedbackSearchTool } from "./feedbackSearch";
import { registerFeedbackStatsTool } from "./feedbackStats";
import { registerLadByRefTool } from "./ladByRef";
import { registerKbSearchTool } from "./kbSearch";

export function registerTools(mcp: any) {
  registerFeedbackListTool(mcp);
  registerFeedbackGetTool(mcp);
  registerFeedbackRecentTool(mcp);
  registerFeedbackSearchTool(mcp);
  registerFeedbackStatsTool(mcp);
  registerLadByRefTool(mcp);
  registerKbSearchTool(mcp);
}
