'use client'

import { useState, useEffect, useCallback } from 'react'
import { notificationManager, Notification, NotificationSettings } from '@/lib/notifications'

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [loading, setLoading] = useState(true)

  // Load notifications and settings
  const loadData = useCallback(() => {
    try {
      const userNotifications = notificationManager.getNotifications(userId)
      const userSettings = notificationManager.getNotificationSettings(userId)
      
      setNotifications(userNotifications)
      setUnreadCount(notificationManager.getUnreadCount(userId))
      setSettings(userSettings)
    } catch (error) {
      console.error('Failed to load notification data:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Initial load
  useEffect(() => {
    if (userId) {
      loadData()
    }
  }, [userId, loadData])

  // Add new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    notificationManager.addNotification(userId, notification)
    loadData() // Refresh data
  }, [userId, loadData])

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    notificationManager.markAsRead(userId, notificationId)
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [userId])

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    notificationManager.markAllAsRead(userId)
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }, [userId])

  // Delete notification
  const deleteNotification = useCallback((notificationId: string) => {
    notificationManager.deleteNotification(userId, notificationId)
    setNotifications(prev => {
      const filtered = prev.filter(n => n.id !== notificationId)
      const deletedNotification = prev.find(n => n.id === notificationId)
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1))
      }
      return filtered
    })
  }, [userId])

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    notificationManager.clearAllNotifications(userId)
    setNotifications([])
    setUnreadCount(0)
  }, [userId])

  // Update settings
  const updateSettings = useCallback((newSettings: NotificationSettings) => {
    notificationManager.saveNotificationSettings(userId, newSettings)
    setSettings(newSettings)
  }, [userId])

  // Get unread notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(n => !n.isRead)
  }, [notifications])

  // Get notifications by type
  const getNotificationsByType = useCallback((type: string) => {
    return notifications.filter(n => n.type === type)
  }, [notifications])

  // Check smart reminders (would be called periodically)
  const checkSmartReminders = useCallback((userData: any) => {
    notificationManager.checkSmartReminders(userId, userData)
    loadData() // Refresh after checking
  }, [userId, loadData])

  return {
    notifications,
    unreadCount,
    settings,
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    getUnreadNotifications,
    getNotificationsByType,
    checkSmartReminders,
    refresh: loadData
  }
}





