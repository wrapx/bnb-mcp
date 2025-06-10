import type { PublicActions, WalletClient } from 'viem';
import { erc20Abi, toHex } from 'viem';
import type { z } from 'zod';
import { WrapXNative, WrapXToken } from './abi.js';
import { 
  WrapXValidationSchema, 
  GetWrapPriceValidationSchema, 
  GetStrategyValidationSchema, 
  UnwrapValidationSchema, 
  GetUnwrapPriceValidationSchema,
  ExtractWrapXAddressValidationSchema
} from './schemas.js';
import { constructExplorerUrl } from '../utils/explorer.js';
import { getDefaultChain } from '../utils/chain.js';
import * as services from '../../services/index.js';

// Address representing native ETH in contracts
const NATIVE_ETH_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

/**
 * Helper function to get oracle price information
 * @private - This is an internal helper function
 */
async function _getOraclePrice(
  wallet: WalletClient & PublicActions,
  contractAddress: `0x${string}`,
  slippagePercent: number = 20
): Promise<{ swap: bigint, fee: bigint, total: bigint }> {
  try {
    // For ETH wrapping, data should be an empty string
    const data = "";

    // Call getWrapOracle to get the base swap amount and fee
    const result = await wallet.readContract({
      address: contractAddress,
      abi: WrapXNative,
      functionName: 'getWrapOracle',
      args: [data],
    }) as [bigint, bigint]; // Type assertion for the tuple response

    // Extract swap amount and fee
    const swap = result[0];
    const fee = result[1];
    
    // Calculate total base amount
    const baseAmount = swap + fee;
    
    // Add slippage buffer (e.g., 20%)
    const slippageBuffer = (baseAmount * BigInt(slippagePercent)) / BigInt(100);
    const totalWithSlippage = baseAmount + slippageBuffer;

    return {
      swap,
      fee,
      total: totalWithSlippage
    };
  } catch (error) {
    throw new Error(`Failed to get recommended wrap amount: ${error}`);
  }
}

/**
 * Helper function to get oracle unwrap price information
 * @private - This is an internal helper function
 */
async function _getUnwrapOraclePrice(
  wallet: WalletClient & PublicActions,
  contractAddress: `0x${string}`,
  tokenId: string,
  slippagePercent: number = 20
): Promise<{ swap: bigint, fee: bigint, total: bigint }> {
  try {
    // For unwrap, we encode the tokenId as data
    const data = toHex(tokenId);

    // Call getUnwrapOracle to get the base swap amount and fee
    const result = await wallet.readContract({
      address: contractAddress,
      abi: WrapXNative,
      functionName: 'getUnwrapOracle',
      args: [data],
    }) as [bigint, bigint]; // Type assertion for the tuple response

    // Extract swap amount and fee
    const swap = result[0];
    const fee = result[1];
    
    // Calculate total base amount
    const baseAmount = swap - fee;
    
    // Subtract slippage buffer (e.g., 20%)
    const slippageBuffer = (baseAmount * BigInt(slippagePercent)) / BigInt(100);
    const totalWithSlippage = baseAmount - slippageBuffer;

    return {
      swap,
      fee,
      total: totalWithSlippage
    };
  } catch (error) {
    throw new Error(`Failed to get recommended unwrap amount: ${error}`);
  }
}

/**
 * Tool to get the current wrap price from the oracle
 */
