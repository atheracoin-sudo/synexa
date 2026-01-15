'use client'

import { useState } from 'react'
import { UserRole, onboardingManager } from '@/lib/onboarding'

interface RoleSelectionStepProps {
  onNext: (role: UserRole) => void
  onSkip: () => void
}

export default function RoleSelectionStep({ onNext, onSkip }: RoleSelectionStepProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const roles = onboardingManager.getRoleDefinitions()

  const handleRoleSelect = (roleId: UserRole) => {
    setSelectedRole(roleId)
  }

  const handleNext = () => {
    if (selectedRole) {
      onNext(selectedRole)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-4">
          Synexa'yı nasıl kullanacaksın?
        </h1>
        <p className="text-gray-400 text-lg">
          Sana uygun deneyimi hazırlayabilmemiz için rolünü seç
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleSelect(role.id)}
            className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
              selectedRole === role.id
                ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70'
            }`}
          >
            {/* Selection Indicator */}
            {selectedRole === role.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Role Icon */}
            <div className="text-4xl mb-4">{role.icon}</div>

            {/* Role Info */}
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {role.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {role.description}
            </p>

            {/* Hover Effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 ${
              selectedRole === role.id ? 'opacity-100' : 'group-hover:opacity-50'
            }`} />
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onSkip}
          className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
        >
          Daha sonra
        </button>

        <button
          onClick={handleNext}
          disabled={!selectedRole}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            selectedRole
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          Devam Et
        </button>
      </div>

      {/* Additional Info */}
      {selectedRole && (
        <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{roles.find(r => r.id === selectedRole)?.icon}</div>
            <div>
              <h4 className="font-medium text-white mb-1">
                {roles.find(r => r.id === selectedRole)?.title} olarak devam ediyorsun
              </h4>
              <p className="text-gray-400 text-sm">
                Sana özel öneriler ve araçlar hazırlayacağız
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Role Card Component (for reuse)
export function RoleCard({ 
  role, 
  isSelected, 
  onSelect 
}: { 
  role: any
  isSelected: boolean
  onSelect: () => void 
}) {
  return (
    <button
      onClick={onSelect}
      className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left w-full ${
        isSelected
          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70'
      }`}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Role Icon */}
      <div className="text-4xl mb-4">{role.icon}</div>

      {/* Role Info */}
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
        {role.title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">
        {role.description}
      </p>

      {/* Hover Effect */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 ${
        isSelected ? 'opacity-100' : 'group-hover:opacity-50'
      }`} />
    </button>
  )
}











