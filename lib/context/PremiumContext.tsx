'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type PlanType = 'free' | 'pro' | 'team'

interface PremiumContextType {
  plan: PlanType
  setPlan: (plan: PlanType) => void
  isPremium: boolean
  isTeam: boolean
  usage: {
    chatMessages: { used: number; limit: number }
    apps: { used: number; limit: number }
    images: { used: number; limit: number }
    agents: { used: number; limit: number }
  }
  updateUsage: (type: keyof PremiumContextType['usage'], amount: number) => void
  canUseFeature: (feature: string) => boolean
  getFeatureLimit: (feature: string) => number
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined)

const PLAN_LIMITS = {
  free: {
    chatMessages: 20,
    apps: 1,
    images: 5,
    agents: 1,
  },
  pro: {
    chatMessages: 1000,
    apps: 10,
    images: 100,
    agents: 5,
  },
  team: {
    chatMessages: -1, // unlimited
    apps: -1, // unlimited
    images: 500,
    agents: 20,
  }
}

interface PremiumProviderProps {
  children: ReactNode
}

export function PremiumProvider({ children }: PremiumProviderProps) {
  const [plan, setPlanState] = useState<PlanType>('free')
  const [usage, setUsage] = useState({
    chatMessages: { used: 12, limit: PLAN_LIMITS.free.chatMessages },
    apps: { used: 1, limit: PLAN_LIMITS.free.apps },
    images: { used: 3, limit: PLAN_LIMITS.free.images },
    agents: { used: 0, limit: PLAN_LIMITS.free.agents },
  })

  const isPremium = plan === 'pro' || plan === 'team'
  const isTeam = plan === 'team'

  // Load plan from localStorage on mount
  useEffect(() => {
    const savedPlan = localStorage.getItem('synexa_plan') as PlanType
    if (savedPlan && ['free', 'pro', 'team'].includes(savedPlan)) {
      setPlanState(savedPlan)
    }
  }, [])

  // Update limits when plan changes
  useEffect(() => {
    const limits = PLAN_LIMITS[plan]
    setUsage(prev => ({
      chatMessages: { ...prev.chatMessages, limit: limits.chatMessages },
      apps: { ...prev.apps, limit: limits.apps },
      images: { ...prev.images, limit: limits.images },
      agents: { ...prev.agents, limit: limits.agents },
    }))
  }, [plan])

  const setPlan = (newPlan: PlanType) => {
    setPlanState(newPlan)
    localStorage.setItem('synexa_plan', newPlan)
  }

  const updateUsage = (type: keyof PremiumContextType['usage'], amount: number) => {
    setUsage(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        used: Math.max(0, prev[type].used + amount)
      }
    }))
  }

  const canUseFeature = (feature: string): boolean => {
    switch (feature) {
      case 'export':
      case 'download':
      case 'openInNewTab':
      case 'zipExport':
      case 'exportProject':
        return isPremium
      case 'unlimitedProjects':
        return usage.apps.used < usage.apps.limit || usage.apps.limit === -1
      case 'advancedStudio':
        return isPremium
      case 'codeGeneration':
        return isPremium
      case 'livePreview':
        return isPremium
      default:
        return true
    }
  }

  const getFeatureLimit = (feature: string): number => {
    switch (feature) {
      case 'chatMessages':
        return usage.chatMessages.limit
      case 'apps':
        return usage.apps.limit
      case 'images':
        return usage.images.limit
      case 'agents':
        return usage.agents.limit
      default:
        return -1
    }
  }

  return (
    <PremiumContext.Provider
      value={{
        plan,
        setPlan,
        isPremium,
        isTeam,
        usage,
        updateUsage,
        canUseFeature,
        getFeatureLimit,
      }}
    >
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  const context = useContext(PremiumContext)
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider')
  }
  return context
}