export async function getWrapPriceHandler(
  wallet: WalletClient & PublicActions,
  args: any,
): Promise<string> {
  // Validate arguments
  const validation = GetWrapPriceValidationSchema.safeParse(args);
  
  if (!validation.success) {
    const errors = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    return JSON.stringify({
      success: false,
      error: `Invalid parameters: ${errors}`,
      received: args
    });
  }

  const { contractAddress, slippagePercentage } = validation.data;
  const slippage = slippagePercentage ? parseInt(slippagePercentage) : 20;

  try {
    // Get the current wrap price from the oracle
    const result = await wallet.readContract({
      address: contractAddress as `0x${string}`,
      abi: WrapXNative, // Both contracts have the same oracle function
      functionName: 'getWrapOracle',
      args: [""],
    }) as [bigint, bigint];

    // Extract base amount and fee
    const oraclePrice = result[0] + result[1]; // base amount + fee

    // Calculate total amount with slippage
    const slippageMultiplier = BigInt(100 + slippage);
    const totalAmountWithSlippage = (oraclePrice * slippageMultiplier) / BigInt(100);

    // Check if this is a native or token contract by trying to read tokenAddress
    let isNativeContract = true;
    try {
      await wallet.readContract({
        address: contractAddress as `0x${string}`,
        abi: WrapXToken,
        functionName: 'tokenAddress',
      });
      isNativeContract = false; // If tokenAddress exists, it's an ERC20 contract
    } catch {
      // If tokenAddress doesn't exist, it's a native contract
      isNativeContract = true;
    }

    const currencyType = isNativeContract ? "BNB" : "ERC20 tokens";
    const additionalCost = isNativeContract ? "" : " (gas fees are additional in BNB)";

    return JSON.stringify({
      success: true,
      data: {
        baseAmount: oraclePrice.toString(),
        slippagePercentage: slippage,
        totalAmountWithSlippage: totalAmountWithSlippage.toString(),
        contractAddress: contractAddress,
        currencyType: currencyType,
        isNativeContract: isNativeContract,
        message: `Wrap amount needed: ${oraclePrice.toString()} wei of ${currencyType}. With ${slippage}% slippage: ${totalAmountWithSlippage.toString()} wei. Use the slippage amount for your wrap transaction${additionalCost}.`
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return JSON.stringify({
      success: false,
      error: `Failed to get wrap price: ${errorMessage}`
    });
  }
}

/**
 * Tool to get the current unwrap price from the oracle
 */
export async function getUnwrapPriceHandler(
  wallet: WalletClient & PublicActions,
  args: any,
): Promise<string> {
  // Validate arguments
  const validation = GetUnwrapPriceValidationSchema.safeParse(args);
  
  if (!validation.success) {
    const errors = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    return JSON.stringify({
      success: false,
      error: `Invalid parameters: ${errors}`,
      received: args
    });
  }

  const { contractAddress, tokenId, slippagePercentage } = validation.data;
  const slippage = slippagePercentage ? parseInt(slippagePercentage) : 20;

  try {
    // Get the unwrap price for the specific token
    const result = await wallet.readContract({
      address: contractAddress as `0x${string}`,
      abi: WrapXNative, // Both contracts have the same function
      functionName: 'getUnwrapOracle',
      args: [toHex(tokenId)],
    }) as [bigint, bigint];

    const unwrapPrice = result[0] - result[1]; // base amount - fee

    // Calculate minimum expected output with slippage protection
    const slippageMultiplier = BigInt(100 - slippage);
    const minExpectedOutput = (unwrapPrice * slippageMultiplier) / BigInt(100);

    return JSON.stringify({
      success: true,
      data: {
        baseAmount: unwrapPrice.toString(),
        slippagePercentage: slippage,
        minExpectedOutput: minExpectedOutput.toString(),
        contractAddress: contractAddress,
        tokenId: tokenId,
        message: `Unwrap price for token ${tokenId}: ${unwrapPrice.toString()} wei. With ${slippage}% slippage protection: ${minExpectedOutput.toString()} wei minimum. Use this as your minExpectedOutput.`
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return JSON.stringify({
      success: false,
      error: `Failed to get unwrap price: ${errorMessage}`
    });
  }
}

/**
 * Tool to unwrap a WrapX NFT back into its original assets
 */
export async function unwrapHandler(
  wallet: WalletClient & PublicActions,
  args: any,
): Promise<string> {
  // Validate arguments
  const validation = UnwrapValidationSchema.safeParse(args);
  
  if (!validation.success) {
    const errors = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    return JSON.stringify({
      success: false,
      error: `Invalid parameters: ${errors}`,
      received: args
    });
  }

  const { contractAddress, to, tokenId, minExpectedOutput } = validation.data;

  try {
    // Call the unwrap function on the contract
    // Encode minExpectedOutput using ABI encoding
    const { encodeAbiParameters } = await import('viem');
    const encodedData = encodeAbiParameters(
      [{ name: 'minExpectedOutput', type: 'uint256' }],
      [BigInt(minExpectedOutput)]
    );
    
    const txHash = await wallet.writeContract({
      account: wallet.account!,
      address: contractAddress as `0x${string}`,
      abi: WrapXNative, // Both contracts have the same unwrap function
      functionName: 'unwrap',
      args: [to as `0x${string}`, BigInt(tokenId), encodedData],
      chain: getDefaultChain(),
    });

    const baseScanUrl = constructExplorerUrl(wallet.chain ?? getDefaultChain(), txHash);

    return JSON.stringify({
      success: true,
      data: {
        transactionHash: txHash,
        baseScanUrl: baseScanUrl,
        contractAddress: contractAddress,
        tokenId: tokenId,
        recipient: to,
        minExpectedOutput: minExpectedOutput,
        message: `Successfully initiated unwrap transaction for token ${tokenId}. Transaction hash: ${txHash}. View on BaseScan: ${baseScanUrl}`
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return JSON.stringify({
      success: false,
      error: `Failed to unwrap NFT: ${errorMessage}`
    });
  }
}

/**
 * Tool to wrap native ETH into a WrapX NFT
 * Only handles wrapping of native ETH (not ERC20 tokens)
 */
export async function wrapXNativeHandler(
  wallet: WalletClient & PublicActions,
  args: any,
): Promise<string> {
  // Validate arguments
  const validation = WrapXValidationSchema.safeParse(args);
  
  if (!validation.success) {
    const errors = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    return JSON.stringify({
      success: false,
      error: `Invalid parameters: ${errors}`,
      received: args
    });
  }

  const { contractAddress, to, tokenName, amount } = validation.data;

  try {
    // Convert amount string to BigInt
    const amountBigInt = BigInt(amount);

    // Call the wrap function on the contract
    // Encode tokenName as bytes
    const tokenNameBytes = toHex(tokenName);
    
    const txHash = await wallet.writeContract({
      account: wallet.account!,
      address: contractAddress as `0x${string}`,
      abi: WrapXNative,
      functionName: 'wrap',
      args: [to as `0x${string}`, tokenNameBytes],
      value: amountBigInt,
      chain: getDefaultChain(),
    });

    const baseScanUrl = constructExplorerUrl(wallet.chain ?? getDefaultChain(), txHash);

    return JSON.stringify({
      success: true,
      data: {
        transactionHash: txHash,
        baseScanUrl: baseScanUrl,
        contractAddress: contractAddress,
        recipient: to,
        tokenName: tokenName,
        amount: amount,
        message: `Successfully initiated native ETH wrap transaction. Transaction hash: ${txHash}. View on BaseScan: ${baseScanUrl}`
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return JSON.stringify({
      success: false,
      error: `Failed to wrap native ETH: ${errorMessage}`
    });
  }
}

/**
 * Tool to wrap ERC20 tokens into a WrapX NFT
 * Only handles wrapping of ERC20 tokens (not native ETH)
 */
export async function wrapXTokenHandler(
  wallet: WalletClient & PublicActions,
  args: any,
): Promise<string> {
  // Validate arguments
  const validation = WrapXValidationSchema.safeParse(args);
  
  if (!validation.success) {
    const errors = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    return JSON.stringify({
      success: false,
      error: `Invalid parameters: ${errors}`,
      received: args
    });
  }

  const { contractAddress, to, tokenName, amount } = validation.data;

  try {
    // Convert amount string to BigInt
    const amountBigInt = BigInt(amount);

    // Get strategy information to determine token address
    const strategyJson = await getStrategyHandler(wallet, { contractAddress });
    const strategy = JSON.parse(strategyJson);
    
    if (!strategy.success) {
      throw new Error(`Failed to get strategy: ${strategy.error}`);
    }
    
    const tokenAddress = strategy.data.asset?.currency as `0x${string}`;
    
    if (!tokenAddress) {
      throw new Error('Could not determine token address from strategy');
    }

    // Check if it's native ETH (should not be for token wrapping)
    if (tokenAddress === NATIVE_ETH_ADDRESS) {
      return JSON.stringify({
        success: false,
        error: 'This contract is configured for native ETH wrapping, not ERC20 tokens. Use the native wrap tool instead.'
      });
    }

    // Step 1: Approve the token transfer
    const approveTxHash = await wallet.writeContract({
      account: wallet.account!,
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [contractAddress as `0x${string}`, amountBigInt],
      chain: getDefaultChain(),
    });

    const approveBaseScanUrl = constructExplorerUrl(wallet.chain ?? getDefaultChain(), approveTxHash);

    // Step 2: Call the wrap function on the contract
    // Encode (amount, tokenName) as bytes using ABI encoding - matching Solidity abi.encode(amountBigInt, tokenName)
    const { encodeAbiParameters } = await import('viem');
    const encodedData = encodeAbiParameters(
      [
        { name: 'amount', type: 'uint256' },
        { name: 'tokenName', type: 'string' }
      ],
      [amountBigInt, tokenName]
    );
    
    const wrapTxHash = await wallet.writeContract({
      account: wallet.account!,
      address: contractAddress as `0x${string}`,
      abi: WrapXToken,
      functionName: 'wrap',
      args: [to as `0x${string}`, encodedData],
      chain: getDefaultChain(),
    });

    const wrapBaseScanUrl = constructExplorerUrl(wallet.chain ?? getDefaultChain(), wrapTxHash);

    return JSON.stringify({
      success: true,
      data: {
        approveTransactionHash: approveTxHash,
        approveBaseScanUrl: approveBaseScanUrl,
        wrapTransactionHash: wrapTxHash,
        wrapBaseScanUrl: wrapBaseScanUrl,
        contractAddress: contractAddress,
        tokenAddress: tokenAddress,
        recipient: to,
        tokenName: tokenName,
        amount: amount,
        message: `Successfully initiated ERC20 token wrap. Approval transaction: ${approveTxHash} (${approveBaseScanUrl}). Wrap transaction: ${wrapTxHash} (${wrapBaseScanUrl})`
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return JSON.stringify({
      success: false,
      error: `Failed to wrap ERC20 tokens: ${errorMessage}`
    });
  }
}

/**
 * Tool to wrap assets (ETH or ERC20 tokens) into a WrapX NFT
 * Automatically detects whether to wrap native ETH or ERC20 tokens based on the contract configuration
 */
export async function wrapXHandler(
  wallet: WalletClient & PublicActions,
  args: any,
): Promise<string> {
  // Validate arguments first
  const validation = WrapXValidationSchema.safeParse(args);
  
  if (!validation.success) {
    const errors = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    return JSON.stringify({
      success: false,
      error: `Invalid parameters: ${errors}`,
      received: args
    });
  }

  const { contractAddress } = validation.data;

  try {
    // Get strategy information to determine contract type
    const strategyJson = await getStrategyHandler(wallet, { contractAddress });
    const strategy = JSON.parse(strategyJson);
    
    const tokenAddress = strategy.data.asset?.currency as `0x${string}`;
    
    if (!tokenAddress) {
      throw new Error('Could not determine token address from strategy');
    }

    // If the asset is the zero address, it's native ETH
    if (tokenAddress === NATIVE_ETH_ADDRESS) {
      return await wrapXNativeHandler(wallet, args);
    } else {
      return await wrapXTokenHandler(wallet, args);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return JSON.stringify({
      success: false,
      error: `Failed to determine contract type for wrapping: ${errorMessage}`
    });
  }
}

/**
 * Tool to get strategy information from a WrapX contract
 * Returns configuration details about the contract
 */
export async function getStrategyHandler(
  wallet: WalletClient & PublicActions,
  args: any,
): Promise<string> {
  // Validate arguments
  const validation = GetStrategyValidationSchema.safeParse(args);
  
  if (!validation.success) {
    const errors = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    return JSON.stringify({
      success: false,
      error: `Invalid parameters: ${errors}`,
      received: args
    });
  }

  const { contractAddress } = validation.data;

  try {
    // Get strategy information from the contract
    const result = await wallet.readContract({
      address: contractAddress as `0x${string}`,
      abi: WrapXNative, // Both contracts have the same getStrategy function
      functionName: 'getStrategy',
    }) as [string, any, string];

    // Extract strategy information
    const appAddress = result[0];
    const asset = result[1];
    const attributeData = result[2];
    
    // Format asset information with BigInt handling
    const assetInfo = {
      currency: String(asset.currency),
      basePremium: String(asset.basePremium),
      feeRecipient: String(asset.feeRecipient),
      mintFeePercent: String(asset.mintFeePercent),
      burnFeePercent: String(asset.burnFeePercent)
    };
    
    return JSON.stringify({
      success: true,
      data: {
        app: String(appAddress),
        asset: assetInfo,
        attributeData: String(attributeData),
        message: `Successfully retrieved strategy information for contract ${contractAddress}`
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return JSON.stringify({
      success: false,
      error: `Failed to get strategy information: ${errorMessage}`
    });
  }
}

/**
 * Tool to extract WrapX contract address from deployment transaction
 * Parses transaction receipt logs to find the newly deployed contract address
 */
export async function extractWrapXAddressHandler(
  wallet: WalletClient & PublicActions,
  args: any,
): Promise<string> {
  // Validate arguments
  const validation = ExtractWrapXAddressValidationSchema.safeParse(args);
  
  if (!validation.success) {
    const errors = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    return JSON.stringify({
      success: false,
      error: `Invalid parameters: ${errors}`,
      received: args
    });
  }

  const { txHash, network = 'bsc-testnet' } = validation.data;

  try {
    // Get transaction receipt to extract contract address from logs
    const receipt = await services.getTransactionReceipt(txHash as `0x${string}`, network);

    if (!receipt.logs || receipt.logs.length === 0) {
      return JSON.stringify({
        success: false,
        error: 'No logs found in transaction receipt. This may not be a deployment transaction.'
      });
    }

    // Look for the deployment event in logs (specifically the 4th event - index 3)
    // The contract address is in topics[1] of the deployment event
    let contractAddress: string | null = null;
    
    // Check specifically the 4th event (index 3) as mentioned by user
    if (receipt.logs.length > 3) {
      const deploymentLog = receipt.logs[3]; // 4th event (index 3)
      
      if (deploymentLog && deploymentLog.topics && deploymentLog.topics.length >= 2) {
        // Extract address from topics[1] (remove padding zeros)
        const possibleAddress = deploymentLog.topics[1];
        if (possibleAddress && possibleAddress.length === 66) { // 0x + 64 chars
          // Remove 0x and first 24 characters (padding), then add 0x back
          const extractedAddress = '0x' + possibleAddress.slice(26);
          
          // Validate if it's a valid address format
          if (/^0x[a-fA-F0-9]{40}$/.test(extractedAddress)) {
            contractAddress = extractedAddress;
          }
        }
      }
    }
    
    // If not found in 4th event, fall back to searching all logs
    if (!contractAddress) {
      for (let i = 0; i < receipt.logs.length; i++) {
        const log = receipt.logs[i];
        
        if (log && log.topics && log.topics.length >= 2) {
          const possibleAddress = log.topics[1];
          if (possibleAddress && possibleAddress.length === 66) {
            const extractedAddress = '0x' + possibleAddress.slice(26);
            
            if (/^0x[a-fA-F0-9]{40}$/.test(extractedAddress)) {
              contractAddress = extractedAddress;
              break;
            }
          }
        }
      }
    }

    if (!contractAddress) {
      return JSON.stringify({
        success: false,
        error: 'Could not extract WrapX contract address from transaction logs. Please verify this is a WrapX deployment transaction.',
        debug: {
          logsCount: receipt.logs.length,
          txHash: txHash,
          status: receipt.status
        }
      });
    }

    // Get current chain info for explorer URL
    const currentChain = getDefaultChain();
    const explorerUrl = constructExplorerUrl(currentChain, txHash);

    return JSON.stringify({
      success: true,
      data: {
        contractAddress: contractAddress,
        txHash: txHash,
        network: network,
        status: receipt.status,
        blockNumber: receipt.blockNumber.toString(),
        explorerUrl: explorerUrl,
        message: `Successfully extracted WrapX contract address: ${contractAddress} from deployment transaction ${txHash}`
      }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return JSON.stringify({
      success: false,
      error: `Failed to extract contract address: ${errorMessage}`
    });
  }
} 