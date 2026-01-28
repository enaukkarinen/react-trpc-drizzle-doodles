import { feedbackList, feedbackGet, feedbackRecent, feedbackSearch, feedbackStats } from "../mcp/feedback";
import { localAuthorityDistrictGet } from "../mcp/localAuthorityDistrict";

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
    case "lad_by_ref":
      return localAuthorityDistrictGet(args?.ref);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
