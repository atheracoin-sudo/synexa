/**
 * Image generation route handler
 */

import { Router, Request, Response } from 'express';
import { callImageModel } from '../services/imageProvider';
import { ImageRequestBody, ImageResponseBody } from '../types/image';
import { authMiddleware } from '../middleware/authMiddleware';
import { getOrCreateUserWithUsage, canUseFeature } from '../services/userService';
import { CREDIT_COSTS } from '../constants/credits';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /image
 * 
 * Requires authentication
 * Enforces credits and daily limits before calling the AI provider
 */
router.post('/image', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    // Validate request body
    const body = req.body as ImageRequestBody;

    if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid request: prompt is required and must not be empty' });
    }

    if (!body.style || !['realistic', 'anime', '3d', 'illustration'].includes(body.style)) {
      return res.status(400).json({ error: 'Invalid request: style must be realistic, anime, 3d, or illustration' });
    }

    if (!body.modelId || typeof body.modelId !== 'string') {
      return res.status(400).json({ error: 'Invalid request: modelId is required' });
    }

    // Validate prompt length (DALL-E has limits)
    if (body.prompt.length > 1000) {
      return res.status(400).json({ error: 'Invalid request: prompt must be 1000 characters or less' });
    }

    // Check credits and daily limits
    const user = await getOrCreateUserWithUsage(userId);
    const check = canUseFeature(user, 'image', CREDIT_COSTS.IMAGE);

    if (!check.allowed) {
      return res.status(403).json({
        code: check.reason!,
        feature: 'image',
        message: check.reason === 'INSUFFICIENT_CREDITS'
          ? 'Insufficient credits. Please purchase more credits or upgrade your plan.'
          : 'Daily image limit reached. Please upgrade to Pro for unlimited images.',
      });
    }

    // Extract workspace from headers (optional)
    const workspaceId = req.headers['x-workspace-id'] as string | undefined;

    // Call image provider service
    const result = await callImageModel(body, workspaceId);

    // On success, decrement credits and increment daily usage
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { decrement: CREDIT_COSTS.IMAGE },
        dailyUsageImage: { increment: 1 },
      },
    });

    const response: ImageResponseBody = {
      id: `img_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      url: result.url,
      isDemo: result.isDemo,
    };

    res.json(response);
  } catch (error: any) {
    console.error('Image route error:', error);
    res.status(500).json({ 
      error: 'Image generation failed',
      message: error.message || 'Internal server error',
    });
  }
});

export default router;

