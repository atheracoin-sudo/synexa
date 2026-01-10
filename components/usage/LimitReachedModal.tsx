'use client'

import { useState } from 'react'
import { AlertCircle, Crown, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface LimitReachedModalProps {
  isOpen: boolean
  onClose: () => void
  limitType: 'chat' | 'apps' | 'images' | 'agents'
  className?: string
}

const limitConfig = {
  chat: {
    title: 'Chat mesaj limitine ulaştın',
    description: 'Bu ay için chat mesaj hakkın bitti',
    icon: '💬',
    resetTime: 'Yarın yeni mesaj hakkın gelecek'
  },
  apps: {
    title: 'App oluşturma limitine ulaştın',
    description: 'Bu ay için app oluşturma hakkın bitti',
    icon: '⚡',
    resetTime: 'Yarın yeni oluşturma hakkın gelecek'
  },
  images: {
    title: 'Görsel oluşturma limitine ulaştın',
    description: 'Bu ay için görsel oluşturma hakkın bitti',
    icon: '🎨',
    resetTime: 'Yarın yeni oluşturma hakkın gelecek'
  },
  agents: {
    title: 'AI Agent limitine ulaştın',
    description: 'Bu ay için AI Agent hakkın bitti',
    icon: '🤖',
    resetTime: 'Yarın yeni agent hakkın gelecek'
  }
}

export function LimitReachedModal({ 
  isOpen, 
  onClose, 
  limitType, 
  className 
}: LimitReachedModalProps) {
  if (!isOpen) return null

  const config = limitConfig[limitType]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className={cn('w-full max-w-md p-6 bg-background', className)}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">{config.icon}</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {config.title}
          </h2>
          <p className="text-muted-foreground text-sm">
            {config.description}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {/* Wait Option */}
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-secondary/30">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Yarın devam et
              </p>
              <p className="text-xs text-muted-foreground">
                {config.resetTime}
              </p>
            </div>
          </div>

          {/* Premium Option */}
          <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
              <Crown className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Premium'a geç
              </p>
              <p className="text-xs text-muted-foreground">
                Sınırsız kullanım + daha fazla özellik
              </p>
            </div>
            <Zap className="h-4 w-4 text-primary" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Link href="/pricing" onClick={onClose}>
            <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
              <Crown className="h-4 w-4 mr-2" />
              Premium'a Geç
            </Button>
          </Link>

          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full"
          >
            Tamam, anladım
          </Button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Premium ile tüm limitler kalkıyor ve öncelikli destek alıyorsun
        </p>
      </Card>
    </div>
  )
}






