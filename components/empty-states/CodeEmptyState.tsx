'use client'

import { Code2, MessageSquare, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface CodeEmptyStateProps {
  onCreateFromPrompt: () => void
  className?: string
}

const quickStarters = [
  {
    id: 'todo',
    title: 'Todo App',
    description: 'Basit görev yöneticisi',
    icon: '📝'
  },
  {
    id: 'calculator',
    title: 'Hesap Makinesi',
    description: 'Temel matematik işlemleri',
    icon: '🧮'
  },
  {
    id: 'weather',
    title: 'Hava Durumu',
    description: 'Şehir bazlı hava raporu',
    icon: '🌤️'
  }
]

export function CodeEmptyState({ onCreateFromPrompt, className }: CodeEmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center min-h-[500px] p-8 text-center', className)}>
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-premium">
          <Code2 className="h-10 w-10 text-white" />
        </div>
        {/* Rocket decoration */}
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
          <span className="text-sm">🚀</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-8 max-w-md">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          İlk uygulamanı oluşturalım 🚀
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          AI ile birlikte kod yaz, canlı önizle ve hemen test et.
        </p>
      </div>

      {/* Quick Starters */}
      <div className="mb-8 w-full max-w-md">
        <p className="text-sm text-muted-foreground mb-4">
          Popüler başlangıçlar:
        </p>
        <div className="grid grid-cols-1 gap-3">
          {quickStarters.map((starter) => (
            <button
              key={starter.id}
              onClick={() => {
                // Auto-fill the prompt
                onCreateFromPrompt()
              }}
              className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors text-left group border border-border/50 hover:border-border"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <span className="text-lg">{starter.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">
                  {starter.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {starter.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Link href="/chat" className="flex-1">
          <Button 
            variant="outline"
            size="lg"
            className="w-full"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Chat'ten Başla
          </Button>
        </Link>
        
        <Button 
          onClick={onCreateFromPrompt}
          size="lg"
          className="flex-1 bg-gradient-to-br from-green-500 to-teal-600 hover:opacity-90 transition-opacity shadow-premium"
        >
          <Code2 className="h-5 w-5 mr-2" />
          Prompt ile Oluştur
        </Button>
      </div>

      {/* Help Link */}
      <button 
        onClick={() => window.location.href = '/help'}
        className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Nasıl çalışır? →
      </button>
    </div>
  )
}