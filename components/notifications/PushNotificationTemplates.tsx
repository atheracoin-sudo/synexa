'use client'

import { Bell, Code2, Image, Users, Clock, Award, AlertTriangle } from 'lucide-react'
import type { Notification } from '@/lib/notifications'

interface PushNotificationPreviewProps {
  notification: Notification
  className?: string
}

// Push notification preview component for testing/demo
export function PushNotificationPreview({ notification, className }: PushNotificationPreviewProps) {
  const getIcon = () => {
    switch (notification.icon) {
      case 'Code2': return <Code2 size={16} className="text-blue-400" />
      case 'Image': return <Image size={16} className="text-green-400" />
      case 'Users': return <Users size={16} className="text-purple-400" />
      case 'Clock': return <Clock size={16} className="text-yellow-400" />
      case 'Award': return <Award size={16} className="text-orange-400" />
      case 'AlertTriangle': return <AlertTriangle size={16} className="text-red-400" />
      default: return <Bell size={16} className="text-gray-400" />
    }
  }

  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-lg max-w-sm ${className}`}>
      {/* App Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">S</span>
        </div>
        <span className="text-white text-sm font-medium">Synexa</span>
        <span className="text-gray-400 text-xs ml-auto">şimdi</span>
      </div>

      {/* Notification Content */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white text-sm font-medium mb-1">
            {notification.title}
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            {notification.message}
          </p>
        </div>
      </div>
    </div>
  )
}

// Push notification templates for different scenarios
export const pushNotificationTemplates = {
  inactiveUser: {
    title: 'Bir süredir görüşemedik 👋',
    message: 'Synexa\'da devam etmek ister misin?',
    icon: 'MessageCircle',
    actionUrl: '/chat'
  },
  
  halfFinishedWork: {
    title: 'Yarım kalan işin var 🚀',
    message: 'Başladığın projeyi bitirmek ister misin?',
    icon: 'Code2',
    actionUrl: '/studio/code'
  },
  
  usageMilestone: {
    title: 'Tebrikler! 🎉',
    message: 'Synexa ile 5 tasarım oluşturdun.',
    icon: 'Award',
    actionUrl: '/analytics'
  },
  
  limitWarning: {
    title: 'Limit yaklaşıyor ⚠️',
    message: 'Bugün için 2 işlem kaldı.',
    icon: 'AlertTriangle',
    actionUrl: '/pricing'
  },
  
  referralJoined: {
    title: 'Arkadaşın katıldı! 🚀',
    message: 'alice@example.com davetini kabul etti.',
    icon: 'Users',
    actionUrl: '/invite'
  },
  
  newFeature: {
    title: 'Yeni özellikler! ✨',
    message: 'AI Agents artık kullanılabilir.',
    icon: 'Sparkles',
    actionUrl: '/agents'
  }
}

// Push notification service simulation
export class PushNotificationService {
  private static instance: PushNotificationService

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService()
    }
    return PushNotificationService.instance
  }

  // Check if push notifications are supported
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator
  }

  // Request permission for push notifications
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      return 'denied'
    }

    const permission = await Notification.requestPermission()
    return permission
  }

  // Send a push notification
  async sendNotification(notification: {
    title: string
    message: string
    icon?: string
    actionUrl?: string
  }): Promise<void> {
    const permission = await this.requestPermission()
    
    if (permission !== 'granted') {
      console.log('Push notification permission denied')
      return
    }

    // In a real app, this would send to a push service
    // For demo, we'll show a browser notification
    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: '/icons/synexa-icon-192.png', // App icon
      badge: '/icons/synexa-badge-72.png', // Small badge icon
      tag: 'synexa-notification',
      requireInteraction: false,
      silent: false
    })

    // Handle notification click
    browserNotification.onclick = () => {
      window.focus()
      if (notification.actionUrl) {
        window.location.href = notification.actionUrl
      }
      browserNotification.close()
    }

    // Auto close after 5 seconds
    setTimeout(() => {
      browserNotification.close()
    }, 5000)
  }

  // Send notification based on template
  async sendTemplateNotification(templateKey: keyof typeof pushNotificationTemplates, customData?: any): Promise<void> {
    const template = pushNotificationTemplates[templateKey]
    
    let message = template.message
    if (customData) {
      // Replace placeholders in message
      message = message.replace(/\{(\w+)\}/g, (match, key) => customData[key] || match)
    }

    await this.sendNotification({
      title: template.title,
      message,
      icon: template.icon,
      actionUrl: template.actionUrl
    })
  }

  // Check if user should receive push notification (respects quiet hours, etc.)
  shouldSendPushNotification(userId: string): boolean {
    try {
      const settings = JSON.parse(localStorage.getItem(`synexa_notification_settings_${userId}`) || '{}')
      
      // Check if push notifications are enabled
      if (!settings.push) return false
      
      // Check quiet hours
      if (settings.quietHours?.enabled) {
        const now = new Date()
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
        
        const start = settings.quietHours.start
        const end = settings.quietHours.end
        
        // Simple time range check
        if (start < end && currentTime >= start && currentTime <= end) {
          return false
        }
      }
      
      return true
    } catch (error) {
      console.error('Failed to check push notification settings:', error)
      return false
    }
  }

  // Daily limit check (max 1 push per day)
  canSendDailyPush(userId: string): boolean {
    const today = new Date().toDateString()
    const lastPushDate = localStorage.getItem(`synexa_last_push_${userId}`)
    
    if (lastPushDate === today) {
      return false // Already sent today
    }
    
    return true
  }

  // Mark that a push was sent today
  markPushSentToday(userId: string): void {
    const today = new Date().toDateString()
    localStorage.setItem(`synexa_last_push_${userId}`, today)
  }
}

// Export singleton instance
export const pushNotificationService = PushNotificationService.getInstance()






