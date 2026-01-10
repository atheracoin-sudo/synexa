/**
 * OpenAI Diagnostics Utility
 * 
 * Provides comprehensive diagnostics and troubleshooting helpers for OpenAI errors.
 */

import { OPENAI_CONFIG } from '../config/openaiConfig';

/**
 * Mask sensitive information for logging
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 10) {
    return '[INVALID]';
  }
  const prefix = apiKey.substring(0, 7);
  const suffix = apiKey.substring(apiKey.length - 4);
  return `${prefix}...${suffix}`;
}

/**
 * Mask project ID for logging (show first 10 and last 4 chars)
 */
export function maskProjectId(projectId: string | null | undefined): string {
  if (!projectId) {
    return '[NOT SET]';
  }
  if (projectId.length < 15) {
    return projectId; // Short enough to show
  }
  const prefix = projectId.substring(0, 10);
  const suffix = projectId.substring(projectId.length - 4);
  return `${prefix}...${suffix}`;
}

/**
 * Get runtime configuration summary for logging
 */
export function getRuntimeConfigSummary(): {
  apiKeyMasked: string;
  projectIdMasked: string;
  defaultModel: string;
  apiEndpoint: string;
  envVarsUsed: {
    OPENAI_API_KEY: string;
    OPENAI_PROJECT_ID: string;
    OPENAI_MODEL_CHAT: string;
  };
} {
  return {
    apiKeyMasked: maskApiKey(OPENAI_CONFIG.API_KEY),
    projectIdMasked: maskProjectId(OPENAI_CONFIG.PROJECT_ID),
    defaultModel: OPENAI_CONFIG.DEFAULT_CHAT_MODEL,
    apiEndpoint: OPENAI_CONFIG.API_ENDPOINT,
    envVarsUsed: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? maskApiKey(process.env.OPENAI_API_KEY) : '[NOT SET]',
      OPENAI_PROJECT_ID: process.env.OPENAI_PROJECT_ID ? maskProjectId(process.env.OPENAI_PROJECT_ID) : '[NOT SET]',
      OPENAI_MODEL_CHAT: process.env.OPENAI_MODEL_CHAT || '[NOT SET - using default]',
    },
  };
}

/**
 * Classify OpenAI error code into categories
 */
export type OpenAIErrorCategory = 
  | 'AUTH_ERROR'
  | 'ACCOUNT_ERROR'
  | 'MODEL_ERROR'
  | 'LIMIT_ERROR'
  | 'CONFIG_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

export interface ErrorDiagnostic {
  category: OpenAIErrorCategory;
  errorCode: string;
  errorType: string;
  message: string;
  suggestedFixes: string[];
  severity: 'critical' | 'warning' | 'info';
}

/**
 * Generate diagnostic information for OpenAI errors
 */
