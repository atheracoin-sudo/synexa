'use client'

import { useState, useEffect } from 'react'
import { ExperienceLevel, UserRole, onboardingManager } from '@/lib/onboarding'

interface ExperienceLevelStepProps {
  selectedRole: UserRole
  onNext: (experienceLevel: ExperienceLevel) => void
  onBack: () => void
  onSkip: () => void
}

export default function ExperienceLevelStep({ 
  selectedRole, 
  onNext, 
  onBack, 
  onSkip 
}: ExperienceLevelStepProps) {
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | null>(null)
  const experienceLevels = onboardingManager.getExperienceLevels()
  const smartDefault = onboardingManager.getSmartDefaultExperience(selectedRole)
  const roleDefinition = onboardingManager.getRoleDefinition(selectedRole)

  // Set smart default on mount
  useEffect(() => {
    setSelectedLevel(smartDefault)
  }, [smartDefault])

  const handleLevelSelect = (level: ExperienceLevel) => {
    setSelectedLevel(level)
  }

  const handleNext = () => {
    if (selectedLevel) {
      onNext(selectedLevel)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        {/* Role Context */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="text-2xl">{roleDefinition?.icon}</div>
          <span className="text-blue-400 font-medium">{roleDefinition?.title}</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Deneyim seviyen?
        </h1>
        <p className="text-gray-400 text-lg">
          Önerilerimizi seviyene göre ayarlayalım
        </p>
      </div>

      {/* Experience Level Options */}
      <div className="space-y-4 mb-12">
        {experienceLevels.map((level) => (
          <button
            key={level.value}
            onClick={() => handleLevelSelect(level.value)}
            className={`group relative w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
              selectedLevel === level.value
                ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {level.label}
                  </h3>
                  
                  {/* Smart Default Badge */}
                  {level.value === smartDefault && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                      Önerilen
                    </span>
                  )}
                </div>
                
                <p className="text-gray-400 leading-relaxed">
                  {level.description}
                </p>
              </div>

              {/* Selection Indicator */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedLevel === level.value
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-600 group-hover:border-gray-500'
              }`}>
                {selectedLevel === level.value && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>

            {/* Hover Effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 ${
              selectedLevel === level.value ? 'opacity-100' : 'group-hover:opacity-50'
            }`} />
          </button>
        ))}
      </div>

      {/* Level-specific Preview */}
      {selectedLevel && (
        <div className="mb-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <h4 className="font-medium text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            {selectedLevel === 'beginner' && 'Yeni başlayanlar için öneriler:'}
            {selectedLevel === 'intermediate' && 'Orta seviye için öneriler:'}
            {selectedLevel === 'advanced' && 'İleri seviye için öneriler:'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
            {selectedLevel === 'beginner' && (
              <>
                <div>• Adım adım rehberlik</div>
                <div>• Temel kavramlar</div>
                <div>• Basit örnekler</div>
                <div>• Detaylı açıklamalar</div>
              </>
            )}
            {selectedLevel === 'intermediate' && (
              <>
                <div>• Pratik örnekler</div>
                <div>• En iyi pratikler</div>
                <div>• Orta seviye projeler</div>
                <div>• Performans ipuçları</div>
              </>
            )}
            {selectedLevel === 'advanced' && (
              <>
                <div>• İleri seviye teknikler</div>
                <div>• Optimizasyon önerileri</div>
                <div>• Karmaşık projeler</div>
                <div>• Uzman ipuçları</div>
              </>
            )}
          </div>
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
          disabled={!selectedLevel}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            selectedLevel
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          Devam Et
        </button>
      </div>
    </div>
  )
}

// Experience Level Option Component (for reuse)
export function ExperienceLevelOption({ 
  level, 
  isSelected, 
  isRecommended,
  onSelect 
}: { 
  level: any
  isSelected: boolean
  isRecommended?: boolean
  onSelect: () => void 
}) {
  return (
    <button
      onClick={onSelect}
      className={`group relative w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
        isSelected
          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {level.label}
            </h3>
            
            {/* Recommended Badge */}
            {isRecommended && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                Önerilen
              </span>
            )}
          </div>
          
          <p className="text-gray-400 leading-relaxed">
            {level.description}
          </p>
        </div>

        {/* Selection Indicator */}
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          isSelected
            ? 'border-blue-500 bg-blue-500'
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
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 ${
        isSelected ? 'opacity-100' : 'group-hover:opacity-50'
      }`} />
    </button>
  )
}






