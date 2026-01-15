'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { IconButton } from '@/components/ui'
import { NotificationPanel } from './NotificationPanel'
import { useNotifications } from '@/lib/hooks/useNotifications'

interface NotificationBellProps {
  userId: string
  className?: string
}

export function NotificationBell({ userId, className }: NotificationBellProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const { unreadCount, loading } = useNotifications(userId)

  const handleBellClick = () => {
    setIsPanelOpen(!isPanelOpen)
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
  }

  return (
    <>
      <div className="relative">
        <IconButton
          variant="ghost"
          size="sm"
          onClick={handleBellClick}
          className={`shrink-0 relative ${className}`}
          aria-label="Bildirimler"
          disabled={loading}
        >
          <Bell className="h-5 w-5" />
          
          {/* Unread count badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-lg">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          
          {/* Loading indicator */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </IconButton>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        userId={userId}
      />
    </>
  )
}











