'use client'

import { Crown, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePremium } from '@/lib/hooks/usePremium'

interface PremiumBadgeProps {
  variant?: 'crown' | 'text' | 'glow'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showLabel?: boolean
}

export function PremiumBadge({ 
  variant = 'crown', 
  size = 'md', 
  className,
  showLabel = false 
}: PremiumBadgeProps) {
  const { isPremium } = usePremium()

  if (!isPremium) return null

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  if (variant === 'crown') {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Crown className={cn(
          sizeClasses[size],
          "text-yellow-500 drop-shadow-sm"
        )} />
        {showLabel && (
          <span className={cn(
            textSizes[size],
            "font-medium text-yellow-600 dark:text-yellow-400"
          )}>
            Premium
          </span>
        )}
      </div>
    )
  }

  if (variant === 'text') {
    return (
      <div className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20",
        className
      )}>
        <Crown className="w-3 h-3 text-yellow-500" />
        <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
          Premium
        </span>
      </div>
    )
  }

  if (variant === 'glow') {
    return (
      <div className={cn(
        "relative inline-flex items-center gap-2",
        className
      )}>
        <div className="relative">
          <Crown className={cn(
            sizeClasses[size],
            "text-yellow-500 drop-shadow-lg"
          )} />
          <div className="absolute inset-0 animate-pulse">
            <Crown className={cn(
              sizeClasses[size],
              "text-yellow-300 opacity-50 blur-sm"
            )} />
          </div>
        </div>
        {showLabel && (
          <span className={cn(
            textSizes[size],
            "font-medium bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent"
          )}>
            Premium
          </span>
        )}
      </div>
    )
  }

  return null
}

// Premium message glow effect
export function PremiumMessageGlow({ children, className }: { 
  children: React.ReactNode
  className?: string 
}) {
  const { isPremium } = usePremium()

  if (!isPremium) {
    return <>{children}</>
  }

  return (
    <div className={cn(
      "relative",
      className
    )}>
      {children}
      {/* Subtle premium glow */}
      <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-yellow-500/5 via-transparent to-orange-500/5 pointer-events-none" />
      <div className="absolute inset-0 rounded-[inherit] ring-1 ring-yellow-500/10 pointer-events-none" />
    </div>
  )
}






