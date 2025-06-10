import { z } from 'zod';

// Schema for MCP tool registration - 使用与标准工具完全一致的格式
export const DeployWrapXZodSchema = {
  name: z.string()
    .min(1, "Name cannot be empty")
    .max(32, "Name must be 32 characters or less")
    .regex(/^[a-z0-9]+$/, "Name must contain only lowercase letters a-z and numbers 0-9")
    .describe("The name of the NFT collection (must contain only lowercase letters a-z and numbers 0-9, max 32 characters). Example: 'myethwrapper'"),
  
  basePremium: z.string()
    .describe("The base premium used for pricing wrap/unwrap operations, in wei. Recommended value for testing: '1000000000000000' (0.001 ETH)"),
    
  maxSupply: z.string()
    .describe("The maximum supply (limit on number of NFTs that can be minted). Use '0' for unlimited supply."),
    
  tokenAddress: z.string()
    .describe("The token address (use '0x0000000000000000000000000000000000000000' for native BNB, or provide an ERC20 token address)")
};

// Internal validation schema for handler
export const DeployWrapXValidationSchema = z.object({
  name: z.string()
    .min(1, "Name cannot be empty")
    .max(32, "Name must be 32 characters or less")
    .regex(/^[a-z0-9]+$/, "Name must contain only lowercase letters a-z and numbers 0-9"),
  
  basePremium: z.string(),
  maxSupply: z.string(),
  tokenAddress: z.string(),
});

// JSON Schema for MCP tool registration (backup)
export const DeployWrapXSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "The name of the NFT collection (must contain only lowercase letters a-z and numbers 0-9, max 32 characters). Example: 'myethwrapper'",
      pattern: "^[a-z0-9]+$",
      minLength: 1,
      maxLength: 32
    },
    basePremium: {
      type: "string", 
      description: "The base premium used for pricing wrap/unwrap operations, in wei. Recommended value for testing: '1000000000000000' (0.001 ETH)"
    },
    maxSupply: {
      type: "string",
      description: "The maximum supply (limit on number of NFTs that can be minted). Suggested range: 10-1000. Example: '100'"
    },
    tokenAddress: {
      type: "string",
      description: "The token address (use '0x0000000000000000000000000000000000000000' for ETH, or provide an ERC20 token address)"
    }
  },
  required: ["name", "basePremium", "maxSupply", "tokenAddress"],
  additionalProperties: false
} as const; 