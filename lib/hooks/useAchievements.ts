'use client'

import { useState, useEffect, useCallback } from 'react'
import { achievementsManager, Achievement, UserProgress } from '@/lib/achievements'

export function useAchievements(userId: string = 'user_1') {
  const [userProgress, setUserProgress] = useState<UserProgress>(
    achievementsManager.getUserProgress(userId)
  )
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([])
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [currentUnlock, setCurrentUnlock] = useState<Achievement | null>(null)

  // Refresh user progress
  const refreshProgress = useCallback(() => {
    const progress = achievementsManager.getUserProgress(userId)
    setUserProgress(progress)
  }, [userId])

  // Track user action and check for new achievements
  const trackAction = useCallback((action: string, value?: number) => {
    const newAchievements = achievementsManager.simulateUserAction(userId, action, value)
    
    if (newAchievements.length > 0) {
      setNewlyUnlocked(newAchievements)
      setCurrentUnlock(newAchievements[0])
      setShowUnlockModal(true)
      refreshProgress()
    }
    
    return newAchievements
  }, [userId, refreshProgress])

  // Mark achievement as notified
  const markAsNotified = useCallback((achievementId: string) => {
    achievementsManager.markAsNotified(userId, achievementId)
    refreshProgress()
  }, [userId, refreshProgress])

  // Set selected badge
  const setSelectedBadge = useCallback((achievementId: string) => {
    achievementsManager.setSelectedBadge(userId, achievementId)
    refreshProgress()
  }, [userId, refreshProgress])

  // Get unlocked achievements
  const unlockedAchievements = achievementsManager.getUnlockedAchievements(userId)
  
  // Get achievement stats
  const stats = achievementsManager.getAchievementStats(userId)

  // Get achievements by category
  const getAchievementsByCategory = useCallback((category: any) => {
    return achievementsManager.getAchievementsByCategory(category, userId)
  }, [userId])

  // Get achievement progress
  const getProgress = useCallback((achievementId: string) => {
    return achievementsManager.getAchievementProgress(userId, achievementId)
  }, [userId])

  // Check if achievement is unlocked
  const isUnlocked = useCallback((achievementId: string) => {
    return userProgress.achievements[achievementId]?.isUnlocked || false
  }, [userProgress])

  // Close unlock modal
  const closeUnlockModal = useCallback(() => {
    setShowUnlockModal(false)
    setCurrentUnlock(null)
    if (newlyUnlocked.length > 0) {
      // Mark as notified
      newlyUnlocked.forEach(achievement => {
        markAsNotified(achievement.id)
      })
      setNewlyUnlocked([])
    }
  }, [newlyUnlocked, markAsNotified])

  return {
    // Data
    userProgress,
    unlockedAchievements,
    stats,
    newlyUnlocked,
    currentUnlock,
    showUnlockModal,
    
    // Actions
    trackAction,
    markAsNotified,
    setSelectedBadge,
    refreshProgress,
    closeUnlockModal,
    
    // Utils
    getAchievementsByCategory,
    getProgress,
    isUnlocked
  }
}

// Hook for specific achievement tracking
export function useAchievementTracking(userId: string = 'user_1') {
  const { trackAction } = useAchievements(userId)

  // Chat actions
  const trackChatMessage = useCallback(() => {
    return trackAction('send_chat_message')
  }, [trackAction])

  // Code actions
  const trackAppCreation = useCallback(() => {
    return trackAction('create_app')
  }, [trackAction])

  // Image actions
  const trackDesignCreation = useCallback(() => {
    return trackAction('create_design')
  }, [trackAction])

  // Agent actions
  const trackAgentUsage = useCallback(() => {
    return trackAction('use_agent')
  }, [trackAction])

  // General actions
  const trackFeatureUsage = useCallback((feature: string) => {
    const progress = achievementsManager.getUserProgress(userId)
    const updates = {
      featuresUsed: [...progress.stats.featuresUsed, feature]
    }
    return achievementsManager.updateUserStats(userId, updates)
  }, [userId])

  const trackDailyActivity = useCallback(() => {
    const progress = achievementsManager.getUserProgress(userId)
    const updates = {
      daysActive: progress.stats.daysActive + 1
    }
    return achievementsManager.updateUserStats(userId, updates)
  }, [userId])

  return {
    trackChatMessage,
    trackAppCreation,
    trackDesignCreation,
    trackAgentUsage,
    trackFeatureUsage,
    trackDailyActivity
  }
}

// Hook for achievement notifications
export function useAchievementNotifications(userId: string = 'user_1') {
  const [notifications, setNotifications] = useState<Achievement[]>([])
  const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null)

  // Add notification
  const addNotification = useCallback((achievement: Achievement) => {
    setNotifications(prev => [...prev, achievement])
    if (!currentNotification) {
      setCurrentNotification(achievement)
    }
  }, [currentNotification])

  // Remove notification
  const removeNotification = useCallback((achievementId: string) => {
    setNotifications(prev => prev.filter(a => a.id !== achievementId))
    if (currentNotification?.id === achievementId) {
      setCurrentNotification(null)
    }
  }, [currentNotification])

  // Show next notification
  const showNextNotification = useCallback(() => {
    if (notifications.length > 0) {
      setCurrentNotification(notifications[0])
    }
  }, [notifications])

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([])
    setCurrentNotification(null)
  }, [])

  return {
    notifications,
    currentNotification,
    addNotification,
    removeNotification,
    showNextNotification,
    clearAllNotifications
  }
}











