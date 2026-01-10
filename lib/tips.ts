export type TipType = 'tooltip' | 'inline' | 'coaching'

export type TipContext = 'chat' | 'code' | 'image' | 'home' | 'profile' | 'goals' | 'analytics' | 'general'

export type TipTrigger = 'first_visit' | 'repeated_error' | 'stuck' | 'new_feature' | 'progress_milestone' | 'idle'

export interface Tip {
  id: string
  type: TipType
  context: TipContext
  trigger: TipTrigger
  title?: string
  message: string
  targetElement?: string // CSS selector for tooltip tips
  actionText?: string
  actionUrl?: string
  dismissText?: string
  priority: 'low' | 'medium' | 'high'
  maxShowCount: number
  cooldownHours: number
  isPremium?: boolean
  conditions?: {
    minUsageDays?: number
    maxUsageDays?: number
    featureUsed?: string[]
    featureNotUsed?: string[]
  }
}

export interface TipState {
  tipId: string
  showCount: number
  lastShown: string
  isDismissed: boolean
  isCompleted: boolean
}

export interface CoachingSuggestion {
  id: string
  title: string
  message: string
  actionText: string
  actionUrl?: string
  actionCallback?: string
  priority: 'low' | 'medium' | 'high'
  context: TipContext
  isPremium?: boolean
  expiresAt?: string
}

export interface TipsSettings {
  showInAppTips: boolean
  enableAICoaching: boolean
  tipFrequency: 'minimal' | 'normal' | 'frequent'
  coachingStyle: 'gentle' | 'proactive'
}

export class TipsManager {
  private static instance: TipsManager

  static getInstance(): TipsManager {
    if (!TipsManager.instance) {
      TipsManager.instance = new TipsManager()
    }
    return TipsManager.instance
  }

  // Get all available tips
  getAllTips(): Tip[] {
    return [
      // Chat Tips
      {
        id: 'chat_first_visit',
        type: 'inline',
        context: 'chat',
        trigger: 'first_visit',
        title: 'Synexa Chat\'e hoş geldin! 👋',
        message: 'AI ile sohbet et, sorular sor, kod yazdır veya tasarım fikirleri al.',
        actionText: 'Örnek sorular',
        priority: 'high',
        maxShowCount: 1,
        cooldownHours: 0
      },
      {
        id: 'chat_convert_to_app',
        type: 'tooltip',
        context: 'chat',
        trigger: 'new_feature',
        message: 'Buradan uygulamayı Code Studio\'ya dönüştürebilirsin.',
        targetElement: '[data-tip="convert-to-app"]',
        actionText: 'Dene',
        priority: 'medium',
        maxShowCount: 2,
        cooldownHours: 24
      },
      {
        id: 'chat_memory_suggestion',
        type: 'inline',
        context: 'chat',
        trigger: 'progress_milestone',
        title: 'İpucu: AI Memory 🧠',
        message: 'Tercihlerini kaydetmek AI\'nın seni daha iyi tanımasını sağlar.',
        actionText: 'Memory Ayarları',
        actionUrl: '/profile/ai-preferences',
        priority: 'low',
        maxShowCount: 1,
        cooldownHours: 72,
        conditions: {
          minUsageDays: 3,
          featureNotUsed: ['memory']
        }
      },

      // Code Studio Tips
      {
        id: 'code_first_visit',
        type: 'inline',
        context: 'code',
        trigger: 'first_visit',
        title: 'Code Studio\'ya hoş geldin! 💻',
        message: 'AI ile uygulama oluştur, kod yaz ve gerçek zamanlı önizleme yap.',
        actionText: 'İlk projeyi başlat',
        priority: 'high',
        maxShowCount: 1,
        cooldownHours: 0
      },
      {
        id: 'code_template_suggestion',
        type: 'tooltip',
        context: 'code',
        trigger: 'repeated_error',
        message: 'Bu projeyi template ile daha hızlı başlatabilirsin.',
        targetElement: '[data-tip="project-templates"]',
        actionText: 'Template\'leri gör',
        priority: 'medium',
        maxShowCount: 2,
        cooldownHours: 48
      },
      {
        id: 'code_version_history',
        type: 'inline',
        context: 'code',
        trigger: 'progress_milestone',
        title: 'Version History ile güvende kal 📝',
        message: 'Projende değişiklikleri takip et ve istediğin zaman geri dön.',
        actionText: 'Version History',
        priority: 'medium',
        maxShowCount: 1,
        cooldownHours: 48,
        isPremium: true,
        conditions: {
          minUsageDays: 2,
          featureNotUsed: ['version_history']
        }
      },

      // Image Studio Tips
      {
        id: 'image_first_visit',
        type: 'inline',
        context: 'image',
        trigger: 'first_visit',
        title: 'Image Studio\'ya hoş geldin! 🎨',
        message: 'AI ile görsel tasarım oluştur, düzenle ve profesyonel sonuçlar al.',
        actionText: 'İlk tasarımı oluştur',
        priority: 'high',
        maxShowCount: 1,
        cooldownHours: 0
      },
      {
        id: 'image_brand_kit',
        type: 'tooltip',
        context: 'image',
        trigger: 'progress_milestone',
        message: 'Brand kit eklemek tasarımını tutarlı yapar.',
        targetElement: '[data-tip="brand-kit"]',
        actionText: 'Brand Kit',
        priority: 'medium',
        maxShowCount: 2,
        cooldownHours: 72,
        isPremium: true,
        conditions: {
          minUsageDays: 1,
          featureNotUsed: ['brand_kit']
        }
      },

      // Home Tips
      {
        id: 'home_goals_suggestion',
        type: 'inline',
        context: 'home',
        trigger: 'progress_milestone',
        title: 'Hedef belirle, ilerlemeyi takip et 🎯',
        message: 'Günlük hedefler belirleyerek motivasyonunu artır.',
        actionText: 'Hedef Oluştur',
        actionUrl: '/goals',
        priority: 'low',
        maxShowCount: 1,
        cooldownHours: 96,
        conditions: {
          minUsageDays: 5,
          featureNotUsed: ['goals']
        }
      },
      {
        id: 'home_analytics_tip',
        type: 'tooltip',
        context: 'home',
        trigger: 'progress_milestone',
        message: 'Burada aktiviteni ve ilerlemeini görebilirsin.',
        targetElement: '[data-tip="activity-card"]',
        actionText: 'Detayları gör',
        actionUrl: '/analytics',
        priority: 'low',
        maxShowCount: 1,
        cooldownHours: 120,
        conditions: {
          minUsageDays: 7
        }
      },

      // General Tips
      {
        id: 'general_premium_value',
        type: 'inline',
        context: 'general',
        trigger: 'stuck',
        title: 'Premium ile sınırları kaldır 🚀',
        message: 'Sınırsız chat, gelişmiş özellikler ve öncelikli destek.',
        actionText: 'Premium\'u Keşfet',
        actionUrl: '/pricing',
        priority: 'low',
        maxShowCount: 2,
        cooldownHours: 168,
        conditions: {
          minUsageDays: 3
        }
      }
    ]
  }

