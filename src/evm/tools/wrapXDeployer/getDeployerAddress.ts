import { generateTool } from '../types.js';
import { getNestedConfigValue } from '../../../config/index.js';

/**
 * Tool to get WrapX Deployer address from current configuration
 * Similar to getChainIdTool, reads from environment variable or config file
 */
export const getWrapXDeployerAddressTool = generateTool({
  name: 'get_wrapx_deployer_address',
  description: `🔗 **WrapX Deployer Address Tool** - Get the currently configured WrapX Deployer contract address.

**Purpose:**
- Returns the WrapX Deployer contract address from current configuration
- Uses same logic as getChainIdTool - reads from environment or config file
- Provides configuration instructions if not set

**Returns:**
- WrapX Deployer contract address if configured  
- Source information (environment variable WRAPX_DEPLOYER_ADDRESS or config file)
- Configuration setup instructions if address not found

**Usage:**
- Call before deploying WrapX contracts
- Get WrapX Deployer configuration status`,
  inputSchema: {
    type: 'object',
    properties: {}
  },
  toolHandler: async (wallet, args) => {
    try {
      // Get WrapX Deployer address using same logic as getChainIdTool
      const deployerAddress = getNestedConfigValue('contracts.wrapXDeployer');
      
      if (deployerAddress) {
        return JSON.stringify({
          success: true,
          data: {
            deployerAddress: deployerAddress,
            source: process.env.WRAPX_DEPLOYER_ADDRESS ? 'environment variable' : 'configuration file'
          }
        });
      }

      // No address configured - provide setup instructions
      return JSON.stringify({
        success: false,
        error: 'WrapX Deployer address not configured',
        setup: {
          message: 'Please configure WrapX Deployer address using one of these methods:',
          options: [
            'Set WRAPX_DEPLOYER_ADDRESS environment variable',
            'Add to config.json: {"contracts": {"wrapXDeployer": "0x..."}}'
          ]
        }
      });
    } catch (error: any) {
      return JSON.stringify({
        success: false,
        error: `Failed to get WrapX Deployer address: ${error.message || error}`
      });
    }
  }
}); 