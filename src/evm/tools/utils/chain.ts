import { getNestedConfigValue } from '../../../config/index.js';
import { chainMap } from '../../chains.js';

/**
 * Get the default chain from configuration
 * Priority: Environment variable > Config file > BSC mainnet (default)
 */
export function getDefaultChain() {
  // Check for environment variable first
  const envChainId = process.env.DEFAULT_CHAIN_ID;
  if (envChainId) {
    const chainId = parseInt(envChainId);
    return getChainById(chainId);
  }
  
  // Check config file
  const configChainId = getNestedConfigValue('networks.default.chainId');
  if (configChainId) {
    return getChainById(configChainId);
  }
  
  // Default to BSC mainnet for BNBChain MCP
  return chainMap[56]; // BSC mainnet
}

/**
 * Get chain configuration by chain ID
 */
export function getChainById(chainId: number) {
  const chain = chainMap[chainId];
  if (chain) {
    return chain;
  }
  
  // Unknown chain ID, fallback to BSC mainnet
  return chainMap[56]; // BSC mainnet
}