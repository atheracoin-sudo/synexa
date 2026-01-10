'use client'

import { useState } from 'react'
import { HelpCircle, X, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContextualHelpProps {
  title: string
  steps: string[]
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  className?: string
}

export function ContextualHelp({ 
  title, 
  steps, 
  position = 'bottom-right',
  className 
}: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false)

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  }

  return (
    <div className={cn('fixed z-40', positionClasses[position], className)}>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200',
          'bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg',
          'hover:bg-background hover:border-border',
          'text-sm text-muted-foreground hover:text-foreground',
          isOpen && 'bg-background border-border'
        )}
        aria-label="Yardım"
      >
        <HelpCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Nasıl çalışır?</span>
        {isOpen ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>

      {/* Help Panel */}
      {isOpen && (
        <div className={cn(
          'absolute w-80 max-w-[calc(100vw-2rem)]',
          'bg-background border border-border rounded-xl shadow-xl',
          'p-4 mt-2',
          position.includes('right') ? 'right-0' : 'left-0',
          position.includes('top') ? 'bottom-full mb-2' : 'top-full'
        )}>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground text-sm">
              {title}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Kapat"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">
                    {index + 1}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-border/50">
            <button
              onClick={() => window.location.href = '/help'}
              className="text-xs text-primary hover:underline"
            >
              Daha fazla yardım →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Predefined help content for different pages
export function ChatContextualHelp() {
  return (
    <ContextualHelp
      title="Chat Nasıl Kullanılır?"
      steps={[
        'Mesaj kutusuna sorununu yaz',
        'AI sana cevap verecek',
        'Devam eden sohbet yapabilirsin'
      ]}
    />
  )
}

export function CodeContextualHelp() {
  return (
    <ContextualHelp
      title="Code Studio Nasıl Kullanılır?"
      steps={[
        'Ne yapmak istediğini anlat',
        'AI senin için kod yazacak',
        'Canlı önizleme ile test et'
      ]}
    />
  )
}

export function DesignContextualHelp() {
  return (
    <ContextualHelp
      title="Design Studio Nasıl Kullanılır?"
      steps={[
        'Hangi görseli istediğini söyle',
        'AI senin için oluşturacak',
        'Düzenle ve indir'
      ]}
    />
  )
}

export function LibraryContextualHelp() {
  return (
    <ContextualHelp
      title="Library Nasıl Kullanılır?"
      steps={[
        'Tüm çalışmalarını burada bul',
        'Kategorilere göre filtrele',
        'Düzenle, paylaş veya sil'
      ]}
    />
  )
}

// Mini help link component (inline)
interface MiniHelpLinkProps {
  onClick?: () => void
  className?: string
}

export function MiniHelpLink({ onClick, className }: MiniHelpLinkProps) {
  return (
    <button
      onClick={onClick || (() => window.location.href = '/help')}
      className={cn(
        'inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors',
        className
      )}
    >
      <HelpCircle className="h-3 w-3" />
      Nasıl çalışır?
    </button>
  )
}






