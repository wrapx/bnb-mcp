import { z } from 'zod';
import { isAddress } from 'viem';

// Schema for MCP tool registration - 使用与标准工具完全一致的格式
export const WrapXZodSchema = {
  contractAddress: z.string()
    .refine(isAddress, { message: 'Invalid contract address' })
    .describe("The address of the deployed WrapX contract"),
  
  to: z.string()
    .refine(isAddress, { message: 'Invalid recipient address' })
    .describe("The address that will receive the new NFT"),
  
  tokenName: z.string()
    .min(1, "Token name cannot be empty")
    .max(32, "Token name must be 32 characters or less")
    .regex(/^[a-z0-9]+$/, "Token name must contain only lowercase letters a-z and numbers 0-9")
    .describe("A name for the specific NFT being created (lowercase a-z, numbers 0-9, max 32 chars)"),
  
  amount: z.string()
    .regex(/^[0-9]+$/, "Amount must be a positive integer string")
    .describe("The maximum amount of tokens (in wei) the user is willing to pay, including slippage")
};

export const GetWrapPriceZodSchema = {
  contractAddress: z.string()
    .refine(isAddress, { message: 'Invalid contract address' })
    .describe("The address of your deployed WrapX contract"),
  
  slippagePercentage: z.string()
    .optional()
    .describe("The slippage percentage to add (default: 20%)")
};

export const GetStrategyZodSchema = {
  contractAddress: z.string()
    .refine(isAddress, { message: 'Invalid contract address' })
    .describe("The address of your deployed WrapX contract")
};

export const UnwrapZodSchema = {
  contractAddress: z.string()
    .refine(isAddress, { message: 'Invalid contract address' })
    .describe("The address of the deployed WrapX contract"),
  
  to: z.string()
    .refine(isAddress, { message: 'Invalid recipient address' })
    .describe("The address that will receive the unwrapped assets"),
  
  tokenId: z.string()
    .regex(/^[0-9]+$/, "TokenId must be a positive integer string")
    .describe("The ID of the NFT token to unwrap"),
  
  minExpectedOutput: z.string()
    .regex(/^[0-9]+$/, "Minimum expected output must be a positive integer string")
    .describe("The minimum amount the user is willing to accept after fees (slippage protection)")
};

export const GetUnwrapPriceZodSchema = {
  contractAddress: z.string()
    .refine(isAddress, { message: 'Invalid contract address' })
    .describe("The address of your deployed WrapX contract"),
  
  tokenId: z.string()
    .regex(/^[0-9]+$/, "TokenId must be a positive integer string")
    .describe("The ID of the NFT token to get unwrap price for"),
  
  slippagePercentage: z.string()
    .optional()
    .describe("The slippage percentage to subtract (default: 20%)")
};

// Schema for extracting WrapX contract address from deployment transaction
export const ExtractWrapXAddressZodSchema = {
  txHash: z.string()
    .regex(/^0x[a-fA-F0-9]{64}$/, "Transaction hash must be a valid 64-character hex string")
    .describe("The transaction hash of the WrapX deployment transaction"),
  
  network: z.string()
    .optional()
    .describe("Network name (e.g. 'bsc-testnet', 'bsc', etc.) or chain ID. Defaults to current network.")
};

// Internal validation schemas for handlers
export const WrapXValidationSchema = z.object({
  contractAddress: z.string().refine(isAddress, {
    message: 'Invalid contract address',
  }),
  
  to: z.string().refine(isAddress, {
    message: 'Invalid recipient address',
  }),
  
  tokenName: z.string()
    .min(1, "Token name cannot be empty")
    .max(32, "Token name must be 32 characters or less")
    .regex(/^[a-z0-9]+$/, "Token name must contain only lowercase letters a-z and numbers 0-9"),
  
  amount: z.string()
    .regex(/^[0-9]+$/, "Amount must be a positive integer string"),
});

export const GetWrapPriceValidationSchema = z.object({
  contractAddress: z.string().refine(isAddress, {
    message: 'Invalid contract address',
  }),
  
  slippagePercentage: z.string().optional(),
});

export const GetStrategyValidationSchema = z.object({
  contractAddress: z.string().refine(isAddress, {
    message: 'Invalid contract address',
  }),
});

export const UnwrapValidationSchema = z.object({
  contractAddress: z.string().refine(isAddress, {
    message: 'Invalid contract address',
  }),
  
  to: z.string().refine(isAddress, {
    message: 'Invalid recipient address',
  }),
  
  tokenId: z.string()
    .regex(/^[0-9]+$/, "TokenId must be a positive integer string"),
  
  minExpectedOutput: z.string()
    .regex(/^[0-9]+$/, "Minimum expected output must be a positive integer string"),
});

