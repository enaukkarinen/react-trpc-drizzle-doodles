import { extractJsonText } from "./extractJsonText";
import { getMcpClient } from "./singletonClient";

export async function localAuthorityDistrictGet(ref: string) {
  const client = await getMcpClient();
  const r = await client.callTool({ name: "lad_by_ref", arguments: { ref } });
  return extractJsonText(r);
}
