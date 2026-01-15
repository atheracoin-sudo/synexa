'use client'

import { useState } from 'react'
import { AlertTriangle, X, Crown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUsage, useUserPlan } from '@/lib/context/AppContext'
import { getUserPlanLimits } from '@/lib/config'
import Link from 'next/link'

interface SoftLimitWarningProps {
  className?: string
  onDismiss?: () => void
}

export function SoftLimitWarning({ className, onDismiss }: SoftLimitWarningProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const usage = useUsage()
  const plan = useUserPlan()
  const limits = getUserPlanLimits(plan)
  const isPremium = plan !== 'free'

  // Don't show for premium users
  if (isPremium || isDismissed) return null

  // Check if any usage is above 80%
  const warnings = []
  
  if (usage.chatMessages / limits.chatMessages >= 0.8) {
    const remaining = limits.chatMessages - usage.chatMessages
    warnings.push({
      type: 'chat',
      name: 'chat mesajı',
      remaining: Math.max(0, remaining)
    })
  }
  
  if (usage.codeGenerations / limits.codeGenerations >= 0.8) {
    const remaining = limits.codeGenerations - usage.codeGenerations
    warnings.push({
      type: 'apps',
      name: 'app oluşturma',
      remaining: Math.max(0, remaining)
    })
  }
  
  if (usage.imageGenerations / limits.imageGenerations >= 0.8) {
    const remaining = limits.imageGenerations - usage.imageGenerations
    warnings.push({
      type: 'images',
      name: 'görsel oluşturma',
      remaining: Math.max(0, remaining)
    })
  }

  // Don't show if no warnings
  if (warnings.length === 0) return null

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  // Get the most critical warning (lowest remaining)
  const criticalWarning = warnings.reduce((prev, current) => 
    current.remaining < prev.remaining ? current : prev
  )

  return (
    <div className={cn(
      'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4',
      'dark:from-yellow-900/20 dark:to-orange-900/20 dark:border-yellow-800/50',
      className
    )}>
      <div className="flex items-start gap-3">
        {/* Warning Icon */}
        <div className="flex-shrink-0 p-1">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                {criticalWarning.remaining === 0 
                  ? `${criticalWarning.name} limitine ulaştın` 
                  : `${criticalWarning.remaining} ${criticalWarning.name} hakkın kaldı`
                }
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                {criticalWarning.remaining === 0 
                  ? 'Devam etmek için Premium\'a geç veya yarın tekrar dene'
                  : 'Sınırsız kullanım için Premium\'a geçebilirsin'
                }
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200 transition-colors"
              aria-label="Uyarıyı kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-3">
            <Link
              href="/profile/usage"
              className={cn(
                'inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium',
                'bg-white/80 text-yellow-800 border border-yellow-300',
                'hover:bg-white hover:border-yellow-400 transition-colors',
                'dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-700',
                'dark:hover:bg-yellow-900/50'
              )}
            >
              <TrendingUp className="h-3 w-3" />
              Usage'ı Gör
            </Link>

            <Link
              href="/pricing"
              className={cn(
                'inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium',
                'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
                'hover:from-yellow-600 hover:to-orange-600 transition-all',
                'shadow-sm hover:shadow-md'
              )}
            >
              <Crown className="h-3 w-3" />
              Premium'a Geç
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}











