import { generateTool } from '../types.js';
import { wrapXHandler, wrapXNativeHandler, wrapXTokenHandler, getWrapPriceHandler, getStrategyHandler, unwrapHandler, getUnwrapPriceHandler, extractWrapXAddressHandler } from './handlers.js';
import { WrapXZodSchema, GetWrapPriceZodSchema, GetStrategyZodSchema, UnwrapZodSchema, GetUnwrapPriceZodSchema, ExtractWrapXAddressZodSchema } from './schemas.js';
import { 
  wrapToolDescription, 
  wrapNativeToolDescription, 
  wrapTokenToolDescription, 
  getWrapPriceToolDescription, 
  getStrategyToolDescription,
  unwrapToolDescription,
  getUnwrapPriceToolDescription,
  extractWrapXAddressToolDescription
} from './descriptions.js';

// Tool for wrapping assets (ETH or tokens) into a WrapX NFT
export const wrapXTool = generateTool({
  name: 'WrapXActionProvider_wrap',
  description: wrapToolDescription,
  inputSchema: WrapXZodSchema,
  toolHandler: wrapXHandler,
});

// Tool specifically for wrapping native ETH into a WrapX NFT
export const wrapXNativeTool = generateTool({
  name: 'WrapXActionProvider_wrap_native',
  description: wrapNativeToolDescription,
  inputSchema: WrapXZodSchema,
  toolHandler: wrapXNativeHandler,
});

// Tool specifically for wrapping ERC20 tokens into a WrapX NFT
export const wrapXTokenTool = generateTool({
  name: 'WrapXActionProvider_wrap_token',
  description: wrapTokenToolDescription,
  inputSchema: WrapXZodSchema,
  toolHandler: wrapXTokenHandler,
});

// Tool for getting recommended wrap price with slippage
export const getWrapPriceTool = generateTool({
  name: 'WrapXActionProvider_get_wrap_price',
  description: getWrapPriceToolDescription,
  inputSchema: GetWrapPriceZodSchema,
  toolHandler: getWrapPriceHandler,
});

// Tool for getting strategy information from a WrapX contract
export const getStrategyTool = generateTool({
  name: 'WrapXActionProvider_get_strategy',
  description: getStrategyToolDescription,
  inputSchema: GetStrategyZodSchema,
  toolHandler: getStrategyHandler,
});

// Tool for unwrapping a WrapX NFT back into its original assets
export const unwrapTool = generateTool({
  name: 'WrapXActionProvider_unwrap',
  description: unwrapToolDescription,
  inputSchema: UnwrapZodSchema,
  toolHandler: unwrapHandler,
});

// Tool for getting recommended unwrap price with slippage
export const getUnwrapPriceTool = generateTool({
  name: 'WrapXActionProvider_get_unwrap_price',
  description: getUnwrapPriceToolDescription,
  inputSchema: GetUnwrapPriceZodSchema,
  toolHandler: getUnwrapPriceHandler,
});

// Tool for extracting WrapX contract address from deployment transaction
export const extractWrapXAddressTool = generateTool({
  name: 'WrapXActionProvider_extract_contract_address',
  description: extractWrapXAddressToolDescription,
  inputSchema: ExtractWrapXAddressZodSchema,
  toolHandler: extractWrapXAddressHandler,
}); 