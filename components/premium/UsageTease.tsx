'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { usePremium } from '@/lib/hooks/usePremium'
import { Crown, Zap, TrendingUp, AlertTriangle } from 'lucide-react'

interface UsageTeaseProps {
  feature: 'chatMessages' | 'codeProjects' | 'imageExports'
  className?: string
}

export function UsageTease({ feature, className }: UsageTeaseProps) {
  const { getRemainingUsage, getUsagePercentage, isPremium } = usePremium()
  
  if (isPremium) return null
  
  const remaining = getRemainingUsage(feature)
  const percentage = getUsagePercentage(feature)
  
  if (remaining === null || percentage < 70) return null

  const getFeatureLabel = () => {
    const labels = {
      chatMessages: 'mesaj',
      codeProjects: 'proje',
      imageExports: 'export'
    }
    return labels[feature]
  }

  const getFeatureIcon = () => {
    const icons = {
      chatMessages: Zap,
      codeProjects: TrendingUp,
      imageExports: Crown
    }
    return icons[feature]
  }

  const Icon = getFeatureIcon()
  const label = getFeatureLabel()
  const isLimitReached = remaining === 0
  const isWarning = percentage >= 90

  if (isLimitReached) {
    return (
      <div className={cn(
        "p-4 rounded-xl border bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20",
        className
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/20">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground">
                Günlük limit doldu
              </h4>
              <p className="text-sm text-muted-foreground">
                Premium ile sınırsız devam edebilirsin
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => window.open('/pricing', '_blank')}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Crown className="h-4 w-4 mr-2" />
            Premium'a Geç
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "p-4 rounded-xl border transition-all duration-200",
      isWarning 
        ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20"
        : "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full",
            isWarning ? "bg-yellow-500/20" : "bg-blue-500/20"
          )}>
            <Icon className={cn(
              "h-4 w-4",
              isWarning ? "text-yellow-500" : "text-blue-500"
            )} />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                Bugün için {remaining} {label} kaldı
              </span>
              
              {/* Progress indicator */}
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-300 rounded-full",
                    isWarning 
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                      : "bg-gradient-to-r from-blue-500 to-purple-500"
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-1">
              Premium ile sınırsız kullan
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open('/pricing', '_blank')}
          className="text-xs"
        >
          <Crown className="h-3 w-3 mr-1" />
          Upgrade
        </Button>
      </div>
    </div>
  )
}

interface SmartUsageBannerProps {
  className?: string
}

export function SmartUsageBanner({ className }: SmartUsageBannerProps) {
  const { isPremium, getUsagePercentage, getRemainingUsage } = usePremium()
  
  if (isPremium) return null
  
  // Check all usage types
  const chatPercentage = getUsagePercentage('chatMessages')
  const codePercentage = getUsagePercentage('codeProjects') 
  const imagePercentage = getUsagePercentage('imageExports')
  
  const chatRemaining = getRemainingUsage('chatMessages')
  const codeRemaining = getRemainingUsage('codeProjects')
  const imageRemaining = getRemainingUsage('imageExports')
  
  // Find the highest usage
  const usages = [
    { type: 'chat', percentage: chatPercentage, remaining: chatRemaining, label: 'mesaj' },
    { type: 'code', percentage: codePercentage, remaining: codeRemaining, label: 'proje' },
    { type: 'image', percentage: imagePercentage, remaining: imageRemaining, label: 'export' }
  ].filter(usage => usage.percentage > 0)
  
  if (usages.length === 0) return null
  
  const highestUsage = usages.reduce((prev, current) => 
    current.percentage > prev.percentage ? current : prev
  )
  
  // Only show if usage is significant
  if (highestUsage.percentage < 50) return null
  
  const isUrgent = highestUsage.remaining !== null && highestUsage.remaining <= 2
  const isWarning = highestUsage.percentage >= 80
  
  return (
    <div className={cn(
      "p-3 rounded-lg border transition-all duration-200",
      isUrgent 
        ? "bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20"
        : isWarning
        ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20"
        : "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isUrgent ? "bg-red-500" : isWarning ? "bg-yellow-500" : "bg-blue-500"
          )} />
          
          <span className="text-sm font-medium text-foreground">
            {highestUsage.remaining !== null && highestUsage.remaining > 0 ? (
              `${highestUsage.remaining} ${highestUsage.label} kaldı`
            ) : (
              `Günlük ${highestUsage.label} limiti doldu`
            )}
          </span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => window.open('/pricing', '_blank')}
          className="text-xs h-6 px-2"
        >
          Premium
        </Button>
      </div>
    </div>
  )
}





