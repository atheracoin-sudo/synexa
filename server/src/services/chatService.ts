/**
 * Chat Service
 * 
 * Handles OpenAI chat completion requests with proper error handling.
 */

import openai, { isOpenAIConfigured } from './openaiClient';
import { getOpenAIModel, getDefaultOpenAIModel } from '../utils/modelMapping';
import { OPENAI_CONFIG } from '../config/openaiConfig';
import {
  classifyOpenAIError,
  createStructuredError,
  generateRequestId,
  sanitizeErrorData,
  StructuredError,
} from '../utils/errorUtils';
import {
  diagnoseOpenAIError,
  formatDiagnosticReport,
  getRuntimeConfigSummary,
  maskApiKey,
  maskProjectId,
} from '../utils/openaiDiagnostics';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GenerateChatResponseOptions {
  messages: ChatMessage[];
  model?: string;
  modelId?: string; // Synexa model ID (e.g., synexa-gpt-5.1)
  userId?: string;
  conversationId?: string;
  requestId?: string; // Optional request correlation ID
}

export interface GenerateChatResponseResult {
  text: string;
  outputText: string;
  requestId: string;
  model?: string;
  tokensIn?: number;
  tokensOut?: number;
  totalTokens?: number;
  duration?: number;
}

export interface GenerateChatResponseError extends StructuredError {
  requestId: string;
  status: number;
}

/**
 * Generate chat response using OpenAI
 * 
 * Note: OpenAI doesn't have a "responses.create" API.
 * We use "chat.completions.create" which is the standard chat API.
 * 
 * @param options - Chat options including messages and optional model
 * @returns Generated text response with request ID
 * @throws GenerateChatResponseError if OpenAI is not configured or API call fails
 */
