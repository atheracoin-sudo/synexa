'use client'

// Beta Metrics Tracking (Silent Observation)
// LOG ONLY - Never show in UI

interface BetaMetric {
  userId: string
  event: string
  data: any
  timestamp: string
}

class BetaMetricsManager {
  private metrics: BetaMetric[] = []
  private readonly STORAGE_KEY = 'beta_metrics'

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadMetrics()
    }
  }

  private loadMetrics() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        this.metrics = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load beta metrics:', error)
    }
  }

  private saveMetrics() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.metrics))
    } catch (error) {
      console.error('Failed to save beta metrics:', error)
    }
  }

  // Track key beta events
  track(userId: string, event: string, data: any = {}) {
    const metric: BetaMetric = {
      userId,
      event,
      data,
      timestamp: new Date().toISOString()
    }

    this.metrics.push(metric)
    this.saveMetrics()

    // In production, send to analytics service
    console.log('Beta Metric:', metric)
  }

  // Key Beta Success Metrics
  trackFirstDayChat(userId: string) {
    this.track(userId, 'first_day_chat_started', {
      daysSinceSignup: this.getDaysSinceSignup(userId)
    })
  }

  trackChatToAppConversion(userId: string, chatId: string, appId: string) {
    this.track(userId, 'chat_to_app_conversion', {
      chatId,
      appId,
      conversionTime: Date.now()
    })
  }

  trackFirstAppCreation(userId: string, timeToCreate: number) {
    this.track(userId, 'first_app_creation', {
      timeToCreateMs: timeToCreate,
      timeToCreateMinutes: Math.round(timeToCreate / 1000 / 60)
    })
  }

  trackSecondDayReturn(userId: string) {
    this.track(userId, 'second_day_return', {
      daysSinceSignup: this.getDaysSinceSignup(userId),
      returnTime: Date.now()
    })
  }

  trackUserJourney(userId: string, step: string, data: any = {}) {
    this.track(userId, 'user_journey', {
      step,
      ...data
    })
  }

  trackFeatureUsage(userId: string, feature: string, action: string, data: any = {}) {
    this.track(userId, 'feature_usage', {
      feature,
      action,
      ...data
    })
  }

  trackFeedbackSubmitted(userId: string, feedback: any) {
    this.track(userId, 'feedback_submitted', {
      hasWhatTrying: !!feedback.whatTrying,
      hasWhereStuck: !!feedback.whereStuck,
      hasWhatLiked: !!feedback.whatLiked,
      totalLength: (feedback.whatTrying + feedback.whereStuck + feedback.whatLiked).length
    })
  }

  // Helper methods
  private getDaysSinceSignup(userId: string): number {
    // In real app, get from user data
    // For now, assume signup was today
    return 0
  }

  // Analytics queries (for internal use only)
  getFirstDayChatRate(): number {
    const totalUsers = new Set(this.metrics.map(m => m.userId)).size
    const chatStartedUsers = new Set(
      this.metrics
        .filter(m => m.event === 'first_day_chat_started')
        .map(m => m.userId)
    ).size

    return totalUsers > 0 ? (chatStartedUsers / totalUsers) * 100 : 0
  }

  getChatToAppConversionRate(): number {
    const chatUsers = new Set(
      this.metrics
        .filter(m => m.event === 'first_day_chat_started')
        .map(m => m.userId)
    ).size

    const appUsers = new Set(
      this.metrics
        .filter(m => m.event === 'chat_to_app_conversion')
        .map(m => m.userId)
    ).size

    return chatUsers > 0 ? (appUsers / chatUsers) * 100 : 0
  }

  getAverageFirstAppCreationTime(): number {
    const appCreations = this.metrics.filter(m => m.event === 'first_app_creation')
    if (appCreations.length === 0) return 0

    const totalTime = appCreations.reduce((sum, m) => sum + m.data.timeToCreateMinutes, 0)
    return Math.round(totalTime / appCreations.length)
  }

  getSecondDayReturnRate(): number {
    const totalUsers = new Set(this.metrics.map(m => m.userId)).size
    const returnUsers = new Set(
      this.metrics
        .filter(m => m.event === 'second_day_return')
        .map(m => m.userId)
    ).size

    return totalUsers > 0 ? (returnUsers / totalUsers) * 100 : 0
  }

  // Export metrics for analysis (internal only)
  exportMetrics(): BetaMetric[] {
    return [...this.metrics]
  }

  // Clear metrics (for testing)
  clearMetrics() {
    this.metrics = []
    this.saveMetrics()
  }
}

export const betaMetrics = new BetaMetricsManager()

// Convenience functions for common tracking
export const trackBetaEvent = (userId: string, event: string, data?: any) => {
  betaMetrics.track(userId, event, data)
}

export const trackUserAction = (userId: string, action: string, context?: any) => {
  betaMetrics.trackFeatureUsage(userId, 'user_action', action, context)
}








