/**
 * OpenAI Client Service
 * 
 * Centralized OpenAI client initialization.
 * All OpenAI API calls should use this client.
 * 
 * This is the SINGLE source of truth for OpenAI client instance.
 * Do NOT create new OpenAI() instances elsewhere in the codebase.
 */

import OpenAI from 'openai';
import { OPENAI_CONFIG, validateOpenAIConfig, getOpenAIConfigSummary } from '../config/openaiConfig';

// Validate configuration on module load
const configValidation = validateOpenAIConfig();

if (!configValidation.isValid) {
  console.error('[OpenAI] ❌ Configuration validation failed:');
  configValidation.errors.forEach(error => {
    console.error(`[OpenAI]    - ${error}`);
  });
  
  // Only throw error if not in test mode
  if (process.env.ENABLE_TEST_MODE !== 'true') {
    throw new Error('OpenAI configuration is invalid');
  } else {
    console.log('[OpenAI] 🧪 Test mode enabled - continuing without valid API key');
  }
}

// Show warnings if any
if (configValidation.warnings.length > 0) {
  console.warn('[OpenAI] ⚠️  Configuration warnings:');
  configValidation.warnings.forEach(warning => {
    console.warn(`[OpenAI]    - ${warning}`);
  });
}

// Get configuration summary
const configSummary = getOpenAIConfigSummary();

// Initialize OpenAI client
// IMPORTANT: This is the ONLY place where new OpenAI() should be instantiated
export const openai = new OpenAI({
  apiKey: OPENAI_CONFIG.API_KEY,
  project: OPENAI_CONFIG.PROJECT_ID || undefined, // Project ID for organization/project scoping
  // Do NOT override baseURL - use default https://api.openai.com/v1
  // Do NOT add custom headers - SDK handles Authorization automatically
});

// Log initialization with masked values
import { getRuntimeConfigSummary, maskApiKey, maskProjectId } from '../utils/openaiDiagnostics';

const runtimeConfig = getRuntimeConfigSummary();

console.log('\n' + '='.repeat(60));
console.log('✅ OpenAI Client Initialized Successfully');
console.log('='.repeat(60));
console.log(`API Endpoint: ${runtimeConfig.apiEndpoint}`);
console.log(`API Key: ${runtimeConfig.apiKeyMasked}`);
if (OPENAI_CONFIG.PROJECT_ID) {
  console.log(`Project ID: ${runtimeConfig.projectIdMasked}`);
} else {
  console.log('Project ID: Not set (optional - using API key default project)');
}
console.log(`Default Model: ${runtimeConfig.defaultModel}`);
console.log('\n📋 Environment Variables Used:');
console.log(`   OPENAI_API_KEY: ${runtimeConfig.envVarsUsed.OPENAI_API_KEY}`);
console.log(`   OPENAI_PROJECT_ID: ${runtimeConfig.envVarsUsed.OPENAI_PROJECT_ID}`);
console.log(`   OPENAI_MODEL_CHAT: ${runtimeConfig.envVarsUsed.OPENAI_MODEL_CHAT}`);
console.log('='.repeat(60) + '\n');

// Export default for backward compatibility
export default openai;

/**
 * Check if OpenAI is configured and ready
 */
export function isOpenAIConfigured(): boolean {
  return configSummary.apiKeyConfigured;
}