export async function generateChatResponse({
  messages,
  model,
  modelId,
  userId,
  conversationId,
  requestId: providedRequestId,
}: GenerateChatResponseOptions): Promise<GenerateChatResponseResult> {
  // Generate request ID for correlation
  const requestId = providedRequestId || generateRequestId();

  // Log request start with tracing
  console.log(`[chat] start requestId=${requestId} userId=${userId || 'unknown'} modelId=${modelId || 'unknown'}`);
  
  const startTime = Date.now();

  // Check if OpenAI is configured
  if (!isOpenAIConfigured()) {
    // TEST MODE: Return mock response if in development
    if (process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_MODE === 'true') {
      console.log(`[chat] TEST MODE: Returning mock response for requestId=${requestId}`);
      const mockResponses = [
        "Merhaba! Bu test modunda çalışan bir yanıt. Backend API entegrasyonu başarıyla çalışıyor! 🚀",
        "Test modu aktif. OpenAI API key'i olmadan da sistem çalışıyor. Gerçek API key'i ekleyince tam özellikli olacak.",
        "Backend'den gelen test yanıtı. Tüm entegrasyon tamamlandı, sadece OpenAI key'i eksik.",
        "Harika! Web uygulaması backend API'yi başarıyla kullanıyor. Test modu ile çalışıyoruz.",
        "Sistem tamamen entegre edildi! Bu test yanıtı backend'den geliyor. 🎉"
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      return {
        text: randomResponse,
        outputText: randomResponse,
        requestId,
        model: modelId || 'test-mode',
        tokensIn: 25,
        tokensOut: 25,
        totalTokens: 50,
        duration: 100
      };
    }
    
    const error = createStructuredError('OPENAI_AUTH', 'OpenAI API key is not configured on the server.', requestId);
    const err = new Error(error.error.message) as any;
    err.structuredError = error;
    err.requestId = requestId;
    err.status = 401;
    throw err;
  }

  // Map Synexa model ID to OpenAI model name
  // Priority: explicit model → mapped from modelId → default from config
  let finalModel: string;
  if (model) {
    finalModel = model;
  } else if (modelId) {
    try {
      finalModel = getOpenAIModel(modelId);
      console.log(`[AI] Model mapping: "${modelId}" → "${finalModel}"`);
    } catch (mappingError: any) {
      console.error(`[AI] ⚠️  Model mapping failed for "${modelId}": ${mappingError.message}`);
      finalModel = getDefaultOpenAIModel();
      console.log(`[AI] Using default model: "${finalModel}"`);
    }
  } else {
    finalModel = getDefaultOpenAIModel();
    console.log(`[AI] Using default model: "${finalModel}"`);
  }

  // Log request with runtime config
  const runtimeConfig = getRuntimeConfigSummary();
  console.log('[AI] OpenAI request', {
    requestId,
    model: finalModel,
    modelId: modelId || 'unknown',
    userId: userId || 'unknown',
    conversationId: conversationId || 'unknown',
    messageCount: messages.length,
    apiKeyConfigured: isOpenAIConfigured(),
    projectIdConfigured: runtimeConfig.projectIdMasked,
    // DO NOT log API key value
  });

  try {
    console.log(`[chat] calling OpenAI requestId=${requestId} model=${finalModel}`);
    
    // Add timeout protection (30 seconds)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('OpenAI request timeout after 30 seconds'));
      }, 30000);
    });
    
    // Log detailed request information before calling OpenAI
    const runtimeConfig = getRuntimeConfigSummary();
    console.log('\n' + '='.repeat(60));
    console.log('🔥 OpenAI Chat Request Diagnostic - Runtime');
    console.log('='.repeat(60));
    console.log(`Endpoint: /chat/openai`);
    console.log(`Request ID: ${requestId}`);
    console.log(`\n📋 Model Configuration:`);
    console.log(`   Synexa Model ID: ${modelId || 'not provided'}`);
    console.log(`   Resolved OpenAI Model: ${finalModel}`);
    console.log(`   Default Model (Config): ${runtimeConfig.defaultModel}`);
    console.log(`\n🔐 Authentication:`);
    console.log(`   API Key: ${runtimeConfig.apiKeyMasked}`);
    console.log(`   Project ID (from client config): ${runtimeConfig.projectIdMasked}`);
    console.log(`   API Endpoint: https://api.openai.com/v1/chat/completions`);
    console.log(`\n📨 Request Parameters:`);
    console.log(`   Message Count: ${messages.length}`);
    console.log(`   Temperature: 0.7`);
    console.log(`   Max Tokens: 2048`);
    console.log(`   User ID: ${userId || 'unknown'}`);
    console.log(`   Conversation ID: ${conversationId || 'unknown'}`);
    console.log(`\n📝 Client Instance:`);
    console.log(`   Using centralized OpenAI client from openaiClient.ts`);
    console.log(`   Project ID set at client initialization: ${OPENAI_CONFIG.PROJECT_ID ? 'Yes' : 'No'}`);
    console.log(`   Client instance ID: ${openai ? 'Initialized' : 'NOT INITIALIZED'}`);
    console.log(`\n🔍 Config Consistency:`);
    console.log(`   Startup config API Key: ${OPENAI_CONFIG.API_KEY.substring(0, 10)}...`);
    console.log(`   Runtime env API Key: ${runtimeConfig.apiKeyMasked}`);
    console.log(`   Startup config Project ID: ${OPENAI_CONFIG.PROJECT_ID || 'Not set'}`);
    console.log(`   Runtime env Project ID: ${runtimeConfig.projectIdMasked}`);
    console.log(`   ✅ Using SAME client instance and config as startup validation`);
    console.log('='.repeat(60) + '\n');
    
    // Use OpenAI Chat Completions API (standard API) with timeout protection
    // Note: OpenAI doesn't have "responses.create" - we use "chat.completions.create"
    const openaiPromise = openai.chat.completions.create({
      model: finalModel,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      temperature: 0.7,
      max_tokens: 2048,
    });

    // Race between OpenAI call and timeout
    const completion = await Promise.race([openaiPromise, timeoutPromise]) as any;

    const responseText = completion.choices[0]?.message?.content || '';
    const usage = completion.usage;
    const duration = Date.now() - startTime;
    
    if (!responseText) {
      throw new Error('Empty response from OpenAI');
    }

    // Log success with timing
    console.log(`[chat] openai success requestId=${requestId} ms=${duration}`);
    console.log(`[chat] response sent requestId=${requestId}`);
    
    // Log response summary
    console.log('[AI] OpenAI response summary', {
      requestId,
      model: finalModel,
      modelId: modelId || 'unknown',
      userId: userId || 'unknown',
      conversationId: conversationId || 'unknown',
      tokensIn: usage?.prompt_tokens || 0,
      tokensOut: usage?.completion_tokens || 0,
      totalTokens: usage?.total_tokens || 0,
      duration: `${duration}ms`,
    });

    return {
      text: responseText,
      outputText: responseText,
      requestId,
    };
  } catch (error: any) {
    // Log error with tracing
    console.log(`[chat] error requestId=${requestId} name=${error.name || 'Error'} message=${error.message || 'Unknown error'}`);
    
    // Check if it's a timeout error
    if (error.message && error.message.includes('timeout')) {
      // Create timeout error response
      const timeoutError = new Error('OpenAI request timed out') as any;
      timeoutError.structuredError = createStructuredError('UPSTREAM_TIMEOUT', 'OpenAI timed out', requestId, 504);
      timeoutError.requestId = requestId;
      timeoutError.status = 504;
      throw timeoutError;
    }
    
    // Extract error details
    const status = error?.status ?? error?.response?.status ?? error?.httpStatus ?? 500;
    const errorData = error?.response?.data ?? error?.error ?? null;
    const sanitizedErrorData = sanitizeErrorData(errorData);
    
    // Determine if request reached OpenAI
    const reachedOpenAI = !!(error?.response || error?.status || error?.httpStatus);
    
    // Classify error type
    const errorType = classifyOpenAIError(status, errorData);
    
    // Enhanced logging for ALL errors - COMPREHENSIVE DIAGNOSTIC REPORT
    const runtimeConfig = getRuntimeConfigSummary();
    
    // Extract error details from multiple possible locations
    const errorCode = error?.code || errorData?.code || errorData?.error?.code || error?.response?.data?.code || 'unknown';
    const errorTypeFromOpenAI = errorData?.type || errorData?.error?.type || error?.type || error?.response?.data?.type || 'unknown';
    const errorMessage = errorData?.message || errorData?.error?.message || error?.message || error?.response?.data?.message || 'unknown';
    const errorParam = error?.param || errorData?.param || errorData?.error?.param || error?.response?.data?.param || undefined;
    
    // Get full error response body
    const fullErrorBody = error?.response?.data || errorData || error?.error || {};
    
    // Generate diagnostic
    const diagnostic = diagnoseOpenAIError(errorCode, errorTypeFromOpenAI, errorMessage, status);
    
    // Detailed error log for ALL errors, especially 401/403/404
    console.error('\n' + '='.repeat(60));
    console.error(`❌ OpenAI Runtime Error Diagnostic`);
    console.error('='.repeat(60));
    console.error(`Endpoint: /chat/openai`);
    console.error(`Request ID: ${requestId}`);
    console.error(`HTTP Status: ${status}`);
    console.error(`\n🔍 Error Details:`);
    console.error(`   error.code: ${errorCode}`);
    console.error(`   error.type: ${errorTypeFromOpenAI}`);
    console.error(`   error.message: ${errorMessage}`);
    if (errorParam) {
      console.error(`   error.param: ${errorParam}`);
    }
    console.error(`\n📋 Request Details:`);
    console.error(`   Requested Model: ${finalModel}`);
    console.error(`   Synexa Model ID: ${modelId || 'unknown'}`);
    console.error(`   API Endpoint: https://api.openai.com/v1/chat/completions`);
    console.error(`   API Method: chat.completions.create`);
    console.error(`\n📋 Runtime Configuration (at time of request):`);
    console.error(`   API Key: ${runtimeConfig.apiKeyMasked}`);
    console.error(`   Project ID: ${runtimeConfig.projectIdMasked}`);
    console.error(`   User ID: ${userId || 'unknown'}`);
    console.error(`   Conversation ID: ${conversationId || 'unknown'}`);
    console.error(`\n📦 Full Error Object from OpenAI SDK:`);
    console.error(JSON.stringify({
      status: error?.status,
      code: error?.code,
      type: error?.type,
      message: error?.message,
      param: error?.param,
      response: {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        headers: error?.response?.headers,
        data: error?.response?.data,
      },
      error: error?.error,
      // Include nested error data structures
      errorData: errorData,
      fullErrorBody: fullErrorBody,
    }, null, 2));
    
    // Print diagnostic report
    console.error(formatDiagnosticReport(diagnostic));
    
    console.error('='.repeat(60) + '\n');
    
    // Log structured error details (sanitized) - ROBUST LOGGING
    console.error('[AI] OpenAI request failed', {
      requestId,
      upstreamStatus: status,
      upstreamErrorPayload: sanitizedErrorData,
      reachedOpenAI,
      errorType,
      model: finalModel,
      modelId: modelId || 'unknown',
      userId: userId || 'unknown',
      conversationId: conversationId || 'unknown',
      message: error.message,
      errorCode: error.code,
      errorTypeFromSDK: error.type,
      // Extract specific OpenAI error codes if available
      openaiErrorCode: errorData?.code || errorData?.error?.code,
      openaiErrorType: errorData?.type || errorData?.error?.type,
      openaiErrorMessage: errorData?.message || errorData?.error?.message,
      // DO NOT log API key or secrets
    });

    // Extract error code and type from OpenAI response - more comprehensive
    const openaiErrorCode = error?.code || errorData?.code || errorData?.error?.code || error?.response?.data?.code || undefined;
    const openaiErrorType = error?.type || errorData?.type || errorData?.error?.type || error?.response?.data?.type || undefined;
    const openaiErrorMessage = error?.message || errorData?.message || errorData?.error?.message || error?.response?.data?.message || undefined;
    
    // Debug: Log extracted error details
    console.log('[chatService] Extracted error details:', {
      openaiErrorCode,
      openaiErrorType,
      openaiErrorMessage,
      errorCode: error?.code,
      errorType: error?.type,
      errorDataCode: errorData?.code,
      errorDataErrorCode: errorData?.error?.code,
    });
    
    // TEST MODE: Handle invalid API key in development
    if ((process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_MODE === 'true') && 
        (openaiErrorCode === 'invalid_api_key' || status === 401)) {
      console.log(`[chat] TEST MODE: API key invalid, returning mock response for requestId=${requestId}`);
      const mockResponses = [
        "Test modu aktif! OpenAI API key'i geçersiz ama sistem çalışıyor. Backend entegrasyonu başarılı! 🎉",
        "Merhaba! Bu test yanıtı backend'den geliyor. API key'i düzeltince gerçek AI yanıtları alacaksınız.",
        "Backend API entegrasyonu tamamlandı! Test modu ile çalışıyoruz. Gerçek OpenAI key'i ekleyince tam özellikli olacak.",
        "Harika! Web uygulaması backend'i başarıyla kullanıyor. Bu test yanıtı API key sorunu olmadan geliyor.",
        "Sistem tamamen entegre! Test modu sayesinde API key olmadan da çalışıyor. 🚀"
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      // Return mock success instead of throwing error
      return {
        text: randomResponse,
        outputText: randomResponse,
        requestId,
        model: modelId || 'test-mode-fallback',
        tokensIn: 35,
        tokensOut: 40,
        totalTokens: 75,
        duration: 150
      };
    }
    
    // Create structured error with full details
    const structuredError = createStructuredError(
      errorType,
      openaiErrorMessage || error.message || errorData?.message,
      requestId,
      status,
      openaiErrorCode,
      openaiErrorType
    );
    
    // Debug: Log structured error
    console.log('[chatService] Created structured error:', JSON.stringify(structuredError, null, 2));

    // Create error object with structured error attached
    const chatError = new Error(structuredError.error.message) as any;
    chatError.structuredError = structuredError;
    chatError.requestId = requestId;
    chatError.status = status;
    chatError.errorType = errorType;
    // Also attach error details directly for easier access in routes
    chatError.errorCode = openaiErrorCode;
    chatError.errorType = openaiErrorType;
    chatError.errorMessage = error.message || errorData?.message;
    
    throw chatError;
  }
}