  // Get tips for specific context
  getTipsForContext(context: TipContext, userId: string): Tip[] {
    const allTips = this.getAllTips()
    const settings = this.getTipsSettings(userId)
    
    if (!settings.showInAppTips) return []

    return allTips.filter(tip => {
      // Context match
      if (tip.context !== context && tip.context !== 'general') return false
      
      // Check if tip should be shown
      return this.shouldShowTip(tip, userId)
    })
  }

  // Check if a tip should be shown
  shouldShowTip(tip: Tip, userId: string): boolean {
    const tipState = this.getTipState(tip.id, userId)
    const settings = this.getTipsSettings(userId)
    
    // Check if dismissed
    if (tipState.isDismissed) return false
    
    // Check show count limit
    if (tipState.showCount >= tip.maxShowCount) return false
    
    // Check cooldown
    if (tipState.lastShown) {
      const lastShownTime = new Date(tipState.lastShown).getTime()
      const cooldownMs = tip.cooldownHours * 60 * 60 * 1000
      if (Date.now() - lastShownTime < cooldownMs) return false
    }
    
    // Check premium requirement
    if (tip.isPremium && !this.isPremiumUser(userId)) return false
    
    // Check conditions
    if (tip.conditions) {
      const userStats = this.getUserStats(userId)
      
      if (tip.conditions.minUsageDays && userStats.usageDays < tip.conditions.minUsageDays) {
        return false
      }
      
      if (tip.conditions.maxUsageDays && userStats.usageDays > tip.conditions.maxUsageDays) {
        return false
      }
      
      if (tip.conditions.featureUsed) {
        const hasUsedFeature = tip.conditions.featureUsed.some(feature => 
          userStats.usedFeatures.includes(feature)
        )
        if (!hasUsedFeature) return false
      }
      
      if (tip.conditions.featureNotUsed) {
        const hasNotUsedFeature = tip.conditions.featureNotUsed.some(feature => 
          !userStats.usedFeatures.includes(feature)
        )
        if (!hasNotUsedFeature) return false
      }
    }
    
    return true
  }

  // Mark tip as shown
  markTipAsShown(tipId: string, userId: string): void {
    const tipState = this.getTipState(tipId, userId)
    tipState.showCount += 1
    tipState.lastShown = new Date().toISOString()
    this.saveTipState(tipId, userId, tipState)
  }

  // Dismiss tip
  dismissTip(tipId: string, userId: string): void {
    const tipState = this.getTipState(tipId, userId)
    tipState.isDismissed = true
    this.saveTipState(tipId, userId, tipState)
  }

  // Complete tip action
  completeTipAction(tipId: string, userId: string): void {
    const tipState = this.getTipState(tipId, userId)
    tipState.isCompleted = true
    this.saveTipState(tipId, userId, tipState)
  }

  // Get tip state
  getTipState(tipId: string, userId: string): TipState {
    try {
      const stored = localStorage.getItem(`synexa_tip_state_${userId}_${tipId}`)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading tip state:', error)
    }

    return {
      tipId,
      showCount: 0,
      lastShown: '',
      isDismissed: false,
      isCompleted: false
    }
  }

