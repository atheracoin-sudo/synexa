'use client'

import { useSync } from '@/lib/hooks/useSync'
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from './Button'

interface SyncStatusProps {
  className?: string
  showDetails?: boolean
}

export function SyncStatus({ className = '', showDetails = false }: SyncStatusProps) {
  const { syncStatus, triggerSync, isOnline, lastSync, syncError } = useSync()

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never'
    
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  if (!showDetails) {
    // Compact version - just the icon
    return (
      <div className={`flex items-center ${className}`}>
        {isOnline ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-500" />
        )}
        {syncError && (
          <AlertCircle className="h-4 w-4 text-yellow-500 ml-1" />
        )}
      </div>
    )
  }

  // Detailed version
  return (
    <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
      <div className="flex items-center gap-1">
        {isOnline ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-500" />
        )}
        <span>{isOnline ? 'Online' : 'Offline'}</span>
      </div>

      {lastSync && (
        <div className="flex items-center gap-1">
          <span>•</span>
          <span>Synced {formatLastSync(lastSync)}</span>
        </div>
      )}

      {syncError && (
        <div className="flex items-center gap-1 text-yellow-600">
          <AlertCircle className="h-4 w-4" />
          <span>Sync error</span>
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={triggerSync}
        disabled={!isOnline}
        className="h-6 px-2"
      >
        <RefreshCw className="h-3 w-3" />
      </Button>
    </div>
  )
}







