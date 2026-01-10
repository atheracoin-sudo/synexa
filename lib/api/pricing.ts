'use client'

export interface PlanFeature {
  id: string
  name: string
  description: string
  free: boolean | string | number
  premium: boolean | string | number
  icon?: string
}

export interface Plan {
  id: 'free' | 'premium'
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
}

// Plan Definitions (NET VE AZ)
export const PLAN_FEATURES: PlanFeature[] = [
  {
    id: 'chat_messages',
    name: 'Chat Messages',
    description: 'AI conversations per month',
    free: '50 messages',
    premium: 'Unlimited',
    icon: '💬'
  },
  {
    id: 'app_builder',
    name: 'App Builder',
    description: 'Code Studio capabilities',
    free: 'Basic templates',
    premium: 'Full builder + custom code',
    icon: '🏗️'
  },
  {
    id: 'image_studio',
    name: 'Image Studio',
    description: 'Design and export capabilities',
    free: 'Basic tools + watermark',
    premium: 'Full tools + no watermark',
    icon: '🎨'
  },
  {
    id: 'ai_agents',
    name: 'AI Agents',
    description: 'Specialized AI assistants',
    free: '1 agent per month',
    premium: 'Unlimited agents',
    icon: '🤖'
  },
  {
    id: 'generation_speed',
    name: 'Generation Speed',
    description: 'AI processing priority',
    free: 'Standard queue',
    premium: 'Priority generation',
    icon: '⚡'
  },
  {
    id: 'version_history',
    name: 'Version History',
    description: 'Project versioning',
    free: false,
    premium: true,
    icon: '📚'
  },
  {
    id: 'brand_kit',
    name: 'Brand Kit',
    description: 'Custom branding tools',
    free: false,
    premium: true,
    icon: '🎯'
  },
  {
    id: 'priority_support',
    name: 'Priority Support',
    description: 'Faster help and assistance',
    free: false,
    premium: true,
    icon: '🚀'
  }
]

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      '50 chat messages/month',
      'Basic App & Image Studio',
      '1 AI Agent/month',
      'Watermarked exports',
      'Community support'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$19',
    description: 'Everything you need to create',
    features: [
      'Unlimited chat messages',
      'Full App Builder',
      'No watermark exports',
      'Unlimited AI Agents',
      'Priority generation',
      'Version history',
      'Brand kit',
      'Priority support'
    ],
    popular: true
  }
]

// Feature Lock Utilities
export function isFeatureLocked(featureId: string, userPlan: 'free' | 'premium'): boolean {
  if (userPlan === 'premium') return false
  
  const premiumOnlyFeatures = [
    'version_history',
    'brand_kit',
    'priority_support',
    'unlimited_agents',
    'no_watermark',
    'priority_generation'
  ]
  
  return premiumOnlyFeatures.includes(featureId)
}

export function getFeatureLockMessage(featureId: string): string {
  const messages = {
    version_history: 'Version history is available with Premium',
    brand_kit: 'Brand kit tools are available with Premium',
    priority_support: 'Priority support is available with Premium',
    unlimited_agents: 'Unlimited agents are available with Premium',
    no_watermark: 'Watermark-free exports are available with Premium',
    priority_generation: 'Priority generation is available with Premium',
    unlimited_chat: 'Unlimited chat messages are available with Premium'
  }
  
  return messages[featureId as keyof typeof messages] || 'This feature is available with Premium'
}

// Usage Limits
export function getUsageLimit(featureId: string, userPlan: 'free' | 'premium'): number {
  if (userPlan === 'premium') return Infinity
  
  const limits = {
    chat_messages: 50,
    code_generations: 10,
    image_generations: 20,
    agents: 1,
    projects: 5
  }
  
  return limits[featureId as keyof typeof limits] || 0
}

export function shouldShowUpgradePrompt(
  usage: number, 
  limit: number, 
  threshold: number = 0.8
): boolean {
  if (limit === Infinity) return false
  return usage / limit >= threshold
}

// Pricing API Simulation
export class PricingAPI {
  static async getPlans(): Promise<Plan[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return PLANS
  }
  
  static async upgradeToPremium(userId: string): Promise<{ success: boolean; message: string }> {
    // Simulate upgrade process
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In real app, this would integrate with Stripe/payment processor
    return {
      success: true,
      message: 'Successfully upgraded to Premium!'
    }
  }
  
  static async cancelSubscription(userId: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      message: 'Subscription cancelled. Premium features will remain active until the end of your billing period.'
    }
  }
}

// Upgrade Entry Points
export const UPGRADE_ENTRY_POINTS = {
  FEATURE_LOCK: 'feature_lock',
  USAGE_LIMIT: 'usage_limit', 
  PRICING_PAGE: 'pricing_page',
  PROFILE: 'profile',
  ONBOARDING: 'onboarding'
} as const

export type UpgradeEntryPoint = typeof UPGRADE_ENTRY_POINTS[keyof typeof UPGRADE_ENTRY_POINTS]





