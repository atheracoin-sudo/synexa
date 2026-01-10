'use client'

// Production Configuration
export const config = {
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.synexa.ai',
    timeout: 30000,
    retries: 3
  },
  
  // Beta Configuration
  beta: {
    enabled: process.env.NEXT_PUBLIC_BETA_MODE === 'true',
    inviteOnly: true,
    showBetaBadge: false, // Never show beta badge in UI
    trackMetrics: true,
  },
  
  // Feature Flags
  features: {
    chat: true,
    codeStudio: true,
    imageStudio: true,
    agents: true,
    marketplace: true,
    analytics: true,
    enterprise: true,
    billing: true
  },
  
  // Plan Limits
  limits: {
    free: {
      chatMessages: 50,
      codeGenerations: 10,
      imageGenerations: 20,
      agents: 3,
      projects: 5,
      storage: '100MB'
    },
    premium: {
      chatMessages: 1000,
      codeGenerations: 100,
      imageGenerations: 200,
      agents: 25,
      projects: 50,
      storage: '10GB'
    },
    team: {
      chatMessages: 5000,
      codeGenerations: 500,
      imageGenerations: 1000,
      agents: 100,
      projects: 200,
      storage: '100GB'
    }
  },
  
  // UI Configuration
  ui: {
    defaultTheme: 'dark',
    animationDuration: 200,
    toastDuration: 3000,
    autoSaveInterval: 30000
  },
  
  // Error Messages (User-Friendly)
  errors: {
    network: 'Connection issue. Please check your internet and try again.',
    timeout: 'Request timed out. Please try again.',
    rateLimit: 'You\'ve reached your usage limit. Upgrade to continue.',
    unauthorized: 'Please sign in to continue.',
    forbidden: 'You don\'t have permission for this action.',
    notFound: 'The requested resource was not found.',
    serverError: 'Something went wrong on our end. We\'re working to fix it.',
    validation: 'Please check your input and try again.',
    quota: 'You\'ve reached your plan limit. Upgrade for more access.'
  }
}

// User Plans
export type UserPlan = 'free' | 'premium' | 'team' | 'enterprise'

// User State Interface
export interface UserState {
  id: string
  email: string
  name: string
  avatar?: string
  plan: UserPlan
  usage: {
    chatMessages: number
    codeGenerations: number
    imageGenerations: number
    agents: number
    projects: number
    storageUsed: string
  }
  subscription?: {
    id: string
    status: 'active' | 'canceled' | 'past_due'
    currentPeriodEnd: string
    cancelAtPeriodEnd: boolean
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    notifications: boolean
    autoSave: boolean
  }
  onboarding: {
    completed: boolean
    role?: string
    goals?: string[]
    experience?: string
  }
}

// Workspace State Interface
export interface WorkspaceState {
  activeProject?: string
  recentProjects: string[]
  openTabs: string[]
  sidebarCollapsed: boolean
}

// Global App State
export interface AppState {
  user: UserState | null
  workspace: WorkspaceState
  isLoading: boolean
  error: string | null
}

// Default User State
export const defaultUserState: UserState = {
  id: 'user_1',
  email: 'alex@company.com',
  name: 'Alex Johnson',
  plan: 'free',
  usage: {
    chatMessages: 12,
    codeGenerations: 3,
    imageGenerations: 8,
    agents: 2,
    projects: 4,
    storageUsed: '45MB'
  },
  preferences: {
    theme: 'dark',
    language: 'en',
    notifications: true,
    autoSave: true
  },
  onboarding: {
    completed: true,
    role: 'developer',
    goals: ['build_apps', 'learn_ai'],
    experience: 'intermediate'
  }
}

// Helper Functions
export function getUserPlanLimits(plan: UserPlan) {
  return config.limits[plan] || config.limits.free
}

export function isFeatureAvailable(feature: string, plan: UserPlan): boolean {
  // Premium features (locked for free users)
  const premiumFeatures = [
    'version_history', 
    'brand_kit', 
    'priority_support', 
    'advanced_analytics',
    'unlimited_agents',
    'no_watermark',
    'priority_generation',
    'unlimited_chat'
  ]
  
  const teamFeatures = ['team_collaboration', 'admin_panel', 'sso', 'audit_logs']
  
  if (premiumFeatures.includes(feature)) {
    return plan === 'premium' || plan === 'team' || plan === 'enterprise'
  }
  
  if (teamFeatures.includes(feature)) {
    return plan === 'team' || plan === 'enterprise'
  }
  
  return true // Core features available to all
}

export function formatUsage(used: number, limit: number): string {
  const percentage = Math.round((used / limit) * 100)
  return `${used.toLocaleString()} / ${limit.toLocaleString()} (${percentage}%)`
}

export function getUsageColor(used: number, limit: number): string {
  const percentage = (used / limit) * 100
  if (percentage >= 90) return 'text-red-500'
  if (percentage >= 75) return 'text-yellow-500'
  return 'text-green-500'
}

export function shouldShowUpgradePrompt(usage: UserState['usage'], plan: UserPlan): boolean {
  const limits = getUserPlanLimits(plan)
  
  // Show upgrade if any usage is above 80%
  return (
    usage.chatMessages / limits.chatMessages > 0.8 ||
    usage.codeGenerations / limits.codeGenerations > 0.8 ||
    usage.imageGenerations / limits.imageGenerations > 0.8
  )
}
