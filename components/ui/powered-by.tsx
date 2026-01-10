'use client'

import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

interface PoweredByProps {
  className?: string
  variant?: 'default' | 'minimal'
}

export function PoweredBy({ className, variant = 'default' }: PoweredByProps) {
  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center justify-center gap-1 text-xs text-muted-foreground", className)}>
        <span>Powered by</span>
        <span className="font-semibold text-foreground">Synexa AI</span>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center gap-2 p-4", className)}>
      <div className="flex items-center gap-2 px-3 py-2 bg-card/50 border border-border/50 rounded-xl">
        <div className="w-6 h-6 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-white" />
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Powered by </span>
          <span className="font-semibold text-foreground">Synexa AI</span>
        </div>
      </div>
    </div>
  )
}






