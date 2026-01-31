import { ToolDefinition, toolRegistry } from "./tools/toolRegistry";

export async function runTool(name: string, args: any) {
  const tool = toolRegistry[name] as ToolDefinition | undefined;
  if (!tool) throw new Error(`Unknown tool: ${name}`);
  return tool.invoke(args);
}
