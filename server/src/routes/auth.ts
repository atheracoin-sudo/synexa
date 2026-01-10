/**
 * Auth Routes
 * 
 * Handles authentication endpoints
 */

import { Router, Request, Response } from 'express';
import { findOrCreateUserByEmail, getOrCreateUserWithUsage, getPlanLimits } from '../services/userService';
import { issueTokenForUser } from '../services/authService';
import { authMiddleware } from '../middleware/authMiddleware';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /auth/demo
 * 
 * Demo authentication endpoint
 * Creates or finds a user with the provided email (or generates a demo email)
 * Returns JWT token and user info
 */
router.post('/demo', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    let userEmail: string;

    if (email && typeof email === 'string' && email.trim()) {
      userEmail = email.trim().toLowerCase();
    } else {
      // Generate a random demo email
      const randomId = Math.random().toString(36).substring(2, 9);
      userEmail = `demo_${randomId}@synexa.local`;
    }

    // Find or create user
    const user = await findOrCreateUserByEmail(userEmail, 'demo');

    // Ensure daily usage is reset if needed
    const userWithUsage = await getOrCreateUserWithUsage(user.id);
    const limits = getPlanLimits(userWithUsage.plan);

    // Issue JWT token
    const token = issueTokenForUser(userWithUsage);

    // Return token and user info (never return sensitive data)
    res.json({
      token,
      user: {
        id: userWithUsage.id,
        email: userWithUsage.email,
        name: userWithUsage.name,
        provider: userWithUsage.provider,
        plan: userWithUsage.plan,
        credits: userWithUsage.credits,
        usageToday: {
          chat: userWithUsage.dailyUsageChat,
          image: userWithUsage.dailyUsageImage,
          video: userWithUsage.dailyUsageVideo,
        },
        limits,
      },
    });
  } catch (error: any) {
    console.error('Auth demo error:', error);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
});

/**
 * GET /auth/me
 * 
 * Get current user info from token
 * Requires authentication
 */
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    // Ensure daily usage is reset if needed
    const userWithUsage = await getOrCreateUserWithUsage(userId);
    const limits = getPlanLimits(userWithUsage.plan);

    // Return user info with account details
    res.json({
      user: {
        id: userWithUsage.id,
        email: userWithUsage.email,
        name: userWithUsage.name,
        picture: userWithUsage.picture,
        provider: userWithUsage.provider,
        plan: userWithUsage.plan,
        credits: userWithUsage.credits,
        usageToday: {
          chat: userWithUsage.dailyUsageChat,
          image: userWithUsage.dailyUsageImage,
          video: userWithUsage.dailyUsageVideo,
        },
        limits,
        createdAt: userWithUsage.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

/**
 * GET /auth/google
 * 
 * TODO: Google OAuth initiation
 * This will redirect to Google OAuth consent screen
 */
router.get('/google', (req: Request, res: Response) => {
  // TODO: Implement Google OAuth flow
  res.status(501).json({ 
    error: 'Google OAuth not yet implemented',
    message: 'Please use /auth/demo for now',
  });
});

/**
 * GET /auth/google/callback
 * 
 * TODO: Google OAuth callback
 * Handles the redirect from Google after user consent
 */
router.get('/google/callback', (req: Request, res: Response) => {
  // TODO: Implement Google OAuth callback
  res.status(501).json({ 
    error: 'Google OAuth not yet implemented',
    message: 'Please use /auth/demo for now',
  });
});

export default router;

