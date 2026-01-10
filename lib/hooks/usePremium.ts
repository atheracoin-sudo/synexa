'use client'

import { useState, useEffect } from 'react'
import { premiumManager } from '@/lib/premium'
import { UserPlan, PlanLimits, FeatureLock } from '@/lib/types'

export function usePremium() {
  const [userPlan, setUserPlan] = useState<UserPlan>(premiumManager.getUserPlan())

  useEffect(() => {
    // Subscribe to plan changes
    const unsubscribe = premiumManager.subscribe(setUserPlan)
    return unsubscribe
  }, [])

  return {
    // Plan info
    userPlan,
    isPremium: premiumManager.isPremium(),
    
    // Feature checks
    isFeatureAvailable: (feature: keyof PlanLimits) => premiumManager.isFeatureAvailable(feature),
    getFeatureLock: (feature: keyof PlanLimits) => premiumManager.getFeatureLock(feature),
    
    // Usage checks
    canPerformAction: (action: 'chatMessages' | 'codeProjects' | 'imageExports') => 
      premiumManager.canPerformAction(action),
    getRemainingUsage: (action: 'chatMessages' | 'codeProjects' | 'imageExports') => 
      premiumManager.getRemainingUsage(action),
    getUsagePercentage: (action: 'chatMessages' | 'codeProjects' | 'imageExports') => 
      premiumManager.getUsagePercentage(action),
    
    // Actions
    incrementUsage: (action: 'chatMessages' | 'codeProjects' | 'imageExports') => 
      premiumManager.incrementUsage(action),
    upgradeToPremium: () => premiumManager.upgradeToPremium(),
    downgradeToFree: () => premiumManager.downgradeToFree(),
    resetUsage: () => premiumManager.resetUsage(),
    
    // Upgrade helpers
    getUpgradeReasons: () => premiumManager.getUpgradeReasons(),
  }
}





