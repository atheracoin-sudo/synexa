/**
 * Model Mapping Utility
 * 
 * Maps Synexa model IDs to actual OpenAI model names.
 * Centralized model name management.
 */

import { OPENAI_CONFIG } from '../config/openaiConfig';

export interface ModelMapping {
  [synexaModelId: string]: string;
}

/**
 * Map Synexa model IDs to OpenAI model names
 * 
 * IMPORTANT: Only map OpenAI models here.
 * Non-OpenAI models (synexa-gemini-3, synexa-deepseek) should NOT be in this map.
 * 
 * Note: gpt-5.1 doesn't exist yet - using gpt-4o as fallback.
 * When gpt-5.1 becomes available, update this mapping.
 */
export const OPENAI_MODEL_MAP: Record<string, string> = {
  'synexa-gpt-5.1': 'gpt-4o', // gpt-5.1 doesn't exist, use gpt-4o
  'synexa-gpt-5': 'gpt-4o',
  'synexa-gpt-5-mini': 'gpt-4o-mini', // gpt-5-mini doesn't exist, use gpt-4o-mini
  'synexa-gpt': 'gpt-4o',
  'gpt-5.1': 'gpt-4o',
  'gpt-5.1-mini': 'gpt-4o-mini',
  'gpt-5': 'gpt-4o',
  'gpt-5-mini': 'gpt-4o-mini',
  'gpt-4o': 'gpt-4o',
  'gpt-4o-mini': 'gpt-4o-mini',
};

// Export as MODEL_MAPPING for backward compatibility
export const MODEL_MAPPING = OPENAI_MODEL_MAP;

/**
 * Get default OpenAI chat model
 * Uses resolved model if available (from startup validation), otherwise uses OPENAI_CONFIG.DEFAULT_CHAT_MODEL
 */
export function getDefaultOpenAIModel(): string {
  // Try to use resolved model first (set during startup validation)
  const { getResolvedChatModel } = require('../config/openaiConfig');
  return getResolvedChatModel();
}

/**
 * Get OpenAI model name from Synexa model ID
 * 
 * IMPORTANT: synexa-gpt-5.1 and all synexa-gpt-* models map to OPENAI_MODEL_CHAT
 * This ensures consistent model usage across the application.
 * 
 * @throws Error if model is not an OpenAI model (e.g., synexa-gemini-3)
 */
export function getOpenAIModel(synexaModelId: string): string {
  // Check if this is an OpenAI model
  const isOpenAIModel = synexaModelId.startsWith('synexa-gpt') || 
                        synexaModelId.startsWith('gpt-') ||
                        OPENAI_MODEL_MAP[synexaModelId];
  
  if (!isOpenAIModel) {
    throw new Error(`Model "${synexaModelId}" is not an OpenAI model. Use appropriate provider.`);
  }
  
  // All synexa-gpt-* models map to the default chat model from config
  // This ensures consistency and makes it easy to change the model via env var
  if (synexaModelId.startsWith('synexa-gpt')) {
    return getDefaultOpenAIModel();
  }
  
  // Check explicit mapping
  const mappedModel = OPENAI_MODEL_MAP[synexaModelId];
  if (mappedModel) {
    return mappedModel;
  }
  
  // If it's already a gpt-* model, use it directly
  if (synexaModelId.startsWith('gpt-')) {
    return synexaModelId;
  }
  
  // Final fallback to default from centralized config
  return getDefaultOpenAIModel();
}

