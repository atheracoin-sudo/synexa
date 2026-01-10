'use client'

import { useRouter } from 'next/navigation'
import { onboardingManager } from '@/lib/onboarding'

interface FirstTaskSuggestionProps {
  userId: string
  className?: string
}

export default function FirstTaskSuggestion({ userId, className = '' }: FirstTaskSuggestionProps) {
  const router = useRouter()
  const personalizedExperience = onboardingManager.getPersonalizedExperience(userId)
  
  if (!personalizedExperience.firstTaskSuggestion) {
    return null
  }

  const { title, description, action, actionUrl } = personalizedExperience.firstTaskSuggestion
  const roleIcon = personalizedExperience.role?.icon

  const handleStartTask = () => {
    router.push(actionUrl)
  }

  return (
    <div className={`bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 ${className}`}>
      <div className="flex items-start gap-4">
        {/* Task Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
          {roleIcon || '🚀'}
        </div>

        <div className="flex-1">
          {/* Task Info */}
          <h3 className="text-lg font-bold text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {description}
          </p>

          {/* Action Button */}
          <button
            onClick={handleStartTask}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg flex items-center gap-2"
          >
            {action}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => {
            // Hide the suggestion (could be stored in localStorage)
            const element = document.querySelector('[data-first-task-suggestion]')
            if (element) {
              element.remove()
            }
          }}
          className="w-8 h-8 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg flex items-center justify-center transition-colors"
          aria-label="Kapat"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="mt-4 flex items-center gap-2 text-xs text-blue-300">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        İlk adımını atmaya hazır mısın?
      </div>
    </div>
  )
}

// Compact version for smaller spaces
export function CompactFirstTaskSuggestion({ userId, className = '' }: FirstTaskSuggestionProps) {
  const router = useRouter()
  const personalizedExperience = onboardingManager.getPersonalizedExperience(userId)
  
  if (!personalizedExperience.firstTaskSuggestion) {
    return null
  }

  const { title, action, actionUrl } = personalizedExperience.firstTaskSuggestion
  const roleIcon = personalizedExperience.role?.icon

  const handleStartTask = () => {
    router.push(actionUrl)
  }

  return (
    <div className={`bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="text-xl">{roleIcon || '🚀'}</div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white text-sm truncate">
            {title}
          </h4>
        </div>

        <button
          onClick={handleStartTask}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
        >
          {action}
        </button>
      </div>
    </div>
  )
}

// Role-based empty state messages
export function PersonalizedEmptyState({ 
  userId, 
  context = 'chat',
  className = '' 
}: { 
  userId: string
  context?: 'chat' | 'code' | 'image'
  className?: string 
}) {
  const personalizedExperience = onboardingManager.getPersonalizedExperience(userId)
  const emptyMessage = personalizedExperience.emptyStateMessages[context]
  const roleIcon = personalizedExperience.role?.icon

  if (!emptyMessage) {
    return null
  }

  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">{roleIcon || '🤖'}</span>
      </div>
      <p className="text-gray-400 text-lg">
        {emptyMessage}
      </p>
    </div>
  )
}

// Personalized chat prompts
export function PersonalizedChatPrompts({ 
  userId, 
  onPromptSelect,
  className = '' 
}: { 
  userId: string
  onPromptSelect: (prompt: string) => void
  className?: string 
}) {
  const personalizedExperience = onboardingManager.getPersonalizedExperience(userId)
  const chatPrompts = personalizedExperience.chatPrompts.slice(0, 3) // Show first 3

  if (!chatPrompts.length) {
    return null
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-gray-400 mb-3">
        Sana özel öneriler:
      </h4>
      
      {chatPrompts.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onPromptSelect(prompt)}
          className="w-full p-3 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 hover:border-gray-600 rounded-lg text-left text-sm text-gray-300 hover:text-white transition-all"
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}

// Personalized tool recommendations
export function PersonalizedToolRecommendations({ 
  userId,
  className = '' 
}: { 
  userId: string
  className?: string 
}) {
  const personalizedExperience = onboardingManager.getPersonalizedExperience(userId)
  const recommendedTools = personalizedExperience.recommendedTools
  const availableTools = onboardingManager.getAvailableTools()

  const tools = availableTools.filter(tool => recommendedTools.includes(tool.id))

  if (!tools.length) {
    return null
  }

  return (
    <div className={`${className}`}>
      <h4 className="text-sm font-medium text-gray-400 mb-3">
        Senin için önerilen araçlar:
      </h4>
      
      <div className="grid grid-cols-2 gap-3">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{tool.icon}</span>
              <span className="font-medium text-white text-sm">{tool.name}</span>
            </div>
            <p className="text-xs text-gray-400">
              {tool.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}





