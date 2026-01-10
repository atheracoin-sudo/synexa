'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useChangelog } from '@/lib/hooks/useChangelog'
import WhatsNewModal from './WhatsNewModal'

interface WhatsNewButtonProps {
  userId: string
  className?: string
  variant?: 'icon' | 'text' | 'badge'
}

export default function WhatsNewButton({ 
  userId, 
  className = '',
  variant = 'icon'
}: WhatsNewButtonProps) {
  const { unreadCount, shouldShowWhatsNew } = useChangelog(userId)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Don't show button if no unread versions
  if (unreadCount === 0) return null

  const handleClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`relative w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors group ${className}`}
          aria-label="Yenilikler"
        >
          <Sparkles className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
          
          {/* Unread Badge */}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xs font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </div>
          )}
          
          {/* Pulse Animation for New Features */}
          {shouldShowWhatsNew && (
            <div className="absolute inset-0 w-10 h-10 bg-green-500 rounded-lg animate-ping opacity-20"></div>
          )}
        </button>

        <WhatsNewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          userId={userId}
        />
      </>
    )
  }

  if (variant === 'text') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group ${className}`}
        >
          <Sparkles className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
            Yenilikler
          </span>
          
          {/* Unread Badge */}
          {unreadCount > 0 && (
            <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </div>
          )}
        </button>

        <WhatsNewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          userId={userId}
        />
      </>
    )
  }

  if (variant === 'badge') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`relative inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium hover:bg-green-500/30 transition-colors ${className}`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Yeni</span>
          
          {/* Pulse Ring */}
          {shouldShowWhatsNew && (
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
          )}
        </button>

        <WhatsNewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          userId={userId}
        />
      </>
    )
  }

  return null
}

// Specialized header button for GlobalHeader
export function WhatsNewHeaderButton({ userId }: { userId: string }) {
  return (
    <WhatsNewButton 
      userId={userId} 
      variant="icon"
      className="shrink-0"
    />
  )
}








