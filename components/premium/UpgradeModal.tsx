'use client'

import { useState } from 'react'
import { Crown, X, Check, Sparkles, Zap, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { usePremium } from '@/lib/hooks/usePremium'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  trigger?: 'feature-lock' | 'usage-limit' | 'manual'
  feature?: string
}

export function UpgradeModal({ isOpen, onClose, trigger = 'manual', feature }: UpgradeModalProps) {
  const [isUpgrading, setIsUpgrading] = useState(false)
  const { upgradeToPremium, getUpgradeReasons } = usePremium()

  if (!isOpen) return null

  const handleUpgrade = async () => {
    setIsUpgrading(true)
    
    // Simulate upgrade process
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    upgradeToPremium()
    setIsUpgrading(false)
    onClose()
  }

  const upgradeReasons = getUpgradeReasons()

  // Context-specific messaging
  const getTitle = () => {
    switch (trigger) {
      case 'feature-lock':
        return 'Bu özelliği açmak için Premium gerekli'
      case 'usage-limit':
        return 'Limitine ulaştın'
      default:
        return 'Daha fazlasını üret 🚀'
    }
  }

  const getDescription = () => {
    switch (trigger) {
      case 'feature-lock':
        return `${feature} özelliği Premium planında mevcut`
      case 'usage-limit':
        return 'Premium ile sınırsız kullanım'
      default:
        return 'Synexa\'nın tüm gücünü açığa çıkar'
    }
  }

  const benefits = [
    {
      icon: Sparkles,
      title: 'Sınırsız Chat',
      description: 'Günlük mesaj limiti yok',
    },
    {
      icon: Zap,
      title: 'Gelişmiş Code Studio',
      description: 'Version history, multi-device preview',
    },
    {
      icon: Palette,
      title: 'Pro Design Tools',
      description: 'Brand kit, HD export, AI assistant',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
        {/* Header */}
        <div className="relative p-6 bg-gradient-primary text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">{getTitle()}</h2>
            <p className="text-white/80 text-sm">{getDescription()}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Benefits */}
          <div className="space-y-4 mb-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                </div>
              )
            })}
          </div>

          {/* Pricing */}
          <div className="bg-muted/30 rounded-xl p-4 mb-6 text-center">
            <div className="text-2xl font-bold text-foreground mb-1">
              ₺29<span className="text-sm text-muted-foreground">/ay</span>
            </div>
            <p className="text-xs text-muted-foreground">
              İlk 7 gün ücretsiz deneme
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full bg-gradient-primary text-white shadow-premium"
            >
              {isUpgrading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Yükseltiliyor...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Premium'a Geç
                </div>
              )}
            </Button>
            
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full"
              disabled={isUpgrading}
            >
              Şimdi değil
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              ✓ İstediğin zaman iptal et • ✓ Güvenli ödeme
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}






