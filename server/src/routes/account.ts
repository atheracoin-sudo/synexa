/**
 * Account Routes
 * 
 * Handles account information and usage endpoints
 */

import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { getOrCreateUserWithUsage, getPlanLimits, calculateWarnings } from '../services/userService';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /account
 * 
 * Get full account state including plan, credits, usage, and limits
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    // Ensure daily usage is reset if needed
    const user = await getOrCreateUserWithUsage(userId);
    const limits = getPlanLimits(user.plan);
    const warnings = calculateWarnings(user);

    res.json({
      plan: user.plan,
      credits: user.credits,
      usageToday: {
        chat: user.dailyUsageChat,
        image: user.dailyUsageImage,
        video: user.dailyUsageVideo,
      },
      limits,
      warnings,
    });
  } catch (error: any) {
    console.error('Get account error:', error);
    res.status(500).json({ error: 'Failed to get account info' });
  }
});

export default router;

