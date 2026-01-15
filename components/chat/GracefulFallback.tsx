'use client'

import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GracefulFallbackProps {
  onRetry: () => void
  isRetrying?: boolean
  className?: string
}

export function GracefulFallback({ onRetry, isRetrying = false, className }: GracefulFallbackProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="text-sm text-muted-foreground">
        Şu anda yanıt oluşturamadım. Tekrar denemek ister misin?
      </p>
      
      <button
        onClick={onRetry}
        disabled={isRetrying}
        className={cn(
          "self-start px-4 py-2 bg-gradient-primary text-white text-sm font-medium rounded-xl",
          "hover:scale-[1.02] transition-all duration-200 shadow-lg",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          "flex items-center gap-2"
        )}
      >
        {isRetrying ? (
          <>
            <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
            <span>Deneniyor...</span>
          </>
        ) : (
          <>
            <RefreshCw className="h-3 w-3" />
            <span>Tekrar Dene</span>
          </>
        )}
      </button>
    </div>
  )
}