  // Save tip state
  saveTipState(tipId: string, userId: string, state: TipState): void {
    try {
      localStorage.setItem(`synexa_tip_state_${userId}_${tipId}`, JSON.stringify(state))
    } catch (error) {
      console.error('Error saving tip state:', error)
    }
  }

  // Get tips settings
  getTipsSettings(userId: string): TipsSettings {
    try {
      const stored = localStorage.getItem(`synexa_tips_settings_${userId}`)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading tips settings:', error)
    }

    // Default settings
    return {
      showInAppTips: true,
      enableAICoaching: true,
      tipFrequency: 'normal',
      coachingStyle: 'gentle'
    }
  }

  // Save tips settings
  saveTipsSettings(userId: string, settings: TipsSettings): void {
    try {
      localStorage.setItem(`synexa_tips_settings_${userId}`, JSON.stringify(settings))
    } catch (error) {
      console.error('Error saving tips settings:', error)
    }
  }

  // Generate AI coaching suggestions
  generateCoachingSuggestions(context: TipContext, userId: string): CoachingSuggestion[] {
    const settings = this.getTipsSettings(userId)
    if (!settings.enableAICoaching) return []

    const userStats = this.getUserStats(userId)
    const suggestions: CoachingSuggestion[] = []

    // Context-specific coaching
    switch (context) {
      case 'chat':
        if (userStats.chatMessages > 10 && !userStats.usedFeatures.includes('memory')) {
          suggestions.push({
            id: 'chat_memory_coaching',
            title: 'Yanıtları kişiselleştir',
            message: 'Tercihlerini kaydetmek AI\'nın seni daha iyi tanımasını sağlar.',
            actionText: 'Memory Ayarları',
            actionUrl: '/profile/ai-preferences',
            priority: 'medium',
            context: 'chat'
          })
        }
        break

      case 'code':
        if (userStats.codeProjects > 2 && !userStats.usedFeatures.includes('version_history')) {
          suggestions.push({
            id: 'code_version_coaching',
            title: 'Projelerini güvende tut',
            message: 'Version History ile değişiklikleri takip et ve geri dön.',
            actionText: 'Version History',
            priority: 'high',
            context: 'code',
            isPremium: true
          })
        }
        break

      case 'image':
        if (userStats.imageDesigns > 3 && !userStats.usedFeatures.includes('brand_kit')) {
          suggestions.push({
            id: 'image_brand_coaching',
            title: 'Tasarımlarını tutarlı yap',
            message: 'Brand Kit ile renkler ve fontları standartlaştır.',
            actionText: 'Brand Kit',
            priority: 'medium',
            context: 'image',
            isPremium: true
          })
        }
        break

      case 'home':
        if (userStats.usageDays > 5 && !userStats.usedFeatures.includes('goals')) {
          suggestions.push({
            id: 'home_goals_coaching',
            title: 'İlerlemeini takip et',
            message: 'Hedefler belirleyerek motivasyonunu artır.',
            actionText: 'Hedef Oluştur',
            actionUrl: '/goals',
            priority: 'low',
            context: 'home'
          })
        }
        break
    }

    // General coaching
    if (userStats.usageDays > 3 && !this.isPremiumUser(userId)) {
      suggestions.push({
        id: 'general_premium_coaching',
        title: 'Daha fazlasını keşfet',
        message: 'Premium ile sınırsız özellikler ve gelişmiş araçlar.',
        actionText: 'Premium\'u Gör',
        actionUrl: '/pricing',
        priority: 'low',
        context: 'general'
      })
    }

    return suggestions.slice(0, 2) // Max 2 suggestions at a time
  }

  // Get user stats (mock implementation)
  getUserStats(userId: string): any {
    // This would come from analytics in real implementation
    return {
      usageDays: 7,
      chatMessages: 25,
      codeProjects: 3,
      imageDesigns: 5,
      usedFeatures: ['chat', 'code', 'image'] // Features user has used
    }
  }

  // Check if user is premium (mock implementation)
  isPremiumUser(userId: string): boolean {
    // This would come from user subscription data
    return false
  }

  // Get tip by ID
  getTipById(tipId: string): Tip | null {
    const allTips = this.getAllTips()
    return allTips.find(tip => tip.id === tipId) || null
  }

  // Reset all tips for user (for testing)
  resetAllTips(userId: string): void {
    const allTips = this.getAllTips()
    allTips.forEach(tip => {
      localStorage.removeItem(`synexa_tip_state_${userId}_${tip.id}`)
    })
  }

  // Get tip statistics
  getTipStatistics(userId: string): { shown: number; dismissed: number; completed: number } {
    const allTips = this.getAllTips()
    let shown = 0
    let dismissed = 0
    let completed = 0

    allTips.forEach(tip => {
      const state = this.getTipState(tip.id, userId)
      if (state.showCount > 0) shown++
      if (state.isDismissed) dismissed++
      if (state.isCompleted) completed++
    })

    return { shown, dismissed, completed }
  }
}

// Export singleton instance
export const tipsManager = TipsManager.getInstance()








