/**
 * User Service
 * 
 * Handles user-related database operations
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateUserData {
  email: string;
  provider: 'google' | 'local' | 'demo';
  name?: string;
  picture?: string;
}

/**
 * Find or create a user by email
 */
export async function findOrCreateUserByEmail(
  email: string,
  provider: 'google' | 'local' | 'demo',
  name?: string,
  picture?: string
) {
  // Try to find existing user
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Create new user
    user = await prisma.user.create({
      data: {
        email,
        provider,
        name: name || null,
        picture: picture || null,
      },
    });
  } else {
    // Update user if provider info changed (e.g., name/picture from Google)
    if (name || picture) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: name || user.name,
          picture: picture || user.picture,
          // Update provider if switching from demo to real auth
          provider: user.provider === 'demo' ? provider : user.provider,
        },
      });
    }
  }

  return user;
}

/**
 * Get user by ID
 */
export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      workspaces: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

/**
 * Get or create a default workspace for a user
 * Returns the first workspace, or creates one named "Synexa"
 */
export async function getOrCreateDefaultWorkspace(userId: string) {
  // Check if user has any workspaces
  const existingWorkspaces = await prisma.workspace.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    take: 1,
  });

  if (existingWorkspaces.length > 0) {
    return existingWorkspaces[0];
  }

  // Create default workspace with name "Synexa" and icon "✨"
  return await prisma.workspace.create({
    data: {
      userId,
      name: 'Synexa',
      icon: '✨',
    },
  });
}

/**
 * Resolve workspace ID for chat requests
 * 
 * Simple rule: Always return a valid workspace ID, never throw 404
 * 
 * Strategy:
 * 1. If workspaceId provided: Try to find it by ID only
 * 2. If not found: Use user's first workspace (fallback)
 * 3. If user has no workspaces: Create default workspace
 * 4. If no workspaceId provided: Use user's first workspace or create default
 * 
 * @param userId - Current user ID from auth context
 * @param requestedWorkspaceId - Optional workspace ID from request
 * @returns Object with resolved workspace ID and strategy used
 */
export async function resolveWorkspaceForChat(
  userId: string,
  requestedWorkspaceId?: string
): Promise<{ workspaceId: string | null; strategy: 'requested' | 'fallback_existing' | 'created_default' | 'no_workspace' }> {
  // Get all user workspaces first (for logging and fallback)
  const userWorkspaces = await prisma.workspace.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });

  // Strategy 1: Workspace ID provided - try to find it
  if (requestedWorkspaceId) {
    // First, try to find in user's workspaces (more efficient and secure)
    const requestedWorkspace = userWorkspaces.find(w => w.id === requestedWorkspaceId);
    
    if (requestedWorkspace) {
      // Found workspace in user's list - use it
      return { workspaceId: requestedWorkspace.id, strategy: 'requested' };
    }

    // Workspace ID provided but not found in user's workspaces
    // Fallback to first workspace
    if (userWorkspaces.length > 0) {
      // Use first workspace (prefer "Synexa" if exists)
      const synexaWorkspace = userWorkspaces.find(ws => ws.name === 'Synexa');
      const fallbackWorkspace = synexaWorkspace || userWorkspaces[0];
      
      console.log(`[resolveWorkspaceForChat] Requested workspaceId ${requestedWorkspaceId} not found in user's workspaces, using fallback workspace ${fallbackWorkspace.id} for user ${userId}`);
      
      return { workspaceId: fallbackWorkspace.id, strategy: 'fallback_existing' };
    }

    // User has no workspaces - return null (caller should handle this)
    console.log(`[resolveWorkspaceForChat] User ${userId} has no workspaces, cannot resolve workspace.`);
    return { workspaceId: null, strategy: 'no_workspace' };
  }

  // Strategy 2: No workspace ID provided - use user's first workspace or return null
  if (userWorkspaces.length > 0) {
    const synexaWorkspace = userWorkspaces.find(ws => ws.name === 'Synexa');
    const firstWorkspace = synexaWorkspace || userWorkspaces[0];
    return { workspaceId: firstWorkspace.id, strategy: 'fallback_existing' };
  }

  // No workspaces - return null (caller should handle this)
  console.log(`[resolveWorkspaceForChat] User ${userId} has no workspaces, cannot resolve workspace.`);
  return { workspaceId: null, strategy: 'no_workspace' };
}

