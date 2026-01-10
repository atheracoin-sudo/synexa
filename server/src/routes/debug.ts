/**
 * Debug Routes
 * 
 * Development-only endpoints for testing and diagnostics.
 * These endpoints should be disabled in production.
 */

import { Router, Request, Response } from 'express';
import { openai, isOpenAIConfigured } from '../services/openaiClient';
import { OPENAI_CONFIG } from '../config/openaiConfig';
import { getResolvedChatModel } from '../config/openaiConfig';
import { getRuntimeConfigSummary } from '../utils/openaiDiagnostics';
import { getOpenAIModel } from '../utils/modelMapping';

const router = Router();

/**
 * GET /debug/openai-test
 * 
 * Minimal test endpoint to verify OpenAI connectivity and configuration.
 * Uses the same client and resolved model as production chat endpoints.
 * 
 * Development only - should be disabled in production.
 */
router.get('/debug/openai-test', async (req: Request, res: Response) => {
  try {
    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      return res.status(503).json({
        error: 'OpenAI API key is not configured on the server.',
        configured: false,
      });
    }

    const runtimeConfig = getRuntimeConfigSummary();
    const resolvedModel = getResolvedChatModel();

    // Log diagnostic information
    console.log('\n' + '='.repeat(60));
    console.log('🔍 OpenAI Test Endpoint Diagnostic');
    console.log('='.repeat(60));
    console.log(`Endpoint: GET /debug/openai-test`);
    console.log(`\n📋 Configuration:`);
    console.log(`   API Key: ${runtimeConfig.apiKeyMasked}`);
    console.log(`   Project ID: ${runtimeConfig.projectIdMasked}`);
    console.log(`   Resolved Model: ${resolvedModel}`);
    console.log(`   Default Model (Config): ${runtimeConfig.defaultModel}`);
    console.log(`   API Endpoint: https://api.openai.com/v1/chat/completions`);
    console.log(`\n📝 Client Instance:`);
    console.log(`   Using centralized OpenAI client from openaiClient.ts`);
    console.log(`   Project ID set at client initialization: ${OPENAI_CONFIG.PROJECT_ID ? 'Yes' : 'No'}`);
    console.log('='.repeat(60) + '\n');

    // Make a minimal test request
    const testMessages = [
      { role: 'user' as const, content: 'Say hello' }
    ];

    console.log('\n' + '='.repeat(60));
    console.log('🔥 OpenAI Test Request Diagnostic - Runtime');
    console.log('='.repeat(60));
    console.log(`Model: ${resolvedModel}`);
    console.log(`Project ID: ${runtimeConfig.projectIdMasked}`);
    console.log(`API Endpoint: https://api.openai.com/v1/chat/completions`);
    console.log(`API Method: chat.completions.create`);
    console.log(`Message Count: ${testMessages.length}`);
    console.log(`Temperature: 0.7`);
    console.log(`Max Tokens: 50`);
    console.log('='.repeat(60) + '\n');

    const startTime = Date.now();
    
    const completion = await openai.chat.completions.create({
      model: resolvedModel,
      messages: testMessages,
      temperature: 0.7,
      max_tokens: 50,
    });

    const duration = Date.now() - startTime;
    const responseText = completion.choices[0]?.message?.content || '';

    console.log(`\n✅ OpenAI Test Request Success`);
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Response Length: ${responseText.length} characters\n`);

    return res.json({
      success: true,
      message: 'OpenAI connection test successful',
      configuration: {
        apiKeyConfigured: true,
        projectId: runtimeConfig.projectIdMasked,
        resolvedModel: resolvedModel,
        defaultModel: runtimeConfig.defaultModel,
      },
      test: {
        model: resolvedModel,
        response: responseText,
        duration: `${duration}ms`,
        tokens: {
          prompt: completion.usage?.prompt_tokens || 0,
          completion: completion.usage?.completion_tokens || 0,
          total: completion.usage?.total_tokens || 0,
        },
      },
    });
  } catch (error: any) {
    const status = error?.status ?? error?.response?.status ?? 500;
    const errorData = error?.response?.data ?? error?.error ?? null;
    const errorCode = error?.code || errorData?.code || errorData?.error?.code || error?.response?.data?.code || 'unknown';
    const errorType = errorData?.type || errorData?.error?.type || error?.type || error?.response?.data?.type || 'unknown';
    const errorMessage = errorData?.message || errorData?.error?.message || error?.message || error?.response?.data?.message || 'unknown';
    const errorParam = error?.param || errorData?.param || errorData?.error?.param || error?.response?.data?.param || undefined;

    const runtimeConfig = getRuntimeConfigSummary();
    const resolvedModel = getResolvedChatModel();

    console.error('\n' + '='.repeat(60));
    console.error('❌ OpenAI Test Endpoint Error Diagnostic');
    console.error('='.repeat(60));
    console.error(`Endpoint: GET /debug/openai-test`);
    console.error(`HTTP Status: ${status}`);
    console.error(`\n🔍 Error Details:`);
    console.error(`   error.code: ${errorCode}`);
    console.error(`   error.type: ${errorType}`);
    console.error(`   error.message: ${errorMessage}`);
    if (errorParam) {
      console.error(`   error.param: ${errorParam}`);
    }
    console.error(`\n📋 Configuration:`);
    console.error(`   API Key: ${runtimeConfig.apiKeyMasked}`);
    console.error(`   Project ID: ${runtimeConfig.projectIdMasked}`);
    console.error(`   Resolved Model: ${resolvedModel}`);
    console.error(`\n📦 Full Error Object:`);
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
      errorData: errorData,
    }, null, 2));
    console.error('='.repeat(60) + '\n');

    return res.status(status).json({
      success: false,
      error: 'OpenAI connection test failed',
      status: status,
      errorCode: errorCode,
      errorType: errorType,
      errorMessage: errorMessage,
      configuration: {
        apiKeyConfigured: isOpenAIConfigured(),
        projectId: runtimeConfig.projectIdMasked,
        resolvedModel: resolvedModel,
      },
    });
  }
});

export default router;







