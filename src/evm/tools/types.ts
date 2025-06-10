// Type definitions for advanced MCP pattern using official SDK types
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

export interface ToolHandler {
  (wallet: any, args: any): Promise<string>;
}

export interface ToolWithHandler {
  definition: Tool;
  handler: ToolHandler;
}

// Utility function to generate tools in advanced MCP pattern
export function generateTool({
  name,
  description,
  inputSchema,
  toolHandler,
}: {
  name: string;
  description: string;
  inputSchema: any;
  toolHandler: ToolHandler;
}): ToolWithHandler {
  const tool: Tool = {
    name,
    description,
    inputSchema,
  };

  return {
    definition: tool,
    handler: toolHandler,
  };
} 