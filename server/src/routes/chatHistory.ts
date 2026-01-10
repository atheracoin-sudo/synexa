/**
 * Chat History Routes
 * 
 * Handles chat message persistence and retrieval (user-scoped)
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /chat/:workspaceId
 * 
 * Get chat messages for a workspace
 * Ensures the workspace belongs to the authenticated user
 * 
 * Query params:
 * - limit: number of messages to return (default: 50)
 * - offset: pagination offset (default: 0)
 */
router.get('/:workspaceId', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { workspaceId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    // Verify workspace belongs to user
    const workspace = await prisma.workspace.findFirst({
      where: { id: workspaceId, userId },
    });

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Get messages (most recent first, then reverse for chronological order)
    const messages = await prisma.chatMessage.findMany({
      where: { workspaceId, userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // Reverse to get chronological order
    messages.reverse();

    res.json({ messages });
  } catch (error: any) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ error: 'Failed to get chat messages' });
  }
});

/**
 * POST /chat/:workspaceId
 * 
 * Save chat messages (typically user message + assistant reply)
 * Ensures the workspace belongs to the authenticated user
 * 
 * Body: {
 *   messages: [
 *     { role: 'user' | 'assistant' | 'system', content: string },
 *     ...
 *   ]
 * }
 */
router.post('/:workspaceId', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { workspaceId } = req.params;
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Verify workspace belongs to user
    const workspace = await prisma.workspace.findFirst({
      where: { id: workspaceId, userId },
    });

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Validate and create messages
    const validRoles = ['user', 'assistant', 'system'];
    const chatMessages = messages
      .filter((msg: any) => {
        return (
          msg &&
          typeof msg.role === 'string' &&
          validRoles.includes(msg.role) &&
          typeof msg.content === 'string'
        );
      })
      .map((msg: any) => ({
        workspaceId,
        userId,
        role: msg.role,
        content: msg.content.trim(),
      }));

    if (chatMessages.length === 0) {
      return res.status(400).json({ error: 'No valid messages provided' });
    }

    // Create messages in bulk
    const created = await prisma.chatMessage.createMany({
      data: chatMessages,
    });

    res.status(201).json({ 
      message: 'Messages saved',
      count: created.count,
    });
  } catch (error: any) {
    console.error('Save chat messages error:', error);
    res.status(500).json({ error: 'Failed to save chat messages' });
  }
});

/**
 * DELETE /chat/:workspaceId
 * 
 * Delete all chat messages for a workspace
 * Ensures the workspace belongs to the authenticated user
 */
router.delete('/:workspaceId', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { workspaceId } = req.params;

    // Verify workspace belongs to user
    const workspace = await prisma.workspace.findFirst({
      where: { id: workspaceId, userId },
    });

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Delete all messages for this workspace
    await prisma.chatMessage.deleteMany({
      where: { workspaceId, userId },
    });

    res.json({ message: 'Chat history cleared' });
  } catch (error: any) {
    console.error('Delete chat messages error:', error);
    res.status(500).json({ error: 'Failed to delete chat messages' });
  }
});

export default router;




