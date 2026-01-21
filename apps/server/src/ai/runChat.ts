import { ResponseFunctionToolCall, ResponseInputItem, ResponseOutputItem } from "openai/resources/responses/responses";
import { openai, OPENAI_MODEL } from "./openaiClient.js";
import { tools, runTool } from "./tools.js";

export type ToolTrace = {
  name: string;
  args: any;
  output: any;
};

function buildInstructions(uiMode: "tool_cards_visible" | "normal") {
  return `
You are a helpful assistant for a feedback tracker app.

You have read-only tools to query feedback items.

IMPORTANT UI RULE:
- The UI will render tool results automatically when provided.
- If UI_MODE is tool_cards_visible, do NOT enumerate items in your text reply.
  Write a short summary (1–2 sentences) and how to proceed (e.g., "Click Get" or "ask to filter").

Never claim you created/edited/deleted data; tools are read-only.

UI_MODE: ${uiMode}
`.trim();
}

export async function runChat(message: string): Promise<{ reply: string; traces: ToolTrace[] }> {
  const uiMode: "tool_cards_visible" | "normal" =
    /^(recent|open|stats)$/i.test(message.trim()) || /^search\s+/i.test(message.trim())
      ? "tool_cards_visible"
      : "normal";

  const instructions = buildInstructions(uiMode);

  const input: ResponseInputItem[] = [{ role: "user", content: message }];

  const traces: ToolTrace[] = [];

  let response = await openai.responses.create({
    model: OPENAI_MODEL,
    instructions,
    tools,
    input,
  });

  const MAX_TOOL_CALL_STEPS = 5;
  // Safety cap on iterative model:
  // conversation control / limit chances for the model to ask for tools again.
  for (let step = 0; step < MAX_TOOL_CALL_STEPS; step++) {
    input.push(...response.output);

    // Extract tool requests from the model output
    const toolRequests = response.output?.filter((item) => isFunctionToolCall(item)) || [];
    if (toolRequests?.length === 0) break;

    for (const call of toolRequests) {
      const name = call.name;
      const args = call.arguments ? JSON.parse(call.arguments) : {};
      const output = await runTool(name, args);

      // Keep a record of tool calls for observability in the client
      traces.push({ name, args, output });

      input.push({
        type: "function_call_output",
        call_id: call.call_id,
        output: JSON.stringify(output),
      });
    }

    response = await openai.responses.create({
      model: OPENAI_MODEL,
      instructions,
      tools,
      input,
    });
  }

  return {
    reply: (response as any).output_text ?? "",
    traces,
  };
}

function isFunctionToolCall(item: ResponseOutputItem): item is ResponseFunctionToolCall {
  return item.type === "function_call";
}
