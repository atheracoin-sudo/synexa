'use client'

import { useState, useEffect } from 'react'
import { UserRole, ExperienceLevel, UserGoal, onboardingManager } from '@/lib/onboarding'
import RoleSelectionStep from './RoleSelectionStep'
import ExperienceLevelStep from './ExperienceLevelStep'
import GoalSelectionStep from './GoalSelectionStep'
import ToolPreferenceStep from './ToolPreferenceStep'

interface AdvancedOnboardingModalProps {
  isOpen: boolean
  onComplete: (data: {
    role: UserRole
    experienceLevel: ExperienceLevel
    goals: UserGoal[]
    tools: string[]
  }) => void
  onSkip: () => void
  userId: string
}

type OnboardingStep = 'role' | 'experience' | 'goals' | 'tools'

export default function AdvancedOnboardingModal({
  isOpen,
  onComplete,
  onSkip,
  userId
}: AdvancedOnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('role')
  const [onboardingData, setOnboardingData] = useState({
    role: null as UserRole | null,
    experienceLevel: null as ExperienceLevel | null,
    goals: [] as UserGoal[],
    tools: [] as string[]
  })

  const steps: OnboardingStep[] = ['role', 'experience', 'goals', 'tools']
  const currentStepIndex = steps.indexOf(currentStep)
  const totalSteps = steps.length

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('role')
      setOnboardingData({
        role: null,
        experienceLevel: null,
        goals: [],
        tools: []
      })
    }
  }, [isOpen])

  const handleRoleSelect = (role: UserRole) => {
    setOnboardingData(prev => ({ ...prev, role }))
    setCurrentStep('experience')
  }

  const handleExperienceSelect = (experienceLevel: ExperienceLevel) => {
    setOnboardingData(prev => ({ ...prev, experienceLevel }))
    setCurrentStep('goals')
  }

  const handleGoalsSelect = (goals: UserGoal[]) => {
    setOnboardingData(prev => ({ ...prev, goals }))
    setCurrentStep('tools')
  }

  const handleToolsSelect = (tools: string[]) => {
    const finalData = {
      ...onboardingData,
      tools,
      role: onboardingData.role!,
      experienceLevel: onboardingData.experienceLevel!
    }
    
    // Complete onboarding
    onboardingManager.completeOnboarding(userId, finalData)
    onComplete(finalData)
  }

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const handleSkipAll = () => {
    // Set default values and complete
    const defaultData = {
      role: 'chat_user' as UserRole,
      experienceLevel: 'beginner' as ExperienceLevel,
      goals: [] as UserGoal[],
      tools: ['chat'] as string[]
    }
    
    onboardingManager.completeOnboarding(userId, defaultData)
    onSkip()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-full h-full bg-gray-950 overflow-y-auto">
        {/* Progress Header */}
        <div className="sticky top-0 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              {/* Progress Dots */}
              <div className="flex items-center gap-3">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index <= currentStepIndex
                        ? 'bg-blue-500'
                        : 'bg-gray-700'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-400 ml-2">
                  {currentStepIndex + 1} / {totalSteps}
                </span>
              </div>

              {/* Skip All */}
              <button
                onClick={handleSkipAll}
                className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
              >
                Atla
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-1">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-1 rounded-full transition-all duration-500"
                style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[calc(100vh-120px)]">
          {currentStep === 'role' && (
            <RoleSelectionStep
              onNext={handleRoleSelect}
              onSkip={handleSkipAll}
            />
          )}

          {currentStep === 'experience' && onboardingData.role && (
            <ExperienceLevelStep
              selectedRole={onboardingData.role}
              onNext={handleExperienceSelect}
              onBack={handleBack}
              onSkip={handleSkipAll}
            />
          )}

          {currentStep === 'goals' && onboardingData.role && (
            <GoalSelectionStep
              selectedRole={onboardingData.role}
              onNext={handleGoalsSelect}
              onBack={handleBack}
              onSkip={handleSkipAll}
            />
          )}

          {currentStep === 'tools' && onboardingData.role && (
            <ToolPreferenceStep
              selectedRole={onboardingData.role}
              onNext={handleToolsSelect}
              onBack={handleBack}
              onSkip={handleSkipAll}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Onboarding completion celebration
export function OnboardingCompletionModal({
  isOpen,
  onClose,
  userData
}: {
  isOpen: boolean
  onClose: () => void
  userData: {
    role: UserRole
    experienceLevel: ExperienceLevel
    goals: UserGoal[]
    tools: string[]
  } | null
}) {
  const roleDefinition = userData ? onboardingManager.getRoleDefinition(userData.role) : null

  if (!isOpen || !userData || !roleDefinition) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">{roleDefinition.icon}</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Hoş geldin! 🎉
          </h2>
          <p className="text-blue-100 text-sm">
            Synexa sana özel hazırlandı
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-white mb-2">
              {roleDefinition.title} olarak devam ediyorsun
            </h3>
            <p className="text-gray-400 text-sm">
              Sana özel öneriler ve araçlar hazırladık
            </p>
          </div>

          {/* Summary */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-300">
                <strong className="text-white">Seviye:</strong> {userData.experienceLevel}
              </span>
            </div>
            
            {userData.goals.length > 0 && (
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-300">
                  <strong className="text-white">Hedefler:</strong> {userData.goals.length} hedef seçtin
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-300">
                <strong className="text-white">Araçlar:</strong> {userData.tools.length} araç aktif
              </span>
            </div>
          </div>

          {/* Action */}
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
          >
            Başlayalım! 🚀
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook for managing onboarding state
export function useAdvancedOnboarding(userId: string) {
  const [needsOnboarding, setNeedsOnboarding] = useState(false)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [completionData, setCompletionData] = useState<any>(null)

  useEffect(() => {
    const needs = onboardingManager.needsOnboarding(userId)
    setNeedsOnboarding(needs)
    if (needs) {
      setIsOnboardingOpen(true)
    }
  }, [userId])

  const handleOnboardingComplete = (data: any) => {
    setIsOnboardingOpen(false)
    setCompletionData(data)
    setShowCompletion(true)
    setNeedsOnboarding(false)
  }

  const handleOnboardingSkip = () => {
    setIsOnboardingOpen(false)
    setNeedsOnboarding(false)
  }

  const handleCompletionClose = () => {
    setShowCompletion(false)
    setCompletionData(null)
  }

  const resetOnboarding = () => {
    onboardingManager.resetOnboarding(userId)
    setNeedsOnboarding(true)
    setIsOnboardingOpen(true)
  }

  return {
    needsOnboarding,
    isOnboardingOpen,
    showCompletion,
    completionData,
    handleOnboardingComplete,
    handleOnboardingSkip,
    handleCompletionClose,
    resetOnboarding
  }
}
