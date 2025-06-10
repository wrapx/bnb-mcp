/**
 * Helper function to construct block explorer URL based on chain
 */
export function constructExplorerUrl(chain: any, txHash: string): string {
  // Map chain IDs to their respective block explorers
  const explorerUrls: Record<number, string> = {
    1: 'https://etherscan.io/tx/',           // Ethereum Mainnet
    56: 'https://bscscan.com/tx/',           // BSC Mainnet
    97: 'https://testnet.bscscan.com/tx/',   // BSC Testnet
    204: 'https://opbnbscan.com/tx/',        // opBNB Mainnet
    5611: 'https://testnet.opbnbscan.com/tx/', // opBNB Testnet
    8453: 'https://basescan.org/tx/',        // Base Mainnet
    84532: 'https://sepolia.basescan.org/tx/', // Base Sepolia
    137: 'https://polygonscan.com/tx/',      // Polygon Mainnet
  };
  
  const chainId = chain?.id || 56; // Default to BSC mainnet
  const explorerUrl = explorerUrls[chainId] || 'https://bscscan.com/tx/'; // Default to BSC
  
  return `${explorerUrl}${txHash}`;
} 