export const GetUnwrapPriceValidationSchema = z.object({
  contractAddress: z.string().refine(isAddress, {
    message: 'Invalid contract address',
  }),
  
  tokenId: z.string()
    .regex(/^[0-9]+$/, "TokenId must be a positive integer string"),
  
  slippagePercentage: z.string().optional(),
});

export const ExtractWrapXAddressValidationSchema = z.object({
  txHash: z.string()
    .regex(/^0x[a-fA-F0-9]{64}$/, "Transaction hash must be a valid 64-character hex string"),
  
  network: z.string().optional(),
});

// JSON Schemas for MCP tool registration (backup)
export const WrapXSchema = {
  type: "object",
  properties: {
    contractAddress: {
      type: "string",
      description: "The address of the deployed WrapX contract.",
      pattern: "^0x[a-fA-F0-9]{40}$"
    },
    to: {
      type: "string", 
      description: "The address that will receive the new NFT.",
      pattern: "^0x[a-fA-F0-9]{40}$"
    },
    tokenName: {
      type: "string",
      description: "A name for the specific NFT being created (must contain only lowercase letters a-z and numbers 0-9, max 32 characters). Example: 'mynft001'",
      pattern: "^[a-z0-9]+$",
      minLength: 1,
      maxLength: 32
    },
    amount: {
      type: "string",
      description: "The maximum amount of tokens (in wei) the user is willing to pay, including slippage. Use getWrapPrice tool first to get recommended amount.",
      pattern: "^[0-9]+$"
    }
  },
  required: ["contractAddress", "to", "tokenName", "amount"],
  additionalProperties: false
} as const;

export const GetWrapPriceSchema = {
  type: "object",
  properties: {
    contractAddress: {
      type: "string",
      description: "The address of your deployed WrapX contract.",
      pattern: "^0x[a-fA-F0-9]{40}$"
    },
    slippagePercentage: {
      type: "string",
      description: "The slippage percentage to add (default: 20%). Example: '20' for 20%",
      pattern: "^[0-9]+$"
    }
  },
  required: ["contractAddress"],
  additionalProperties: false
} as const;

export const GetStrategySchema = {
  type: "object", 
  properties: {
    contractAddress: {
      type: "string",
      description: "The address of your deployed WrapX contract.",
      pattern: "^0x[a-fA-F0-9]{40}$"
    }
  },
  required: ["contractAddress"],
  additionalProperties: false
} as const;

export const UnwrapSchema = {
  type: "object",
  properties: {
    contractAddress: {
      type: "string",
      description: "The address of the deployed WrapX contract.",
      pattern: "^0x[a-fA-F0-9]{40}$"
    },
    to: {
      type: "string",
      description: "The address that will receive the unwrapped assets.",
      pattern: "^0x[a-fA-F0-9]{40}$"
    },
    tokenId: {
      type: "string",
      description: "The ID of the NFT token to unwrap. The user must own this token or be approved to manage it.",
      pattern: "^[0-9]+$"
    },
    minExpectedOutput: {
      type: "string",
      description: "The minimum amount the user is willing to accept after fees (slippage protection). You can get the recommended amount with slippage by first calling the getUnwrapPriceTool.",
      pattern: "^[0-9]+$"
    }
  },
  required: ["contractAddress", "to", "tokenId", "minExpectedOutput"],
  additionalProperties: false
} as const;

export const GetUnwrapPriceSchema = {
  type: "object",
  properties: {
    contractAddress: {
      type: "string", 
      description: "The address of your deployed WrapX contract.",
      pattern: "^0x[a-fA-F0-9]{40}$"
    },
    tokenId: {
      type: "string",
      description: "The ID of the NFT token to get unwrap price for.",
      pattern: "^[0-9]+$"
    },
    slippagePercentage: {
      type: "string",
      description: "The slippage percentage to subtract (default: 20%). Example: '20' for 20%",
      pattern: "^[0-9]+$"
    }
  },
  required: ["contractAddress", "tokenId"],
  additionalProperties: false
} as const;

// JSON Schema for MCP tool registration - Extract WrapX Address
export const ExtractWrapXAddressSchema = {
  type: "object",
  properties: {
    txHash: {
      type: "string",
      description: "The transaction hash of the WrapX deployment transaction.",
      pattern: "^0x[a-fA-F0-9]{64}$"
    },
    network: {
      type: "string",
      description: "Network name (e.g. 'bsc-testnet', 'bsc', etc.) or chain ID. Defaults to current network."
    }
  },
  required: ["txHash"],
  additionalProperties: false
} as const; 