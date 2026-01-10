/**
 * Chat Provider Service
 * 
 * Handles chat model calls with provider abstraction and demo fallback.
 */

import { ChatRequestBody, ChatMessage } from '../types/chat';
import { aiProviderConfig, isProviderConfigured, getProviderDisplayName } from '../config/aiProviderConfig';
import openai, { isOpenAIConfigured } from './openaiClient';
import { OPENAI_CONFIG } from '../config/openaiConfig';
import { getRuntimeConfigSummary } from '../utils/openaiDiagnostics';

// Base system prompt for Synexa
const BASE_SYSTEM_PROMPT = `You are Synexa, a helpful bilingual AI assistant. You support Turkish and English.

Rules:
- If the user writes in Turkish, always answer in natural Turkish.
- If the user writes in English, answer in natural English.
- If the user mixes both languages, answer in the language that makes the most sense, and keep their intent clear.
- If the user explicitly asks for translation (e.g. 'çevir', 'translate', 'Türkçeye çevir', 'translate this to English'), then perform a high-quality translation instead of a normal answer.
- When translating, do NOT add explanations unless the user asks. Just give the translated text.
- If the user asks 'fix my English' or 'düzelt', rewrite and improve the text instead of answering the content.`;

/**
 * Build messages array with system prompt and language preferences
 */
function buildMessages(
  requestMessages: ChatMessage[],
  languagePreference: 'auto' | 'tr' | 'en' = 'auto',
  translationMode: 'none' | 'to-tr' | 'to-en' | 'fix-en' = 'none'
): ChatMessage[] {
  let systemPrompt = BASE_SYSTEM_PROMPT;

  // Add language preference instruction
  if (languagePreference === 'tr') {
    systemPrompt += '\n\nUser preferred language: Turkish. When you answer normal questions, answer in Turkish.';
  } else if (languagePreference === 'en') {
    systemPrompt += '\n\nUser preferred language: English. When you answer normal questions, answer in English.';
  }

  // Handle translation modes
  if (translationMode !== 'none') {
    const lastUserMessage = requestMessages
      .filter(m => m.role === 'user')
      .pop();
    const textToTranslate = lastUserMessage?.content || '';

    if (translationMode === 'to-tr') {
      systemPrompt = `Translate the following text to Turkish. Do not add explanations. Just return the translated text.\n\nText to translate: ${textToTranslate}`;
    } else if (translationMode === 'to-en') {
      systemPrompt = `Translate the following text to English. Do not add explanations. Just return the translated text.\n\nText to translate: ${textToTranslate}`;
    } else if (translationMode === 'fix-en') {
      systemPrompt = `Improve and correct the following English text. Return only the improved text without explanations.\n\nText to improve: ${textToTranslate}`;
    }
  }

  // Build final messages array
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...requestMessages.filter(m => m.role !== 'system'), // Remove any existing system messages from request
  ];

  return messages;
}

/**
 * Generate demo response
 */
function generateDemoResponse(
  options: ChatRequestBody,
  isDemo: boolean = true
): { text: string; isDemo: boolean } {
  if (options.translationMode && options.translationMode !== 'none') {
    const lastUserMessage = options.messages
      .filter(m => m.role === 'user')
      .pop();
    const textToTranslate = lastUserMessage?.content || '';
    
    if (options.translationMode === 'to-tr') {
      return {
        text: `[DEMO - Türkçe Çeviri]\n\n${textToTranslate}\n\n→ Bu metin Türkçeye çevrilmiş halidir. Gerçek API entegrasyonu yapıldığında doğru çeviri gösterilecektir.`,
        isDemo: true,
      };
    } else if (options.translationMode === 'to-en') {
      return {
        text: `[DEMO - English Translation]\n\n${textToTranslate}\n\n→ This is the English translation of the text. The actual translation will be shown when the API is integrated.`,
        isDemo: true,
      };
    } else if (options.translationMode === 'fix-en') {
      return {
        text: `[DEMO - Improved English]\n\n${textToTranslate}\n\n→ This is an improved version of your English text. The actual improvement will be shown when the API is integrated.`,
        isDemo: true,
      };
    }
  }
  
  return {
    text: 'Bu, sunucu DEMO modunda olduğu için dönen geçici bir Synexa cevabıdır. Gerçek AI entegrasyonu için AI_PROVIDER ve ilgili API anahtarları yapılandırılmalıdır.',
    isDemo: true,
  };
}

/**
 * Call OpenAI provider
 */
