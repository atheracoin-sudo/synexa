'use client'

import { useState, useEffect } from 'react'
import { UserRole, onboardingManager } from '@/lib/onboarding'

interface ToolPreferenceStepProps {
  selectedRole: UserRole
  onNext: (tools: string[]) => void
  onBack: () => void
  onSkip: () => void
}

export default function ToolPreferenceStep({ 
  selectedRole, 
  onNext, 
  onBack, 
  onSkip 
}: ToolPreferenceStepProps) {
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const availableTools = onboardingManager.getAvailableTools()
  const recommendedTools = onboardingManager.getRoleRecommendedTools(selectedRole)
  const roleDefinition = onboardingManager.getRoleDefinition(selectedRole)

  // Set recommended tools as default
  useEffect(() => {
    setSelectedTools(recommendedTools)
  }, [recommendedTools])

  const handleToolToggle = (toolId: string) => {
    setSelectedTools(prev => {
      if (prev.includes(toolId)) {
        // Don't allow removing all tools
        if (prev.length === 1) return prev
        return prev.filter(t => t !== toolId)
      } else {
        return [...prev, toolId]
      }
    })
  }

  const handleNext = () => {
    onNext(selectedTools)
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
          Hangi araçları kullanacaksın?
        </h1>
        <p className="text-gray-400 text-lg mb-2">
          İhtiyacın olan araçları seç
        </p>
        <p className="text-sm text-gray-500">
          Rolüne göre önerilen araçlar seçili geldi
        </p>
      </div>

      {/* Tool Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {availableTools.map((tool) => {
          const isSelected = selectedTools.includes(tool.id)
          const isRecommended = recommendedTools.includes(tool.id)
          const isLastSelected = selectedTools.length === 1 && isSelected

          return (
            <button
              key={tool.id}
              onClick={() => handleToolToggle(tool.id)}
              disabled={isLastSelected}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                  : isLastSelected
                  ? 'border-gray-700 bg-gray-800/50 opacity-50 cursor-not-allowed'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70'
              }`}
            >
              {/* Recommended Badge */}
              {isRecommended && (
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                    Önerilen
                  </span>
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Tool Icon */}
                <div className="text-3xl">{tool.icon}</div>

                <div className="flex-1">
                  {/* Tool Info */}
                  <h3 className={`text-xl font-bold mb-2 transition-colors ${
                    isSelected 
                      ? 'text-white' 
                      : isLastSelected
                      ? 'text-gray-600'
                      : 'text-white group-hover:text-blue-400'
                  }`}>
                    {tool.name}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed ${
                    isSelected 
                      ? 'text-gray-300' 
                      : isLastSelected
                      ? 'text-gray-600'
                      : 'text-gray-400'
                  }`}>
                    {tool.description}
                  </p>

                  {/* Selection Status */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-600'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    <span className={`text-xs font-medium ${
                      isSelected 
                        ? 'text-blue-400' 
                        : isLastSelected
                        ? 'text-gray-600'
                        : 'text-gray-500'
                    }`}>
                      {isSelected ? 'Seçili' : 'Seçilmedi'}
                    </span>

                    {isLastSelected && (
                      <span className="text-xs text-amber-400">
                        (En az 1 araç seçili olmalı)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              {!isLastSelected && (
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 ${
                  isSelected ? 'opacity-100' : 'group-hover:opacity-50'
                }`} />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected Tools Summary */}
      <div className="mb-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Seçtiğin araçlar ({selectedTools.length}):
        </h4>
        
        <div className="flex flex-wrap gap-3 mb-4">
          {selectedTools.map((toolId) => {
            const tool = availableTools.find(t => t.id === toolId)
            const isRecommended = recommendedTools.includes(toolId)
            
            return tool ? (
              <div
                key={toolId}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm"
              >
                <span className="text-lg">{tool.icon}</span>
                <span className="font-medium">{tool.name}</span>
                {isRecommended && (
                  <span className="px-1.5 py-0.5 bg-green-500/30 text-green-400 text-xs rounded">
                    Önerilen
                  </span>
                )}
              </div>
            ) : null
          })}
        </div>

        <p className="text-gray-400 text-sm">
          Bu araçlar ana menüde ve önerilerde öncelikli olarak gösterilecek
        </p>
      </div>

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
          Tamamla
        </button>
      </div>
    </div>
  )
}

// Tool Option Component (for reuse)
export function ToolOption({ 
  tool, 
  isSelected, 
  isRecommended,
  isDisabled,
  onToggle 
}: { 
  tool: any
  isSelected: boolean
  isRecommended?: boolean
  isDisabled?: boolean
  onToggle: () => void 
}) {
  return (
    <button
      onClick={onToggle}
      disabled={isDisabled}
      className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left w-full ${
        isSelected
          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
          : isDisabled
          ? 'border-gray-700 bg-gray-800/50 opacity-50 cursor-not-allowed'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70'
      }`}
    >
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
            Önerilen
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Tool Icon */}
        <div className="text-3xl">{tool.icon}</div>

        <div className="flex-1">
          {/* Tool Info */}
          <h3 className={`text-xl font-bold mb-2 transition-colors ${
            isSelected 
              ? 'text-white' 
              : isDisabled
              ? 'text-gray-600'
              : 'text-white group-hover:text-blue-400'
          }`}>
            {tool.name}
          </h3>
          
          <p className={`text-sm leading-relaxed ${
            isSelected 
              ? 'text-gray-300' 
              : isDisabled
              ? 'text-gray-600'
              : 'text-gray-400'
          }`}>
            {tool.description}
          </p>

          {/* Selection Status */}
          <div className="mt-3 flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
              isSelected
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-600'
            }`}>
              {isSelected && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            
            <span className={`text-xs font-medium ${
              isSelected 
                ? 'text-blue-400' 
                : isDisabled
                ? 'text-gray-600'
                : 'text-gray-500'
            }`}>
              {isSelected ? 'Seçili' : 'Seçilmedi'}
            </span>

            {isDisabled && (
              <span className="text-xs text-amber-400">
                (En az 1 araç seçili olmalı)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      {!isDisabled && (
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 ${
          isSelected ? 'opacity-100' : 'group-hover:opacity-50'
        }`} />
      )}
    </button>
  )
}






