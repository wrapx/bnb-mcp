import { isAddress } from 'viem';
import type { z } from 'zod';
import { DeployWrapXValidationSchema } from './schemas.js';
import { WRAPX_DEPLOYER_ABI } from './abi.js';
import { getNestedConfigValue } from '../../../config/index.js';
import { constructExplorerUrl } from '../utils/explorer.js';
import { getDefaultChain } from '../utils/chain.js';
import * as services from '../../services/index.js';
import { getPrivateKey } from '../../../config/index.js';

// Helper function to map chain ID to network name for services
function getNetworkNameFromChainId(chainId: number): string {
  const networkMap: Record<number, string> = {
    1: 'ethereum',
    56: 'bsc',
    97: 'bsc-testnet',
    137: 'polygon',
    10: 'optimism',
    42161: 'arbitrum',
    8453: 'base',
    204: 'opbnb',
    5611: 'opbnb-testnet',
    11155111: 'sepolia',
  };
  
  return networkMap[chainId] || 'bsc-testnet';
}

export async function deployWrapXHandler(
  _wallet: any, // Not used since we use services
  args: any,
): Promise<string> {
  // Validate the arguments using Zod schema
  const validation = DeployWrapXValidationSchema.safeParse(args);
  
  if (!validation.success) {
    const errors = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    return JSON.stringify({
      success: false,
      error: `Invalid parameters: ${errors}`,
      received: args,
      requirements: {
        name: "String with lowercase letters a-z and numbers 0-9, max 32 characters",
        basePremium: "String representing wei amount (e.g., '1000000000000000')",
        maxSupply: "String representing number (e.g., '0' for unlimited)",
        tokenAddress: "String representing Ethereum address (use '0x0000000000000000000000000000000000000000' for BNB)"
      }
    });
  }

  const validatedArgs = validation.data;

  // Get the WrapXDeployer address from configuration
  const deployerAddress = getNestedConfigValue('contracts.wrapXDeployer');
  
  if (!deployerAddress) {
    return JSON.stringify({
      success: false,
      error: 'WrapXDeployer address not configured.',
      solution: {
        message: 'Please use the get_wrapx_deployer_address tool first to check available options.',
        recommendations: [
          'Call get_wrapx_deployer_address tool to see configuration options',
          'Set WRAPX_DEPLOYER_ADDRESS environment variable with the deployer contract address',
          'Add "contracts": {"wrapXDeployer": "0x..."} to your config.json file',
          'Deploy a new WrapX Deployer contract on this network first if none exists'
        ],
        nextSteps: 'Use: get_wrapx_deployer_address tool to get detailed configuration instructions'
      }
    });
  }

  // Validate that it's not a placeholder address
  if (deployerAddress === '0x0000000000000000000000000000000000000000' || 
      deployerAddress === '0x1234567890123456789012345678901234567890') {
    return JSON.stringify({
      success: false,
      error: 'WrapXDeployer address is a placeholder, not a real contract address.',
      solution: {
        message: 'The configured address is a placeholder and cannot be used for deployment.',
        recommendations: [
          'Use get_wrapx_deployer_address tool to check configuration options',
          'Update the configuration with a real WrapX Deployer contract address',
          'Deploy a new WrapX Deployer contract if none exists on this network'
        ],
        configuredAddress: deployerAddress
      }
    });
  }

  // Validate token address - 0x0000000000000000000000000000000000000000 means native token (BNB)
  const isNativeToken = validatedArgs.tokenAddress === '0x0000000000000000000000000000000000000000';
  
  if (!isNativeToken && !isAddress(validatedArgs.tokenAddress)) {
    return JSON.stringify({
      success: false,
      error: `Invalid token address: ${validatedArgs.tokenAddress}`,
      help: {
        message: "Token address must be either a valid ERC20 contract address or the native token address",
        examples: {
          nativeToken: "Use '0x0000000000000000000000000000000000000000' for BNB (native token)",
          erc20Token: "Use a valid contract address like '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' for USDC"
        }
      }
    });
  }

  try {
    // Get private key from configuration
    const privateKey = getPrivateKey();
    if (!privateKey) {
      return JSON.stringify({
        success: false,
        error: 'Private key not configured. Please set PRIVATE_KEY environment variable.'
      });
    }

    // Payment amount for deployment (0.01 ETH in wei)
    const paymentAmount = BigInt(10000000000000000);

    // Get current chain and determine network name
    const currentChain = getDefaultChain();
    const networkName = getNetworkNameFromChainId(currentChain?.id || 97);

    // Prepare contract parameters
    const contractParams = {
      address: deployerAddress as `0x${string}`,
      abi: WRAPX_DEPLOYER_ABI,
      functionName: 'deployWrapX',
      args: [
        validatedArgs.name,
        BigInt(validatedArgs.basePremium),
        BigInt(validatedArgs.maxSupply),
        validatedArgs.tokenAddress as `0x${string}`,
      ],
      value: paymentAmount,
    };

    // Execute the deployment
    const txHash = await services.writeContract(
      privateKey as services.Hex,
      contractParams,
      networkName
    );

    // Automatically extract the deployed WrapX contract address from transaction logs
    let deployedContractAddress: string | null = null;
    
    try {
      // Wait a moment for transaction to be confirmed
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get transaction receipt to extract contract address from logs
      const receipt = await services.getTransactionReceipt(txHash as `0x${string}`, networkName);

      if (receipt.logs && receipt.logs.length > 3) {
        const deploymentLog = receipt.logs[3]; // 4th event (index 3)
        
        if (deploymentLog && deploymentLog.topics && deploymentLog.topics.length >= 2) {
          // Extract address from topics[1] (remove padding zeros)
          const possibleAddress = deploymentLog.topics[1];
          if (possibleAddress && possibleAddress.length === 66) { // 0x + 64 chars
            // Remove 0x and first 24 characters (padding), then add 0x back
            const extractedAddress = '0x' + possibleAddress.slice(26);
            
            // Validate if it's a valid address format
            if (/^0x[a-fA-F0-9]{40}$/.test(extractedAddress)) {
              deployedContractAddress = extractedAddress;
            }
          }
        }
      }
    } catch (extractError) {
      // If extraction fails, continue without the contract address
      console.warn('Failed to extract contract address automatically:', extractError);
    }

    return JSON.stringify({
      success: true,
      data: {
        txHash: txHash,
        wrapXContractAddress: deployedContractAddress, // The actual deployed contract address
        contractName: validatedArgs.name,
        basePremium: validatedArgs.basePremium,
        maxSupply: validatedArgs.maxSupply,
        tokenAddress: validatedArgs.tokenAddress,
        explorerUrl: constructExplorerUrl(currentChain || { id: 97, name: 'BSC Testnet' } as any, txHash),
        message: deployedContractAddress 
          ? `🎉 WrapX contract successfully deployed! Contract address: ${deployedContractAddress}. You can now use this address for wrap/unwrap operations.`
          : `WrapX deployment transaction sent. Use the transaction hash ${txHash} with extract_contract_address tool to get your contract address.`,
        nextSteps: deployedContractAddress 
          ? [
              `✅ Your WrapX contract is deployed at: ${deployedContractAddress}`,
              "✅ You can now use wrap, unwrap, and other WrapX operations",
              "✅ Use get_strategy tool to verify contract configuration"
            ]
          : [
              `Use extract_contract_address tool with txHash: ${txHash}`,
              "Once you have the contract address, you can start wrapping operations"
            ]
      }
    });
  } catch (error: any) {
    return JSON.stringify({
      success: false,
      error: `Failed to deploy WrapX contract: ${error.message || error}`,
      troubleshooting: {
        suggestions: [
          'Check if the WrapX Deployer contract address is correct and deployed on this network',
          'Ensure you have sufficient native tokens for gas fees and the 0.01 ETH payment',
          'Verify that all parameters are valid (name format, token address, etc.)',
          'Use get_wrapx_deployer_address tool to verify the deployer address'
        ]
      }
    });
  }
} 