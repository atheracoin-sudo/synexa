export type AchievementCategory = 'chat' | 'code' | 'image' | 'agents' | 'team' | 'general'

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface Achievement {
  id: string
  category: AchievementCategory
  tier: AchievementTier
  title: string
  description: string
  icon: string
  requirement: {
    type: 'count' | 'streak' | 'feature_use' | 'milestone'
    target: number
    metric: string // e.g., 'chat_messages', 'apps_created', 'days_active'
  }
  reward?: {
    type: 'badge' | 'feature_unlock' | 'premium_trial'
    value?: string
  }
  isPremium?: boolean
  isHidden?: boolean // Hidden until unlocked
  unlockedAt?: string
  shareText?: string
}

export interface UserProgress {
  userId: string
  achievements: { [achievementId: string]: AchievementProgress }
  stats: UserStats
  selectedBadge?: string // Badge shown on profile
  lastNotificationShown?: string
}

export interface AchievementProgress {
  achievementId: string
  isUnlocked: boolean
  unlockedAt?: string
  currentProgress: number
  hasBeenNotified: boolean
  hasBeenShared?: boolean
}

export interface UserStats {
  chatMessages: number
  appsCreated: number
  imagesDesigned: number
  agentsUsed: string[]
  workspacesCreated: number
  daysActive: number
  streakDays: number
  featuresUsed: string[]
  premiumDays: number
}

export class AchievementsManager {
  private static instance: AchievementsManager

  static getInstance(): AchievementsManager {
    if (!AchievementsManager.instance) {
      AchievementsManager.instance = new AchievementsManager()
    }
    return AchievementsManager.instance
  }

