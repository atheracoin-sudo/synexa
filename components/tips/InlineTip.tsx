'use client'

import { useState } from 'react'
import { X, Lightbulb, ArrowRight, Crown, Sparkles } from 'lucide-react'
import { Tip } from '@/lib/tips'

interface InlineTipProps {
  tip: Tip
  onDismiss: () => void
  onAction: () => void
  className?: string
  variant?: 'default' | 'compact' | 'prominent'
}

export default function InlineTip({ 
  tip, 
  onDismiss, 
  onAction,
  className = '',
  variant = 'default'
}: InlineTipProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(onDismiss, 200) // Wait for animation
  }

  const handleAction = () => {
    onAction()
  }

  if (!isVisible) return null

  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'p-3'
      case 'prominent':
        return 'p-6 border-2 border-blue-500/30'
      default:
        return 'p-4'
    }
  }

  const getIconColor = () => {
    switch (tip.priority) {
      case 'high':
        return 'text-blue-400 bg-blue-500/20'
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20'
      case 'low':
        return 'text-green-400 bg-green-500/20'
      default:
        return 'text-blue-400 bg-blue-500/20'
    }
  }

  const getBorderColor = () => {
    switch (tip.priority) {
      case 'high':
        return 'border-blue-500/30'
      case 'medium':
        return 'border-yellow-500/30'
      case 'low':
        return 'border-green-500/30'
      default:
        return 'border-blue-500/30'
    }
  }

  return (
    <div
      className={`
        bg-gray-900/50 backdrop-blur-sm border rounded-xl transition-all duration-200
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        ${getBorderColor()}
        ${getVariantClasses()}
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor()}`}>
          <Lightbulb className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          {tip.title && (
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-white">{tip.title}</h4>
              {tip.isPremium && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                  <Crown className="w-3 h-3" />
                  <span>Premium</span>
                </div>
              )}
            </div>
          )}

          {/* Message */}
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            {tip.message}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {tip.actionText && (
              <button
                onClick={handleAction}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <span>{tip.actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              {tip.dismissText || 'Anladım'}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
          aria-label="Kapat"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Priority Indicator */}
      {tip.priority === 'high' && (
        <div className="absolute -top-1 -right-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  )
}

// Specialized inline tip variants
export function WelcomeTip({ tip, onDismiss, onAction }: { 
  tip: Tip
  onDismiss: () => void
  onAction: () => void
}) {
  return (
    <InlineTip
      tip={tip}
      onDismiss={onDismiss}
      onAction={onAction}
      variant="prominent"
      className="mb-6"
    />
  )
}

export function ProgressTip({ tip, onDismiss, onAction }: { 
  tip: Tip
  onDismiss: () => void
  onAction: () => void
}) {
  return (
    <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-white">{tip.title}</h4>
            <div className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">
              İlerleme
            </div>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            {tip.message}
          </p>
          <div className="flex items-center gap-3">
            {tip.actionText && (
              <button
                onClick={onAction}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all"
              >
                <span>{tip.actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onDismiss}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              Daha sonra
            </button>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="w-8 h-8 bg-gray-800/50 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
          aria-label="Kapat"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  )
}

export function CompactTip({ tip, onDismiss, onAction }: { 
  tip: Tip
  onDismiss: () => void
  onAction: () => void
}) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 mb-3">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-blue-500/20 rounded-md flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-3 h-3 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-300">
            <span className="text-blue-400 font-medium">İpucu:</span> {tip.message}
          </p>
        </div>
        {tip.actionText && (
          <button
            onClick={onAction}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            {tip.actionText}
          </button>
        )}
        <button
          onClick={onDismiss}
          className="w-5 h-5 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition-colors flex-shrink-0"
          aria-label="Kapat"
        >
          <X className="w-3 h-3 text-gray-400" />
        </button>
      </div>
    </div>
  )
}











