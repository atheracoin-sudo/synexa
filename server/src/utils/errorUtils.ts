/**
 * Error Utilities
 * 
 * Provides error classification and structured error responses for OpenAI errors.
 */

import { randomBytes } from 'crypto';

export type OpenAIErrorType =
  | 'OPENAI_AUTH'           // 401 - Authentication errors (invalid_api_key, mismatched_project)
  | 'OPENAI_ACCOUNT_ERROR'  // 401/403 - Account/billing errors (account_deactivated, billing issues)
  | 'OPENAI_MODEL_ERROR'    // 403/404 - Model access/permission errors
  | 'OPENAI_QUOTA'          // 429 - Insufficient quota
  | 'OPENAI_RATE_LIMIT'     // 429 - Rate limit exceeded
  | 'OPENAI_BAD_REQUEST'    // 400 - Invalid request
  | 'OPENAI_SERVER'         // 5xx - Server errors
  | 'UPSTREAM_TIMEOUT'      // Timeout errors
  | 'UPSTREAM_UNKNOWN';     // Unknown errors

export interface StructuredError {
  error: {
    type: OpenAIErrorType;
    message: string;
    requestId: string;
    status?: number;
    errorCode?: string; // OpenAI error code (e.g., mismatched_project, invalid_api_key)
    errorType?: string; // OpenAI error type (e.g., invalid_request_error)
    // Frontend-friendly error category for UI display
    category?: 'AUTH_ERROR' | 'ACCOUNT_ERROR' | 'MODEL_ERROR' | 'ACCESS_ERROR' | 'LIMIT_ERROR' | 'SERVER_ERROR' | 'UNKNOWN_ERROR';
  };
}

/**
 * Generate a request correlation ID
 */
export function generateRequestId(): string {
  return `req_${randomBytes(8).toString('hex')}`;
}

/**
 * Classify OpenAI error based on status code and error payload
 */
export function classifyOpenAIError(
  status: number | string,
  errorData?: any
): OpenAIErrorType {
  const statusNum = typeof status === 'string' ? parseInt(status, 10) : status;
  const errorCode = errorData?.code || errorData?.error?.code || '';
  const errorMessage = errorData?.message || errorData?.error?.message || '';

  // 401 Unauthorized - Check if it's really auth, account, or model/access issue
  if (statusNum === 401) {
    // Check for account/billing errors first
    if (
      errorCode === 'account_deactivated' ||
      errorCode === 'billing_not_active' ||
      errorCode === 'access_terminated' ||
      errorMessage.toLowerCase().includes('account') ||
      errorMessage.toLowerCase().includes('billing') ||
      errorMessage.toLowerCase().includes('deactivated') ||
      errorMessage.toLowerCase().includes('payment')
    ) {
      return 'OPENAI_ACCOUNT_ERROR';
    }
    
    // Check for model/access issues
    if (
      errorCode === 'model_not_found' ||
      errorCode === 'permission_denied' ||
      errorMessage.toLowerCase().includes('model') ||
      errorMessage.toLowerCase().includes('access')
    ) {
      return 'OPENAI_MODEL_ERROR';
    }
    
    // Real auth errors (invalid_api_key, mismatched_project, etc.)
    return 'OPENAI_AUTH';
  }

  // 403 Forbidden - Model/permission errors
  if (statusNum === 403) {
    if (
      errorCode === 'model_not_found' ||
      errorCode === 'permission_denied' ||
      errorMessage.toLowerCase().includes('model') ||
      errorMessage.toLowerCase().includes('permission')
    ) {
      return 'OPENAI_MODEL_ERROR';
    }
    // Default 403 is also auth-related
    return 'OPENAI_AUTH';
  }

  // 404 Not Found - Usually model errors
  if (statusNum === 404) {
    if (
      errorCode === 'model_not_found' ||
      errorMessage.toLowerCase().includes('model') ||
      errorMessage.toLowerCase().includes('not found')
    ) {
      return 'OPENAI_MODEL_ERROR';
    }
    return 'OPENAI_BAD_REQUEST';
  }

  // 429 Rate Limit
  if (statusNum === 429) {
    // Check if it's actually a quota issue
    if (
      errorCode === 'insufficient_quota' ||
      errorMessage.toLowerCase().includes('quota') ||
      errorMessage.toLowerCase().includes('insufficient')
    ) {
      return 'OPENAI_QUOTA';
    }
    
    return 'OPENAI_RATE_LIMIT';
  }

  // 400 Bad Request
  if (statusNum === 400) {
    return 'OPENAI_BAD_REQUEST';
  }

  // 5xx Server Errors
  if (statusNum >= 500 && statusNum < 600) {
    return 'OPENAI_SERVER';
  }

  // Unknown
  return 'UPSTREAM_UNKNOWN';
}

