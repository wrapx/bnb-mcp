import type { PublicActions, WalletClient } from 'viem';
import { isAddress } from 'viem';
import type { z } from 'zod';
import type { SetTokenURIEngineSchema } from './schemas.js';
import { TOKENURI_ENGINE_ABI } from './abi.js';
import { constructExplorerUrl } from '../utils/explorer.js';
import { getDefaultChain } from '../utils/chain.js';

export async function setTokenURIEngineHandler(
  wallet: WalletClient & PublicActions,
  args: z.infer<typeof SetTokenURIEngineSchema>,
): Promise<string> {
  // Validate contract address
  if (!isAddress(args.contractAddress)) {
    throw new Error(`Invalid contract address: ${args.contractAddress}`);
  }

  // Validate token URI engine address
  if (!isAddress(args.tokenURIEngine)) {
    throw new Error(`Invalid token URI engine address: ${args.tokenURIEngine}`);
  }

  try {
    // Simulate the contract call to check for errors
    const tx = await wallet.simulateContract({
      account: wallet.account,
      abi: TOKENURI_ENGINE_ABI,
      address: args.contractAddress as `0x${string}`,
      functionName: 'setTokenURIEngine',
      args: [
        BigInt(args.tokenId),
        args.tokenURIEngine as `0x${string}`,
      ],
    });

    // Execute the transaction
    const txHash = await wallet.writeContract(tx.request);

    return JSON.stringify({
      hash: txHash,
      url: constructExplorerUrl(wallet.chain ?? getDefaultChain(), txHash),
      message: `Successfully set token URI engine for NFT #${args.tokenId} to ${args.tokenURIEngine}.`,
    });
  } catch (error) {
    throw new Error(`Failed to set token URI engine: ${error}`);
  }
} 