/**
 * Model Resolver Utility
 * 
 * Resolves model names with fallback logic based on available models.
 * Handles model availability checks and automatic fallback selection.
 */

import { OPENAI_CONFIG } from '../config/openaiConfig';
import { getOpenAIModel } from './modelMapping';

/**
 * Find a suitable fallback chat model from available models
 * Prioritizes: gpt-4o-mini, gpt-4o, gpt-3.5-turbo, or any gpt-* model
 */
export function findFallbackChatModel(availableModelIds: string[]): string | null {
  // Priority list of preferred chat models
  const preferredModels = [
    'gpt-4o-mini',
    'gpt-4o',
    'gpt-4-turbo',
    'gpt-4',
    'gpt-3.5-turbo',
    'gpt-4o-2024-08-06',
    'gpt-4o-mini-2024-07-18',
  ];

  // Try preferred models first
  for (const preferred of preferredModels) {
    if (availableModelIds.includes(preferred)) {
      return preferred;
    }
  }

  // Fallback: find any gpt-* chat model
  const chatModels = availableModelIds.filter(id => 
    id.startsWith('gpt-') && 
    !id.includes('instruct') && 
    !id.includes('embedding') &&
    !id.includes('vision')
  );

  if (chatModels.length > 0) {
    // Sort to prefer newer models (longer names often mean newer versions)
    chatModels.sort((a, b) => b.length - a.length);
    return chatModels[0];
  }

  return null;
}

/**
 * Resolve the actual model name to use, with fallback if needed
 * 
 * @param requestedModel - The model name from config or mapping
 * @param availableModelIds - List of available model IDs from OpenAI
 * @returns The resolved model name (or fallback if requested model is not available)
 */
export function resolveModelWithFallback(
  requestedModel: string,
  availableModelIds: string[]
): {
  resolvedModel: string;
  isFallback: boolean;
  fallbackReason?: string;
} {
  // Check if requested model is available
  if (availableModelIds.includes(requestedModel)) {
    return {
      resolvedModel: requestedModel,
      isFallback: false,
    };
  }

  // Requested model not available - find fallback
  const fallbackModel = findFallbackChatModel(availableModelIds);

  if (!fallbackModel) {
    // No suitable fallback found - this is a critical error
    throw new Error(
      `Requested model "${requestedModel}" is not available, ` +
      `and no suitable fallback chat model could be found in available models.`
    );
  }

  return {
    resolvedModel: fallbackModel,
    isFallback: true,
    fallbackReason: `Requested model "${requestedModel}" not found in available models. Using fallback: "${fallbackModel}"`,
  };
}

/**
 * Resolve Synexa model ID to actual OpenAI model with fallback
 * 
 * @param synexaModelId - Synexa model ID (e.g., "synexa-gpt-5.1")
 * @param availableModelIds - List of available model IDs from OpenAI
 * @returns Resolved model info
 */
export function resolveSynexaModel(
  synexaModelId: string,
  availableModelIds: string[]
): {
  resolvedModel: string;
  isFallback: boolean;
  fallbackReason?: string;
  mapping: string; // The mapped model name before fallback
} {
  // First, get the mapped model from our mapping
  const mappedModel = getOpenAIModel(synexaModelId);

  // Then resolve with fallback if needed
  const resolution = resolveModelWithFallback(mappedModel, availableModelIds);

  return {
    resolvedModel: resolution.resolvedModel,
    isFallback: resolution.isFallback,
    fallbackReason: resolution.fallbackReason,
    mapping: mappedModel,
  };
}

/**
 * Get the default chat model with fallback
 * 
 * @param availableModelIds - List of available model IDs from OpenAI
 * @returns Resolved default model info
 */
export function getDefaultModelWithFallback(availableModelIds: string[]): {
  resolvedModel: string;
  isFallback: boolean;
  fallbackReason?: string;
  originalModel: string;
} {
  const originalModel = OPENAI_CONFIG.DEFAULT_CHAT_MODEL;
  const resolution = resolveModelWithFallback(originalModel, availableModelIds);

  return {
    resolvedModel: resolution.resolvedModel,
    isFallback: resolution.isFallback,
    fallbackReason: resolution.fallbackReason,
    originalModel,
  };
}







