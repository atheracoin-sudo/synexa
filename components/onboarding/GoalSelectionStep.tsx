'use client'

import { useState } from 'react'
import { UserRole, UserGoal, onboardingManager } from '@/lib/onboarding'

interface GoalSelectionStepProps {
  selectedRole: UserRole
  onNext: (goals: UserGoal[]) => void
  onBack: () => void
  onSkip: () => void
}

export default function GoalSelectionStep({ 
  selectedRole, 
  onNext, 
  onBack, 
  onSkip 
}: GoalSelectionStepProps) {
  const [selectedGoals, setSelectedGoals] = useState<UserGoal[]>([])
  const roleGoals = onboardingManager.getRoleGoals(selectedRole)
  const roleDefinition = onboardingManager.getRoleDefinition(selectedRole)

  const handleGoalToggle = (goal: UserGoal) => {
    setSelectedGoals(prev => {
      if (prev.includes(goal)) {
        return prev.filter(g => g !== goal)
      } else {
        // Limit to 3 goals maximum
        if (prev.length >= 3) {
          return [...prev.slice(1), goal]
        }
        return [...prev, goal]
      }
    })
  }

  const handleNext = () => {
    onNext(selectedGoals)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        {/* Role Context */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="text-2xl">{roleDefinition?.icon}</div>
          <span className="text-blue-400 font-medium">{roleDefinition?.title}</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Ne yapmak istiyorsun?
        </h1>
        <p className="text-gray-400 text-lg mb-2">
          Hedeflerini bilmek bize yardımcı olur
        </p>
        <p className="text-sm text-gray-500">
          En fazla 3 hedef seçebilirsin
        </p>
      </div>

      {/* Goal Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {roleGoals.map((goal, index) => {
          const isSelected = selectedGoals.includes(goal)
          const isDisabled = !isSelected && selectedGoals.length >= 3

          return (
            <button
              key={index}
              onClick={() => handleGoalToggle(goal)}
              disabled={isDisabled}
              className={`group relative p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                  : isDisabled
                  ? 'border-gray-800 bg-gray-900/50 opacity-50 cursor-not-allowed'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`text-lg font-medium mb-2 transition-colors ${
                    isSelected 
                      ? 'text-white' 
                      : isDisabled
                      ? 'text-gray-600'
                      : 'text-white group-hover:text-blue-400'
                  }`}>
                    {goal}
                  </h3>
                  
                  {/* Goal Index */}
                  <div className={`text-xs font-medium ${
                    isSelected 
                      ? 'text-blue-400' 
                      : isDisabled
                      ? 'text-gray-600'
                      : 'text-gray-500'
                  }`}>
                    {roleDefinition?.title} hedefi
                  </div>
                </div>

                {/* Selection Indicator */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500'
                    : isDisabled
                    ? 'border-gray-700 bg-gray-800'
                    : 'border-gray-600 group-hover:border-gray-500'
                }`}>
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Hover Effect */}
              {!isDisabled && (
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 ${
                  isSelected ? 'opacity-100' : 'group-hover:opacity-50'
                }`} />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected Goals Summary */}
      {selectedGoals.length > 0 && (
        <div className="mb-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <h4 className="font-medium text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Seçtiğin hedefler ({selectedGoals.length}/3):
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {selectedGoals.map((goal, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm"
              >
                <span>{goal}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleGoalToggle(goal)
                  }}
                  className="w-4 h-4 rounded-full bg-blue-500/30 hover:bg-blue-500/50 flex items-center justify-center transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <p className="text-gray-400 text-sm mt-3">
            Bu hedeflere göre sana özel öneriler hazırlayacağız
          </p>
        </div>
      )}

      {/* Empty State */}
      {selectedGoals.length === 0 && (
        <div className="text-center py-8 mb-8">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-400">
            Hedeflerini seç ve kişisel deneyimini başlat
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Geri
          </button>

          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
          >
            Daha sonra
          </button>
        </div>

        <button
          onClick={handleNext}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg"
        >
          {selectedGoals.length > 0 ? 'Devam Et' : 'Hedef Seçmeden Devam Et'}
        </button>
      </div>
    </div>
  )
}

// Goal Option Component (for reuse)
export function GoalOption({ 
  goal, 
  isSelected, 
  isDisabled,
  roleTitle,
  onToggle 
}: { 
  goal: string
  isSelected: boolean
  isDisabled?: boolean
  roleTitle?: string
  onToggle: () => void 
}) {
  return (
    <button
      onClick={onToggle}
      disabled={isDisabled}
      className={`group relative p-6 rounded-xl border-2 transition-all duration-300 text-left w-full ${
        isSelected
          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
          : isDisabled
          ? 'border-gray-800 bg-gray-900/50 opacity-50 cursor-not-allowed'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`text-lg font-medium mb-2 transition-colors ${
            isSelected 
              ? 'text-white' 
              : isDisabled
              ? 'text-gray-600'
              : 'text-white group-hover:text-blue-400'
          }`}>
            {goal}
          </h3>
          
          {/* Goal Context */}
          {roleTitle && (
            <div className={`text-xs font-medium ${
              isSelected 
                ? 'text-blue-400' 
                : isDisabled
                ? 'text-gray-600'
                : 'text-gray-500'
            }`}>
              {roleTitle} hedefi
            </div>
          )}
        </div>

        {/* Selection Indicator */}
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          isSelected
            ? 'border-blue-500 bg-blue-500'
            : isDisabled
            ? 'border-gray-700 bg-gray-800'
            : 'border-gray-600 group-hover:border-gray-500'
        }`}>
          {isSelected && (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      {!isDisabled && (
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 ${
          isSelected ? 'opacity-100' : 'group-hover:opacity-50'
        }`} />
      )}
    </button>
  )
}





