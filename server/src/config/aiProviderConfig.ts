/**
 * AI Provider Configuration
 * 
 * Centralized configuration for AI provider selection and model settings.
 * Supports multiple providers with environment variable configuration.
 */

export type AIProvider = 'none' | 'openai' | 'custom';

export interface AIProviderConfig {
  provider: AIProvider;
  chatModel: string;
  imageModel?: string;
  videoModel?: string; // For script generation, still text-based
  maxTokens?: number;
  timeoutMs?: number;
  allowDemoFallback: boolean;
}

/**
 * Get AI provider from environment variable
 */
function getProvider(): AIProvider {
  const provider = (process.env.AI_PROVIDER || 'none').toLowerCase();
  if (provider === 'openai' || provider === 'custom' || provider === 'none') {
    return provider as AIProvider;
  }
  console.warn(`Invalid AI_PROVIDER value: ${provider}. Defaulting to 'none'`);
  return 'none';
}

/**
 * Check if provider API key is configured
 */
function hasProviderKey(provider: AIProvider): boolean {
  if (provider === 'none') {
    return false;
  }
  
  if (provider === 'openai') {
    const key = process.env.OPENAI_API_KEY || process.env.PROVIDER_API_KEY;
    return !!(key && key !== 'your_openai_api_key_here' && key.trim() !== '');
  }
  
  if (provider === 'custom') {
    const key = process.env.PROVIDER_API_KEY || process.env.CUSTOM_PROVIDER_API_KEY;
    return !!(key && key.trim() !== '');
  }
  
  return false;
}

export const aiProviderConfig: AIProviderConfig = {
  provider: getProvider(),
  chatModel: process.env.AI_CHAT_MODEL || 'gpt-4o-mini',
  imageModel: process.env.AI_IMAGE_MODEL || 'dall-e-3',
  videoModel: process.env.AI_VIDEO_MODEL || 'gpt-4o-mini', // For script generation
  maxTokens: Number(process.env.AI_MAX_TOKENS || 2048),
  timeoutMs: Number(process.env.AI_TIMEOUT_MS || 30000),
  allowDemoFallback: process.env.ALLOW_DEMO_FALLBACK !== 'false', // Default to true
};

/**
 * Check if provider is configured and ready
 */
export function isProviderConfigured(): boolean {
  return hasProviderKey(aiProviderConfig.provider);
}

/**
 * Get provider display name for UI
 */
export function getProviderDisplayName(): string {
  if (!isProviderConfigured()) {
    return 'Demo Mode';
  }
  
  switch (aiProviderConfig.provider) {
    case 'openai':
      return 'Synexa Cloud';
    case 'custom':
      return 'Custom Provider';
    default:
      return 'Demo Mode';
  }
}





