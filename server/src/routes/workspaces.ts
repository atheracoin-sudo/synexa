/**
 * Workspaces Routes
 * 
 * Handles workspace CRUD operations (user-scoped)
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/authMiddleware';
import { getOrCreateDefaultWorkspace } from '../services/userService';
import { getWebSocketService } from '../services/websocketService';

const router = Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /workspaces
 * 
 * Get all workspaces for the authenticated user
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    
    // Diagnostic log for userId comparison
    console.log('\n' + '='.repeat(70));
    console.log('🔍 [Workspaces Endpoint] GET /workspaces');
    console.log('='.repeat(70));
    console.log('👤 Resolved userId for this request:', userId);
    console.log('📋 Query: findMany({ where: { userId: "' + userId + '" } })');
    console.log('='.repeat(70));
    
    const workspaces = await prisma.workspace.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
    
    console.log('✅ Found', workspaces.length, 'workspace(s) for userId:', userId);
    console.log('📋 Workspace IDs:', workspaces.map(ws => ws.id).join(', '));
    console.log('='.repeat(70) + '\n');

    res.json({ workspaces });
  } catch (error: any) {
    console.error('Get workspaces error:', error);
    res.status(500).json({ error: 'Failed to get workspaces' });
  }
});

/**
 * POST /workspaces
 * 
 * Create a new workspace for the authenticated user
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, icon } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Workspace name is required' });
    }

    const workspace = await prisma.workspace.create({
      data: {
        userId,
        name: name.trim(),
        icon: icon || null,
      },
    });

    // Broadcast workspace creation to user's other devices
    const wsService = getWebSocketService();
    if (wsService) {
      wsService.broadcastToUser(userId, {
        type: 'workspace_update',
        data: {
          action: 'created',
          workspace,
          timestamp: new Date().toISOString()
        },
        timestamp: Date.now(),
        userId
      });
    }

    res.status(201).json({ workspace });
  } catch (error: any) {
    console.error('Create workspace error:', error);
    res.status(500).json({ error: 'Failed to create workspace' });
  }
});

/**
 * PATCH /workspaces/:id
 * 
 * Update a workspace (currently only name and icon)
 * Ensures the workspace belongs to the authenticated user
 */
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { name, icon } = req.body;

    // Verify workspace belongs to user
    const existingWorkspace = await prisma.workspace.findFirst({
      where: { id, userId },
    });

    if (!existingWorkspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Build update data
    const updateData: { name?: string; icon?: string | null } = {};
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Invalid workspace name' });
      }
      updateData.name = name.trim();
    }
    if (icon !== undefined) {
      updateData.icon = icon || null;
    }

    const workspace = await prisma.workspace.update({
      where: { id },
      data: updateData,
    });

    // Broadcast workspace update to user's other devices
    const wsService = getWebSocketService();
    if (wsService) {
      wsService.broadcastToUser(userId, {
        type: 'workspace_update',
        data: {
          action: 'updated',
          workspace,
          timestamp: new Date().toISOString()
        },
        timestamp: Date.now(),
        userId
      });
    }

    res.json({ workspace });
  } catch (error: any) {
    console.error('Update workspace error:', error);
    res.status(500).json({ error: 'Failed to update workspace' });
  }
});

/**
 * DELETE /workspaces/:id
 * 
 * Delete a workspace
 * Ensures the workspace belongs to the authenticated user
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Verify workspace belongs to user
    const existingWorkspace = await prisma.workspace.findFirst({
      where: { id, userId },
    });

    if (!existingWorkspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Delete workspace (cascade will delete chat messages)
    await prisma.workspace.delete({
      where: { id },
    });

    res.json({ message: 'Workspace deleted' });
  } catch (error: any) {
    console.error('Delete workspace error:', error);
    res.status(500).json({ error: 'Failed to delete workspace' });
  }
});

/**
 * POST /workspaces/ensure-default
 * 
 * Ensure user has at least one workspace (creates default if none exist)
 */
router.post('/ensure-default', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    const workspace = await getOrCreateDefaultWorkspace(userId);

    res.json({ workspace });
  } catch (error: any) {
    console.error('Ensure default workspace error:', error);
    res.status(500).json({ error: 'Failed to ensure default workspace' });
  }
});

export default router;




