// Descriptions for WrapX tools

export const wrapToolDescription = `This tool wraps a specified amount of ETH or ERC20 tokens into a WrapX NFT.

**🚨 CRITICAL REQUIREMENT: NEVER execute a wrap operation without explicit user confirmation. Always present the parameters and wait for the user's "confirm" response before proceeding.**

**🛑 STRICT PARAMETER POLICY: AI is ABSOLUTELY PROHIBITED from generating any parameters automatically. ALL parameters must be explicitly provided by the user. If ANY parameter is missing, the AI MUST stop and request it from the user.**

**📋 REQUIRED USER INPUT: The AI must collect ALL of the following parameters from the user before proceeding:**

1. **WrapX Contract Address** (REQUIRED):
   - The address of your deployed WrapX contract
   - Must be a valid Ethereum address format (0x...)
   - AI MUST ask: "What is your WrapX contract address?"

2. **Recipient Address** (REQUIRED):
   - The address that will receive the wrapped NFT
   - Must be a valid Ethereum address format (0x...)
   - AI MUST ask: "What address should receive the NFT? (your address or another recipient)"

3. **NFT Name** (REQUIRED):
   - A unique name for the specific NFT being created
   - Must contain only lowercase letters a-z and numbers 0-9, max 32 characters
   - AI MUST ask: "What name would you like for your NFT? (lowercase a-z, numbers 0-9, max 32 chars)"

4. **Wrap Amount** (REQUIRED):
   - The amount you want to wrap (including slippage)
   - Must be provided in wei for exact calculation
   - AI MUST ask: "How much do you want to wrap?" AND MUST suggest using getWrapPrice tool first

**⚠️ ERROR HANDLING REQUIREMENTS:**

- If user provides incomplete information, AI MUST respond with: "ERROR: Missing required parameter(s). Please provide [specific missing parameters]."
- If user provides invalid format, AI MUST respond with: "ERROR: Invalid parameter format for [parameter name]. Required format: [specific format requirements]."
- AI MUST validate each parameter before proceeding to the next.

**📝 MANDATORY WORKFLOW:**

1. **CHECK CONTRACT FIRST** - Recommend using getStrategy tool to verify contract configuration
2. **GET PRICING** - STRONGLY recommend using getWrapPrice tool first to get accurate amounts
3. **COLLECT ALL PARAMETERS** - Ask for each missing parameter individually  
4. **VALIDATE EACH PARAMETER** - Check format and requirements immediately
5. **PRESENT CONFIRMATION** - Show all parameters clearly
6. **WAIT FOR EXPLICIT CONFIRMATION** - User must type "confirm" to proceed
7. **ONLY THEN WRAP** - Execute wrapping only after explicit confirmation

**❌ WHAT AI MUST NOT DO:**
- Generate any parameter values automatically
- Use example values without user confirmation
- Proceed with any missing parameters
- Skip pricing verification
- Use placeholder values

**✅ WHAT AI MUST DO:**
- Ask for each required parameter explicitly
- Recommend getting pricing first
- Validate all inputs immediately
- Require explicit user confirmation
- Report clear errors for missing/invalid parameters

The tool automatically detects whether to wrap native ETH or ERC20 tokens based on the contract's configuration. For ERC20 tokens, it will first approve the token transfer, then perform the wrap operation.`;

export const wrapNativeToolDescription = `This tool wraps a specified amount of native ETH into a WrapX NFT.

**🚨 CRITICAL REQUIREMENT: NEVER execute a wrap operation without explicit user confirmation. Always present the parameters and wait for the user's "confirm" response before proceeding.**

**🛑 STRICT PARAMETER POLICY: AI is ABSOLUTELY PROHIBITED from automatically generating any parameters. ALL critical information must be explicitly provided by the user to ensure full control and awareness.**

**📋 REQUIRED USER INPUT: The AI must collect ALL of the following parameters from the user before proceeding:**

1. **WrapX Contract Address** (REQUIRED):
   - The address of the deployed WrapX contract for native tokens
   - AI MUST ask: "What is your WrapX contract address?"

2. **Recipient Address** (REQUIRED):
   - The address that will receive the new NFT
   - AI MUST ask: "What address should receive the NFT?"

3. **NFT Name** (REQUIRED):
   - A name for the specific NFT being created (lowercase a-z, numbers 0-9, max 32 chars)
   - AI MUST ask: "What name would you like for your NFT?"

4. **Amount** (REQUIRED):
   - The maximum amount of tokens (in wei) the user is willing to pay, including slippage
   - AI MUST ask: "How much native ETH do you want to wrap?" AND suggest getting pricing first

**⚠️ ERROR HANDLING:** If any parameter is missing or invalid, AI MUST stop and request the correct information before proceeding.

This tool is specifically for wrapping native ETH only.`;