async function callOpenAIProvider(
  messages: ChatMessage[],
  model: string
): Promise<{ text: string; isDemo: boolean }> {
  // Use centralized OpenAI client
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key is not configured on the server.');
  }

  // Log detailed request information before calling OpenAI
  const runtimeConfig = getRuntimeConfigSummary();
  console.log('\n' + '='.repeat(60));
  console.log('🔥 OpenAI Chat Request Diagnostic - Runtime');
  console.log('='.repeat(60));
  console.log(`Endpoint: /chat (via callChatModel)`);
  console.log(`\n📋 Model Configuration:`);
  console.log(`   Requested Model: ${model}`);
  console.log(`   Default Model (Config): ${runtimeConfig.defaultModel}`);
  console.log(`\n🔐 Authentication:`);
  console.log(`   API Key: ${runtimeConfig.apiKeyMasked}`);
  console.log(`   Project ID (from client config): ${runtimeConfig.projectIdMasked}`);
  console.log(`   API Endpoint: https://api.openai.com/v1/chat/completions`);
  console.log(`\n📨 Request Parameters:`);
  console.log(`   Message Count: ${messages.length}`);
  console.log(`   Temperature: 0.7`);
  console.log(`   Max Tokens: ${aiProviderConfig.maxTokens || 2048}`);
  console.log(`\n📝 Client Instance:`);
  console.log(`   Using centralized OpenAI client from openaiClient.ts`);
  console.log(`   Project ID set at client initialization: ${OPENAI_CONFIG.PROJECT_ID ? 'Yes' : 'No'}`);
  console.log('='.repeat(60) + '\n');

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: messages as any,
      temperature: 0.7,
      max_tokens: aiProviderConfig.maxTokens || 2048,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    if (!responseText) {
      throw new Error('Empty response from OpenAI');
    }

    return {
      text: responseText,
      isDemo: false,
    };
  } catch (error: any) {
    // Enhanced error logging
    const status = error?.status ?? error?.response?.status ?? 500;
    const errorData = error?.response?.data ?? error?.error ?? null;
    const errorCode = errorData?.code || errorData?.error?.code || error?.code || 'unknown';
    const errorType = errorData?.type || errorData?.error?.type || error?.type || 'unknown';
    const errorMessage = errorData?.message || errorData?.error?.message || error?.message || 'unknown';
    
    console.error('\n' + '='.repeat(60));
    console.error('❌ OpenAI Runtime Error Diagnostic');
    console.error('='.repeat(60));
    console.error(`Endpoint: /chat (via callChatModel)`);
    console.error(`HTTP Status: ${status}`);
    console.error(`Error Code: ${errorCode}`);
    console.error(`Error Type: ${errorType}`);
    console.error(`Error Message: ${errorMessage}`);
    console.error(`\n📋 Request Details:`);
    console.error(`   Model: ${model}`);
    console.error(`   Project ID: ${runtimeConfig.projectIdMasked}`);
    console.error(`\n📦 Full Error Object:`);
    console.error(JSON.stringify({
      status: error?.status,
      code: error?.code,
      type: error?.type,
      message: error?.message,
      response: {
        status: error?.response?.status,
        data: errorData,
      },
      param: error?.param,
    }, null, 2));
    console.error('='.repeat(60) + '\n');
    
    throw error;
  }
}

/**
 * Call chat model with provider abstraction
 */
export async function callChatModel(
  options: ChatRequestBody,
  workspaceId?: string,
  locale?: string
): Promise<{ text: string; isDemo: boolean }> {
  const configured = isProviderConfigured();
  
  // If provider is 'none' or not configured, return demo
  if (!configured || aiProviderConfig.provider === 'none') {
    console.warn('📝 [DEMO] Chat request - AI provider not configured');
    return generateDemoResponse(options, true);
  }

  const messages = buildMessages(
    options.messages,
    options.languagePreference || 'auto',
    options.translationMode || 'none'
  );

  try {
    // Route to appropriate provider
    if (aiProviderConfig.provider === 'openai') {
      const result = await callOpenAIProvider(messages, aiProviderConfig.chatModel);
      return result;
    }
    
    // Custom provider (placeholder for future implementation)
    if (aiProviderConfig.provider === 'custom') {
      // TODO: Implement custom provider integration
      console.warn('📝 [DEMO] Custom provider not yet implemented');
      return generateDemoResponse(options, true);
    }

    // Fallback to demo
    return generateDemoResponse(options, true);
  } catch (error: any) {
    console.error('Chat provider error:', {
      provider: aiProviderConfig.provider,
      model: aiProviderConfig.chatModel,
      workspaceId,
      error: error.message,
    });

    // If demo fallback is allowed, return demo response
    if (aiProviderConfig.allowDemoFallback) {
      console.warn('📝 [DEMO FALLBACK] Chat request failed, using demo mode');
      return generateDemoResponse(options, true);
    }

    // Otherwise, propagate error
    throw new Error(`Chat API error: ${error.message || 'Unknown error'}`);
  }
}





