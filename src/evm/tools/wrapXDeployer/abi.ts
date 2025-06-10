// Simplified WrapX Deployer ABI with essential functions
export const WRAPX_DEPLOYER_ABI = [
  {
    "type": "function",
    "name": "deployWrapX",
    "inputs": [
      {
        "name": "name_",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "basePremium",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxSupply",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "wrapperAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "payable"
  }
] as const; 