export const wrapTokenToolDescription = `This tool wraps a specified amount of ERC20 tokens into a WrapX NFT.

**🚨 CRITICAL REQUIREMENT: NEVER execute a wrap operation without explicit user confirmation. Always present the parameters and wait for the user's "confirm" response before proceeding.**

**🛑 STRICT PARAMETER POLICY: AI is ABSOLUTELY PROHIBITED from automatically generating any parameters. ALL critical information must be explicitly provided by the user to ensure full control and awareness.**

**📋 REQUIRED USER INPUT: The AI must collect ALL of the following parameters from the user before proceeding:**

1. **WrapX Contract Address** (REQUIRED):
   - The address of the deployed WrapX contract for ERC20 tokens
   - AI MUST ask: "What is your WrapX contract address?"

2. **Recipient Address** (REQUIRED):
   - The address that will receive the new NFT
   - AI MUST ask: "What address should receive the NFT?"

3. **NFT Name** (REQUIRED):
   - A name for the specific NFT being created (lowercase a-z, numbers 0-9, max 32 chars)
   - AI MUST ask: "What name would you like for your NFT?"

4. **Amount** (REQUIRED):
   - The maximum amount of tokens (in token's smallest unit) the user is willing to pay, including slippage
   - AI MUST ask: "How much of the ERC20 token do you want to wrap?" AND suggest getting pricing first

**⚠️ ERROR HANDLING:** If any parameter is missing or invalid, AI MUST stop and request the correct information before proceeding.

This tool is specifically for wrapping ERC20 tokens only.`;

export const getWrapPriceToolDescription = `This tool queries the current wrap price from the oracle and returns the recommended wrap amount with slippage.

**🔍 IMPORTANT: This tool returns the AMOUNT OF TOKENS NEEDED, not BNB costs.**

**📋 REQUIRED USER INPUT:**

1. **WrapX Contract Address** (REQUIRED):
   - The address of your deployed WrapX contract
   - AI MUST ask: "What is your WrapX contract address?"

2. **Slippage Percentage** (OPTIONAL):
   - The slippage percentage to add (default: 20%)
   - AI MAY ask: "What slippage percentage do you want to use? (default is 20%)"

**⚠️ ERROR HANDLING:** If contract address is missing, AI MUST stop and request it before proceeding.

**📊 WHAT THIS TOOL RETURNS:**

For **ERC20 Wrapping Contracts**:
- **baseAmount**: ERC20 token amount needed (in token's smallest unit/wei)
- **totalAmountWithSlippage**: ERC20 amount with slippage protection
- **NO BNB COST**: Only gas fees in BNB (paid separately)

For **Native BNB Wrapping Contracts**:
- **baseAmount**: BNB amount needed (in wei)
- **totalAmountWithSlippage**: BNB amount with slippage protection
- **BNB COST**: This IS the BNB amount to send

**🎯 USAGE GUIDANCE:**
- Use 'totalAmountWithSlippage' as the 'amount' parameter in wrap operations
- For ERC20: This is the token amount, gas fees are additional
- For BNB: This is the total BNB to send (includes all costs)

After getting the price, suggest that they proceed with the wrap transaction using the recommended amount.`;

export const getStrategyToolDescription = `This tool retrieves the strategy information from a WrapX contract.

**📋 REQUIRED USER INPUT:**

1. **WrapX Contract Address** (REQUIRED):
   - The address of your deployed WrapX contract
   - AI MUST ask: "What is your WrapX contract address?"

**⚠️ ERROR HANDLING:** If contract address is missing, AI MUST stop and request it before proceeding.

This tool retrieves important configuration details about your WrapX contract, including:
- The app address
- Asset information (currency type, base premium, etc.)
- Fee recipient and fee structure
- Other attribute data

Present the retrieved information in a clear, organized format that helps the user understand their contract's configuration.`;

