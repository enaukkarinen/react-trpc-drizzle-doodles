import { ChatResponseSchema, type ChatResponse } from "@einari/api-contract";

export async function postChat(message: string): Promise<ChatResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errMsg =
      (json && typeof json === "object" && "error" in json && (json as any).error) || `Request failed (${res.status})`;
    throw new Error(String(errMsg));
  }

  // Optional but nice: runtime validation so contract drift is caught instantly.
  return ChatResponseSchema.parse(json);
}
