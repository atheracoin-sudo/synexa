'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Lightbulb, ArrowRight } from 'lucide-react'
import { Tip } from '@/lib/tips'

interface TooltipTipProps {
  tip: Tip
  targetElement: string
  onDismiss: () => void
  onAction: () => void
  className?: string
}

export default function TooltipTip({ 
  tip, 
  targetElement, 
  onDismiss, 
  onAction,
  className = ''
}: TooltipTipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [placement, setPlacement] = useState<'top' | 'bottom' | 'left' | 'right'>('top')
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = document.querySelector(targetElement)
    if (!target) return

    const updatePosition = () => {
      const targetRect = target.getBoundingClientRect()
      const tooltipRect = tooltipRef.current?.getBoundingClientRect()
      
      if (!tooltipRect) return

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      let newPlacement: 'top' | 'bottom' | 'left' | 'right' = 'top'
      let newPosition = { top: 0, left: 0 }

      // Try top placement first
      if (targetRect.top - tooltipRect.height - 10 > 0) {
        newPlacement = 'top'
        newPosition = {
          top: targetRect.top - tooltipRect.height - 10,
          left: targetRect.left + (targetRect.width - tooltipRect.width) / 2
        }
      }
      // Try bottom placement
      else if (targetRect.bottom + tooltipRect.height + 10 < viewportHeight) {
        newPlacement = 'bottom'
        newPosition = {
          top: targetRect.bottom + 10,
          left: targetRect.left + (targetRect.width - tooltipRect.width) / 2
        }
      }
      // Try right placement
      else if (targetRect.right + tooltipRect.width + 10 < viewportWidth) {
        newPlacement = 'right'
        newPosition = {
          top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
          left: targetRect.right + 10
        }
      }
      // Try left placement
      else if (targetRect.left - tooltipRect.width - 10 > 0) {
        newPlacement = 'left'
        newPosition = {
          top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
          left: targetRect.left - tooltipRect.width - 10
        }
      }
      // Fallback to bottom
      else {
        newPlacement = 'bottom'
        newPosition = {
          top: targetRect.bottom + 10,
          left: Math.max(10, Math.min(targetRect.left, viewportWidth - tooltipRect.width - 10))
        }
      }

      // Ensure tooltip stays within viewport
      newPosition.left = Math.max(10, Math.min(newPosition.left, viewportWidth - tooltipRect.width - 10))
      newPosition.top = Math.max(10, Math.min(newPosition.top, viewportHeight - tooltipRect.height - 10))

      setPosition(newPosition)
      setPlacement(newPlacement)
    }

    // Show tooltip after a short delay
    const showTimer = setTimeout(() => {
      setIsVisible(true)
      updatePosition()
    }, 500)

    // Update position on scroll/resize
    const handleUpdate = () => {
      if (isVisible) updatePosition()
    }

    window.addEventListener('scroll', handleUpdate)
    window.addEventListener('resize', handleUpdate)

    return () => {
      clearTimeout(showTimer)
      window.removeEventListener('scroll', handleUpdate)
      window.removeEventListener('resize', handleUpdate)
    }
  }, [targetElement, isVisible])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(onDismiss, 200) // Wait for animation
  }

  const handleAction = () => {
    setIsVisible(false)
    setTimeout(onAction, 200)
  }

  if (!isVisible) return null

  const getArrowClasses = () => {
    const baseClasses = 'absolute w-3 h-3 bg-gray-800 transform rotate-45'
    
    switch (placement) {
      case 'top':
        return `${baseClasses} -bottom-1.5 left-1/2 -translate-x-1/2`
      case 'bottom':
        return `${baseClasses} -top-1.5 left-1/2 -translate-x-1/2`
      case 'left':
        return `${baseClasses} -right-1.5 top-1/2 -translate-y-1/2`
      case 'right':
        return `${baseClasses} -left-1.5 top-1/2 -translate-y-1/2`
      default:
        return `${baseClasses} -bottom-1.5 left-1/2 -translate-x-1/2`
    }
  }

  return (
    <div
      ref={tooltipRef}
      className={`fixed z-50 max-w-xs transition-all duration-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${className}`}
      style={{
        top: position.top,
        left: position.left
      }}
    >
      {/* Arrow */}
      <div className={getArrowClasses()}></div>
      
      {/* Tooltip Content */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 relative">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white leading-relaxed">
              {tip.message}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Kapat"
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {tip.actionText && (
            <button
              onClick={handleAction}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
            >
              <span>{tip.actionText}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md text-xs font-medium transition-colors"
          >
            {tip.dismissText || 'Anladım'}
          </button>
        </div>

        {/* Premium Badge */}
        {tip.isPremium && (
          <div className="absolute -top-2 -right-2">
            <div className="w-5 h-5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">👑</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Hook for managing tooltip tips
export function useTooltipTips(context: string, userId: string = 'user_1') {
  const [activeTip, setActiveTip] = useState<Tip | null>(null)
  
  const showTip = (tip: Tip) => {
    setActiveTip(tip)
  }

  const hideTip = () => {
    setActiveTip(null)
  }

  const dismissTip = () => {
    if (activeTip) {
      // Mark as dismissed in tips manager
      hideTip()
    }
  }

  const actionTip = () => {
    if (activeTip) {
      // Mark as completed in tips manager
      hideTip()
    }
  }

  return {
    activeTip,
    showTip,
    hideTip,
    dismissTip,
    actionTip
  }
}











