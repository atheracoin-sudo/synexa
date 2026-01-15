'use client'

import { useState, useEffect } from 'react'
import { Bot, X, ArrowRight, Minimize2, Maximize2, Crown, Sparkles } from 'lucide-react'
import { CoachingSuggestion, tipsManager } from '@/lib/tips'

interface AICoachingPanelProps {
  context: string
  userId?: string
  className?: string
}

export default function AICoachingPanel({ 
  context, 
  userId = 'user_1',
  className = ''
}: AICoachingPanelProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [suggestions, setSuggestions] = useState<CoachingSuggestion[]>([])
  const [currentSuggestion, setCurrentSuggestion] = useState(0)

  useEffect(() => {
    // Load coaching suggestions for current context
    const loadSuggestions = () => {
      const newSuggestions = tipsManager.generateCoachingSuggestions(context as any, userId)
      setSuggestions(newSuggestions)
      setIsVisible(newSuggestions.length > 0)
      setCurrentSuggestion(0)
    }

    // Load suggestions after a delay to avoid being intrusive
    const timer = setTimeout(loadSuggestions, 3000)
    return () => clearTimeout(timer)
  }, [context, userId])

  const handleDismiss = () => {
    setIsVisible(false)
  }

  const handleAction = (suggestion: CoachingSuggestion) => {
    if (suggestion.actionUrl) {
      window.location.href = suggestion.actionUrl
    }
    if (suggestion.actionCallback) {
      // Handle callback actions
      console.log('Callback action:', suggestion.actionCallback)
    }
    handleDismiss()
  }

  const handleNext = () => {
    if (currentSuggestion < suggestions.length - 1) {
      setCurrentSuggestion(currentSuggestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSuggestion > 0) {
      setCurrentSuggestion(currentSuggestion - 1)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  if (!isVisible || suggestions.length === 0) return null

  const suggestion = suggestions[currentSuggestion]

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
        isMinimized ? 'w-14 h-14' : 'w-80'
      } ${className}`}
    >
      {/* Minimized State */}
      {isMinimized ? (
        <button
          onClick={toggleMinimize}
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg flex items-center justify-center transition-all group"
        >
          <Bot className="w-6 h-6 text-white" />
          
          {/* Notification Dot */}
          {suggestions.length > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{suggestions.length}</span>
            </div>
          )}
          
          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
        </button>
      ) : (
        /* Expanded State */
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white">AI Coach</h3>
                  <p className="text-xs text-blue-100">Sana yardımcı olmak için buradayım</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleMinimize}
                  className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-md flex items-center justify-center transition-colors"
                  aria-label="Küçült"
                >
                  <Minimize2 className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={handleDismiss}
                  className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-md flex items-center justify-center transition-colors"
                  aria-label="Kapat"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Suggestion */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium text-white">{suggestion.title}</h4>
                {suggestion.isPremium && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                    <Crown className="w-3 h-3" />
                    <span>Premium</span>
                  </div>
                )}
                {suggestion.priority === 'high' && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                {suggestion.message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => handleAction(suggestion)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex-1"
              >
                <span>{suggestion.actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                Daha sonra
              </button>
            </div>

            {/* Navigation */}
            {suggestions.length > 1 && (
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentSuggestion === 0}
                  className="text-xs text-gray-400 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Önceki
                </button>
                <div className="flex items-center gap-1">
                  {suggestions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSuggestion ? 'bg-blue-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  disabled={currentSuggestion === suggestions.length - 1}
                  className="text-xs text-gray-400 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sonraki →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Empty state when no suggestions
export function AICoachEmptyState() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-white">AI Coach</h3>
              <p className="text-xs text-green-100">Her şey yolunda!</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-green-400" />
          </div>
          <h4 className="font-medium text-white mb-2">Her şey yolunda 👍</h4>
          <p className="text-sm text-gray-400 mb-4">
            Yardım gerekirse buradayım.
          </p>
          <button className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook for managing AI coaching
export function useAICoaching(context: string, userId: string = 'user_1') {
  const [suggestions, setSuggestions] = useState<CoachingSuggestion[]>([])
  const [isEnabled, setIsEnabled] = useState(true)

  useEffect(() => {
    if (!isEnabled) return

    const loadSuggestions = () => {
      const newSuggestions = tipsManager.generateCoachingSuggestions(context as any, userId)
      setSuggestions(newSuggestions)
    }

    loadSuggestions()
  }, [context, userId, isEnabled])

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
  }

  const disableCoaching = () => {
    setIsEnabled(false)
    setSuggestions([])
  }

  return {
    suggestions,
    isEnabled,
    dismissSuggestion,
    disableCoaching
  }
}











