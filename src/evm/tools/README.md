# EVM Tools - Advanced MCP Pattern

This directory contains EVM blockchain tools following an advanced MCP pattern, migrated from the `todo` directory.

## Structure

```
src/evm/tools/
├── index.ts              # Main export file with all migrated tools
├── types.ts              # Local type definitions for MCP pattern
├── README.md             # This documentation file
├── wrapX/                # WrapX NFT wrapping tools (7 tools)
│   ├── index.ts          # WrapX tool exports
│   ├── schemas.ts        # Zod validation schemas
│   ├── handlers.ts       # Tool implementation handlers
│   ├── descriptions.ts   # Tool descriptions and prompts
│   └── abi.ts           # Smart contract ABIs
├── wrapXDeployer/        # WrapX contract deployment tools
│   ├── index.ts          # Deployer tool exports
│   ├── schemas.ts        # Deployment schemas
│   ├── handlers.ts       # Deployment handlers
│   ├── descriptions.ts   # Deployment descriptions
│   └── abi.ts           # Deployer contract ABI
└── tokenURI/             # Token URI management tools
    ├── index.ts          # TokenURI tool exports
    ├── schemas.ts        # URI schemas
    ├── handlers.ts       # URI handlers
    ├── descriptions.ts   # URI descriptions
    └── abi.ts           # TokenURI contract ABI
```

**Note:** Token-related tools (ERC20 operations) are available in the existing `src/evm/modules/tokens/` directory and are not duplicated here.

## Available Tools

### WrapX Tools (7 tools)
- `WrapXActionProvider_wrap` - Wrap ETH or ERC20 tokens into NFTs
- `WrapXActionProvider_wrap_native` - Wrap native ETH specifically
- `WrapXActionProvider_wrap_token` - Wrap ERC20 tokens specifically
- `WrapXActionProvider_get_wrap_price` - Get wrap pricing with slippage
- `WrapXActionProvider_get_strategy` - Get contract strategy information
- `WrapXActionProvider_unwrap` - Unwrap NFTs back to original assets
- `WrapXActionProvider_get_unwrap_price` - Get unwrap pricing with slippage

### Deployment Tools (1 tool)
- `WrapXDeployerActionProvider_deploy_wrapx` - Deploy new WrapX contracts

### Token URI Tools (1 tool)
- `TokenURIActionProvider_set_token_uri_engine` - Set custom URI engines for NFTs

## Usage

### Advanced MCP Pattern
```typescript
import { advancedMcpTools, toolToHandler } from './index.js';

// Get all tools
const tools = advancedMcpTools;

// Get handler for a specific tool
const handler = toolToHandler['WrapXActionProvider_wrap'];
```

### Individual Tool Import
```typescript
import { wrapXTool, deployWrapXTool } from './index.js';

// Use specific tools directly
const wrapTool = wrapXTool;
const deployTool = deployWrapXTool;
```

## Migration Notes

This implementation was migrated from the `todo` directory and includes:

1. **Local Type Definitions**: Uses local types to avoid import resolution issues
2. **Simplified ABIs**: Contains only essential contract functions
3. **Inline Descriptions**: Tool descriptions are embedded rather than file-based
4. **Error Handling**: Comprehensive try-catch blocks with JSON responses
5. **Service Integration**: Handlers integrate with existing EVM services

## Key Features

- **Type Safety**: Full TypeScript support with Zod validation
- **Blockchain Integration**: Direct integration with viem for Ethereum interactions
- **User Confirmation**: All tools require explicit user confirmation before execution
- **Comprehensive Documentation**: Each tool includes detailed usage instructions
- **Security**: Input validation, address validation, and error sanitization

## Dependencies

- `viem` - Ethereum client library
- `zod` - Schema validation
- `@modelcontextprotocol/sdk` - MCP SDK types

## Security

All tools implement:
- Input validation with Zod schemas
- Address validation for Ethereum addresses
- User confirmation requirements for destructive operations
- Comprehensive error handling and sanitization 