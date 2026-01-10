'use client'

import { MessageSquare, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ChatEmptyStateProps {
  onStartChat: () => void
  className?: string
}

const quickPrompts = [
  {
    id: 'code',
    text: 'React component yaz',
    icon: '⚡'
  },
  {
    id: 'design',
    text: 'Logo tasarımı yap',
    icon: '🎨'
  },
  {
    id: 'help',
    text: 'Nasıl çalışır?',
    icon: '❓'
  }
]

export function ChatEmptyState({ onStartChat, className }: ChatEmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center min-h-[400px] p-8 text-center', className)}>
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-premium">
          <MessageSquare className="h-10 w-10 text-white" />
        </div>
        {/* Sparkle decoration */}
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-white" />
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-8 max-w-sm">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Synexa ile konuşmaya başla
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          Bir fikir sor, kod yazdır veya uygulama oluştur.
        </p>
      </div>

      {/* Quick Prompts */}
      <div className="mb-8 w-full max-w-sm">
        <p className="text-sm text-muted-foreground mb-3">
          Hızlı başlangıç:
        </p>
        <div className="space-y-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => {
                // Auto-fill the prompt and start chat
                onStartChat()
                // You can pass the prompt text to the chat input
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors text-left group"
            >
              <span className="text-lg">{prompt.icon}</span>
              <span className="text-sm text-foreground flex-1">
                {prompt.text}
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Main CTA */}
      <Button 
        onClick={onStartChat}
        size="lg"
        className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-premium"
      >
        <MessageSquare className="h-5 w-5 mr-2" />
        Sohbete Başla
      </Button>

      {/* Help Link */}
      <button 
        onClick={() => window.location.href = '/help'}
        className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Nasıl çalışır? →
      </button>
    </div>
  )
}