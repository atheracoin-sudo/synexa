'use client'

import { useState, useEffect, useCallback } from 'react'
import { tipsManager, Tip, TipContext, CoachingSuggestion } from '@/lib/tips'

export function useTips(context: TipContext, userId: string = 'user_1') {
  const [tips, setTips] = useState<Tip[]>([])
  const [activeTip, setActiveTip] = useState<Tip | null>(null)
  const [suggestions, setSuggestions] = useState<CoachingSuggestion[]>([])
  const [settings, setSettings] = useState(tipsManager.getTipsSettings(userId))

  // Load tips for current context
  const loadTips = useCallback(() => {
    if (!settings.showInAppTips) {
      setTips([])
      return
    }

    const contextTips = tipsManager.getTipsForContext(context, userId)
    setTips(contextTips)

    // Show first available tip
    if (contextTips.length > 0 && !activeTip) {
      setActiveTip(contextTips[0])
      tipsManager.markTipAsShown(contextTips[0].id, userId)
    }
  }, [context, userId, settings.showInAppTips, activeTip])

  // Load coaching suggestions
  const loadSuggestions = useCallback(() => {
    if (!settings.enableAICoaching) {
      setSuggestions([])
      return
    }

    const contextSuggestions = tipsManager.generateCoachingSuggestions(context, userId)
    setSuggestions(contextSuggestions)
  }, [context, userId, settings.enableAICoaching])

  useEffect(() => {
    loadTips()
    loadSuggestions()
  }, [loadTips, loadSuggestions])

  // Dismiss current tip
  const dismissTip = useCallback((tipId?: string) => {
    const targetTip = tipId ? tips.find(t => t.id === tipId) : activeTip
    if (!targetTip) return

    tipsManager.dismissTip(targetTip.id, userId)
    setActiveTip(null)
    
    // Show next tip if available
    const remainingTips = tips.filter(t => t.id !== targetTip.id)
    if (remainingTips.length > 0) {
      setTimeout(() => {
        setActiveTip(remainingTips[0])
        tipsManager.markTipAsShown(remainingTips[0].id, userId)
      }, 1000) // Delay before showing next tip
    }
  }, [tips, activeTip, userId])

  // Complete tip action
  const completeTipAction = useCallback((tipId?: string) => {
    const targetTip = tipId ? tips.find(t => t.id === tipId) : activeTip
    if (!targetTip) return

    tipsManager.completeTipAction(targetTip.id, userId)
    
    // Navigate to action URL if provided
    if (targetTip.actionUrl) {
      window.location.href = targetTip.actionUrl
    }
    
    setActiveTip(null)
  }, [tips, activeTip, userId])

  // Trigger specific tip
  const triggerTip = useCallback((tipId: string) => {
    const tip = tipsManager.getTipById(tipId)
    if (!tip) return

    if (tipsManager.shouldShowTip(tip, userId)) {
      setActiveTip(tip)
      tipsManager.markTipAsShown(tip.id, userId)
    }
  }, [userId])

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<typeof settings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    tipsManager.saveTipsSettings(userId, updatedSettings)
    
    // Reload tips and suggestions with new settings
    setTimeout(() => {
      loadTips()
      loadSuggestions()
    }, 100)
  }, [settings, userId, loadTips, loadSuggestions])

  // Reset all tips (for testing)
  const resetAllTips = useCallback(() => {
    tipsManager.resetAllTips(userId)
    setActiveTip(null)
    loadTips()
  }, [userId, loadTips])

  return {
    // Data
    tips,
    activeTip,
    suggestions,
    settings,
    
    // Actions
    dismissTip,
    completeTipAction,
    triggerTip,
    updateSettings,
    resetAllTips,
    
    // Utils
    loadTips,
    loadSuggestions
  }
}

