'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Crown, MessageSquare, Code2, Image, Bot, TrendingUp, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp, useUsage, useUserPlan } from '@/lib/context/AppContext'
import { getUserPlanLimits } from '@/lib/config'
import Link from 'next/link'

interface UsageItem {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  current: number
  limit: number
  color: string
}

export function UsageSummaryCard({ className }: { className?: string }) {
  const usage = useUsage()
  const plan = useUserPlan()
  const limits = getUserPlanLimits(plan)
  const isPremium = plan !== 'free'

  // Usage items configuration
  const usageItems: UsageItem[] = [
    {
      id: 'chat',
      name: 'Chat',
      icon: MessageSquare,
      current: usage.chatMessages,
      limit: limits.chatMessages,
      color: 'bg-blue-500'
    },
    {
      id: 'apps',
      name: 'Apps',
      icon: Code2,
      current: usage.codeGenerations,
      limit: limits.codeGenerations,
      color: 'bg-green-500'
    },
    {
      id: 'images',
      name: 'Images',
      icon: Image,
      current: usage.imageGenerations,
      limit: limits.imageGenerations,
      color: 'bg-purple-500'
    },
    {
      id: 'agents',
      name: 'Agents',
      icon: Bot,
      current: usage.agents,
      limit: limits.agents,
      color: 'bg-orange-500'
    }
  ]

  return (
    <Card className={cn('p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Bu ay kullandıkların
            </h3>
            <p className="text-sm text-muted-foreground">
              {isPremium ? 'Premium Plan' : 'Free Plan'}
            </p>
          </div>
        </div>

        {isPremium && (
          <Badge variant="premium" className="flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Premium
          </Badge>
        )}
      </div>

      {/* Usage Items */}
      <div className="space-y-4">
        {usageItems.map((item) => {
          const Icon = item.icon
          const percentage = isPremium ? 0 : Math.min((item.current / item.limit) * 100, 100)
          const isNearLimit = percentage >= 80
          const isAtLimit = percentage >= 100

          return (
            <div key={item.id} className="space-y-2">
              {/* Item Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {item.name}
                  </span>
                </div>

                <div className="text-right">
                  {isPremium ? (
                    <Badge variant="outline" className="text-xs">
                      Unlimited
                    </Badge>
                  ) : (
                    <span className={cn(
                      'text-sm font-medium',
                      isAtLimit ? 'text-red-500' : 
                      isNearLimit ? 'text-yellow-500' : 
                      'text-muted-foreground'
                    )}>
                      {item.current} / {item.limit}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar (only for free users) */}
              {!isPremium && (
                <div className="relative">
                  <ProgressBar 
                    value={percentage} 
                    className={cn(
                      'h-2',
                      isAtLimit && 'bg-red-100',
                      isNearLimit && !isAtLimit && 'bg-yellow-100'
                    )}
                  />
                  
                  {/* Warning indicator */}
                  {isNearLimit && (
                    <div className={cn(
                      'absolute -top-1 -right-1 w-3 h-3 rounded-full',
                      isAtLimit ? 'bg-red-500' : 'bg-yellow-500'
                    )} />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer Actions */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <Link 
            href="/profile/usage"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            Detayları gör
            <ArrowRight className="h-3 w-3" />
          </Link>

          {!isPremium && (
            <Link 
              href="/pricing"
              className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Premium'a Geç
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}

// Progress component
function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('w-full bg-secondary rounded-full overflow-hidden', className)}>
      <div 
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}
