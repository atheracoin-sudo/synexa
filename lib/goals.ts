export type GoalType = 'chat_daily' | 'chat_weekly' | 'code_weekly' | 'code_monthly' | 'image_weekly' | 'image_monthly' | 'agent_tasks'

export type GoalPeriod = 'daily' | 'weekly' | 'monthly'

import { safeLocalStorage } from './utils/safe-storage'

export type GoalStatus = 'active' | 'completed' | 'paused' | 'failed'

export interface Goal {
  id: string
  type: GoalType
  title: string
  description: string
  target: number
  period: GoalPeriod
  status: GoalStatus
  progress: number
  createdAt: string
  completedAt?: string
  lastUpdated: string
  category: 'chat' | 'code' | 'image' | 'agent'
  icon: string
  color: string
}

export interface Streak {
  id: string
  type: 'general' | 'chat' | 'code' | 'image'
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  isActive: boolean
  gracePeriodUsed: boolean // Premium feature
}

export interface GoalTemplate {
  type: GoalType
  title: string
  description: string
  defaultTarget: number
  period: GoalPeriod
  category: 'chat' | 'code' | 'image' | 'agent'
  icon: string
  color: string
  isPremium?: boolean
}

export class GoalManager {
  private static instance: GoalManager

  static getInstance(): GoalManager {
    if (!GoalManager.instance) {
      GoalManager.instance = new GoalManager()
    }
    return GoalManager.instance
  }

  // Goal templates with smart defaults
  getGoalTemplates(): GoalTemplate[] {
    return [
      {
        type: 'chat_daily',
        title: 'Günlük Sohbet',
        description: 'Her gün AI ile sohbet et',
        defaultTarget: 5,
        period: 'daily',
        category: 'chat',
        icon: 'MessageCircle',
        color: 'blue'
      },
      {
        type: 'chat_weekly',
        title: 'Haftalık Aktif Gün',
        description: 'Haftada X gün sohbet et',
        defaultTarget: 5,
        period: 'weekly',
        category: 'chat',
        icon: 'Calendar',
        color: 'blue'
      },
      {
        type: 'code_weekly',
        title: 'Haftalık Uygulama',
        description: 'Haftada X uygulama oluştur',
        defaultTarget: 2,
        period: 'weekly',
        category: 'code',
        icon: 'Code2',
        color: 'green'
      },
      {
        type: 'code_monthly',
        title: 'Aylık Feature',
        description: 'Ayda X özellik geliştir',
        defaultTarget: 5,
        period: 'monthly',
        category: 'code',
        icon: 'Zap',
        color: 'green'
      },
      {
        type: 'image_weekly',
        title: 'Haftalık Tasarım',
        description: 'Haftada X tasarım oluştur',
        defaultTarget: 3,
        period: 'weekly',
        category: 'image',
        icon: 'Image',
        color: 'purple'
      },
      {
        type: 'image_monthly',
        title: 'Aylık Export',
        description: 'Ayda X tasarım export et',
        defaultTarget: 10,
        period: 'monthly',
        category: 'image',
        icon: 'Download',
        color: 'purple'
      },
      {
        type: 'agent_tasks',
        title: 'Agent Görevleri',
        description: 'Belirli agent ile X görev tamamla',
        defaultTarget: 10,
        period: 'weekly',
        category: 'agent',
        icon: 'Bot',
        color: 'cyan',
        isPremium: true
      }
    ]
  }

  // Get user's goals
  getUserGoals(userId: string): Goal[] {
    const stored = safeLocalStorage.getItem(`synexa_goals_${userId}`)
    if (stored) {
      return JSON.parse(stored)
    }

    // Mock goals for demonstration
    const mockGoals: Goal[] = [
      {
        id: 'goal_1',
        type: 'chat_daily',
        title: 'Günlük Sohbet',
        description: 'Her gün 5 mesaj gönder',
        target: 5,
        period: 'daily',
        status: 'active',
        progress: 3,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        category: 'chat',
        icon: 'MessageCircle',
        color: 'blue'
      },
      {
        id: 'goal_2',
        type: 'code_weekly',
        title: 'Haftalık Uygulama',
        description: 'Haftada 2 uygulama oluştur',
        target: 2,
        period: 'weekly',
        status: 'active',
        progress: 1,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date().toISOString(),
        category: 'code',
        icon: 'Code2',
        color: 'green'
      }
    ]

    this.saveUserGoals(userId, mockGoals)
    return mockGoals
  }

  // Save user's goals
  saveUserGoals(userId: string, goals: Goal[]): void {
    safeLocalStorage.setItem(`synexa_goals_${userId}`, JSON.stringify(goals))
  }

