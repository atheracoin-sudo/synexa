import { PlanType, PlanLimits, UserPlan, UsageStats, FeatureLock } from './types'

// Plan configurations
export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    chatMessages: 50, // per day
    codeProjects: 3, // per month
    imageExports: 10, // per month
    versionHistory: false,
    brandKit: false,
    hdExport: false,
    multiDevicePreview: false,
    aiDesignAssistant: false,
  },
  premium: {
    chatMessages: null, // unlimited
    codeProjects: null, // unlimited
    imageExports: null, // unlimited
    versionHistory: true,
    brandKit: true,
    hdExport: true,
    multiDevicePreview: true,
    aiDesignAssistant: true,
  },
  team: {
    chatMessages: null, // unlimited
    codeProjects: null, // unlimited
    imageExports: null, // unlimited
    versionHistory: true,
    brandKit: true,
    hdExport: true,
    multiDevicePreview: true,
    aiDesignAssistant: true,
  },
}

// Default usage stats
const getDefaultUsage = (): UsageStats => ({
  chatMessages: 0,
  codeProjects: 0,
  imageExports: 0,
  period: 'monthly',
  resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
})

// Storage keys
const STORAGE_KEYS = {
  USER_PLAN: 'synexa_user_plan',
  USAGE_STATS: 'synexa_usage_stats',
} as const

export class PremiumManager {
  private static instance: PremiumManager
  private userPlan: UserPlan
  private listeners: Set<(plan: UserPlan) => void> = new Set()

  private constructor() {
    this.userPlan = this.loadUserPlan()
  }

  static getInstance(): PremiumManager {
    if (!PremiumManager.instance) {
      PremiumManager.instance = new PremiumManager()
    }
    return PremiumManager.instance
  }

  // Load user plan from storage
  private loadUserPlan(): UserPlan {
    if (typeof window === 'undefined') {
      return this.getDefaultPlan()
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PLAN)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          ...this.getDefaultPlan(),
          ...parsed,
          usage: { ...getDefaultUsage(), ...parsed.usage },
        }
      }
    } catch (error) {
      console.warn('Failed to load user plan:', error)
    }

    return this.getDefaultPlan()
  }

  // Save user plan to storage
  private saveUserPlan(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEYS.USER_PLAN, JSON.stringify(this.userPlan))
      this.notifyListeners()
    } catch (error) {
      console.warn('Failed to save user plan:', error)
    }
  }

  // Get default free plan
  private getDefaultPlan(): UserPlan {
    return {
      type: 'free',
      limits: PLAN_LIMITS.free,
      usage: getDefaultUsage(),
    }
  }

  // Subscribe to plan changes
  subscribe(callback: (plan: UserPlan) => void): () => void {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  // Notify listeners of plan changes
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.userPlan))
  }

  // Get current user plan
  getUserPlan(): UserPlan {
    return { ...this.userPlan }
  }

  // Check if user has premium
  isPremium(): boolean {
    return this.userPlan.type === 'premium'
  }

  // Check if a feature is available
  isFeatureAvailable(feature: keyof PlanLimits): boolean {
    return this.userPlan.limits[feature] === true || this.userPlan.limits[feature] === null
  }

  // Check if user can perform an action (considering usage limits)
  canPerformAction(action: 'chatMessages' | 'codeProjects' | 'imageExports'): boolean {
    const limit = this.userPlan.limits[action]
    if (limit === null) return true // unlimited

    const usage = this.userPlan.usage[action]
    return usage < limit
  }

  // Get remaining usage for an action
  getRemainingUsage(action: 'chatMessages' | 'codeProjects' | 'imageExports'): number | null {
    const limit = this.userPlan.limits[action]
    if (limit === null) return null // unlimited

    const usage = this.userPlan.usage[action]
    return Math.max(0, limit - usage)
  }

  // Get usage percentage (0-100)
  getUsagePercentage(action: 'chatMessages' | 'codeProjects' | 'imageExports'): number {
    const limit = this.userPlan.limits[action]
    if (limit === null) return 0 // unlimited

    const usage = this.userPlan.usage[action]
    return Math.min(100, (usage / limit) * 100)
  }

  // Increment usage
  incrementUsage(action: 'chatMessages' | 'codeProjects' | 'imageExports'): void {
    this.userPlan.usage[action]++
    this.saveUserPlan()
  }

  // Check if feature is locked and get lock info
  getFeatureLock(feature: keyof PlanLimits): FeatureLock {
    const isAvailable = this.isFeatureAvailable(feature)
    
    if (isAvailable) {
      return { feature, isLocked: false }
    }

    const upgradeMessages = {
      versionHistory: 'Version history ile projelerini güvenle yönet',
      brandKit: 'Brand kit ile tutarlı tasarımlar oluştur',
      hdExport: 'HD kalitede export et',
      multiDevicePreview: 'Tüm cihazlarda önizle',
      aiDesignAssistant: 'AI tasarım asistanı ile daha hızlı çalış',
    }

    return {
      feature,
      isLocked: true,
      reason: 'Premium özellik',
      upgradeMessage: (upgradeMessages as any)[feature] || 'Premium ile açılır',
    }
  }

  // Upgrade to premium (demo mode)
  upgradeToPremium(): void {
    this.userPlan = {
      ...this.userPlan,
      type: 'premium',
      limits: PLAN_LIMITS.premium,
      subscriptionDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    }
    this.saveUserPlan()
  }

  // Downgrade to free (for testing)
  downgradeToFree(): void {
    this.userPlan = {
      ...this.userPlan,
      type: 'free',
      limits: PLAN_LIMITS.free,
      subscriptionDate: undefined,
      expiryDate: undefined,
    }
    this.saveUserPlan()
  }

  // Reset usage (for testing)
  resetUsage(): void {
    this.userPlan.usage = getDefaultUsage()
    this.saveUserPlan()
  }

  // Get upgrade reasons based on current usage
  getUpgradeReasons(): string[] {
    const reasons: string[] = []
    
    // Check usage limits
    if (this.getUsagePercentage('chatMessages') > 80) {
      reasons.push('Unlimited chat messages')
    }
    if (this.getUsagePercentage('codeProjects') > 80) {
      reasons.push('Unlimited code projects')
    }
    if (this.getUsagePercentage('imageExports') > 80) {
      reasons.push('Unlimited HD exports')
    }

    // Add premium features
    if (!this.isFeatureAvailable('versionHistory')) {
      reasons.push('Project version history')
    }
    if (!this.isFeatureAvailable('brandKit')) {
      reasons.push('Brand kit & design system')
    }
    if (!this.isFeatureAvailable('aiDesignAssistant')) {
      reasons.push('AI design assistant')
    }

    return reasons
  }
}

// Singleton instance
export const premiumManager = PremiumManager.getInstance()






