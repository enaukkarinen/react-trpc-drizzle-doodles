import { ChatRequestSchema, ChatResponseSchema, type ChatResponse } from "@einari/api-contract";

export async function postChat(message: string): Promise<ChatResponse> {
  const body = ChatRequestSchema.parse({ message });
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errMsg =
      (json && typeof json === "object" && "error" in json && (json as any).error) || `Request failed (${res.status})`;
    throw new Error(String(errMsg));
  }

  return ChatResponseSchema.parse(json);
}