  // Create new goal
  createGoal(userId: string, goalData: Omit<Goal, 'id' | 'createdAt' | 'lastUpdated' | 'progress' | 'status'>): Goal {
    const goals = this.getUserGoals(userId)
    
    const newGoal: Goal = {
      ...goalData,
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'active',
      progress: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }

    goals.push(newGoal)
    this.saveUserGoals(userId, goals)
    
    return newGoal
  }

  // Update goal progress
  updateGoalProgress(userId: string, goalId: string, progress: number): void {
    const goals = this.getUserGoals(userId)
    const goal = goals.find(g => g.id === goalId)
    
    if (goal) {
      goal.progress = Math.min(progress, goal.target)
      goal.lastUpdated = new Date().toISOString()
      
      // Check if goal is completed
      if (goal.progress >= goal.target && goal.status === 'active') {
        goal.status = 'completed'
        goal.completedAt = new Date().toISOString()
      }
      
      this.saveUserGoals(userId, goals)
    }
  }

  // Delete goal
  deleteGoal(userId: string, goalId: string): void {
    const goals = this.getUserGoals(userId)
    const filteredGoals = goals.filter(g => g.id !== goalId)
    this.saveUserGoals(userId, filteredGoals)
  }

  // Get active goals
  getActiveGoals(userId: string): Goal[] {
    const goals = this.getUserGoals(userId)
    return goals.filter(g => g.status === 'active')
  }

  // Get completed goals
  getCompletedGoals(userId: string): Goal[] {
    const goals = this.getUserGoals(userId)
    return goals.filter(g => g.status === 'completed')
  }

  // Check goal limits (Free vs Premium)
  canCreateGoal(userId: string, isPremium: boolean): boolean {
    const activeGoals = this.getActiveGoals(userId)
    
    if (isPremium) {
      return activeGoals.length < 10 // Premium limit
    } else {
      return activeGoals.length < 2 // Free limit
    }
  }

  // Get user's streaks
  getUserStreaks(userId: string): Streak[] {
    const stored = safeLocalStorage.getItem(`synexa_streaks_${userId}`)
    if (stored) {
      return JSON.parse(stored)
    }

    // Initialize default streaks
    const defaultStreaks: Streak[] = [
      {
        id: 'general_streak',
        type: 'general',
        currentStreak: 5,
        longestStreak: 12,
        lastActiveDate: new Date().toISOString(),
        isActive: true,
        gracePeriodUsed: false
      },
      {
        id: 'chat_streak',
        type: 'chat',
        currentStreak: 3,
        longestStreak: 8,
        lastActiveDate: new Date().toISOString(),
        isActive: true,
        gracePeriodUsed: false
      },
      {
        id: 'code_streak',
        type: 'code',
        currentStreak: 2,
        longestStreak: 5,
        lastActiveDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isActive: false,
        gracePeriodUsed: false
      }
    ]

    this.saveUserStreaks(userId, defaultStreaks)
    return defaultStreaks
  }

  // Save user's streaks
  saveUserStreaks(userId: string, streaks: Streak[]): void {
    safeLocalStorage.setItem(`synexa_streaks_${userId}`, JSON.stringify(streaks))
  }

