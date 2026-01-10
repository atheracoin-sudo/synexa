'use client'

import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { useChangelog } from '@/lib/hooks/useChangelog'

interface NewFeatureBadgeProps {
  featureId: string
  children: React.ReactNode
  className?: string
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  showTooltip?: boolean
}

export default function NewFeatureBadge({ 
  featureId, 
  children, 
  className = '',
  placement = 'top-right',
  showTooltip = true
}: NewFeatureBadgeProps) {
  const { isFeatureNew, getFeatureNewBadge } = useChangelog()
  const [showTooltipState, setShowTooltipState] = useState(false)
  const [featureInfo, setFeatureInfo] = useState<{ title: string; daysLeft: number } | null>(null)

  useEffect(() => {
    if (isFeatureNew(featureId)) {
      const info = getFeatureNewBadge(featureId)
      setFeatureInfo(info)
    }
  }, [featureId, isFeatureNew, getFeatureNewBadge])

  if (!featureInfo) {
    return <>{children}</>
  }

  const getPlacementClasses = () => {
    switch (placement) {
      case 'top-right':
        return '-top-1 -right-1'
      case 'top-left':
        return '-top-1 -left-1'
      case 'bottom-right':
        return '-bottom-1 -right-1'
      case 'bottom-left':
        return '-bottom-1 -left-1'
      default:
        return '-top-1 -right-1'
    }
  }

  return (
    <div className={`relative inline-block ${className}`}>
      {children}
      
      {/* New Badge */}
      <div 
        className={`absolute ${getPlacementClasses()} z-10`}
        onMouseEnter={() => showTooltip && setShowTooltipState(true)}
        onMouseLeave={() => showTooltip && setShowTooltipState(false)}
      >
        <div className="relative">
          {/* Badge */}
          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          
          {/* Pulse Ring */}
          <div className="absolute inset-0 w-6 h-6 bg-green-500 rounded-full animate-ping opacity-20"></div>
          
          {/* Tooltip */}
          {showTooltip && showTooltipState && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20">
              <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white whitespace-nowrap shadow-xl">
                <div className="font-medium">Yeni eklendi ✨</div>
                <div className="text-xs text-gray-400 mt-1">
                  {featureInfo.daysLeft} gün kaldı
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                  <div className="border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Simple text badge variant
export function NewTextBadge({ 
  featureId, 
  className = '',
  text = 'New'
}: { 
  featureId: string
  className?: string
  text?: string
}) {
  const { isFeatureNew, getFeatureNewBadge } = useChangelog()
  const [featureInfo, setFeatureInfo] = useState<{ title: string; daysLeft: number } | null>(null)

  useEffect(() => {
    if (isFeatureNew(featureId)) {
      const info = getFeatureNewBadge(featureId)
      setFeatureInfo(info)
    }
  }, [featureId, isFeatureNew, getFeatureNewBadge])

  if (!featureInfo) {
    return null
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium ${className}`}>
      <Sparkles className="w-3 h-3" />
      <span>{text}</span>
    </span>
  )
}

// Inline badge for menu items
export function NewInlineBadge({ 
  featureId,
  className = ''
}: { 
  featureId: string
  className?: string
}) {
  const { isFeatureNew } = useChangelog()

  if (!isFeatureNew(featureId)) {
    return null
  }

  return (
    <span className={`inline-flex items-center justify-center w-2 h-2 bg-green-500 rounded-full ${className}`}>
      <span className="sr-only">New</span>
    </span>
  )
}