/**
 * Get human-readable error message
 */
export function getErrorMessage(type: OpenAIErrorType, originalMessage?: string): string {
  switch (type) {
    case 'OPENAI_AUTH':
      return 'The AI provider rejected the request due to authentication failure. Please check API key and project configuration.';
    case 'OPENAI_ACCOUNT_ERROR':
      return originalMessage || 'Your AI provider account has been deactivated or has billing issues. Please check your account status and payment method.';
    case 'OPENAI_MODEL_ERROR':
      return originalMessage || 'Model access denied or model not found. Please check if the model is available and you have access to it.';
    case 'OPENAI_QUOTA':
      return 'Insufficient quota or credits with the AI provider. Please check your account balance.';
    case 'OPENAI_RATE_LIMIT':
      return 'Rate limit exceeded. Please try again in a few moments.';
    case 'OPENAI_BAD_REQUEST':
      return originalMessage || 'Invalid request to AI provider. Please check your input.';
    case 'OPENAI_SERVER':
      return 'The AI provider is experiencing issues. Please try again later.';
    case 'UPSTREAM_UNKNOWN':
      return originalMessage || 'An unknown error occurred with the AI provider.';
    default:
      return originalMessage || 'An error occurred with the AI provider.';
  }
}

/**
 * Map OpenAIErrorType to frontend-friendly category
 */
function mapToFrontendCategory(errorType: OpenAIErrorType): 'AUTH_ERROR' | 'ACCOUNT_ERROR' | 'MODEL_ERROR' | 'ACCESS_ERROR' | 'LIMIT_ERROR' | 'SERVER_ERROR' | 'UNKNOWN_ERROR' {
  switch (errorType) {
    case 'OPENAI_AUTH':
      return 'AUTH_ERROR';
    case 'OPENAI_ACCOUNT_ERROR':
      return 'ACCOUNT_ERROR';
    case 'OPENAI_MODEL_ERROR':
      return 'MODEL_ERROR';
    case 'OPENAI_QUOTA':
    case 'OPENAI_RATE_LIMIT':
      return 'LIMIT_ERROR';
    case 'OPENAI_SERVER':
      return 'SERVER_ERROR';
    case 'OPENAI_BAD_REQUEST':
    case 'UPSTREAM_UNKNOWN':
    default:
      return 'UNKNOWN_ERROR';
  }
}

/**
 * Create structured error response
 */
export function createStructuredError(
  type: OpenAIErrorType,
  message?: string,
  requestId?: string,
  status?: number,
  errorCode?: string,
  errorType?: string
): StructuredError {
  return {
    error: {
      type,
      message: getErrorMessage(type, message),
      requestId: requestId || generateRequestId(),
      status,
      errorCode,
      errorType,
      category: mapToFrontendCategory(type),
    },
  };
}

/**
 * Sanitize error data for logging (remove sensitive information)
 */
export function sanitizeErrorData(errorData: any): any {
  if (!errorData || typeof errorData !== 'object') {
    return errorData;
  }

  const sanitized = { ...errorData };
  
  // Remove potential API keys or secrets
  const sensitiveKeys = ['api_key', 'apiKey', 'key', 'secret', 'token', 'authorization'];
  for (const key of sensitiveKeys) {
    if (sanitized[key]) {
      sanitized[key] = '[REDACTED]';
    }
  }

  return sanitized;
}

