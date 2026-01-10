import { UserPreferences, OnboardingData } from './types'

const STORAGE_KEYS = {
  USER_PREFERENCES: 'synexa_user_preferences',
  ONBOARDING: 'synexa_onboarding',
} as const

// Default preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  onboarding: null,
  theme: 'dark',
  language: 'tr',
}

// Storage utilities
export const storage = {
  // Get user preferences
  getPreferences(): UserPreferences {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
      if (!stored) return DEFAULT_PREFERENCES
      
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_PREFERENCES, ...parsed }
    } catch (error) {
      console.warn('Failed to load user preferences:', error)
      return DEFAULT_PREFERENCES
    }
  },

  // Save user preferences
  setPreferences(preferences: Partial<UserPreferences>): void {
    if (typeof window === 'undefined') return
    
    try {
      const current = this.getPreferences()
      const updated = { ...current, ...preferences }
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated))
    } catch (error) {
      console.warn('Failed to save user preferences:', error)
    }
  },

  // Onboarding specific methods
  getOnboarding(): OnboardingData | null {
    return this.getPreferences().onboarding
  },

  setOnboarding(data: OnboardingData): void {
    this.setPreferences({ onboarding: data })
  },

  isOnboardingCompleted(): boolean {
    const onboarding = this.getOnboarding()
    return onboarding?.completed === true
  },

  // Clear all data (for testing/reset)
  clear(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES)
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING)
    } catch (error) {
      console.warn('Failed to clear storage:', error)
    }
  }
}





