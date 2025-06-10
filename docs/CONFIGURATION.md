# Configuration Guide

This document explains how to configure the BNBChain MCP server using configuration files and environment variables.

## Configuration Priority

The configuration system follows this priority order (highest to lowest):

1. **Environment Variables** - Highest priority
2. **Configuration Files** - Medium priority  
3. **Default Values** - Lowest priority

## Configuration Files

The system will automatically look for configuration files in these locations:

1. `config.json` (project root)

## Default Chain Configuration

The BNBChain MCP now supports configurable default chains instead of hardcoded values. This allows you to specify which blockchain network should be used by default for transactions.

### Supported Chains

- **BSC Mainnet** (Chain ID: 56) - Default
- **BSC Testnet** (Chain ID: 97)
- **opBNB Mainnet** (Chain ID: 204)
- **opBNB Testnet** (Chain ID: 5611)

### Configuration Methods

1. **Environment Variable** (Highest Priority):
   ```bash
   export DEFAULT_CHAIN_ID=56  # BSC Mainnet
   export DEFAULT_CHAIN_NAME="BNB Smart Chain"
   ```

2. **Configuration File**:
   ```json
   {
     "networks": {
       "default": {
         "chainId": 56,
         "name": "BNB Smart Chain"
       }
     }
   }
   ```

3. **Default Fallback**: BSC Mainnet (Chain ID: 56)

### Chain Selection Examples

```bash
# Use BSC Mainnet (default)
export DEFAULT_CHAIN_ID=56

# Use BSC Testnet
export DEFAULT_CHAIN_ID=97

# Use opBNB Mainnet
export DEFAULT_CHAIN_ID=204

# Use opBNB Testnet
export DEFAULT_CHAIN_ID=5611
```

### Creating a Configuration File

1. Copy the example configuration:
   ```bash
   cp config.example.json config.json
   ```

2. Edit `config.json` with your settings:
   ```json
   {
     "networks": {
       "default": {
         "chainId": 56,
         "name": "BNB Smart Chain"
       }
     },
     "contracts": {
       "wrapXDeployer": "0x1234567890123456789012345678901234567890"
     },
     "security": {
       "maxGasPrice": "20000000000",
       "gasLimit": "500000"
     },
     "server": {
       "port": 3001,
       "logLevel": "INFO"
     },
     "api": {
       "anthropicApiKey": "your-anthropic-api-key",
       "openaiApiKey": "your-openai-api-key",
       "deepseekApiKey": "your-deepseek-api-key"
     }
   }
   ```

   **Note**: Detailed network configurations (RPC URLs, etc.) are managed in `src/evm/chains.ts`. The config file only needs to specify the default chain to use.

## Environment Variables

You can override any configuration value using environment variables:

### Network Configuration
- `DEFAULT_CHAIN_ID` - Default chain ID for transactions (default: 56 for BSC)
- `DEFAULT_CHAIN_NAME` - Default chain display name

**Note**: RPC URLs and other network details are managed in `src/evm/chains.ts` and don't need environment variables.

### Contract Addresses
- `WRAPX_DEPLOYER_ADDRESS` - WrapX deployer contract address

### Security Settings
- `PRIVATE_KEY` - **REQUIRED** Private key for wallet operations (MUST be set via environment variable only)
- `MAX_GAS_PRICE` - Maximum gas price in wei
- `GAS_LIMIT` - Gas limit for transactions

**⚠️ SECURITY WARNING**: Private keys MUST ONLY be configured via environment variables. Never store private keys in configuration files!

### Server Settings
- `PORT` - Server port (default: 3001)
- `LOG_LEVEL` - Log level (DEBUG, INFO, WARN, ERROR)

### API Keys
- `ANTHROPIC_API_KEY` - Anthropic API key
- `OPENAI_API_KEY` - OpenAI API key
- `DEEPSEEK_API_KEY` - DeepSeek API key

## Configuration Schema

The configuration is validated using Zod schemas. Here's the complete structure:

```typescript
{
  networks?: {
    default?: {
      chainId: number,
      name: string
    }
  },
  contracts?: {
    wrapXDeployer?: string
  },
  security?: {
    // privateKey is only supported via PRIVATE_KEY environment variable
    maxGasPrice?: string,
    gasLimit?: string
  },
  server?: {
    port: number (default: 3001),
    logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR" (default: "INFO")
  },
  api?: {
    anthropicApiKey?: string,
    openaiApiKey?: string,
    deepseekApiKey?: string
  }
}
```

## Usage Examples

### Using Configuration in Code

```typescript
import { getConfig, getNestedConfigValue, hasConfigValue } from './config/index.js';

// Get the entire configuration
const config = getConfig();

// Get a specific nested value
const wrapXAddress = getNestedConfigValue('contracts.wrapXDeployer');

// Check if a value exists
if (hasConfigValue('security.privateKey')) {
  // Private key is configured
}

// Get a top-level configuration section
const networks = getConfigValue('networks');
```

### Environment Variable Examples

```bash
# Set via environment variables
export WRAPX_DEPLOYER_ADDRESS="0x1234567890123456789012345678901234567890"
export PRIVATE_KEY="0xabcdef..."
export LOG_LEVEL="DEBUG"
export PORT="3002"

# Run the server
npm start
```

### Configuration File Example

```json
{
  "contracts": {
    "wrapXDeployer": "0x1234567890123456789012345678901234567890"
  },
  "security": {
    "privateKey": "0xabcdef...",
    "maxGasPrice": "20000000000"
  },
  "server": {
    "port": 3002,
    "logLevel": "DEBUG"
  }
}
```

## Security Considerations

1. **Private Key Security** - Private keys MUST ONLY be set via `PRIVATE_KEY` environment variable, never in config files
2. **Never commit sensitive data** - Add `config.json` to `.gitignore`
3. **Use environment variables for secrets** - More secure than config files
4. **Validate configuration** - The system automatically validates all configuration
5. **Private key protection** - Private keys are never logged or displayed in console output

## Troubleshooting

### Configuration Not Loading
- Check file paths and permissions
- Verify JSON syntax in configuration files
- Check console for validation errors

### Environment Variables Not Working
- Ensure variables are exported in your shell
- Check variable names match exactly
- Restart the server after setting variables

### Validation Errors
- Check the configuration schema above
- Ensure all required fields are present
- Verify data types (strings, numbers, URLs)

## Migration from Environment Variables

If you're currently using only environment variables, you can:

1. Create a `config.json` file with your settings
2. Remove environment variables (optional)
3. The system will automatically use the config file as fallback

The configuration system is backward compatible - existing environment variables will continue to work. 