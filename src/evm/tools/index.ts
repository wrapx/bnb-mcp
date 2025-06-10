// Main export file for EVM tools following advanced MCP pattern
import type { ToolHandler, ToolWithHandler } from './types.js';

// Import all tool modules
import { 
  wrapXTool, 
  wrapXNativeTool, 
  wrapXTokenTool,
  getWrapPriceTool, 
  getStrategyTool,
  unwrapTool,
  getUnwrapPriceTool,
  extractWrapXAddressTool
} from './wrapX/index.js';

import { deployWrapXTool } from './wrapXDeployer/index.js';
import { getWrapXDeployerAddressTool } from './wrapXDeployer/getDeployerAddress.js';
import { setTokenURIEngineTool } from './tokenURI/index.js';
import { getChainIdTool } from './chainInfo/index.js';

// Export all advanced MCP-style tools
export const advancedMcpTools: ToolWithHandler[] = [
  deployWrapXTool,
  getWrapXDeployerAddressTool,
  wrapXTool,
  wrapXNativeTool,
  wrapXTokenTool,
  getWrapPriceTool,
  getStrategyTool,
  unwrapTool,
  getUnwrapPriceTool,
  extractWrapXAddressTool,
  setTokenURIEngineTool,
  getChainIdTool
];

// Export types
export type { ToolHandler, ToolWithHandler }; 