  // Get all available achievements
  getAllAchievements(): Achievement[] {
    return [
      // Chat Achievements
      {
        id: 'first_chat',
        category: 'chat',
        tier: 'bronze',
        title: 'First Chat',
        description: 'İlk sohbetini tamamladın',
        icon: 'MessageCircle',
        requirement: {
          type: 'count',
          target: 1,
          metric: 'chat_messages'
        },
        shareText: 'Synexa AI ile ilk sohbetimi tamamladım! 💬'
      },
      {
        id: 'daily_thinker',
        category: 'chat',
        tier: 'silver',
        title: 'Daily Thinker',
        description: '3 gün üst üste sohbet ettin',
        icon: 'Brain',
        requirement: {
          type: 'streak',
          target: 3,
          metric: 'chat_streak'
        },
        shareText: '3 gün üst üste Synexa AI ile düşünüyorum! 🧠'
      },
      {
        id: 'power_user',
        category: 'chat',
        tier: 'gold',
        title: 'Power User',
        description: '100 mesaj gönderdin',
        icon: 'Zap',
        requirement: {
          type: 'count',
          target: 100,
          metric: 'chat_messages'
        },
        shareText: 'Synexa AI ile 100 mesaj milestone\'ına ulaştım! ⚡'
      },

      // Code Achievements
      {
        id: 'first_app',
        category: 'code',
        tier: 'bronze',
        title: 'First App',
        description: 'İlk uygulamanı oluşturdun',
        icon: 'Code2',
        requirement: {
          type: 'count',
          target: 1,
          metric: 'apps_created'
        },
        shareText: 'Synexa AI ile ilk uygulamamı oluşturdum! 🚀'
      },
      {
        id: 'builder',
        category: 'code',
        tier: 'silver',
        title: 'Builder',
        description: '5 uygulama oluşturdun',
        icon: 'Hammer',
        requirement: {
          type: 'count',
          target: 5,
          metric: 'apps_created'
        },
        shareText: '5 uygulama oluşturdum! Builder seviyesine ulaştım! 🔨'
      },
      {
        id: 'shipper',
        category: 'code',
        tier: 'gold',
        title: 'Shipper',
        description: 'İlk export/deploy işlemini yaptın',
        icon: 'Rocket',
        requirement: {
          type: 'feature_use',
          target: 1,
          metric: 'app_exported'
        },
        shareText: 'İlk uygulamamı deploy ettim! Shipper oldun! 🚀'
      },

      // Image Achievements
      {
        id: 'first_design',
        category: 'image',
        tier: 'bronze',
        title: 'First Design',
        description: 'İlk tasarımını oluşturdun',
        icon: 'Palette',
        requirement: {
          type: 'count',
          target: 1,
          metric: 'images_designed'
        },
        shareText: 'Synexa AI ile ilk tasarımımı oluşturdum! 🎨'
      },
      {
        id: 'visual_creator',
        category: 'image',
        tier: 'silver',
        title: 'Visual Creator',
        description: '5 tasarım oluşturdun',
        icon: 'Image',
        requirement: {
          type: 'count',
          target: 5,
          metric: 'images_designed'
        },
        shareText: '5 tasarım oluşturdum! Visual Creator oldun! 🎨'
      },
      {
        id: 'brand_ready',
        category: 'image',
        tier: 'gold',
        title: 'Brand Ready',
        description: 'Brand Kit özelliğini kullandın',
        icon: 'Crown',
        requirement: {
          type: 'feature_use',
          target: 1,
          metric: 'brand_kit_used'
        },
        isPremium: true,
        shareText: 'Brand Kit ile profesyonel tasarımlar yapıyorum! 👑'
      },

      // Agent Achievements
      {
        id: 'agent_explorer',
        category: 'agents',
        tier: 'bronze',
        title: 'Agent Explorer',
        description: 'İlk AI agent\'ını kullandın',
        icon: 'Bot',
        requirement: {
          type: 'count',
          target: 1,
          metric: 'agents_used'
        },
        shareText: 'AI Agent\'larını keşfetmeye başladım! 🤖'
      },
      {
        id: 'team_player',
        category: 'agents',
        tier: 'silver',
        title: 'Team Player',
        description: '3 farklı agent kullandın',
        icon: 'Users',
        requirement: {
          type: 'count',
          target: 3,
          metric: 'unique_agents_used'
        },
        shareText: '3 farklı AI Agent ile çalışıyorum! Team Player! 👥'
      },

      // Team Achievements
      {
        id: 'workspace_created',
        category: 'team',
        tier: 'bronze',
        title: 'Workspace Created',
        description: 'İlk workspace\'ini oluşturdun',
        icon: 'Building',
        requirement: {
          type: 'count',
          target: 1,
          metric: 'workspaces_created'
        },
        isPremium: true,
        shareText: 'İlk team workspace\'imi oluşturdum! 🏢'
      },
      {
        id: 'collaborator',
        category: 'team',
        tier: 'silver',
        title: 'Collaborator',
        description: 'İlk ortak projeyi başlattın',
        icon: 'Handshake',
        requirement: {
          type: 'feature_use',
          target: 1,
          metric: 'shared_project_created'
        },
        isPremium: true,
        shareText: 'Team collaboration\'a başladım! 🤝'
      },

      // General Achievements
      {
        id: 'early_adopter',
        category: 'general',
        tier: 'silver',
        title: 'Early Adopter',
        description: '7 gün aktif kullanıcısın',
        icon: 'Star',
        requirement: {
          type: 'count',
          target: 7,
          metric: 'days_active'
        },
        shareText: 'Synexa AI\'nın early adopter\'ıyım! ⭐'
      },
      {
        id: 'streak_master',
        category: 'general',
        tier: 'gold',
        title: 'Streak Master',
        description: '14 gün üst üste aktifsin',
        icon: 'Flame',
        requirement: {
          type: 'streak',
          target: 14,
          metric: 'daily_streak'
        },
        isPremium: true,
        shareText: '14 gün streak! Streak Master oldun! 🔥'
      },
      {
        id: 'premium_explorer',
        category: 'general',
        tier: 'platinum',
        title: 'Premium Explorer',
        description: 'Premium özelliklerini keşfettin',
        icon: 'Gem',
        requirement: {
          type: 'count',
          target: 1,
          metric: 'premium_days'
        },
        isPremium: true,
        isHidden: true,
        shareText: 'Premium özellikleri keşfediyorum! 💎'
      }
    ]
  }

