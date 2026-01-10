/**
 * OpenAI Configuration
 * 
 * Centralized configuration for OpenAI API settings.
 * All OpenAI-related environment variables should be referenced here.
 */

/**
 * OpenAI API Configuration Constants
 */
// Runtime-resolved model (set during startup validation)
let resolvedChatModel: string | null = null;
let resolvedModelIsFallback: boolean = false;
let resolvedModelFallbackReason: string | undefined = undefined;

export const OPENAI_CONFIG = {
  // API Key (required)
  API_KEY: process.env.OPENAI_API_KEY || '',
  
  // Project ID (optional, for organization/project scoping)
  PROJECT_ID: process.env.OPENAI_PROJECT_ID || null,
  
  // Default chat model (from env or default)
  DEFAULT_CHAT_MODEL: process.env.OPENAI_MODEL_CHAT || 'gpt-4o-mini',
  
  // API endpoint (default, do not override unless necessary)
  API_ENDPOINT: 'https://api.openai.com/v1',
} as const;

/**
 * Set the resolved chat model (called during startup validation)
 */
export function setResolvedChatModel(
  model: string,
  isFallback: boolean = false,
  fallbackReason?: string
): void {
  resolvedChatModel = model;
  resolvedModelIsFallback = isFallback;
  resolvedModelFallbackReason = fallbackReason;
}

/**
 * Get the resolved chat model (uses fallback if set, otherwise uses default)
 */
export function getResolvedChatModel(): string {
  return resolvedChatModel || OPENAI_CONFIG.DEFAULT_CHAT_MODEL;
}

/**
 * Check if the resolved model is a fallback
 */
export function isResolvedModelFallback(): boolean {
  return resolvedModelIsFallback;
}

/**
 * Get fallback reason if applicable
 */
export function getFallbackReason(): string | undefined {
  return resolvedModelFallbackReason;
}

/**
 * Validate OpenAI configuration
 * 
 * @returns Object with validation results
 */
export function validateOpenAIConfig(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check API key
  if (!OPENAI_CONFIG.API_KEY || OPENAI_CONFIG.API_KEY.trim() === '') {
    errors.push('OPENAI_API_KEY is missing in environment variables');
  } else if (
    OPENAI_CONFIG.API_KEY === 'your_openai_api_key_here' ||
    OPENAI_CONFIG.API_KEY === 'BURAYA_YENİ_SK_PROJ_KEY_GELECEK'
  ) {
    errors.push('OPENAI_API_KEY is set to placeholder value');
  } else if (!OPENAI_CONFIG.API_KEY.startsWith('sk-') && !OPENAI_CONFIG.API_KEY.startsWith('sk-proj-')) {
    errors.push('OPENAI_API_KEY format is invalid (should start with "sk-" or "sk-proj-")');
  }
  
  // Check Project ID (optional, but warn if configured incorrectly)
  if (OPENAI_CONFIG.PROJECT_ID) {
    if (!OPENAI_CONFIG.PROJECT_ID.startsWith('proj_')) {
      warnings.push('OPENAI_PROJECT_ID format may be invalid (should start with "proj_")');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get OpenAI configuration summary for logging
 */
export function getOpenAIConfigSummary(): {
  apiKeyConfigured: boolean;
  projectIdConfigured: boolean;
  defaultModel: string;
  apiEndpoint: string;
} {
  return {
    apiKeyConfigured: !!OPENAI_CONFIG.API_KEY && 
                      OPENAI_CONFIG.API_KEY.trim() !== '' &&
                      OPENAI_CONFIG.API_KEY !== 'your_openai_api_key_here' &&
                      OPENAI_CONFIG.API_KEY.startsWith('sk-'),
    projectIdConfigured: !!OPENAI_CONFIG.PROJECT_ID,
    defaultModel: OPENAI_CONFIG.DEFAULT_CHAT_MODEL,
    apiEndpoint: OPENAI_CONFIG.API_ENDPOINT,
  };
}

/**
 * Get runtime configuration details (for detailed logging)
 */
export function getRuntimeConfigDetails(): {
  apiKey: string;
  projectId: string | null;
  defaultModel: string;
  apiEndpoint: string;
  envVars: {
    OPENAI_API_KEY: string | undefined;
    OPENAI_PROJECT_ID: string | undefined;
    OPENAI_MODEL_CHAT: string | undefined;
  };
} {
  return {
    apiKey: OPENAI_CONFIG.API_KEY,
    projectId: OPENAI_CONFIG.PROJECT_ID,
    defaultModel: OPENAI_CONFIG.DEFAULT_CHAT_MODEL,
    apiEndpoint: OPENAI_CONFIG.API_ENDPOINT,
    envVars: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENAI_PROJECT_ID: process.env.OPENAI_PROJECT_ID,
      OPENAI_MODEL_CHAT: process.env.OPENAI_MODEL_CHAT,
    },
  };
}







