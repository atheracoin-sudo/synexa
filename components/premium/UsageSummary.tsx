'use client'

import { useState } from 'react'
import { MessageSquare, Code2, Image as ImageIcon, TrendingUp, Crown, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { UsageIndicator } from './UsageIndicator'
import { UpgradeModal } from './UpgradeModal'
import { usePremium } from '@/lib/hooks/usePremium'

interface UsageSummaryProps {
  className?: string
}

export function UsageSummary({ className }: UsageSummaryProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const { userPlan, isPremium } = usePremium()

  const usageItems = [
    {
      action: 'chatMessages' as const,
      icon: MessageSquare,
      label: 'Chat Mesajları',
      color: 'text-blue-500',
    },
    {
      action: 'codeProjects' as const,
      icon: Code2,
      label: 'Kod Projeleri',
      color: 'text-green-500',
    },
    {
      action: 'imageExports' as const,
      icon: ImageIcon,
      label: 'Görsel Export',
      color: 'text-purple-500',
    },
  ]

  // Calculate total projects created
  const totalProjects = userPlan.usage.chatMessages + userPlan.usage.codeProjects + userPlan.usage.imageExports

  return (
    <>
      <Card className={cn("bg-card border-border/50 shadow-card", className)}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Bu Ay Kullanım
            </CardTitle>
            {isPremium && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                <Crown className="w-3 h-3 text-yellow-500" />
                <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                  Premium
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Achievement message */}
          <div className="text-center p-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">
                Bu ay Synexa ile {totalProjects} iş yaptın! 🚀
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {isPremium 
                ? 'Premium avantajlarını sonuna kadar kullanıyorsun!'
                : 'Harika ilerleme! Premium ile daha da hızlan.'
              }
            </p>
          </div>

          {/* Usage breakdown */}
          <div className="space-y-4">
            {usageItems.map((item) => {
              const Icon = item.icon
              const usage = userPlan.usage[item.action]
              const limit = userPlan.limits[item.action]
              
              return (
                <div key={item.action} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-5 w-5", item.color)} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">
                          {item.label}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {limit === null ? (
                            <span className="flex items-center gap-1 text-primary">
                              <Crown className="h-3 w-3" />
                              Sınırsız
                            </span>
                          ) : (
                            `${usage} / ${limit}`
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <UsageIndicator
                    action={item.action}
                    showLabel={false}
                    onUpgradeClick={() => setShowUpgradeModal(true)}
                  />
                </div>
              )
            })}
          </div>

          {/* Upgrade CTA for free users */}
          {!isPremium && (
            <div className="pt-4 border-t border-border/50">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Premium ile sınırları kaldır
                </p>
                <Button
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full bg-gradient-primary text-white shadow-premium"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Premium'a Geç
                </Button>
              </div>
            </div>
          )}

          {/* Premium benefits reminder */}
          {isPremium && (
            <div className="pt-4 border-t border-border/50">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Premium Avantajların
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                  <span>✓ Sınırsız kullanım</span>
                  <span>✓ Version history</span>
                  <span>✓ HD export</span>
                  <span>✓ Brand kit</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger="usage-limit"
      />
    </>
  )
}





