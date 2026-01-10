/**
 * Image Provider Service
 * 
 * Handles image generation with provider abstraction and demo fallback.
 */

import { ImageRequestBody } from '../types/image';
import { aiProviderConfig, isProviderConfigured } from '../config/aiProviderConfig';
import openai, { isOpenAIConfigured } from './openaiClient';

/**
 * Map style to DALL-E style description
 */
function mapStyleToPrompt(style: 'realistic' | 'anime' | '3d' | 'illustration'): string {
  const styleMap: Record<string, string> = {
    realistic: 'photorealistic, high quality, detailed',
    anime: 'anime style, vibrant colors, Japanese animation style',
    '3d': '3D rendered, modern 3D graphics, high detail',
    illustration: 'digital illustration, artistic, stylized',
  };
  return styleMap[style] || style;
}

/**
 * Map size to DALL-E size format
 */
function mapSizeToDalleSize(size: 'square' | 'portrait' | 'landscape'): '1024x1024' | '1024x1792' | '1792x1024' {
  const sizeMap: Record<string, '1024x1024' | '1024x1792' | '1792x1024'> = {
    square: '1024x1024',
    portrait: '1024x1792',
    landscape: '1792x1024',
  };
  return sizeMap[size] || '1024x1024';
}

/**
 * Generate demo image response
 */
function generateDemoImage(options: ImageRequestBody): { url: string; thumbnailUrl?: string; isDemo: boolean } {
  const placeholderUrl = `https://placehold.co/512x512/22C55E/FFFFFF?text=${encodeURIComponent(options.prompt.substring(0, 20))}`;
  
  return {
    url: placeholderUrl,
    thumbnailUrl: placeholderUrl,
    isDemo: true,
  };
}

/**
 * Call OpenAI image generation
 */
async function callOpenAIImage(
  prompt: string,
  style: string,
  size: '1024x1024' | '1024x1792' | '1792x1024'
): Promise<{ url: string; thumbnailUrl?: string; isDemo: boolean }> {
  // Use centralized OpenAI client
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key is not configured on the server.');
  }

  try {
    const stylePrompt = mapStyleToPrompt(style as any);
    const enhancedPrompt = `${prompt}, ${stylePrompt}`;

    const response = await openai.images.generate({
      model: aiProviderConfig.imageModel || 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: size,
      quality: 'standard',
      response_format: 'url',
    });

    const imageUrl = response.data?.[0]?.url;
    
    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    return {
      url: imageUrl,
      thumbnailUrl: imageUrl,
      isDemo: false,
    };
  } catch (error: any) {
    const status = error.status || error.response?.status || error.statusCode;
    
    // Handle 401 Unauthorized - log detailed error for debugging
    if (status === 401) {
      console.error('[AI] OpenAI request failed', {
        status: error.status,
        data: error.response?.data,
        message: error.message,
        errorType: error.type,
        errorCode: error.code,
        responseBody: error.response?.data || error.body || 'No response body',
        // DO NOT log API key
      });
      throw new Error('OpenAI authentication failed');
    }
    
    // Handle 404 Not Found
    if (status === 404) {
      console.error('[Image] OpenAI model/endpoint not found', {
        model: aiProviderConfig.imageModel,
        status: 404,
        message: error.message,
        responseBody: error.response?.data || error.body || 'No response body',
      });
      throw new Error(`Image model "${aiProviderConfig.imageModel}" not found`);
    }
    
    // Log error (without sensitive data)
    console.error('[AI] OpenAI request failed', {
      status: error.status,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      type: error.type,
      responseBody: error.response?.data || error.body || 'No response body',
      // DO NOT log API key
    });
    
    throw error;
  }
}

/**
 * Call image model with provider abstraction
 */
export async function callImageModel(
  options: ImageRequestBody,
  workspaceId?: string
): Promise<{ url: string; thumbnailUrl?: string; isDemo: boolean }> {
  const configured = isProviderConfigured();
  
  // If provider is 'none' or not configured, return demo
  if (!configured || aiProviderConfig.provider === 'none') {
    console.warn('🖼️  [DEMO] Image generation - AI provider not configured');
    return generateDemoImage(options);
  }

  try {
    const size = mapSizeToDalleSize(options.size || 'square');

    // Route to appropriate provider
    if (aiProviderConfig.provider === 'openai') {
      const result = await callOpenAIImage(options.prompt, options.style, size);
      return result;
    }
    
    // Custom provider (placeholder for future implementation)
    if (aiProviderConfig.provider === 'custom') {
      // TODO: Implement custom provider integration
      console.warn('🖼️  [DEMO] Custom provider not yet implemented');
      return generateDemoImage(options);
    }

    // Fallback to demo
    return generateDemoImage(options);
  } catch (error: any) {
    console.error('Image provider error:', {
      provider: aiProviderConfig.provider,
      model: aiProviderConfig.imageModel,
      workspaceId,
      error: error.message,
    });

    // If demo fallback is allowed, return demo response
    if (aiProviderConfig.allowDemoFallback) {
      console.warn('🖼️  [DEMO FALLBACK] Image generation failed, using demo mode');
      return generateDemoImage(options);
    }

    // Otherwise, propagate error
    throw new Error(`Image generation error: ${error.message || 'Unknown error'}`);
  }
}