// Hook for specific tip triggers
export function useTipTriggers(context: TipContext, userId: string = 'user_1') {
  const { triggerTip } = useTips(context, userId)

  // Trigger first visit tip
  const triggerFirstVisit = useCallback(() => {
    const firstVisitTipId = `${context}_first_visit`
    triggerTip(firstVisitTipId)
  }, [context, triggerTip])

  // Trigger progress milestone tip
  const triggerProgressMilestone = useCallback((milestone: string) => {
    const milestoneTipId = `${context}_${milestone}`
    triggerTip(milestoneTipId)
  }, [context, triggerTip])

  // Trigger feature tip
  const triggerFeatureTip = useCallback((feature: string) => {
    const featureTipId = `${context}_${feature}`
    triggerTip(featureTipId)
  }, [context, triggerTip])

  // Trigger error/stuck tip
  const triggerStuckTip = useCallback(() => {
    // Find tips with 'stuck' or 'repeated_error' triggers
    const allTips = tipsManager.getAllTips()
    const stuckTips = allTips.filter(tip => 
      tip.context === context && 
      (tip.trigger === 'stuck' || tip.trigger === 'repeated_error')
    )
    
    if (stuckTips.length > 0) {
      triggerTip(stuckTips[0].id)
    }
  }, [context, triggerTip])

  return {
    triggerFirstVisit,
    triggerProgressMilestone,
    triggerFeatureTip,
    triggerStuckTip
  }
}

// Hook for page-specific tip integration
export function usePageTips(context: TipContext, userId: string = 'user_1') {
  const { tips, activeTip, dismissTip, completeTipAction } = useTips(context, userId)
  const { triggerFirstVisit } = useTipTriggers(context, userId)

  // Check if this is first visit to the page
  useEffect(() => {
    const visitKey = `synexa_first_visit_${context}_${userId}`
    const hasVisited = localStorage.getItem(visitKey)
    
    if (!hasVisited) {
      // Mark as visited
      localStorage.setItem(visitKey, 'true')
      
      // Trigger first visit tip after a short delay
      setTimeout(() => {
        triggerFirstVisit()
      }, 1000)
    }
  }, [context, userId, triggerFirstVisit])

  // Get tips by type
  const inlineTips = tips.filter(tip => tip.type === 'inline')
  const tooltipTips = tips.filter(tip => tip.type === 'tooltip')
  const coachingTips = tips.filter(tip => tip.type === 'coaching')

  return {
    // All tips
    tips,
    activeTip,
    
    // Tips by type
    inlineTips,
    tooltipTips,
    coachingTips,
    
    // Actions
    dismissTip,
    completeTipAction,
    
    // Utils
    hasInlineTips: inlineTips.length > 0,
    hasTooltipTips: tooltipTips.length > 0,
    hasCoachingTips: coachingTips.length > 0
  }
}

// Hook for AI coaching integration
export function useAICoaching(context: TipContext, userId: string = 'user_1') {
  const { suggestions, settings, updateSettings } = useTips(context, userId)
  const [isVisible, setIsVisible] = useState(false)
  const [currentSuggestion, setCurrentSuggestion] = useState(0)

  useEffect(() => {
    if (suggestions.length > 0 && settings.enableAICoaching) {
      // Show coaching panel after a delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 3000)
      
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [suggestions, settings.enableAICoaching])

  const dismissCoaching = useCallback(() => {
    setIsVisible(false)
  }, [])

  const nextSuggestion = useCallback(() => {
    if (currentSuggestion < suggestions.length - 1) {
      setCurrentSuggestion(currentSuggestion + 1)
    }
  }, [currentSuggestion, suggestions.length])

  const previousSuggestion = useCallback(() => {
    if (currentSuggestion > 0) {
      setCurrentSuggestion(currentSuggestion - 1)
    }
  }, [currentSuggestion])

  const disableCoaching = useCallback(() => {
    updateSettings({ enableAICoaching: false })
    setIsVisible(false)
  }, [updateSettings])

  return {
    // Data
    suggestions,
    currentSuggestion: suggestions[currentSuggestion],
    isVisible,
    isEnabled: settings.enableAICoaching,
    
    // Actions
    dismissCoaching,
    nextSuggestion,
    previousSuggestion,
    disableCoaching,
    
    // Utils
    hasSuggestions: suggestions.length > 0,
    suggestionCount: suggestions.length
  }
}






