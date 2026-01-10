'use client'

import { useState, useCallback } from 'react'
import { 
  MessageSquare, 
  Code2, 
  Palette, 
  GraduationCap, 
  Zap, 
  Target,
  BookOpen,
  Rocket,
  Clock,
  X,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { OnboardingPurpose, OnboardingLevel, OnboardingGoal, OnboardingData } from '@/lib/types'

interface OnboardingModalProps {
  isOpen: boolean
  onComplete: (data: OnboardingData) => void
  onSkip: () => void
}

interface StepData {
  purpose?: OnboardingPurpose
  level?: OnboardingLevel
  goal?: OnboardingGoal
}

const purposeOptions = [
  {
    id: 'chat' as OnboardingPurpose,
    title: 'Chat',
    subtitle: 'Daily AI Assistant',
    description: 'Get help with questions, writing, and daily tasks',
    icon: MessageSquare,
    gradient: 'bg-gradient-primary',
  },
  {
    id: 'code' as OnboardingPurpose,
    title: 'Code',
    subtitle: 'Build an App',
    description: 'Create applications with AI-powered development',
    icon: Code2,
    gradient: 'bg-gradient-to-br from-green-500 to-teal-600',
  },
  {
    id: 'design' as OnboardingPurpose,
    title: 'Design',
    subtitle: 'Create Visuals',
    description: 'Generate stunning graphics and designs',
    icon: Palette,
    gradient: 'bg-gradient-to-br from-pink-500 to-purple-600',
  },
]

const levelOptions = [
  {
    id: 'beginner' as OnboardingLevel,
    title: 'Beginner',
    description: 'New to AI tools, need guidance',
    icon: GraduationCap,
    color: 'text-green-500',
  },
  {
    id: 'intermediate' as OnboardingLevel,
    title: 'Intermediate',
    description: 'Some experience, want to explore',
    icon: Zap,
    color: 'text-blue-500',
  },
  {
    id: 'pro' as OnboardingLevel,
    title: 'Pro',
    description: 'Advanced user, need powerful features',
    icon: Target,
    color: 'text-purple-500',
  },
]

const goalOptions = [
  {
    id: 'learn' as OnboardingGoal,
    title: 'Öğrenmek',
    description: 'Explore and understand AI capabilities',
    icon: BookOpen,
    color: 'text-blue-500',
  },
  {
    id: 'build' as OnboardingGoal,
    title: 'Proje üretmek',
    description: 'Create real projects and applications',
    icon: Rocket,
    color: 'text-green-500',
  },
  {
    id: 'quick' as OnboardingGoal,
    title: 'Hızlı sonuç almak',
    description: 'Get immediate results and solutions',
    icon: Clock,
    color: 'text-orange-500',
  },
]

export function OnboardingModal({ isOpen, onComplete, onSkip }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [stepData, setStepData] = useState<StepData>({})

  const handleNext = useCallback(() => {
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Complete onboarding
      const data: OnboardingData = {
        purpose: stepData.purpose!,
        level: stepData.level!,
        goal: stepData.goal!,
        completed: true,
        completedAt: new Date(),
      }
      onComplete(data)
    }
  }, [currentStep, stepData, onComplete])

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  const handlePurposeSelect = useCallback((purpose: OnboardingPurpose) => {
    setStepData(prev => ({ ...prev, purpose }))
  }, [])

  const handleLevelSelect = useCallback((level: OnboardingLevel) => {
    setStepData(prev => ({ ...prev, level }))
  }, [])

  const handleGoalSelect = useCallback((goal: OnboardingGoal) => {
    setStepData(prev => ({ ...prev, goal }))
  }, [])

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!stepData.purpose
      case 1: return !!stepData.level
      case 2: return !!stepData.goal
      default: return false
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
        {/* Header */}
        <div className="relative p-6 bg-gradient-primary text-white">
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Skip onboarding"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Welcome to Synexa</h1>
            <p className="text-white/80">Let's personalize your experience</p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  step <= currentStep ? "bg-white" : "bg-white/30"
                )}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Purpose */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Synexa ile ne yapmak istiyorsun?
                </h2>
                <p className="text-muted-foreground">
                  Ana kullanım amacını seç
                </p>
              </div>

              <div className="grid gap-4">
                {purposeOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = stepData.purpose === option.id
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handlePurposeSelect(option.id)}
                      className={cn(
                        "relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-200",
                        "border-2 hover:scale-[1.02] active:scale-[0.98]",
                        isSelected 
                          ? "border-primary bg-primary/5" 
                          : "border-border/50 bg-card hover:border-border"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shadow-premium",
                          option.gradient
                        )}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-foreground">
                              {option.title}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                              {option.subtitle}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2: Level */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Seviyen nedir?
                </h2>
                <p className="text-muted-foreground">
                  AI araçlarındaki deneyimin
                </p>
              </div>

              <div className="grid gap-4">
                {levelOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = stepData.level === option.id
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleLevelSelect(option.id)}
                      className={cn(
                        "relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-200",
                        "border-2 hover:scale-[1.02] active:scale-[0.98]",
                        isSelected 
                          ? "border-primary bg-primary/5" 
                          : "border-border/50 bg-card hover:border-border"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
                          <Icon className={cn("h-6 w-6", option.color)} />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            {option.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Goal */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Hedefin ne?
                </h2>
                <p className="text-muted-foreground">
                  Synexa'yı nasıl kullanmak istiyorsun?
                </p>
              </div>

              <div className="grid gap-4">
                {goalOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = stepData.goal === option.id
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleGoalSelect(option.id)}
                      className={cn(
                        "relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-200",
                        "border-2 hover:scale-[1.02] active:scale-[0.98]",
                        isSelected 
                          ? "border-primary bg-primary/5" 
                          : "border-border/50 bg-card hover:border-border"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
                          <Icon className={cn("h-6 w-6", option.color)} />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            {option.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/50 bg-muted/20">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={currentStep === 0 ? onSkip : handleBack}
              className="flex items-center gap-2"
            >
              {currentStep === 0 ? (
                'Skip'
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </>
              )}
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-gradient-primary text-white shadow-premium"
            >
              {currentStep === 2 ? 'Complete' : 'Next'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}






