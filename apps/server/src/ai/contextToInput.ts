import { ChatContextSchema, type ChatContext } from "@einari/api-contract";
import { ResponseInputItem } from "openai/resources/responses/responses.mjs";

export function contextToInput(context: ChatContext | undefined): ResponseInputItem[] {
  const safe = ChatContextSchema.optional().parse(context);

  if (!safe || safe.type === "none") return [];

  if (safe.type === "lad") {
    const label = safe.uiLabel ? `UI label: "${safe.uiLabel}" (not authoritative).` : `UI label: (none).`;

    return [
      {
        role: "user",
        content: [
          "Context: Map → UK Local Authority District (LAD).",
          `- Reference (authoritative): ${safe.ref}`,
          `- ${label}`,
          "",
          "Tooling rule:",
          `- If the user asks any factual question about this district (name, dates, bbox, area/size, boundaries), call lad_by_ref({ ref }) BEFORE answering.`,
          "- Do not invent planning/external data that isn't wired in.",
        ].join("\n"),
      },
    ];
  }

  return [];
}
