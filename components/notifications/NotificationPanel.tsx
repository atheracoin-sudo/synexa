'use client'

import { useState, useEffect } from 'react'
import { X, Bell, MessageCircle, Code2, Image, Settings, Activity, Clock, Users, Sparkles, Award, AlertTriangle, Trash2 } from 'lucide-react'
import { notificationManager, Notification, NotificationType } from '@/lib/notifications'
import { NotificationEmptyState, NotificationLoadingState } from './NotificationEmptyStates'

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
    const iconProps = { size: 20, className: "text-gray-400" }
    
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
      case 'system': return 'text-blue-400'
      case 'activity': return 'text-green-400'
      case 'reminder': return 'text-yellow-400'
      case 'growth': return 'text-purple-400'
      case 'updates': return 'text-cyan-400'
      default: return 'text-gray-400'
    }
  }

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed top-16 right-4 w-96 max-w-[calc(100vw-2rem)] bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl z-50 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-gray-400" />
            <h3 className="text-lg font-semibold text-white">Bildirimler</h3>
            {unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Tümü ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'unread'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Okunmamış ({unreadCount})
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between p-3 border-b border-gray-800">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Tümünü okundu işaretle
              </button>
            )}
            <button
              onClick={handleClearAll}
              className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
            >
              <Trash2 size={14} />
              Tümünü temizle
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <NotificationLoadingState />
          ) : filteredNotifications.length === 0 ? (
            <NotificationEmptyState
              type={activeTab === 'unread' ? 'no_unread' : 'no_notifications'}
            />
          ) : (
            <div className="divide-y divide-gray-800">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-gray-800/50 cursor-pointer transition-colors group ${
                    !notification.isRead ? 'bg-gray-800/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-medium ${
                          !notification.isRead ? 'text-white' : 'text-gray-300'
                        }`}>
                          {notification.title}
                        </h4>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-500">
                            {notificationManager.formatTimestamp(notification.timestamp)}
                          </span>
                          <button
                            onClick={(e) => handleDeleteNotification(notification.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-all"
                          >
                            <X size={14} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                      
                      <p className={`text-sm mt-1 ${
                        !notification.isRead ? 'text-gray-300' : 'text-gray-400'
                      }`}>
                        {notification.message}
                      </p>
                      
                      {notification.actionText && (
                        <div className="mt-2">
                          <span className="text-xs text-blue-400 font-medium">
                            {notification.actionText} →
                          </span>
                        </div>
                      )}
                      
                      {/* Type indicator */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full bg-gray-800 ${getTypeColor(notification.type)}`}>
                          {notification.type === 'system' && 'Sistem'}
                          {notification.type === 'activity' && 'Aktivite'}
                          {notification.type === 'reminder' && 'Hatırlatma'}
                          {notification.type === 'growth' && 'Büyüme'}
                          {notification.type === 'updates' && 'Güncellemeler'}
                        </span>
                        
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-800">
            <button
              onClick={() => window.location.href = '/profile'}
              className="w-full text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              Bildirim ayarları →
            </button>
          </div>
        )}
      </div>
    </>
  )
}
