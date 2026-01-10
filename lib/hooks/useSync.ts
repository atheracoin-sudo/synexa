import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useWorkspaces } from '@/lib/hooks/useWorkspaces'
import { getWebSocketClient, SyncEvent } from '@/lib/sync/websocket'

interface SyncStatus {
  isOnline: boolean
  lastSync: Date | null
  pendingChanges: number
  syncError: string | null
}

export function useSync() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: null,
    pendingChanges: 0,
    syncError: null
  })

  const { isAuthenticated } = useAuth()
  const { loadWorkspaces } = useWorkspaces()
  const syncIntervalRef = useRef<NodeJS.Timeout>()
  const wsClientRef = useRef<ReturnType<typeof getWebSocketClient> | null>(null)

  // Sync function
  const performSync = async () => {
    if (!isAuthenticated) return

    try {
      // Sync workspaces
      await loadWorkspaces()
      
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        syncError: null,
        pendingChanges: 0
      }))
    } catch (error: any) {
      setSyncStatus(prev => ({
        ...prev,
        syncError: error.message || 'Sync failed'
      }))
    }
  }

  // Manual sync trigger
  const triggerSync = () => {
    performSync()
  }

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }))
      if (isAuthenticated) {
        performSync() // Auto-sync when coming back online
      }
    }

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [isAuthenticated])

  // WebSocket connection management
  const connectWebSocket = async () => {
    if (!isAuthenticated || wsClientRef.current?.isConnected) return

    try {
      wsClientRef.current = getWebSocketClient()
      
      // Set up event listeners
      wsClientRef.current.on('chat_message', (event: SyncEvent) => {
        console.log('[Sync] Received chat message:', event.data)
      })

      wsClientRef.current.on('workspace_update', (event: SyncEvent) => {
        console.log('[Sync] Workspace updated:', event.data)
        loadWorkspaces()
      })

      await wsClientRef.current.connect()
      
      setSyncStatus(prev => ({
        ...prev,
        syncError: null
      }))
    } catch (error) {
      console.error('[Sync] WebSocket connection failed:', error)
      setSyncStatus(prev => ({
        ...prev,
        syncError: 'Real-time sync unavailable'
      }))
    }
  }

  // Periodic sync when authenticated and online
  useEffect(() => {
    if (isAuthenticated && syncStatus.isOnline) {
      // Initial sync
      performSync()
      connectWebSocket()

      // Set up periodic sync (every 5 minutes)
      syncIntervalRef.current = setInterval(performSync, 5 * 60 * 1000)
    } else {
      // Clear interval when not authenticated or offline
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
        syncIntervalRef.current = undefined
      }
      
      // Disconnect WebSocket
      if (wsClientRef.current) {
        wsClientRef.current.disconnect()
        wsClientRef.current = null
      }
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
      if (wsClientRef.current) {
        wsClientRef.current.disconnect()
      }
    }
  }, [isAuthenticated, syncStatus.isOnline])

  // Sync on tab focus (when user returns to the app)
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated && syncStatus.isOnline) {
        performSync()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isAuthenticated, syncStatus.isOnline])

  return {
    syncStatus,
    triggerSync,
    isOnline: syncStatus.isOnline,
    lastSync: syncStatus.lastSync,
    syncError: syncStatus.syncError
  }
}
