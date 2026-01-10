export type NotificationType = 'system' | 'activity' | 'reminder' | 'growth' | 'updates'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Notification {
  id: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  icon: string
  timestamp: string
  isRead: boolean
  actionUrl?: string
  actionText?: string
  metadata?: Record<string, any>
}

export interface NotificationSettings {
  inApp: boolean
  push: boolean
  email: boolean
  categories: {
    system: boolean
    activity: boolean
    reminder: boolean
    growth: boolean
    updates: boolean
  }
  quietHours: {
    enabled: boolean
    start: string // HH:MM format
    end: string   // HH:MM format
  }
}

export interface SmartReminderTrigger {
  id: string
  type: 'inactive_user' | 'half_finished_work' | 'usage_milestone' | 'limit_reminder'
  condition: (userData: any) => boolean
  createNotification: (userData: any) => Omit<Notification, 'id' | 'timestamp' | 'isRead'>
  cooldown: number // hours
  lastTriggered?: string
}

export class NotificationManager {
  private static instance: NotificationManager

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager()
    }
    return NotificationManager.instance
  }

  // Get user's notifications
  getNotifications(userId: string): Notification[] {
    const stored = localStorage.getItem(`synexa_notifications_${userId}`)
    if (stored) {
      return JSON.parse(stored)
    }

    // Mock notifications for demonstration
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'activity',
        priority: 'medium',
        title: 'Projen hazır! 🎉',
        message: 'Todo App React projen başarıyla oluşturuldu.',
        icon: 'Code2',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        isRead: false,
        actionUrl: '/studio/code',
        actionText: 'Projeyi Gör'
      },
      {
        id: '2',
        type: 'reminder',
        priority: 'medium',
        title: 'Yarım kalan işin var 👋',
        message: 'Başladığın tasarımı bitirmek ister misin?',
        icon: 'Image',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        isRead: false,
        actionUrl: '/studio/image',
        actionText: 'Devam Et'
      },
      {
        id: '3',
        type: 'growth',
        priority: 'low',
        title: 'Arkadaşın katıldı! 🚀',
        message: 'alice@example.com davetini kabul etti.',
        icon: 'Users',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        isRead: true,
        actionUrl: '/invite',
        actionText: 'Ödülünü Gör'
      },
      {
        id: '4',
        type: 'system',
        priority: 'high',
        title: 'Yeni özellikler! ✨',
        message: 'AI Agents ve Team Workspace artık kullanılabilir.',
        icon: 'Sparkles',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        isRead: true,
        actionUrl: '/agents',
        actionText: 'Keşfet'
      }
    ]

    this.saveNotifications(userId, mockNotifications)
    return mockNotifications
  }

  // Save notifications
  saveNotifications(userId: string, notifications: Notification[]): void {
    localStorage.setItem(`synexa_notifications_${userId}`, JSON.stringify(notifications))
  }

  // Add new notification
  addNotification(userId: string, notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): void {
    const notifications = this.getNotifications(userId)
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      isRead: false
    }

    notifications.unshift(newNotification)
    
    // Keep only last 50 notifications
    if (notifications.length > 50) {
      notifications.splice(50)
    }

    this.saveNotifications(userId, notifications)
  }

  // Mark notification as read
  markAsRead(userId: string, notificationId: string): void {
    const notifications = this.getNotifications(userId)
    const notification = notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.isRead = true
      this.saveNotifications(userId, notifications)
    }
  }

  // Mark all as read
  markAllAsRead(userId: string): void {
    const notifications = this.getNotifications(userId)
    notifications.forEach(n => n.isRead = true)
    this.saveNotifications(userId, notifications)
  }

  // Get unread count
  getUnreadCount(userId: string): number {
    const notifications = this.getNotifications(userId)
    return notifications.filter(n => !n.isRead).length
  }

  // Get notifications by type
  getNotificationsByType(userId: string, type: NotificationType): Notification[] {
    const notifications = this.getNotifications(userId)
    return notifications.filter(n => n.type === type)
  }

  // Get unread notifications
  getUnreadNotifications(userId: string): Notification[] {
    const notifications = this.getNotifications(userId)
    return notifications.filter(n => !n.isRead)
  }

  // Delete notification
  deleteNotification(userId: string, notificationId: string): void {
    const notifications = this.getNotifications(userId)
    const filteredNotifications = notifications.filter(n => n.id !== notificationId)
    this.saveNotifications(userId, filteredNotifications)
  }

  // Clear all notifications
  clearAllNotifications(userId: string): void {
    this.saveNotifications(userId, [])
  }

  // Get notification settings
  getNotificationSettings(userId: string): NotificationSettings {
    const stored = localStorage.getItem(`synexa_notification_settings_${userId}`)
    if (stored) {
      return JSON.parse(stored)
    }

    // Default settings - minimal and user-friendly
    const defaultSettings: NotificationSettings = {
      inApp: true,
      push: false, // Off by default to avoid spam
      email: false, // Off by default
      categories: {
        system: true,
        activity: true,
        reminder: true,
        growth: true,
        updates: false // Product updates off by default
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      }
    }

    this.saveNotificationSettings(userId, defaultSettings)
    return defaultSettings
  }

  // Save notification settings
  saveNotificationSettings(userId: string, settings: NotificationSettings): void {
    localStorage.setItem(`synexa_notification_settings_${userId}`, JSON.stringify(settings))
  }

  // Smart reminder triggers
  getSmartReminderTriggers(): SmartReminderTrigger[] {
    return [
      {
        id: 'inactive_user',
        type: 'inactive_user',
        condition: (userData) => {
          const lastActivity = userData.lastActiveDate
          if (!lastActivity) return false
          
          const daysSinceActivity = (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
          return daysSinceActivity >= 2 && daysSinceActivity <= 7
        },
        createNotification: (userData) => ({
          type: 'reminder',
          priority: 'medium',
          title: 'Bir süredir görüşemedik 👋',
          message: 'Synexa\'da devam etmek ister misin?',
          icon: 'MessageCircle',
          actionUrl: '/chat',
          actionText: 'Devam Et'
        }),
        cooldown: 48 // 2 days
      },
      {
        id: 'half_finished_work',
        type: 'half_finished_work',
        condition: (userData) => {
          // Check if user has projects in draft/incomplete state
          return userData.incompleteProjects > 0
        },
        createNotification: (userData) => ({
          type: 'reminder',
          priority: 'medium',
          title: 'Yarım kalan işin var 🚀',
          message: 'Başladığın projeyi bitirmek ister misin?',
          icon: 'Code2',
          actionUrl: '/studio/code',
          actionText: 'Projeye Dön'
        }),
        cooldown: 24 // 1 day
      },
      {
        id: 'usage_milestone_5_designs',
        type: 'usage_milestone',
        condition: (userData) => {
          return userData.imageDesigns === 5
        },
        createNotification: (userData) => ({
          type: 'activity',
          priority: 'low',
          title: 'Tebrikler! 🎉',
          message: 'Synexa ile 5 tasarım oluşturdun.',
          icon: 'Award',
          actionUrl: '/analytics',
          actionText: 'İstatistikleri Gör'
        }),
        cooldown: 0 // Only trigger once
      },
      {
        id: 'limit_reminder',
        type: 'limit_reminder',
        condition: (userData) => {
          const usagePercent = (userData.chatMessages / userData.chatLimit) * 100
          return usagePercent >= 80 && usagePercent < 100
        },
        createNotification: (userData) => ({
          type: 'reminder',
          priority: 'medium',
          title: 'Limit yaklaşıyor ⚠️',
          message: `Bugün için ${userData.chatLimit - userData.chatMessages} mesaj kaldı.`,
          icon: 'AlertTriangle',
          actionUrl: '/analytics',
          actionText: 'Kullanımı Gör'
        }),
        cooldown: 12 // 12 hours
      }
    ]
  }

  // Check and trigger smart reminders
  checkSmartReminders(userId: string, userData: any): void {
    const triggers = this.getSmartReminderTriggers()
    const settings = this.getNotificationSettings(userId)
    
    // Skip if reminders are disabled
    if (!settings.categories.reminder) return

    triggers.forEach(trigger => {
      // Check cooldown
      if (trigger.lastTriggered) {
        const hoursSinceLastTrigger = (Date.now() - new Date(trigger.lastTriggered).getTime()) / (1000 * 60 * 60)
        if (hoursSinceLastTrigger < trigger.cooldown) return
      }

      // Check condition
      if (trigger.condition(userData)) {
        const notification = trigger.createNotification(userData)
        this.addNotification(userId, notification)
        
        // Update last triggered time
        trigger.lastTriggered = new Date().toISOString()
      }
    })
  }

  // Format timestamp for display
  formatTimestamp(timestamp: string): string {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffMs = now.getTime() - notificationTime.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return 'Şimdi'
    if (diffMinutes < 60) return `${diffMinutes}dk önce`
    if (diffHours < 24) return `${diffHours}s önce`
    if (diffDays < 7) return `${diffDays}g önce`
    
    return notificationTime.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  // Get notification icon component name
  getNotificationIcon(notification: Notification): string {
    if (notification.icon) return notification.icon
    
    switch (notification.type) {
      case 'system': return 'Settings'
      case 'activity': return 'Activity'
      case 'reminder': return 'Clock'
      case 'growth': return 'Users'
      case 'updates': return 'Sparkles'
      default: return 'Bell'
    }
  }

  // Check if notification should be shown (quiet hours, etc.)
  shouldShowNotification(userId: string, notification: Notification): boolean {
    const settings = this.getNotificationSettings(userId)
    
    // Check if category is enabled
    if (!settings.categories[notification.type]) return false
    
    // Check quiet hours
    if (settings.quietHours.enabled) {
      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      
      const start = settings.quietHours.start
      const end = settings.quietHours.end
      
      // Simple time range check (doesn't handle overnight ranges)
      if (start < end) {
        if (currentTime >= start && currentTime <= end) return false
      }
    }
    
    return true
  }

  // Simulate push notification (would integrate with actual push service)
  sendPushNotification(userId: string, notification: Notification): void {
    const settings = this.getNotificationSettings(userId)
    
    if (!settings.push) return
    if (!this.shouldShowNotification(userId, notification)) return
    
    // In a real app, this would send to push notification service
    console.log('Push notification sent:', {
      title: notification.title,
      body: notification.message,
      userId
    })
  }

  // Add changelog update notification
  addChangelogUpdateNotification(userId: string, versionId: string, versionTitle: string, summary: string): void {
    const settings = this.getNotificationSettings(userId)
    
    // Skip if updates notifications are disabled
    if (!settings.categories.updates) return
    
    // Check if we already sent notification for this version
    const notifications = this.getNotifications(userId)
    const existingNotification = notifications.find(n => 
      n.type === 'updates' && n.metadata?.versionId === versionId
    )
    
    if (existingNotification) return // Already notified
    
    const notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'> = {
      type: 'updates',
      priority: 'medium',
      title: 'Yeni özellik eklendi 🚀',
      message: `${versionTitle}: ${summary}`,
      icon: 'Sparkles',
      actionUrl: '/changelog',
      actionText: 'Gör',
      metadata: {
        versionId,
        versionTitle,
        summary
      }
    }
    
    this.addNotification(userId, notification)
  }

  // Add feature-specific update notification
  addFeatureUpdateNotification(userId: string, featureTitle: string, featureDescription: string, actionUrl?: string): void {
    const settings = this.getNotificationSettings(userId)
    
    // Skip if updates notifications are disabled
    if (!settings.categories.updates) return
    
    const notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'> = {
      type: 'updates',
      priority: 'low',
      title: `${featureTitle} artık kullanılabilir ✨`,
      message: featureDescription,
      icon: 'Sparkles',
      actionUrl: actionUrl || '/changelog',
      actionText: 'Keşfet',
      metadata: {
        featureTitle,
        featureDescription
      }
    }
    
    this.addNotification(userId, notification)
  }

  // Generate weekly summary
  generateWeeklySummary(userId: string): string {
    // This would generate a weekly summary email
    return `
      Bu hafta Synexa ile harika işler yaptın! 
      
      📊 Bu hafta özet:
      - 15 chat mesajı
      - 2 kod projesi
      - 3 tasarım
      
      Devam etmek için: https://synexa.ai
    `
  }
}

// Export singleton instance
export const notificationManager = NotificationManager.getInstance()
