import { generateTool } from '../types.js';
import { deployWrapXHandler } from './handlers.js';
import { DeployWrapXZodSchema } from './schemas.js';
import { deployWrapXToolDescription } from './descriptions.js';

// Tool for deploying WrapX in a single step
export const deployWrapXTool = generateTool({
  name: 'WrapXDeployerActionProvider_deploy_wrapx',
  description: deployWrapXToolDescription,
  inputSchema: DeployWrapXZodSchema,
  toolHandler: deployWrapXHandler,
}); 