# 🛑 Parameter Policy Update - AI Parameter Generation Prevention

## 📋 Overview

This update modifies all MCP tool descriptions to prevent AI from automatically generating parameters and enforce strict user input requirements.

## 🔧 Changes Made

### 1. WrapX Deployer Tools (`src/evm/tools/wrapXDeployer/descriptions.ts`)
- **deployWrapXToolDescription**: Complete rewrite with strict parameter collection policy
- **Eliminated**: AI parameter generation and suggestions without user input
- **Added**: Mandatory parameter validation and error handling requirements
- **Required Parameters**: Collection name, base premium, token address, max supply

### 2. WrapX Operation Tools (`src/evm/tools/wrapX/descriptions.ts`)
- **wrapToolDescription**: Enhanced with strict parameter collection
- **wrapNativeToolDescription**: Updated with user-only parameter policy
- **wrapTokenToolDescription**: Modified to prevent AI auto-generation
- **getWrapPriceToolDescription**: Simplified with clear user input requirements
- **getStrategyToolDescription**: Updated parameter collection workflow
- **unwrapToolDescription**: Enhanced with mandatory workflow steps
- **getUnwrapPriceToolDescription**: Clarified parameter requirements

### 3. Token URI Tools (`src/evm/tools/tokenURI/descriptions.ts`)
- **setTokenURIEngineToolDescription**: Complete rewrite with parameter validation
- **Removed**: AI suggestion mechanisms without user confirmation
- **Added**: Step-by-step parameter collection workflow

## 🚨 New Policy Rules

### **🛑 ABSOLUTE PROHIBITIONS**
1. **No AI Parameter Generation**: AI cannot create any parameter values automatically
2. **No Default Suggestions**: AI cannot suggest values without explicit user request
3. **No Placeholder Usage**: Tools cannot use `random_string` or similar dummy parameters
4. **No Proceeding Without Confirmation**: All operations require explicit user "confirm"

### **✅ MANDATORY REQUIREMENTS**
1. **Explicit Parameter Requests**: AI must ask for each required parameter individually
2. **Format Validation**: AI must validate each parameter format immediately
3. **Error Reporting**: Clear error messages for missing/invalid parameters
4. **Confirmation Workflow**: Present all parameters for user confirmation before execution

## 📝 Updated Workflow Pattern

```
1. COLLECT PARAMETERS ← AI asks for each required parameter
2. VALIDATE FORMAT    ← AI checks format and requirements
3. PRESENT SUMMARY    ← AI shows all collected parameters
4. WAIT FOR CONFIRM   ← User must type "confirm" explicitly  
5. EXECUTE OPERATION  ← Only then proceed with blockchain operation
```

## ⚠️ Error Handling Standards

### **Missing Parameters**
```
ERROR: Missing required parameter(s). Please provide [specific missing parameters].
```

### **Invalid Format**
```
ERROR: Invalid parameter format for [parameter name]. Required format: [specific format requirements].
```

### **Incomplete Information**
```
AI MUST stop and request complete information before proceeding.
```

## 🎯 Example Interactions

### **✅ CORRECT Interaction**
```
AI: "I need your WrapX contract address to proceed. What is your contract address?"
User: "0x123..."
AI: "✓ Contract address: 0x123...

What Token ID do you want to unwrap?"
User: "42"
AI: "✓ Token ID: 42

Please confirm:
• Contract: 0x123...
• Token ID: 42

Type 'confirm' to proceed."
User: "confirm"
AI: [Executes operation]
```

### **❌ INCORRECT Interaction (Now Prevented)**
```
AI: "I'll wrap some tokens for you using default parameters..."
AI: [Automatically generates parameters and executes]
```

## 🔍 Tools Affected

1. **WrapX Deployment**: `deployWrapX`
2. **Token Wrapping**: `wrap`, `wrapNative`, `wrapToken`
3. **Token Unwrapping**: `unwrap`
4. **Price Queries**: `getWrapPrice`, `getUnwrapPrice`
5. **Strategy Info**: `getStrategy`
6. **TokenURI Management**: `setTokenURIEngine`

## 🚀 Benefits

1. **Enhanced Security**: Prevents accidental parameter generation
2. **User Control**: Users have complete control over all operations
3. **Clear Communication**: Explicit parameter requests and confirmations
4. **Error Prevention**: Validation at each step prevents invalid operations
5. **Transparency**: All parameters are clearly presented before execution

## 🔄 Migration Path

- **Existing Tools**: All descriptions updated with new policy
- **Schema Validation**: Parameter schemas remain unchanged (still enforce proper validation)
- **Handler Functions**: No changes to core functionality, only interaction patterns
- **Backward Compatibility**: All tools function the same, just with enhanced user interaction

---

**🎯 Result**: AI assistants will now properly guide users through parameter collection instead of generating values automatically, ensuring secure and user-controlled blockchain operations. 