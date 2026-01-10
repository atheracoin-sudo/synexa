'use client'

import { Bell, BellOff, Settings, MessageCircle, Sparkles } from 'lucide-react'

interface NotificationEmptyStateProps {
  type: 'no_notifications' | 'no_unread' | 'notifications_disabled' | 'category_disabled'
  category?: string
  onAction?: () => void
  className?: string
}

export function NotificationEmptyState({ 
  type, 
  category, 
  onAction, 
  className 
}: NotificationEmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'no_notifications':
        return {
          icon: <Bell size={48} className="text-gray-600 mx-auto mb-4" />,
          title: 'Henüz bir bildirim yok',
          description: 'Synexa senin için önemli olanları burada gösterir.',
          actionText: null,
          actionIcon: null
        }

      case 'no_unread':
        return {
          icon: <Bell size={48} className="text-green-500 mx-auto mb-4" />,
          title: 'Tüm bildirimler okundu! ✨',
          description: 'Yeni bildirimler geldiğinde burada görünecek.',
          actionText: null,
          actionIcon: null
        }

      case 'notifications_disabled':
        return {
          icon: <BellOff size={48} className="text-gray-600 mx-auto mb-4" />,
          title: 'Bildirimler kapalı',
          description: 'Önemli güncellemeleri kaçırmamak için bildirimleri aç.',
          actionText: 'Bildirimleri Aç',
          actionIcon: <Settings size={16} />
        }

      case 'category_disabled':
        return {
          icon: <BellOff size={48} className="text-gray-600 mx-auto mb-4" />,
          title: `${category} bildirimleri kapalı`,
          description: 'Bu kategorideki bildirimleri görmek için ayarlardan açabilirsin.',
          actionText: 'Ayarlara Git',
          actionIcon: <Settings size={16} />
        }

      default:
        return {
          icon: <Bell size={48} className="text-gray-600 mx-auto mb-4" />,
          title: 'Bildirim yok',
          description: 'Şu anda gösterilecek bildirim bulunmuyor.',
          actionText: null,
          actionIcon: null
        }
    }
  }

  const content = getEmptyStateContent()

  return (
    <div className={`p-8 text-center ${className}`}>
      {content.icon}
      
      <h4 className="text-white font-medium mb-2">
        {content.title}
      </h4>
      
      <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
        {content.description}
      </p>

      {content.actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {content.actionIcon}
          {content.actionText}
        </button>
      )}
    </div>
  )
}

// Specialized empty states for different contexts
export function ChatNotificationEmptyState() {
  return (
    <div className="p-8 text-center">
      <MessageCircle size={48} className="text-blue-400 mx-auto mb-4" />
      <h4 className="text-white font-medium mb-2">
        Chat bildirimlerin burada görünecek
      </h4>
      <p className="text-gray-400 text-sm">
        Yeni mesajlar ve chat güncellemeleri için buraya bak.
      </p>
    </div>
  )
}

export function SystemNotificationEmptyState() {
  return (
    <div className="p-8 text-center">
      <Settings size={48} className="text-green-400 mx-auto mb-4" />
      <h4 className="text-white font-medium mb-2">
        Sistem bildirimlerin temiz ✨
      </h4>
      <p className="text-gray-400 text-sm">
        Güvenlik ve sistem güncellemeleri burada görünür.
      </p>
    </div>
  )
}

export function UpdateNotificationEmptyState() {
  return (
    <div className="p-8 text-center">
      <Sparkles size={48} className="text-purple-400 mx-auto mb-4" />
      <h4 className="text-white font-medium mb-2">
        Yeni özellik bildirimleri burada
      </h4>
      <p className="text-gray-400 text-sm">
        Synexa'daki yeniliklerden ilk sen haberdar ol.
      </p>
    </div>
  )
}

// Loading state for notifications
export function NotificationLoadingState() {
  return (
    <div className="p-8">
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-800 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-800 rounded w-3/4"></div>
              <div className="h-3 bg-gray-800 rounded w-1/2"></div>
            </div>
            <div className="w-12 h-3 bg-gray-800 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Error state for notifications
export function NotificationErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="p-8 text-center">
      <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Bell size={24} className="text-red-400" />
      </div>
      
      <h4 className="text-white font-medium mb-2">
        Bildirimler yüklenemedi
      </h4>
      
      <p className="text-gray-400 text-sm mb-6">
        Bağlantı sorunu yaşıyor olabilirsin.
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Tekrar Dene
        </button>
      )}
    </div>
  )
}

// First time user notification state
export function FirstTimeNotificationState() {
  return (
    <div className="p-8 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Bell size={24} className="text-white" />
      </div>
      
      <h4 className="text-white font-medium mb-2">
        Synexa'ya hoş geldin! 👋
      </h4>
      
      <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
        Önemli güncellemeler, hatırlatmalar ve başarıların burada görünecek.
      </p>

      <div className="bg-gray-800/50 rounded-xl p-4">
        <p className="text-gray-400 text-xs">
          💡 İpucu: Bildirim tercihlerini ayarlardan özelleştirebilirsin.
        </p>
      </div>
    </div>
  )
}






