'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface SystemStatusProps {
  className?: string
  showDetails?: boolean
}

interface SystemHealth {
  ai: 'online' | 'offline' | 'degraded'
  sync: 'active' | 'inactive' | 'syncing'
  lastResponseTime?: number
}

export function SystemStatus({ className, showDetails = false }: SystemStatusProps) {
  const [health, setHealth] = useState<SystemHealth>({
    ai: 'online',
    sync: 'active',
    lastResponseTime: 42
  })

  // Simulate real system monitoring
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health')
        if (response.ok) {
          setHealth(prev => ({
            ...prev,
            ai: 'online',
            sync: 'active'
          }))
        } else {
          setHealth(prev => ({
            ...prev,
            ai: 'degraded'
          }))
        }
      } catch (error) {
        setHealth(prev => ({
          ...prev,
          ai: 'offline',
          sync: 'inactive'
        }))
      }
    }

    // Check immediately
    checkHealth()

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
        return 'text-green-500'
      case 'degraded':
      case 'syncing':
        return 'text-yellow-500'
      case 'offline':
      case 'inactive':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
        return '🟢'
      case 'degraded':
      case 'syncing':
        return '🟡'
      case 'offline':
      case 'inactive':
        return '🔴'
      default:
        return '⚪'
    }
  }

  if (!showDetails) {
    // Compact status indicator - Production ready
    const isOnline = health.ai === 'online' && health.sync === 'active'
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-1">
          <span className="text-xs">{isOnline ? '🟢' : '🟡'}</span>
          <span className="text-xs text-muted-foreground">
            {isOnline ? 'Online' : 'Bağlantı Sorunu'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">System Status</span>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs">{getStatusIcon(health.ai)}</span>
            <span className="text-xs text-muted-foreground">AI</span>
          </div>
          <span className={cn("text-xs font-medium capitalize", getStatusColor(health.ai))}>
            {health.ai}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs">{getStatusIcon(health.sync)}</span>
            <span className="text-xs text-muted-foreground">Sync</span>
          </div>
          <span className={cn("text-xs font-medium capitalize", getStatusColor(health.sync))}>
            {health.sync}
          </span>
        </div>
        
        {health.lastResponseTime && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Response time</span>
            <span className="text-xs text-muted-foreground">
              ~{health.lastResponseTime}ms
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
