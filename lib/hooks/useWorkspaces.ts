/**
 * React hook for workspace management
 */

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api/client'
import { useAuth } from './useAuth'

export interface Workspace {
  id: string
  name: string
  userId: string
  createdAt: string
  updatedAt: string
}

export function useWorkspaces() {
  const { isAuthenticated } = useAuth()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load workspaces
  const loadWorkspaces = async () => {
    if (!isAuthenticated) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.getWorkspaces()
      
      if (response.success && response.data) {
        setWorkspaces(response.data)
        
        // Set active workspace if none selected
        if (!activeWorkspaceId && response.data.length > 0) {
          const savedWorkspaceId = localStorage.getItem('synexa_active_workspace')
          const validWorkspace = response.data.find(w => w.id === savedWorkspaceId)
          
          setActiveWorkspaceId(validWorkspace?.id || response.data[0].id)
        }
      } else {
        setError(response.error?.message || 'Failed to load workspaces')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load workspaces')
    } finally {
      setIsLoading(false)
    }
  }

  // Create workspace
  const createWorkspace = async (name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.createWorkspace(name)
      
      if (response.success && response.data) {
        setWorkspaces(prev => [...(Array.isArray(prev) ? prev : []), response.data!])
        setActiveWorkspaceId(response.data.id)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.error?.message || 'Failed to create workspace' 
        }
      }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.message || 'Failed to create workspace' 
      }
    }
  }

  // Update workspace
  const updateWorkspace = async (id: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.updateWorkspace(id, name)
      
      if (response.success && response.data) {
        setWorkspaces(prev => 
          (Array.isArray(prev) ? prev : []).map(w => w.id === id ? response.data! : w)
        )
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.error?.message || 'Failed to update workspace' 
        }
      }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.message || 'Failed to update workspace' 
      }
    }
  }

  // Delete workspace
  const deleteWorkspace = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.deleteWorkspace(id)
      
      if (response.success) {
        setWorkspaces(prev => (Array.isArray(prev) ? prev : []).filter(w => w.id !== id))
        
        // If deleted workspace was active, switch to another one
        if (activeWorkspaceId === id) {
          const remaining = workspaces.filter(w => w.id !== id)
          setActiveWorkspaceId(remaining.length > 0 ? remaining[0].id : null)
        }
        
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.error?.message || 'Failed to delete workspace' 
        }
      }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.message || 'Failed to delete workspace' 
      }
    }
  }

  // Set active workspace
  const setActiveWorkspace = (id: string | null) => {
    setActiveWorkspaceId(id)
    if (id) {
      localStorage.setItem('synexa_active_workspace', id)
    } else {
      localStorage.removeItem('synexa_active_workspace')
    }
  }

  // Get active workspace
  const activeWorkspace = Array.isArray(workspaces) ? workspaces.find(w => w.id === activeWorkspaceId) || null : null

  // Load workspaces when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadWorkspaces()
    } else {
      setWorkspaces([])
      setActiveWorkspaceId(null)
    }
  }, [isAuthenticated])

  return {
    workspaces,
    activeWorkspace,
    activeWorkspaceId,
    isLoading,
    error,
    loadWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    setActiveWorkspace
  }
}
