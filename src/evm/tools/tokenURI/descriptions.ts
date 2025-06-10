// Descriptions for TokenURI tools

export const setTokenURIEngineToolDescription = `This tool allows setting a token URI engine for a specific NFT in a WrapX contract.

**🚨 CRITICAL REQUIREMENT: NEVER set a token URI engine without explicit user confirmation. Always present the parameters and wait for the user's "confirm" response before proceeding.**

**🛑 STRICT PARAMETER POLICY: AI is ABSOLUTELY PROHIBITED from generating any parameters automatically. ALL parameters must be explicitly provided by the user. If ANY parameter is missing, the AI MUST stop and request it from the user.**

**📋 REQUIRED USER INPUT: The AI must collect ALL of the following parameters from the user before proceeding:**

1. **WrapX Contract Address** (REQUIRED):
   - The address of your deployed WrapX contract
   - Must be a valid Ethereum address format (0x...)
   - AI MUST ask: "What is your WrapX contract address?"

2. **Token ID** (REQUIRED):
   - The ID of the NFT token to set the URI engine for
   - Must be a valid positive integer
   - AI MUST ask: "What is the Token ID of the NFT you want to set the URI engine for?"

3. **Token URI Engine Address** (REQUIRED):
   - The address of the token URI engine to set
   - Must be a valid Ethereum address format (0x...)
   - AI MUST ask: "What is the token URI engine address you want to set?"

**⚠️ ERROR HANDLING REQUIREMENTS:**

- If user provides incomplete information, AI MUST respond with: "ERROR: Missing required parameter(s). Please provide [specific missing parameters]."
- If user provides invalid format, AI MUST respond with: "ERROR: Invalid parameter format for [parameter name]. Required format: [specific format requirements]."
- AI MUST validate each parameter before proceeding to the next.

**📝 WORKFLOW REQUIREMENTS:**

1. **COLLECT ALL PARAMETERS FIRST** - Ask for each missing parameter individually
2. **VALIDATE EACH PARAMETER** - Check format and requirements immediately
3. **PRESENT CONFIRMATION** - Show all parameters in a clear format
4. **WAIT FOR EXPLICIT CONFIRMATION** - User must type "confirm" to proceed
5. **ONLY THEN EXECUTE** - Set URI engine only after explicit confirmation

**❌ WHAT AI MUST NOT DO:**
- Generate any parameter values automatically
- Suggest default values without user choice
- Proceed with operation if any parameter is missing
- Use placeholder values like "random_string"
- Skip parameter validation

**✅ WHAT AI MUST DO:**
- Ask for each required parameter explicitly
- Validate parameter format immediately
- Require explicit user confirmation
- Report clear errors for missing/invalid parameters

**Example Correct Interaction:**

AI: "I need 3 parameters to set the token URI engine:
1. WrapX contract address (0x...)
2. Token ID (number)
3. Token URI engine address (0x...)

What is your WrapX contract address?"

User: "0x123..."
AI: "✓ WrapX Contract: 0x123...

What is the Token ID of the NFT you want to set the URI engine for?"

User: "42"
AI: "✓ Token ID: 42

What is the token URI engine address you want to set?"

User: "0x456..."
AI: "✓ Token URI Engine: 0x456...

Please confirm these parameters:
• WrapX Contract Address: 0x123...
• NFT Token ID: 42
• Token URI Engine Address: 0x456...

Type 'confirm' to set the token URI engine."

This operation will update the URI engine for the specified NFT token in your WrapX contract.`; 