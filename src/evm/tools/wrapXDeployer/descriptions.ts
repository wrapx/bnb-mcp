// Descriptions for WrapX Deployer tools

export const deployWrapXToolDescription = `🔗 **PREREQUISITE: CHAIN CONTEXT REQUIRED** - Before proceeding, MUST call get_current_chain_id() to check the active blockchain network.

This tool allows deploying a WrapX contract that can wrap ETH or ERC20 tokens into NFTs.

**🚨 CRITICAL REQUIREMENT: NEVER deploy a WrapX contract without explicit user confirmation. Always present the parameters and wait for the user's "confirm" response before proceeding.**

**🛑 STRICT PARAMETER POLICY: AI is ABSOLUTELY PROHIBITED from generating any parameters automatically. ALL parameters must be explicitly provided by the user. If ANY parameter is missing, the AI MUST stop and request it from the user.**

**✅ AUTOMATIC CONTRACT ADDRESS EXTRACTION**

The tool now automatically extracts and returns the deployed WrapX contract address!

After successful deployment, the tool will:
- Automatically extract the real WrapX contract address from transaction logs
- Return the usable contract address directly in the response
- Provide clear next steps for using the deployed contract

**🎯 SIMPLIFIED POST-DEPLOYMENT WORKFLOW**

The deployment will return:
- wrapXContractAddress: The actual deployed contract address you can use for operations
- txHash: Transaction hash for verification
- explorerUrl: Link to view the transaction on blockchain explorer
- nextSteps: Clear instructions for what to do next

**📋 REQUIRED USER INPUT: The AI must collect ALL of the following parameters from the user before proceeding:**

1. **Collection Name** (REQUIRED):
   - Must contain only lowercase letters a-z and numbers 0-9
   - Maximum 32 characters
   - Examples: "mytoken", "mycoin123", "wrapper01"
   - AI MUST ask: "What collection name would you like to use?"

2. **Base Premium** (REQUIRED):
   - Fee amount in BNB for wrap/unwrap operations
   - Examples: "0.001" for low fees, "0.01" for medium, "0.1" for higher
   - AI MUST ask: "What base premium (in BNB) would you like to set for operations?"

3. **Token Address** (REQUIRED):
   - Use "0x0000000000000000000000000000000000000000" for BNB
   - Or provide a specific ERC20 token contract address
   - AI MUST ask: "Do you want to wrap BNB or a specific ERC20 token? (Provide token address or say 'BNB')"

4. **Maximum Supply** (REQUIRED):
   - Number limit for NFTs that can be minted
   - Use "0" for unlimited supply
   - AI MUST ask: "What maximum supply do you want? (Enter a number or '0' for unlimited)"

**⚠️ ERROR HANDLING REQUIREMENTS:**

- If user provides incomplete information, AI MUST respond with: "ERROR: Missing required parameter(s). Please provide [specific missing parameters]."
- If user provides invalid format, AI MUST respond with: "ERROR: Invalid parameter format for [parameter name]. Required format: [specific format requirements]."
- AI MUST validate each parameter before proceeding to the next.

**📝 WORKFLOW REQUIREMENTS:**

1. **COLLECT ALL PARAMETERS FIRST** - Ask for each missing parameter individually
2. **VALIDATE EACH PARAMETER** - Check format and requirements immediately
3. **PRESENT CONFIRMATION** - Show all parameters in a clear format
4. **WAIT FOR EXPLICIT CONFIRMATION** - User must type "confirm" to proceed
5. **DEPLOY** - Execute deployment only after explicit confirmation
6. **PRESENT CLEAR RESULTS** - Show the deployed contract address and next steps

**❌ WHAT AI MUST NOT DO:**
- Generate any parameter values automatically
- Suggest default values without user choice
- Proceed with deployment if any parameter is missing
- Use placeholder values like "random_string"
- Skip parameter validation

**✅ WHAT AI MUST DO:**
- Ask for each required parameter explicitly
- Validate parameter format immediately
- Require explicit user confirmation
- Report clear errors for missing/invalid parameters
- Present the deployed contract address clearly when available

**🎯 EXPECTED RESULT:**

After successful deployment, you will receive:
- The deployed WrapX contract address (ready to use for wrap/unwrap operations)
- Transaction hash for verification
- Blockchain explorer link
- Clear next steps for using your contract

The deployer will receive an NFT representing ownership of the deployed contract.`; 