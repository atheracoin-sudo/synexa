'use client'

import { Image, Palette, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ImageEmptyStateProps {
  onCreateDesign: () => void
  className?: string
}

const designTypes = [
  {
    id: 'social',
    title: 'Sosyal Medya',
    description: 'Instagram, Twitter görseli',
    icon: '📱'
  },
  {
    id: 'logo',
    title: 'Logo',
    description: 'Marka logosu tasarımı',
    icon: '🎯'
  },
  {
    id: 'banner',
    title: 'Banner',
    description: 'Web sitesi banner\'ı',
    icon: '🖼️'
  }
]

export function ImageEmptyState({ onCreateDesign, className }: ImageEmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center min-h-[500px] p-8 text-center', className)}>
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-premium">
          <Image className="h-10 w-10 text-white" />
        </div>
        {/* Palette decoration */}
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
          <Palette className="h-3 w-3 text-white" />
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-8 max-w-md">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Bir tasarım oluştur
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          Sosyal medya, banner veya görsel üret.
        </p>
      </div>

      {/* Design Types */}
      <div className="mb-8 w-full max-w-md">
        <p className="text-sm text-muted-foreground mb-4">
          Popüler tasarım türleri:
        </p>
        <div className="grid grid-cols-1 gap-3">
          {designTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                // Auto-fill the design type
                onCreateDesign()
              }}
              className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors text-left group border border-border/50 hover:border-border"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                <span className="text-lg">{type.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">
                  {type.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {type.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Main CTA */}
      <Button 
        onClick={onCreateDesign}
        size="lg"
        className="bg-gradient-to-br from-purple-500 to-pink-600 hover:opacity-90 transition-opacity shadow-premium mb-4"
      >
        <Sparkles className="h-5 w-5 mr-2" />
        Tasarım Yap
      </Button>

      {/* Help Link */}
      <button 
        onClick={() => window.location.href = '/help'}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Nasıl çalışır? →
      </button>
    </div>
  )
}