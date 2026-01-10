/**
 * Chat route handler
 */

import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { getOrCreateUserWithUsage, canUseFeature } from '../services/userService';
import { CREDIT_COSTS } from '../constants/credits';
import { PrismaClient } from '@prisma/client';
import { generateChatResponse } from '../services/chatService';
import { getWebSocketService } from '../services/websocketService';
import { isOpenAIConfigured } from '../services/openaiClient';

const router = Router();
const prisma = new PrismaClient();

/**
 * Common handler for OpenAI chat requests
 * Used by both /chat and /chat/openai endpoints
 */
async function handleOpenAIChat(req: Request, res: Response, route: '/chat' | '/chat/openai' = '/chat') {
  console.log(`[${route}] Incoming request`);
  console.log(`[${route}] Request body:`, JSON.stringify({
    modelId: req.body?.modelId,
    workspaceId: req.body?.workspaceId,
    messageCount: req.body?.messages?.length,
    engine: req.body?.engine,
  }));

  try {
    const userId = req.userId!;
    console.log(`[${route}] Resolved userId:`, userId);
    
    // Log model request
    console.log(`[${route}] Model request`, {
      route,
      modelId: req.body?.modelId,
      userId,
    });

    const messages = req.body?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      console.warn(`[${route}] Missing messages array`);
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Validate message structure
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return res.status(400).json({ error: 'Each message must have role and content' });
      }
      if (!['system', 'user', 'assistant'].includes(msg.role)) {
        return res.status(400).json({ error: 'Message role must be system, user, or assistant' });
      }
    }

    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      return res.status(503).json({
        error: 'OpenAI API key is not configured on the server.',
      });
    }

    // Check credits and daily limits
    const user = await getOrCreateUserWithUsage(userId);
    const check = canUseFeature(user, 'chat', CREDIT_COSTS.CHAT);

    if (!check.allowed) {
      return res.status(403).json({
        code: check.reason!,
        feature: 'chat',
        message: check.reason === 'INSUFFICIENT_CREDITS'
          ? 'Insufficient credits. Please purchase more credits or upgrade your plan.'
          : 'Daily chat limit reached. Please upgrade to Pro for unlimited chat.',
      });
    }

    // Extract modelId
    // For /chat endpoint: redirect ALL models to synexa-gpt-5.1
    // For /chat/openai endpoint: use requested modelId or default to synexa-gpt-5.1
    const requestedModelId = req.body?.modelId || 'synexa-gpt-5.1';
    const modelId = route === '/chat' ? 'synexa-gpt-5.1' : requestedModelId; // Redirect all models to synexa-gpt-5.1 for /chat
    
    if (route === '/chat' && requestedModelId !== 'synexa-gpt-5.1') {
      console.log(`[${route}] Model redirect: "${requestedModelId}" → "synexa-gpt-5.1"`);
    }

    // Workspace resolution - SAME LOGIC AS /chat/openai
    // İstenen workspace ID (opsiyonel)
    const requestedWorkspaceId: string | null =
      typeof req.body.workspaceId === 'string' ? req.body.workspaceId : null;

    // Kullanıcının tüm workspace'lerini çek
    const userWorkspaces = await prisma.workspace.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    console.log(
      `[${route}] User workspaces:`,
      userWorkspaces.map((w) => w.id)
    );

    let activeWorkspaceId: string | null = null;

    // Workspace resolution with fallback
    // 1) İstenen workspace kullanıcının listesinde varsa onu seç
    if (Array.isArray(userWorkspaces) && userWorkspaces.length > 0) {
      activeWorkspaceId =
        userWorkspaces.find((w) => w.id === requestedWorkspaceId)?.id ??
        userWorkspaces[0].id;
      
      if (activeWorkspaceId !== requestedWorkspaceId && requestedWorkspaceId) {
        console.warn(
          `[${route}] Requested workspace ${requestedWorkspaceId} not found in user workspaces, using fallback: ${activeWorkspaceId}`
        );
      } else if (activeWorkspaceId === userWorkspaces[0].id && !requestedWorkspaceId) {
        console.log(
          `[${route}] Fallback workspace selected: ${activeWorkspaceId}`
        );
      }
    }

    // 2) Hiç workspace yoksa bile ASLA HATA DÖNME
    if (!activeWorkspaceId) {
      console.warn(
        `[${route}] No workspace found for user ${userId}, continuing without workspace`
      );
    }

    // Generate request ID for correlation
    const requestId = req.headers['x-request-id'] as string || 
                     `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // OpenAI chat çağrısı – workspaceId opsiyonel
    // Use generateChatResponse (same as /chat/openai) instead of callChatModel
    const result = await generateChatResponse({
      messages,
      modelId,
      userId,
      conversationId: req.body.conversationId || req.headers['x-conversation-id'] as string | undefined,
      requestId,
    });

    // On success, decrement credits and increment daily usage
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { decrement: CREDIT_COSTS.CHAT },
        dailyUsageChat: { increment: 1 },
      },
    });

    // Log success summary
    console.log('\n' + '='.repeat(60));
    console.log(`✅ ${route} Request Success Summary`);
    console.log('='.repeat(60));
    console.log(`Request ID: ${result.requestId}`);
    console.log(`User ID: ${userId}`);
    console.log(`Requested Model: ${requestedModelId}`);
    console.log(`Resolved Model: ${modelId}`);
    console.log(`Requested Workspace: ${requestedWorkspaceId || 'none'}`);
    console.log(`Resolved Workspace: ${activeWorkspaceId || 'none'}`);
    console.log(`Workspace Fallback Used: ${activeWorkspaceId !== null && activeWorkspaceId !== requestedWorkspaceId}`);
    console.log(`Message Count: ${messages.length}`);
    console.log(`Response Length: ${result.outputText?.length || result.text?.length || 0} characters`);
    console.log('✅ Successfully sent to OpenAI and received response');
    console.log('='.repeat(60) + '\n');

    // Broadcast chat message to user's other devices via WebSocket
    const wsService = getWebSocketService();
    if (wsService) {
      wsService.broadcastToUser(userId, {
        type: 'chat_message',
        data: {
          requestId: result.requestId,
          message: result.outputText || result.text,
          workspaceId: activeWorkspaceId,
          model: modelId,
          timestamp: new Date().toISOString()
        },
        timestamp: Date.now(),
        userId
      });
    }

    console.log(`[${route}] Sending success response`);
    
    // Standardized response format for both endpoints
    const responseText = result.outputText || result.text;
    return res.status(200).json({
      requestId: result.requestId,
      outputText: responseText,  // Primary field
      reply: responseText,       // Backward compatibility
      text: responseText,        // Backward compatibility
      model: modelId,
      resolvedWorkspaceId: activeWorkspaceId || undefined,
      workspaceFallbackUsed: activeWorkspaceId !== null && activeWorkspaceId !== requestedWorkspaceId,
      modelRedirected: route === '/chat' && requestedModelId !== 'synexa-gpt-5.1',
      originalModelId: requestedModelId,
      resolvedModelId: modelId,
    });
  } catch (error: any) {
    console.error(`[${route}] Unexpected error:`, error);

    // Handle timeout errors specifically
    if (error?.status === 504 || (error?.message && error.message.includes('timeout'))) {
      return res.status(504).json({
        error: 'UPSTREAM_TIMEOUT',
        message: 'OpenAI timed out',
        requestId: error?.requestId || `req_${Date.now()}`,
      });
    }
    
    // BURADA Özellikle workspace ile ilgili custom 404 dönme YASAK:
    // workspace_not_found vs. hiçbir özel case olmayacak.
    // Asla 404 "Not found" dönme - always return 500 for internal errors
    const status = error?.status ?? error?.response?.status ?? 500;
    
    // Only return 500 for internal errors, never 404
    const finalStatus = status === 404 ? 500 : status;
    
    return res.status(finalStatus).json({ 
      error: 'CHAT_FAILED',
      message: error?.message || 'An unexpected error occurred',
      requestId: error?.requestId || `req_${Date.now()}`,
    });
  }
}

/**
 * POST /chat/openai
 * 
 * OpenAI-specific chat endpoint
 * Requires authentication
 * Workspace is OPTIONAL - chat works without it
 * NEVER returns "Workspace not found" or 404 error
 * 
 * IMPORTANT: This route must be defined BEFORE /chat to ensure proper route matching
 * Router is mounted at /chat, so this becomes /chat/openai
 */
router.post('/openai', authMiddleware, async (req: Request, res: Response) => {
  // Use the common OpenAI handler
  return handleOpenAIChat(req, res, '/chat/openai');
});

/**
 * POST /chat
 * 
 * Generic chat endpoint (wrapper for different providers)
 * Requires authentication
 * Workspace is OPTIONAL - chat works without it
 * NEVER returns "Workspace not found" or 404 error
 * 
 * All model IDs (synexa-gemini-3, synexa-deepseek, synexa-qwen, etc.) are redirected to synexa-gpt-5.1
 * 
 * Router is mounted at /chat, so this route handles /chat directly
 * IMPORTANT: This route must be defined AFTER /openai to ensure /chat/openai requests are handled correctly
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  console.log('[Chat] Generic /chat endpoint called', {
    modelId: req.body?.modelId,
    engine: req.body?.engine,
  });
  
  // Şimdilik tüm modelleri OpenAI üzerinden çalıştırmak istiyorum
  // İleride provider'a göre yönlendirme yapacağız ama şu an için
  // direkt OpenAI handler'ını kullan:
  return handleOpenAIChat(req, res, '/chat');
});

export default router;

