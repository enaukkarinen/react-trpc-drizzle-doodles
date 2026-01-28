import { ResponseFunctionToolCall, ResponseInputItem, ResponseOutputItem } from "openai/resources/responses/responses";
import { openai, OPENAI_MODEL } from "./openaiClient.js";
import { tools } from "./tools";

import type { ChatContext, ToolTrace } from "@einari/api-contract";
import { buildInstructions } from "./buildInstructions.js";
import { contextToInput } from "./contextToInput.js";
import { runTool } from "./runTool.js";

export async function runChat(message: string, context?: ChatContext): Promise<{ reply: string; traces: ToolTrace[] }> {
  const uiMode: "tool_cards_visible" | "normal" =
    /^(recent|open|stats)$/i.test(message.trim()) || /^search\s+/i.test(message.trim())
      ? "tool_cards_visible"
      : "normal";

  const instructions = buildInstructions(uiMode);

  const input: ResponseInputItem[] = [...contextToInput(context), { role: "user", content: message }];

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
