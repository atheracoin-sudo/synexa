/**
 * Video Script Provider Service
 * 
 * Handles video script generation (text-based) with provider abstraction and demo fallback.
 * Note: This generates scripts/text, not actual video files.
 */

import { VideoRequestBody } from '../types/video';
import { aiProviderConfig, isProviderConfigured } from '../config/aiProviderConfig';
import openai, { isOpenAIConfigured } from './openaiClient';
import { ChatMessage } from '../types/chat';

/**
 * Generate demo video script
 */
function generateDemoScript(options: VideoRequestBody): { script: string; isDemo: boolean } {
  const demoScript = `[DEMO VIDEO SCRIPT]

Title: ${options.prompt}

Duration: ${options.length}
Format: ${options.format}

Scene 1:
- Opening shot: [Describe based on prompt]
- Visual: [Key visual elements]
- Text overlay: [Main message]

Scene 2:
- Transition: [Transition type]
- Visual: [Secondary elements]
- Text overlay: [Supporting message]

Closing:
- Call to action: [CTA based on prompt]

Note: This is a demo script. Real AI-generated scripts will be available when the provider is configured.`;

  return {
    script: demoScript,
    isDemo: true,
  };
}

/**
 * Build video script system prompt
 */
function buildVideoScriptPrompt(options: VideoRequestBody): ChatMessage[] {
  const systemPrompt = `You are a professional video script writer. Generate a detailed script for a ${options.length} ${options.format} format video.

Requirements:
- Duration: ${options.length}
- Format: ${options.format === 'portrait' ? 'Vertical (9:16)' : 'Square (1:1)'}
- Structure: Clear scenes with visual descriptions and text overlays
- Engaging and concise
- Include timing suggestions for each scene

Generate the script in a structured format with:
1. Title
2. Scene breakdowns
3. Visual descriptions
4. Text overlays
5. Transitions
6. Call to action`;

  const userPrompt = `Create a video script for: ${options.prompt}`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

/**
 * Call OpenAI for video script generation
 */
async function callOpenAIVideoScript(
  messages: ChatMessage[]
): Promise<{ script: string; isDemo: boolean }> {
  // Use centralized OpenAI client
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key is not configured on the server.');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: aiProviderConfig.videoModel || aiProviderConfig.chatModel,
      messages: messages as any,
      temperature: 0.8, // More creative for scripts
      max_tokens: aiProviderConfig.maxTokens || 2048,
    });

    const script = completion.choices[0]?.message?.content || '';
    
    if (!script) {
      throw new Error('Empty response from OpenAI');
    }

    return {
      script,
      isDemo: false,
    };
  } catch (error: any) {
    console.error('OpenAI video script error:', error);
    throw error;
  }
}

/**
 * Call video script model with provider abstraction
 */
export async function callVideoScriptModel(
  options: VideoRequestBody,
  workspaceId?: string
): Promise<{ script: string; isDemo: boolean }> {
  const configured = isProviderConfigured();
  
  // If provider is 'none' or not configured, return demo
  if (!configured || aiProviderConfig.provider === 'none') {
    console.warn('📹 [DEMO] Video script generation - AI provider not configured');
    return generateDemoScript(options);
  }

  try {
    const messages = buildVideoScriptPrompt(options);

    // Route to appropriate provider
    if (aiProviderConfig.provider === 'openai') {
      const result = await callOpenAIVideoScript(messages);
      return result;
    }
    
    // Custom provider (placeholder for future implementation)
    if (aiProviderConfig.provider === 'custom') {
      // TODO: Implement custom provider integration
      console.warn('📹 [DEMO] Custom provider not yet implemented');
      return generateDemoScript(options);
    }

    // Fallback to demo
    return generateDemoScript(options);
  } catch (error: any) {
    console.error('Video script provider error:', {
      provider: aiProviderConfig.provider,
      model: aiProviderConfig.videoModel,
      workspaceId,
      error: error.message,
    });

    // If demo fallback is allowed, return demo response
    if (aiProviderConfig.allowDemoFallback) {
      console.warn('📹 [DEMO FALLBACK] Video script generation failed, using demo mode');
      return generateDemoScript(options);
    }

    // Otherwise, propagate error
    throw new Error(`Video script generation error: ${error.message || 'Unknown error'}`);
  }
}





