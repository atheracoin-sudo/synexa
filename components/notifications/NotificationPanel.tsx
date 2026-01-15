'use client'

import { useState, useEffect } from 'react'
import { Bell, MessageCircle, Code2, Image, Settings, Activity, Clock, Users, Sparkles, Award, AlertTriangle, Trash2 } from 'lucide-react'
import { notificationManager, Notification, NotificationType } from '@/lib/notifications'
import { NotificationEmptyState, NotificationLoadingState } from './NotificationEmptyStates'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetBody, 
  SheetFooter, 
  SheetTitle, 
  SheetClose 
} from '@/components/ui/sheet'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function NotificationPanel({ isOpen, onClose, userId }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen, userId])

  const loadNotifications = () => {
    setLoading(true)
    try {
      const userNotifications = notificationManager.getNotifications(userId)
      setNotifications(userNotifications)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      notificationManager.markAsRead(userId, notification.id)
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      )
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  const handleMarkAllAsRead = () => {
    notificationManager.markAllAsRead(userId)
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const handleDeleteNotification = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    notificationManager.deleteNotification(userId, notificationId)
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  const handleClearAll = () => {
    notificationManager.clearAllNotifications(userId)
    setNotifications([])
  }

  const getIcon = (notification: Notification) => {
    const iconName = notificationManager.getNotificationIcon(notification)
    const iconProps = { size: 20, className: "text-muted-foreground" }
    
    switch (iconName) {
      case 'MessageCircle': return <MessageCircle {...iconProps} />
      case 'Code2': return <Code2 {...iconProps} />
      case 'Image': return <Image {...iconProps} />
      case 'Settings': return <Settings {...iconProps} />
      case 'Activity': return <Activity {...iconProps} />
      case 'Clock': return <Clock {...iconProps} />
      case 'Users': return <Users {...iconProps} />
      case 'Sparkles': return <Sparkles {...iconProps} />
      case 'Award': return <Award {...iconProps} />
      case 'AlertTriangle': return <AlertTriangle {...iconProps} />
      default: return <Bell {...iconProps} />
    }
  }

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case 'system': return 'text-blue-500'
      case 'activity': return 'text-green-500'
      case 'reminder': return 'text-yellow-500'
      case 'growth': return 'text-purple-500'
      case 'updates': return 'text-cyan-500'
      default: return 'text-muted-foreground'
    }
  }

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" size="md" className="bg-card border-border shadow-2xl">
        {/* Header */}
        <SheetHeader className="border-b border-border">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-muted-foreground" />
            <SheetTitle>Bildirimler</SheetTitle>
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          <SheetClose onClick={onClose} />
        </SheetHeader>

        {/* Tabs */}
        <div className="flex border-b border-border px-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-foreground border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Tümü ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'unread'
                ? 'text-foreground border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Okunmamış ({unreadCount})
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between p-3 border-b border-border">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Tümünü okundu işaretle
              </button>
            )}
            <button
              onClick={handleClearAll}
              className="text-sm text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1.5 font-medium"
            >
              <Trash2 size={14} />
              Tümünü temizle
            </button>
          </div>
        )}

        {/* Notifications List */}
        <SheetBody className="p-0">
          {loading ? (
            <NotificationLoadingState />
          ) : filteredNotifications.length === 0 ? (
            <NotificationEmptyState
              type={activeTab === 'unread' ? 'no_unread' : 'no_notifications'}
            />
          ) : (
            <div className="divide-y divide-border">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors group ${
                    !notification.isRead ? 'bg-muted/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-medium ${
                          !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {notification.title}
                        </h4>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-muted-foreground">
                            {notificationManager.formatTimestamp(notification.timestamp)}
                          </span>
                          <button
                            onClick={(e) => handleDeleteNotification(notification.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                          >
                            <Trash2 size={14} className="text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                      
                      <p className={`text-sm mt-1 leading-relaxed ${
                        !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {notification.message}
                      </p>
                      
                      {notification.actionText && (
                        <div className="mt-2">
                          <span className="text-xs text-primary font-medium">
                            {notification.actionText} →
                          </span>
                        </div>
                      )}
                      
                      {/* Type indicator */}
                      <div className="flex items-center gap-2 mt-3">
                        <span className={`text-xs px-2 py-1 rounded-full bg-muted ${getTypeColor(notification.type)}`}>
                          {notification.type === 'system' && 'Sistem'}
                          {notification.type === 'activity' && 'Aktivite'}
                          {notification.type === 'reminder' && 'Hatırlatma'}
                          {notification.type === 'growth' && 'Büyüme'}
                          {notification.type === 'updates' && 'Güncellemeler'}
                        </span>
                        
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SheetBody>

        {/* Footer */}
        {notifications.length > 0 && (
          <SheetFooter className="border-t border-border">
            <button
              onClick={() => window.location.href = '/notifications'}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Tüm bildirimleri görüntüle →
            </button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