export function diagnoseOpenAIError(
  errorCode: string | undefined,
  errorType: string | undefined,
  errorMessage: string | undefined,
  status: number
): ErrorDiagnostic {
  const code = errorCode || 'unknown';
  const type = errorType || 'unknown';
  const message = errorMessage || 'No error message provided';
  
  // Check for account/billing errors first
  if (
    code === 'account_deactivated' ||
    code === 'billing_not_active' ||
    code === 'access_terminated' ||
    message.toLowerCase().includes('account') && message.toLowerCase().includes('deactivated') ||
    message.toLowerCase().includes('billing') ||
    message.toLowerCase().includes('payment') ||
    message.toLowerCase().includes('subscription')
  ) {
    return {
      category: 'ACCOUNT_ERROR',
      errorCode: code,
      errorType: type,
      message,
      severity: 'critical',
      suggestedFixes: [
        'Your OpenAI account has been deactivated or has billing issues.',
        'Check your account status at https://platform.openai.com/account',
        'Verify your payment method and billing information.',
        'Ensure your subscription is active and payment method is valid.',
      ],
    };
  }
  
  // Check for model/access errors (not account issues)
  if (
    code === 'model_not_found' ||
    code === 'permission_denied' ||
    (message.toLowerCase().includes('model') && (status === 401 || status === 403 || status === 404)) ||
    (message.toLowerCase().includes('access') && !message.toLowerCase().includes('account'))
  ) {
    return {
      category: 'MODEL_ERROR',
      errorCode: code,
      errorType: type,
      message,
      severity: 'critical',
      suggestedFixes: [
        'Model access denied or model not found.',
        `Requested Model: ${OPENAI_CONFIG.DEFAULT_CHAT_MODEL}`,
        'Check if your API key has access to the requested model.',
        'Verify available models at https://platform.openai.com/account/usage',
        'To fix: Update OPENAI_MODEL_CHAT in .env to a model you have access to.',
      ],
    };
  }
  
  // Auth/Config errors (real auth issues)
  if (status === 401 || code === 'invalid_api_key' || code === 'mismatched_project' || code === 'project_not_found') {
    if (code === 'mismatched_project') {
      return {
        category: 'AUTH_ERROR',
        errorCode: code,
        errorType: type,
        message,
        severity: 'critical',
        suggestedFixes: [
          'The Project ID does not match the API key.',
          `Current Project ID: ${maskProjectId(OPENAI_CONFIG.PROJECT_ID)}`,
          'Check if the API key belongs to a different project.',
          'To fix: Update OPENAI_PROJECT_ID in .env to match your API key\'s project.',
          'Or remove OPENAI_PROJECT_ID if you want to use the API key\'s default project.',
        ],
      };
    }
    
    if (code === 'invalid_api_key') {
      return {
        category: 'AUTH_ERROR',
        errorCode: code,
        errorType: type,
        message,
        severity: 'critical',
        suggestedFixes: [
          'The API key is invalid, expired, or revoked.',
          `Current API Key: ${maskApiKey(OPENAI_CONFIG.API_KEY)}`,
          'Check if the API key is correct in .env file.',
          'Verify the API key at https://platform.openai.com/api-keys',
          'To fix: Update OPENAI_API_KEY in .env with a valid key.',
        ],
      };
    }
    
    if (code === 'project_not_found') {
      return {
        category: 'CONFIG_ERROR',
        errorCode: code,
        errorType: type,
        message,
        severity: 'critical',
        suggestedFixes: [
          'The Project ID does not exist or has been deleted.',
          `Current Project ID: ${maskProjectId(OPENAI_CONFIG.PROJECT_ID)}`,
          'Check if the Project ID is correct in .env file.',
          'Verify the Project ID at https://platform.openai.com/settings/organization',
          'To fix: Update OPENAI_PROJECT_ID in .env with a valid project ID, or remove it.',
        ],
      };
    }
    
    // Generic 401
    return {
      category: 'AUTH_ERROR',
      errorCode: code,
      errorType: type,
      message,
      severity: 'critical',
      suggestedFixes: [
        'Authentication failed. This could be due to:',
        `- API Key: ${maskApiKey(OPENAI_CONFIG.API_KEY)}`,
        `- Project ID: ${maskProjectId(OPENAI_CONFIG.PROJECT_ID)}`,
        'Check OPENAI_API_KEY and OPENAI_PROJECT_ID in .env file.',
        'Verify credentials at https://platform.openai.com/account/api-keys',
      ],
    };
  }
  
  // Model/access errors
  if (status === 403 || code === 'model_not_found' || code === 'permission_denied') {
    return {
      category: 'MODEL_ERROR',
      errorCode: code,
      errorType: type,
      message,
      severity: 'critical',
      suggestedFixes: [
        'Model access denied or model not found.',
        `Default Model: ${OPENAI_CONFIG.DEFAULT_CHAT_MODEL}`,
        'Check if your API key has access to the requested model.',
        'Verify available models at https://platform.openai.com/account/usage',
        'To fix: Update OPENAI_MODEL_CHAT in .env to a model you have access to.',
      ],
    };
  }
  
  // Limit errors
  if (status === 429 || code === 'rate_limit_exceeded' || code === 'insufficient_quota') {
    return {
      category: 'LIMIT_ERROR',
      errorCode: code,
      errorType: type,
      message,
      severity: 'warning',
      suggestedFixes: [
        'Rate limit or quota exceeded.',
        'Wait a few minutes and try again.',
        'Check your usage and billing at https://platform.openai.com/account/usage',
        'Consider upgrading your plan if limits are too restrictive.',
      ],
    };
  }
  
  // Server errors
  if (status >= 500) {
    return {
      category: 'SERVER_ERROR',
      errorCode: code,
      errorType: type,
      message,
      severity: 'warning',
      suggestedFixes: [
        'OpenAI service is experiencing issues.',
        'This is usually temporary.',
        'Check OpenAI status at https://status.openai.com',
        'Wait a few minutes and try again.',
      ],
    };
  }
  
  // Unknown
  return {
    category: 'UNKNOWN_ERROR',
    errorCode: code,
    errorType: type,
    message,
    severity: 'warning',
    suggestedFixes: [
      'An unknown error occurred.',
      `Status: ${status}`,
      `Error Code: ${code}`,
      `Error Type: ${type}`,
      'Check OpenAI documentation or contact support.',
    ],
  };
}

/**
 * Format diagnostic report for logging
 */
export function formatDiagnosticReport(diagnostic: ErrorDiagnostic): string {
  const lines = [
    '\n' + '='.repeat(60),
    `📊 OpenAI Error Diagnostic Report`,
    '='.repeat(60),
    `Category: ${diagnostic.category}`,
    `Severity: ${diagnostic.severity.toUpperCase()}`,
    `Error Code: ${diagnostic.errorCode}`,
    `Error Type: ${diagnostic.errorType}`,
    `Message: ${diagnostic.message}`,
    '',
    '🔧 Suggested Fixes:',
    ...diagnostic.suggestedFixes.map((fix, idx) => `   ${idx + 1}. ${fix}`),
    '='.repeat(60) + '\n',
  ];
  
  return lines.join('\n');
}







