import { toolRegistry } from "./tools/toolRegistry";

export async function runTool(name: string, args: any) {
  const tool = (toolRegistry as any)[name];
  if (!tool) throw new Error(`Unknown tool: ${name}`);
  return tool.invoke(args);
}