  // Update streak
  updateStreak(userId: string, type: Streak['type'], isActive: boolean): void {
    const streaks = this.getUserStreaks(userId)
    const streak = streaks.find(s => s.type === type)
    
    if (streak) {
      const today = new Date().toDateString()
      const lastActiveDate = new Date(streak.lastActiveDate).toDateString()
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
      
      if (isActive) {
        if (lastActiveDate === today) {
          // Already active today, no change
          return
        } else if (lastActiveDate === yesterday) {
          // Continuing streak
          streak.currentStreak += 1
        } else {
          // Streak broken, start new
          streak.currentStreak = 1
          streak.gracePeriodUsed = false
        }
        
        streak.isActive = true
        streak.lastActiveDate = new Date().toISOString()
        
        // Update longest streak
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak
        }
      } else {
        // Check if streak should be broken
        if (lastActiveDate !== today && lastActiveDate !== yesterday) {
          streak.currentStreak = 0
          streak.isActive = false
        }
      }
      
      this.saveUserStreaks(userId, streaks)
    }
  }

  // Get main streak (general)
  getMainStreak(userId: string): Streak | null {
    const streaks = this.getUserStreaks(userId)
    return streaks.find(s => s.type === 'general') || null
  }

  // Check if user needs streak reminder
  needsStreakReminder(userId: string): boolean {
    const mainStreak = this.getMainStreak(userId)
    if (!mainStreak || !mainStreak.isActive) return false
    
    const today = new Date().toDateString()
    const lastActiveDate = new Date(mainStreak.lastActiveDate).toDateString()
    
    // If not active today and has current streak
    return lastActiveDate !== today && mainStreak.currentStreak > 0
  }

  // Use grace period (Premium feature)
  useGracePeriod(userId: string, streakType: Streak['type']): boolean {
    const streaks = this.getUserStreaks(userId)
    const streak = streaks.find(s => s.type === streakType)
    
    if (streak && !streak.gracePeriodUsed) {
      streak.gracePeriodUsed = true
      streak.lastActiveDate = new Date().toISOString()
      this.saveUserStreaks(userId, streaks)
      return true
    }
    
    return false
  }

  // Get goal progress percentage
  getGoalProgressPercentage(goal: Goal): number {
    return Math.round((goal.progress / goal.target) * 100)
  }

  // Get goal progress text
  getGoalProgressText(goal: Goal): string {
    return `${goal.progress} / ${goal.target} tamamlandı`
  }

  // Get goal color class
  getGoalColorClass(color: string): string {
    const colorMap = {
      blue: 'text-blue-400 bg-blue-500/20',
      green: 'text-green-400 bg-green-500/20',
      purple: 'text-purple-400 bg-purple-500/20',
      cyan: 'text-cyan-400 bg-cyan-500/20',
      yellow: 'text-yellow-400 bg-yellow-500/20',
      red: 'text-red-400 bg-red-500/20'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  // Get streak emoji
  getStreakEmoji(streak: number): string {
    if (streak >= 30) return '🔥'
    if (streak >= 14) return '⚡'
    if (streak >= 7) return '🌟'
    if (streak >= 3) return '✨'
    return '💫'
  }

  // Get streak message
  getStreakMessage(streak: number): string {
    if (streak >= 30) return `${streak} gün üst üste! Efsanesin! 🔥`
    if (streak >= 14) return `${streak} gün üst üste aktifsin! ⚡`
    if (streak >= 7) return `${streak} gün üst üste! Harika gidiyorsun! 🌟`
    if (streak >= 3) return `${streak} gün üst üste aktifsin ✨`
    if (streak >= 1) return `${streak} gün aktifsin! Devam et 💫`
    return 'Bugün başlayalım! 🚀'
  }

  // Check if goal should show completion celebration
  shouldShowCompletion(userId: string, goalId: string): boolean {
    const key = `synexa_goal_completion_shown_${userId}_${goalId}`
    return !safeLocalStorage.getItem(key)
  }

  // Mark goal completion as shown
  markCompletionShown(userId: string, goalId: string): void {
    const key = `synexa_goal_completion_shown_${userId}_${goalId}`
    safeLocalStorage.setItem(key, 'true')
  }

  // Get smart goal suggestions based on user activity
  getSmartGoalSuggestions(userId: string): GoalTemplate[] {
    try {
      // Get user's analytics data
      const analytics = JSON.parse(safeLocalStorage.getItem(`synexa_analytics_${userId}`) || '{}')
      const usageMetrics = analytics.usageMetrics || {}
      
      const suggestions: GoalTemplate[] = []
      const templates = this.getGoalTemplates()
      
      // Suggest based on current usage patterns
      if (usageMetrics.chatMessages > 0) {
        suggestions.push(templates.find(t => t.type === 'chat_daily')!)
      }
      
      if (usageMetrics.codeProjects > 0) {
        suggestions.push(templates.find(t => t.type === 'code_weekly')!)
      }
      
      if (usageMetrics.imageDesigns > 0) {
        suggestions.push(templates.find(t => t.type === 'image_weekly')!)
      }
      
      // If no activity, suggest starter goals
      if (suggestions.length === 0) {
        suggestions.push(
          templates.find(t => t.type === 'chat_daily')!,
          templates.find(t => t.type === 'code_weekly')!
        )
      }
      
      return suggestions.slice(0, 3) // Max 3 suggestions
    } catch (error) {
      // Fallback suggestions
      const templates = this.getGoalTemplates()
      return [
        templates.find(t => t.type === 'chat_daily')!,
        templates.find(t => t.type === 'code_weekly')!
      ]
    }
  }

  // Log activity for goal progress
  logActivityForGoals(userId: string, activityType: 'chat' | 'code' | 'image' | 'agent', amount: number = 1): void {
    const goals = this.getActiveGoals(userId)
    
    goals.forEach(goal => {
      if (goal.category === activityType) {
        this.updateGoalProgress(userId, goal.id, goal.progress + amount)
      }
    })
    
    // Update streaks
    this.updateStreak(userId, 'general', true)
    // Only update specific streak for valid types
    if (activityType !== 'agent') {
      this.updateStreak(userId, activityType, true)
    }
  }
}

// Export singleton instance
export const goalManager = GoalManager.getInstance()






