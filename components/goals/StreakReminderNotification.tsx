'use client'

import { useState, useEffect } from 'react'
import { Flame, X, MessageCircle, Code2, Image, ArrowRight } from 'lucide-react'
import { goalManager } from '@/lib/goals'
import { notificationManager } from '@/lib/notifications'

interface StreakReminderNotificationProps {
  userId: string
  onDismiss?: () => void
  className?: string
}

export function StreakReminderNotification({ 
  userId, 
  onDismiss, 
  className 
}: StreakReminderNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [mainStreak, setMainStreak] = useState<any>(null)

  useEffect(() => {
    // Check if user needs streak reminder
    const needsReminder = goalManager.needsStreakReminder(userId)
    const streak = goalManager.getMainStreak(userId)
    
    if (needsReminder && streak) {
      setMainStreak(streak)
      setIsVisible(true)
      
      // Add to notification system
      notificationManager.addNotification(userId, {
        type: 'reminder',
        priority: 'medium',
        title: 'Streak\'ini korumak için bugün küçük bir şey yapabilirsin 🔥',
        message: `${streak.currentStreak} günlük streak\'ini kaybetme!`,
        icon: 'Flame',
        actionUrl: '/chat',
        actionText: 'Chat\'e Başla'
      })
    }
  }, [userId])

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  const handleActionClick = (action: string) => {
    // Log activity to maintain streak
    goalManager.updateStreak(userId, 'general', true)
    
    // Navigate to action
    window.location.href = action === 'chat' ? '/chat' : action === 'code' ? '/studio/code' : '/studio/image'
    
    handleDismiss()
  }

  if (!isVisible || !mainStreak) return null

  return (
    <div className={`bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 transition-all duration-300 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center animate-pulse">
          <Flame size={20} className="text-orange-400" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium text-orange-400 text-sm mb-1">
            Streak'ini korumak için bugün küçük bir şey yapabilirsin 🔥
          </h4>
          <p className="text-gray-300 text-xs mb-3">
            {mainStreak.currentStreak} günlük streak'ini kaybetme!
          </p>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleActionClick('chat')}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium rounded-lg transition-colors"
            >
              <MessageCircle size={12} />
              Chat
            </button>
            <button
              onClick={() => handleActionClick('code')}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs font-medium rounded-lg transition-colors"
            >
              <Code2 size={12} />
              Kod
            </button>
            <button
              onClick={() => handleActionClick('image')}
              className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs font-medium rounded-lg transition-colors"
            >
              <Image size={12} />
              Tasarım
            </button>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-300 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

// Streak Reminder Toast (for floating notifications)
interface StreakReminderToastProps {
  userId: string
  onDismiss: () => void
  autoHide?: boolean
  duration?: number
}

export function StreakReminderToast({ 
  userId, 
  onDismiss, 
  autoHide = true, 
  duration = 5000 
}: StreakReminderToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [streak, setStreak] = useState<any>(null)

  useEffect(() => {
    const mainStreak = goalManager.getMainStreak(userId)
    setStreak(mainStreak)

    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onDismiss, 300)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [userId, autoHide, duration, onDismiss])

  const handleQuickAction = () => {
    // Log activity
    goalManager.updateStreak(userId, 'general', true)
    
    // Navigate to chat
    window.location.href = '/chat'
    
    onDismiss()
  }

  if (!isVisible || !streak) return null

  return (
    <div className={`fixed top-20 right-4 z-50 bg-gray-900 border border-orange-500/20 rounded-xl p-4 shadow-2xl max-w-sm transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
    }`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
          <Flame size={16} className="text-orange-400" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium text-white text-sm mb-1">
            Streak Hatırlatması 🔥
          </h4>
          <p className="text-gray-400 text-xs mb-3">
            {streak.currentStreak} günlük streak'ini korumak için bugün aktif ol!
          </p>
          
          <button
            onClick={handleQuickAction}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Hemen Başla
            <ArrowRight size={12} />
          </button>
        </div>
        
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-300 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

// Streak Milestone Achievement Toast
interface StreakMilestoneToastProps {
  streakCount: number
  onDismiss: () => void
  autoHide?: boolean
}

export function StreakMilestoneToast({ 
  streakCount, 
  onDismiss, 
  autoHide = true 
}: StreakMilestoneToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  const getMilestone = () => {
    if (streakCount >= 30) return { emoji: '🔥', title: 'Efsane Streak!', message: '30 gün üst üste!' }
    if (streakCount >= 14) return { emoji: '⚡', title: 'Süper Streak!', message: '2 hafta üst üste!' }
    if (streakCount >= 7) return { emoji: '🌟', title: 'Harika Streak!', message: '1 hafta üst üste!' }
    return { emoji: '✨', title: 'Yeni Streak!', message: `${streakCount} gün aktif!` }
  }

  const milestone = getMilestone()

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onDismiss, 300)
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [autoHide, onDismiss])

  if (!isVisible) return null

  return (
    <div className={`fixed top-20 right-4 z-50 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl p-4 shadow-2xl max-w-sm transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
    }`}>
      <div className="flex items-center gap-3">
        <div className="text-2xl animate-bounce">
          {milestone.emoji}
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium text-orange-400 text-sm">
            {milestone.title}
          </h4>
          <p className="text-gray-300 text-xs">
            {milestone.message}
          </p>
        </div>
        
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-300 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}





