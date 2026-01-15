'use client'

import { useState, useEffect, useCallback } from 'react'
import { OnboardingData } from '@/lib/types'
import { storage } from '@/lib/storage'

export function useOnboarding() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check onboarding status on mount
    const checkOnboarding = () => {
      try {
        const data = storage.getOnboarding()
        setOnboardingData(data)
        
        // Show onboarding if not completed
        if (!data?.completed) {
          setIsOnboardingOpen(true)
        }
      } catch (error) {
        console.warn('Failed to check onboarding status:', error)
        // Show onboarding on error to be safe
        setIsOnboardingOpen(true)
      } finally {
        setIsLoading(false)
      }
    }

    checkOnboarding()
  }, [])

  const completeOnboarding = useCallback((data: OnboardingData) => {
    try {
      storage.setOnboarding(data)
      setOnboardingData(data)
      setIsOnboardingOpen(false)
    } catch (error) {
      console.error('Failed to save onboarding data:', error)
    }
  }, [])

  const skipOnboarding = useCallback(() => {
    try {
      const defaultData: OnboardingData = {
        purpose: 'chat',
        level: 'intermediate',
        goal: 'quick',
        completed: true,
        completedAt: new Date(),
      }
      storage.setOnboarding(defaultData)
      setOnboardingData(defaultData)
      setIsOnboardingOpen(false)
    } catch (error) {
      console.error('Failed to skip onboarding:', error)
    }
  }, [])

  const resetOnboarding = useCallback(() => {
    try {
      storage.setOnboarding({
        purpose: 'chat',
        level: 'beginner',
        goal: 'learn',
        completed: false,
      })
      setOnboardingData(null)
      setIsOnboardingOpen(true)
    } catch (error) {
      console.error('Failed to reset onboarding:', error)
    }
  }, [])

  const isCompleted = onboardingData?.completed === true

  return {
    isOnboardingOpen,
    onboardingData,
    isLoading,
    isCompleted,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
  }
}