/**
 * Get all workspaces for a user
 */
export async function getUserWorkspaces(userId: string) {
  return await prisma.workspace.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });
}

/**
 * Get or create user with usage tracking
 * Ensures daily usage is reset if needed (if dailyUsageResetAt is before today)
 * Returns user with fresh dailyUsage fields and credits
 */
export async function getOrCreateUserWithUsage(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Check if we need to reset daily usage
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const resetAt = user.dailyUsageResetAt ? new Date(user.dailyUsageResetAt) : null;
  const resetAtDate = resetAt ? new Date(resetAt.getFullYear(), resetAt.getMonth(), resetAt.getDate()) : null;

  // If resetAt is null or before today, reset daily usage
  if (!resetAtDate || resetAtDate < today) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        dailyUsageChat: 0,
        dailyUsageImage: 0,
        dailyUsageVideo: 0,
        dailyUsageResetAt: now,
      },
    });
    return updatedUser;
  }

  return user;
}

/**
 * Get plan limits based on plan type
 */
export function getPlanLimits(plan: string): {
  chat: { maxPerDay: number };
  image: { maxPerDay: number };
  video: { maxPerDay: number };
} {
  switch (plan) {
    case 'PRO_MONTHLY':
    case 'PRO_YEARLY':
      return {
        chat: { maxPerDay: Infinity },
        image: { maxPerDay: Infinity },
        video: { maxPerDay: Infinity },
      };
    case 'FREE':
    default:
      return {
        chat: { maxPerDay: 50 },
        image: { maxPerDay: 10 },
        video: { maxPerDay: 5 },
      };
  }
}

/**
 * Check if user can use a feature (sufficient credits and within daily limits)
 */
export function canUseFeature(
  user: {
    plan: string;
    credits: number;
    dailyUsageChat: number;
    dailyUsageImage: number;
    dailyUsageVideo: number;
  },
  feature: 'chat' | 'image' | 'video',
  creditCost: number
): { allowed: boolean; reason?: 'INSUFFICIENT_CREDITS' | 'DAILY_LIMIT_REACHED' } {
  // Check credits
  if (user.credits < creditCost) {
    return { allowed: false, reason: 'INSUFFICIENT_CREDITS' };
  }

  // Check daily limits
  const limits = getPlanLimits(user.plan);
  let currentUsage = 0;
  let maxPerDay = 0;

  if (feature === 'chat') {
    currentUsage = user.dailyUsageChat;
    maxPerDay = limits.chat.maxPerDay;
  } else if (feature === 'image') {
    currentUsage = user.dailyUsageImage;
    maxPerDay = limits.image.maxPerDay;
  } else if (feature === 'video') {
    currentUsage = user.dailyUsageVideo;
    maxPerDay = limits.video.maxPerDay;
  }

  if (maxPerDay !== Infinity && currentUsage >= maxPerDay) {
    return { allowed: false, reason: 'DAILY_LIMIT_REACHED' };
  }

  return { allowed: true };
}

/**
 * Calculate warnings for user account
 * Returns warnings about low credits and near daily limits
 */
export function calculateWarnings(
  user: {
    plan: string;
    credits: number;
    dailyUsageChat: number;
    dailyUsageImage: number;
    dailyUsageVideo: number;
  },
  lowCreditsThreshold: number = 20
): {
  lowCredits: boolean;
  nearDailyLimit: {
    chat: boolean;
    image: boolean;
    video: boolean;
  };
} {
  const warnings = {
    lowCredits: user.credits < lowCreditsThreshold,
    nearDailyLimit: {
      chat: false,
      image: false,
      video: false,
    },
  };

  // Check near daily limits (80% threshold)
  const limits = getPlanLimits(user.plan);
  const threshold = 0.8;

  if (limits.chat.maxPerDay !== Infinity) {
    warnings.nearDailyLimit.chat = user.dailyUsageChat >= limits.chat.maxPerDay * threshold;
  }

  if (limits.image.maxPerDay !== Infinity) {
    warnings.nearDailyLimit.image = user.dailyUsageImage >= limits.image.maxPerDay * threshold;
  }

  if (limits.video.maxPerDay !== Infinity) {
    warnings.nearDailyLimit.video = user.dailyUsageVideo >= limits.video.maxPerDay * threshold;
  }

  return warnings;
}

