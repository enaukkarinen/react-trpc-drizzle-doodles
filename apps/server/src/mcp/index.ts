import { extractJsonText } from "./extractJsonText";
import { getMcpClient } from "./getMcpClient";

export async function feedbackList(args: { limit?: number; offset?: number; status?: string; query?: string }) {
  const client = await getMcpClient();
  const result = await client.callTool({
    name: "feedback_list",
    arguments: args,
  });
  return extractJsonText(result);
}

export async function feedbackGet(id: string) {
  const client = await getMcpClient();
  const r = await client.callTool({ name: "feedback_get", arguments: { id } });
  return extractJsonText(r);
}

export async function feedbackRecent(args?: { limit?: number; status?: string }) {
  const client = await getMcpClient();
  const r = await client.callTool({ name: "feedback_recent", arguments: args });
  return extractJsonText(r);
}

export async function feedbackSearch(args: { query: string; limit?: number; offset?: number; status?: string }) {
  const client = await getMcpClient();
  const r = await client.callTool({ name: "feedback_search", arguments: args });
  return extractJsonText(r);
}

export async function feedbackStats() {
  const client = await getMcpClient();
  const r = await client.callTool({ name: "feedback_stats", arguments: {} });
  return extractJsonText(r);
}

// Knowledge
export async function kbSearch(args: { query: string; topK?: number }) {
  const client = await getMcpClient();
  const out = await client.callTool({ name: "kb_search", arguments: args });
  return extractJsonText(out);
}

// Local Authority District
export async function localAuthorityDistrictGet(ref: string) {
  const client = await getMcpClient();
  const r = await client.callTool({ name: "lad_by_ref", arguments: { ref } });
  return extractJsonText(r);
}