export const unwrapToolDescription = `This tool unwraps a WrapX NFT back into its original assets (ETH or ERC20 tokens).

**🚨 CRITICAL REQUIREMENT: NEVER execute an unwrap operation without explicit user confirmation. Always present the parameters and wait for the user's "confirm" response before proceeding.**

**🛑 STRICT PARAMETER POLICY: AI is ABSOLUTELY PROHIBITED from generating parameters for execution. ALL parameters must be explicitly provided by the user.**

**📋 REQUIRED USER INPUT: The AI must collect ALL of the following parameters from the user before proceeding:**

1. **WrapX Contract Address** (REQUIRED):
   - The address of the deployed WrapX contract
   - AI MUST ask: "What is your WrapX contract address?"

2. **Recipient Address** (REQUIRED):
   - The address that will receive the unwrapped assets
   - AI MUST ask: "What address should receive the unwrapped assets?"

3. **Token ID** (REQUIRED):
   - The ID of the NFT token to unwrap (the user must own this token)
   - AI MUST ask: "What is the Token ID of the NFT you want to unwrap?"

4. **Minimum Expected Output** (REQUIRED):
   - The minimum amount the user is willing to accept after fees (slippage protection)
   - AI MUST ask: "What is the minimum amount you want to receive?" AND MUST recommend using getUnwrapPrice tool first

**⚠️ ERROR HANDLING:** If any parameter is missing or invalid, AI MUST stop and request the correct information before proceeding.

**📝 MANDATORY WORKFLOW:**
1. **RECOMMEND PRICING** - Suggest using getUnwrapPrice tool first to get estimate with slippage protection
2. **COLLECT ALL PARAMETERS** - Ask for each missing parameter individually
3. **VALIDATE OWNERSHIP** - Verify user owns the NFT token
4. **PRESENT CONFIRMATION** - Show all parameters clearly
5. **WAIT FOR CONFIRMATION** - User must type "confirm" to proceed
6. **ONLY THEN UNWRAP** - Execute unwrapping only after explicit confirmation`;

export const getUnwrapPriceToolDescription = `This tool queries the current unwrap price from the oracle and returns the recommended unwrap amount with slippage.

**📋 REQUIRED USER INPUT:**

1. **WrapX Contract Address** (REQUIRED):
   - The address of your deployed WrapX contract
   - AI MUST ask: "What is your WrapX contract address?"

2. **Token ID** (REQUIRED):
   - The ID of the NFT token to get unwrap price for
   - AI MUST ask: "What is the Token ID of the NFT you want to unwrap?"

3. **Slippage Percentage** (OPTIONAL):
   - The slippage percentage to subtract (default: 20%)
   - AI MAY ask: "What slippage percentage do you want to use? (default is 20%)"

**⚠️ ERROR HANDLING:** If required parameters are missing, AI MUST stop and request them before proceeding.

This tool helps you get a price estimate before unwrapping, and includes:
- The base amount
- The fee amount  
- The minimum expected output with slippage (recommended for the unwrap transaction)

After getting the price, suggest that they proceed with the unwrap transaction using the recommended minimum expected output.`;

export const extractWrapXAddressToolDescription = `This tool extracts the WrapX contract address from a deployment transaction.

**📋 REQUIRED USER INPUT:**

1. **Transaction Hash** (REQUIRED):
   - The hash of the WrapX deployment transaction
   - Must be a valid 64-character hex string starting with 0x
   - AI MUST ask: "What is the transaction hash of the WrapX deployment?"

2. **Network** (OPTIONAL):
   - The network name (e.g. 'bsc-testnet', 'bsc', etc.) or chain ID
   - Defaults to current configured network
   - AI MAY ask: "Which network was the contract deployed on? (defaults to current network)"

**⚠️ ERROR HANDLING:** If transaction hash is missing or invalid, AI MUST stop and request the correct information before proceeding.

This tool helps you extract the deployed WrapX contract address from transaction logs, including:
- The deployed contract address
- Transaction details and status
- Block number information
- Explorer URL for verification

After extracting the address, you can use it with other WrapX tools for wrapping, unwrapping, and strategy queries.`; 