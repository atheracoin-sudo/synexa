'use client'

import { useState } from 'react'
import { Crown, Lock, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFeatureLockMessage } from '@/lib/api/pricing'
import { useApp } from '@/lib/context/AppContext'

interface FeatureLockProps {
  featureId: string
  children: React.ReactNode
  className?: string
  showTooltip?: boolean
  customMessage?: string
}

export function FeatureLock({ 
  featureId, 
  children, 
  className,
  showTooltip = true,
  customMessage 
}: FeatureLockProps) {
  const { state } = useApp()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  
  const userPlan = state.user?.plan || 'free'
  const isLocked = userPlan === 'free'
  
  if (!isLocked) {
    return <>{children}</>
  }

  const message = customMessage || getFeatureLockMessage(featureId)

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true)
  }

  return (
    <>
      <div className={cn('relative group', className)}>
        {/* Locked Content */}
        <div className="relative">
          <div className="pointer-events-none opacity-60 grayscale">
            {children}
          </div>
          
          {/* Lock Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
            <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg shadow-lg">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-foreground">Premium</span>
            </div>
          </div>
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
              {message}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}

        {/* Click Handler */}
        <button
          onClick={handleUpgradeClick}
          className="absolute inset-0 cursor-pointer"
          aria-label="Upgrade to Premium"
        />
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          featureId={featureId}
        />
      )}
    </>
  )
}

// Soft Upgrade Modal (NOT blocking)
function UpgradeModal({ 
  isOpen, 
  onClose, 
  featureId 
}: { 
  isOpen: boolean
  onClose: () => void
  featureId: string 
}) {
  if (!isOpen) return null

  const handleUpgrade = () => {
    // Navigate to pricing page
    window.location.href = '/pricing'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-card rounded-2xl border border-border shadow-premium animate-in fade-in scale-in duration-300">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Unlock Premium
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get full access to all features
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground font-medium mb-1">
                    {getFeatureLockMessage(featureId)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Plus unlimited access to all other premium features
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Unlimited chat messages</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Full App Builder access</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>No watermark exports</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Priority generation speed</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleUpgrade}
              className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Usage Limit Banner (Soft Warning)
export function UsageLimitBanner({ 
  featureType, 
  used, 
  limit, 
  onUpgrade 
}: {
  featureType: string
  used: number
  limit: number
  onUpgrade: () => void
}) {
  const percentage = (used / limit) * 100
  
  if (percentage < 80) return null

  return (
    <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
          <Crown className="w-4 h-4 text-yellow-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-foreground mb-1">
            {percentage >= 100 ? 'Limit Reached' : 'Almost at your limit'}
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            You've used {used} of {limit} {featureType} this month. 
            {percentage >= 100 ? ' Upgrade to continue.' : ' Upgrade for unlimited access.'}
          </p>
          <button
            onClick={onUpgrade}
            className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
          >
            Upgrade to Premium →
          </button>
        </div>
      </div>
    </div>
  )
}

// Premium Badge
export function PremiumBadge({ className }: { className?: string }) {
  return (
    <div className={cn(
      'inline-flex items-center gap-1 px-2 py-1 bg-gradient-primary text-white text-xs font-medium rounded-lg',
      className
    )}>
      <Crown className="w-3 h-3" />
      <span>Premium</span>
    </div>
  )
}