import { generateTool } from '../types.js';
import { getConfig, getNestedConfigValue } from '../../../config/index.js';

/**
 * Tool to get user's configured chain ID from configuration
 */
export const getChainIdTool = generateTool({
  name: 'get_current_chain_id',
  description: `🔍 **CRITICAL BLOCKCHAIN CONTEXT CHECK** - Get the currently configured chain ID from user settings.

**⚠️ MANDATORY REQUIREMENT**: This tool MUST be called FIRST before ANY blockchain operation, including:
- Deploying contracts
- Reading/writing smart contracts  
- Token transfers
- Transaction analysis
- Balance queries
- Network-specific operations

**Why this is essential:**
- Ensures operations execute on the correct blockchain network
- Prevents costly mistakes from wrong-network assumptions
- Validates user's environment configuration
- Provides proper context for gas calculations and token addresses

**Returns:**
- Current configured chain ID and name
- Network source (environment variable or config file)
- Hex format for web3 operations

**AI Workflow Requirement:**
1. ✅ ALWAYS call this tool first for blockchain operations
2. ✅ Use returned chain info to guide user interactions
3. ✅ Validate compatibility with user's intended actions
4. ✅ Inform user of current network before proceeding

**Example Usage Pattern:**
User: "Deploy a contract"
AI: First check current chain → Inform user → Collect parameters → Execute`,
  inputSchema: {
    type: 'object',
    properties: {}
  },
  toolHandler: async (wallet, args) => {
    try {
      // Get the current configuration
      const config = getConfig();
      
      // Get chainId from nested config
      const chainId = getNestedConfigValue('networks.default.chainId');
      const chainName = getNestedConfigValue('networks.default.name');
      
      return JSON.stringify({
        success: true,
        data: {
          chainId: chainId.toString(),
          chainIdHex: `0x${chainId.toString(16)}`,
          chainName: chainName,
          source: process.env.DEFAULT_CHAIN_ID ? 'environment variable' : 'configuration file'
        }
      });
    } catch (error: any) {
      return JSON.stringify({
        success: false,
        error: `Failed to get configured chain ID: ${error.message || error}`
      });
    }
  }
}); 