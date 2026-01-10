/**
 * Video generation route handler
 */

import { Router, Request, Response } from 'express';
import { callVideoScriptModel } from '../services/videoScriptProvider';
import { VideoRequestBody, VideoResponseBody } from '../types/video';
import { authMiddleware } from '../middleware/authMiddleware';
import { getOrCreateUserWithUsage, canUseFeature } from '../services/userService';
import { CREDIT_COSTS } from '../constants/credits';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /video
 * 
 * Requires authentication
 * Enforces credits and daily limits before calling the AI provider
 */
router.post('/video', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    // Validate request body
    const body = req.body as VideoRequestBody;

    if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid request: prompt is required and must not be empty' });
    }

    if (!body.length || !['15s', '30s'].includes(body.length)) {
      return res.status(400).json({ error: 'Invalid request: length must be 15s or 30s' });
    }

    if (!body.format || !['portrait', 'square'].includes(body.format)) {
      return res.status(400).json({ error: 'Invalid request: format must be portrait or square' });
    }

    if (!body.modelId || typeof body.modelId !== 'string') {
      return res.status(400).json({ error: 'Invalid request: modelId is required' });
    }

    // Validate prompt length
    if (body.prompt.length > 1000) {
      return res.status(400).json({ error: 'Invalid request: prompt must be 1000 characters or less' });
    }

    // Check credits and daily limits
    const user = await getOrCreateUserWithUsage(userId);
    const check = canUseFeature(user, 'video', CREDIT_COSTS.VIDEO);

    if (!check.allowed) {
      return res.status(403).json({
        code: check.reason!,
        feature: 'video',
        message: check.reason === 'INSUFFICIENT_CREDITS'
          ? 'Insufficient credits. Please purchase more credits or upgrade your plan.'
          : 'Daily video limit reached. Please upgrade to Pro for unlimited videos.',
      });
    }

    // Extract workspace from headers (optional)
    const workspaceId = req.headers['x-workspace-id'] as string | undefined;

    // Call video script provider service (generates script text)
    const scriptResult = await callVideoScriptModel(body, workspaceId);

    // For now, return placeholder video URL with generated script
    // TODO: In future, integrate actual video generation API
    const demoVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    const demoThumbnailUrl = `https://placehold.co/512x512/8B5CF6/FFFFFF?text=${encodeURIComponent(body.prompt.substring(0, 20))}`;

    // On success, decrement credits and increment daily usage
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { decrement: CREDIT_COSTS.VIDEO },
        dailyUsageVideo: { increment: 1 },
      },
    });

    const response: VideoResponseBody = {
      id: `video_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      url: scriptResult.isDemo ? demoVideoUrl : demoVideoUrl, // Placeholder until real video API
      thumbnailUrl: demoThumbnailUrl,
      isDemo: scriptResult.isDemo,
      script: scriptResult.script, // Include generated script
    };

    res.json(response);
  } catch (error: any) {
    console.error('Video route error:', error);
    res.status(500).json({ 
      error: 'Video generation failed',
      message: error.message || 'Internal server error',
    });
  }
});

export default router;

