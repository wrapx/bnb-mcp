import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import type { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, createPublicClient, http } from "viem";

import { advancedMcpTools } from "./index.js";
import { getPrivateKey, hasPrivateKey } from "../../config/index.js";
import { getDefaultChain } from "./utils/chain.js";

/**
 * Register advanced MCP tools to the server
 */
export function registerAdvancedTools(server: McpServer) {
  // Get the private key from environment variable only (for security)
  const privateKey = getPrivateKey();
  if (!hasPrivateKey() || !privateKey) {
    throw new Error("Private key not configured. Please set the PRIVATE_KEY environment variable.");
  }

  // Create account and wallet client with all required methods
  const account = privateKeyToAccount(privateKey as Hex);
  const chain = getDefaultChain();
  
  // Create wallet client with transport
  const walletClient = createWalletClient({
    account,
    chain,
    transport: http()
  });

  // Create public client for reading
  const publicClient = createPublicClient({
    chain,
    transport: http()
  });

  // Combine wallet and public clients using Object.assign for compatibility
  const client = Object.assign(walletClient, publicClient);

  // Register all tools using standard MCP format
  for (const tool of advancedMcpTools) {
    server.tool(
      tool.definition.name,
      tool.definition.description || `Tool: ${tool.definition.name}`,
      tool.definition.inputSchema,
      async (args) => {
        try {
          const result = await tool.handler(client, args);
          return typeof result === 'string' 
            ? { content: [{ type: 'text', text: result }] } 
            : result;
        } catch (error) {
          if (error instanceof McpError) {
            throw error;
          }
          
          throw new McpError(
            ErrorCode.InternalError,
            `Error executing tool ${tool.definition.name}: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }
    );
  }
}