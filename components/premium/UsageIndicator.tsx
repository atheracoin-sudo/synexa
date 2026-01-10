'use client'

import { Crown, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePremium } from '@/lib/hooks/usePremium'

interface UsageIndicatorProps {
  action: 'chatMessages' | 'codeProjects' | 'imageExports'
  className?: string
  showLabel?: boolean
  onUpgradeClick?: () => void
}

const actionLabels = {
  chatMessages: 'Chat Messages',
  codeProjects: 'Code Projects', 
  imageExports: 'Image Exports',
}

const actionLabelsTurkish = {
  chatMessages: 'Chat Mesajları',
  codeProjects: 'Kod Projeleri',
  imageExports: 'Görsel Export',
}

export function UsageIndicator({ 
  action, 
  className, 
  showLabel = true,
  onUpgradeClick 
}: UsageIndicatorProps) {
  const { 
    isPremium, 
    getRemainingUsage, 
    getUsagePercentage, 
    userPlan 
  } = usePremium()

  const remaining = getRemainingUsage(action)
  const percentage = getUsagePercentage(action)
  const limit = userPlan.limits[action]
  const used = userPlan.usage[action]

  // Don't show for unlimited (premium)
  if (remaining === null) {
    if (!showLabel) return null
    
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <Crown className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">
          {actionLabelsTurkish[action]}: Sınırsız
        </span>
      </div>
    )
  }

  const isWarning = percentage > 80
  const isCritical = percentage > 95

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {actionLabelsTurkish[action]}
          </span>
          <span className={cn(
            "font-medium",
            isCritical ? "text-red-500" : isWarning ? "text-yellow-500" : "text-foreground"
          )}>
            {used} / {limit}
          </span>
        </div>
      )}
      
      <div className="relative">
        {/* Progress bar background */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          {/* Progress bar fill */}
          <div 
            className={cn(
              "h-full transition-all duration-300 rounded-full",
              isCritical 
                ? "bg-gradient-to-r from-red-500 to-red-600" 
                : isWarning 
                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                : "bg-gradient-primary"
            )}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
        
        {/* Warning icon for high usage */}
        {isWarning && (
          <div className="absolute -top-1 -right-1">
            <AlertTriangle className={cn(
              "h-4 w-4",
              isCritical ? "text-red-500" : "text-yellow-500"
            )} />
          </div>
        )}
      </div>
      
      {/* Upgrade suggestion for high usage */}
      {isWarning && onUpgradeClick && (
        <button
          onClick={onUpgradeClick}
          className="w-full text-xs text-center py-2 px-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          {isCritical 
            ? "Premium ile devam et" 
            : "Premium ile sınırları kaldır"
          }
        </button>
      )}
    </div>
  )
}