  // Get user progress
  getUserProgress(userId: string): UserProgress {
    try {
      const stored = localStorage.getItem(`synexa_achievements_${userId}`)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading user progress:', error)
    }

    // Default progress with mock data
    return {
      userId,
      achievements: {},
      stats: {
        chatMessages: 25,
        appsCreated: 3,
        imagesDesigned: 5,
        agentsUsed: ['general', 'frontend_developer'],
        workspacesCreated: 0,
        daysActive: 7,
        streakDays: 5,
        featuresUsed: ['chat', 'code', 'image', 'goals'],
        premiumDays: 0
      }
    }
  }

  // Save user progress
  saveUserProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(`synexa_achievements_${progress.userId}`, JSON.stringify(progress))
    } catch (error) {
      console.error('Error saving user progress:', error)
    }
  }

  // Check and unlock achievements
  checkAchievements(userId: string): Achievement[] {
    const progress = this.getUserProgress(userId)
    const achievements = this.getAllAchievements()
    const newlyUnlocked: Achievement[] = []

    achievements.forEach(achievement => {
      const achievementProgress = progress.achievements[achievement.id] || {
        achievementId: achievement.id,
        isUnlocked: false,
        currentProgress: 0,
        hasBeenNotified: false
      }

      if (!achievementProgress.isUnlocked) {
        const currentValue = this.getCurrentValue(progress.stats, achievement.requirement.metric)
        achievementProgress.currentProgress = currentValue

        // Check if achievement should be unlocked
        if (this.shouldUnlockAchievement(achievement, progress.stats)) {
          achievementProgress.isUnlocked = true
          achievementProgress.unlockedAt = new Date().toISOString()
          newlyUnlocked.push(achievement)
        }

        progress.achievements[achievement.id] = achievementProgress
      }
    })

    this.saveUserProgress(progress)
    return newlyUnlocked
  }

  // Check if achievement should be unlocked
  private shouldUnlockAchievement(achievement: Achievement, stats: UserStats): boolean {
    const { requirement } = achievement
    const currentValue = this.getCurrentValue(stats, requirement.metric)

    switch (requirement.type) {
      case 'count':
        return currentValue >= requirement.target

      case 'streak':
        return stats.streakDays >= requirement.target

      case 'feature_use':
        return stats.featuresUsed.includes(requirement.metric)

      case 'milestone':
        return currentValue >= requirement.target

      default:
        return false
    }
  }

  // Get current value for a metric
  private getCurrentValue(stats: UserStats, metric: string): number {
    switch (metric) {
      case 'chat_messages': return stats.chatMessages
      case 'apps_created': return stats.appsCreated
      case 'images_designed': return stats.imagesDesigned
      case 'agents_used': return stats.agentsUsed.length
      case 'unique_agents_used': return new Set(stats.agentsUsed).size
      case 'workspaces_created': return stats.workspacesCreated
      case 'days_active': return stats.daysActive
      case 'daily_streak': return stats.streakDays
      case 'premium_days': return stats.premiumDays
      default: return 0
    }
  }

  // Update user stats
  updateUserStats(userId: string, updates: Partial<UserStats>): Achievement[] {
    const progress = this.getUserProgress(userId)
    progress.stats = { ...progress.stats, ...updates }
    this.saveUserProgress(progress)
    
    // Check for new achievements
    return this.checkAchievements(userId)
  }

  // Mark achievement as notified
  markAsNotified(userId: string, achievementId: string): void {
    const progress = this.getUserProgress(userId)
    if (progress.achievements[achievementId]) {
      progress.achievements[achievementId].hasBeenNotified = true
      this.saveUserProgress(progress)
    }
  }

  // Set selected badge for profile
  setSelectedBadge(userId: string, achievementId: string): void {
    const progress = this.getUserProgress(userId)
    if (progress.achievements[achievementId]?.isUnlocked) {
      progress.selectedBadge = achievementId
      this.saveUserProgress(progress)
    }
  }

  // Get unlocked achievements
  getUnlockedAchievements(userId: string): Achievement[] {
    const progress = this.getUserProgress(userId)
    const achievements = this.getAllAchievements()
    
    return achievements.filter(achievement => 
      progress.achievements[achievement.id]?.isUnlocked
    )
  }

  // Get achievements by category
  getAchievementsByCategory(category: AchievementCategory, userId: string): Achievement[] {
    const achievements = this.getAllAchievements()
    const progress = this.getUserProgress(userId)
    
    return achievements
      .filter(achievement => achievement.category === category)
      .map(achievement => ({
        ...achievement,
        ...progress.achievements[achievement.id]
      }))
  }

  // Get achievement progress percentage
  getAchievementProgress(userId: string, achievementId: string): number {
    const progress = this.getUserProgress(userId)
    const achievement = this.getAllAchievements().find(a => a.id === achievementId)
    
    if (!achievement) return 0
    
    const achievementProgress = progress.achievements[achievementId]
    if (!achievementProgress) return 0
    
    if (achievementProgress.isUnlocked) return 100
    
    const currentValue = this.getCurrentValue(progress.stats, achievement.requirement.metric)
    return Math.min(100, (currentValue / achievement.requirement.target) * 100)
  }

  // Get tier color
  getTierColor(tier: AchievementTier): string {
    switch (tier) {
      case 'bronze': return 'text-orange-400 bg-orange-500/20'
      case 'silver': return 'text-gray-300 bg-gray-500/20'
      case 'gold': return 'text-yellow-400 bg-yellow-500/20'
      case 'platinum': return 'text-purple-400 bg-purple-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  // Get tier name
  getTierName(tier: AchievementTier): string {
    switch (tier) {
      case 'bronze': return 'Bronz'
      case 'silver': return 'Gümüş'
      case 'gold': return 'Altın'
      case 'platinum': return 'Platin'
      default: return tier
    }
  }

  // Get category name
  getCategoryName(category: AchievementCategory): string {
    switch (category) {
      case 'chat': return 'Chat'
      case 'code': return 'Code Studio'
      case 'image': return 'Image Studio'
      case 'agents': return 'AI Agents'
      case 'team': return 'Team'
      case 'general': return 'Genel'
      default: return category
    }
  }

  // Get achievement statistics
  getAchievementStats(userId: string): {
    total: number
    unlocked: number
    bronze: number
    silver: number
    gold: number
    platinum: number
  } {
    const achievements = this.getAllAchievements()
    const progress = this.getUserProgress(userId)
    
    const unlocked = achievements.filter(a => progress.achievements[a.id]?.isUnlocked)
    
    return {
      total: achievements.length,
      unlocked: unlocked.length,
      bronze: unlocked.filter(a => a.tier === 'bronze').length,
      silver: unlocked.filter(a => a.tier === 'silver').length,
      gold: unlocked.filter(a => a.tier === 'gold').length,
      platinum: unlocked.filter(a => a.tier === 'platinum').length
    }
  }

  // Simulate user actions for testing
  simulateUserAction(userId: string, action: string, value?: number): Achievement[] {
    const updates: Partial<UserStats> = {}
    
    switch (action) {
      case 'send_chat_message':
        const progress = this.getUserProgress(userId)
        updates.chatMessages = progress.stats.chatMessages + (value || 1)
        break
      case 'create_app':
        const appProgress = this.getUserProgress(userId)
        updates.appsCreated = appProgress.stats.appsCreated + (value || 1)
        break
      case 'create_design':
        const designProgress = this.getUserProgress(userId)
        updates.imagesDesigned = designProgress.stats.imagesDesigned + (value || 1)
        break
      case 'use_agent':
        const agentProgress = this.getUserProgress(userId)
        updates.agentsUsed = [...agentProgress.stats.agentsUsed, 'new_agent']
        break
    }
    
    return this.updateUserStats(userId, updates)
  }
}

// Export singleton instance
export const achievementsManager = AchievementsManager.getInstance()





