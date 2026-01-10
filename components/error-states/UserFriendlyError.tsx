'use client'

import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface UserFriendlyErrorProps {
  title?: string
  message?: string
  showRetry?: boolean
  showHome?: boolean
  showSupport?: boolean
  onRetry?: () => void
  className?: string
}

// User-friendly error messages (NO technical terms)
const errorMessages = {
  network: {
    title: 'Bağlantı sorunu',
    message: 'İnternet bağlantını kontrol et ve tekrar dene'
  },
  timeout: {
    title: 'Zaman aşımı',
    message: 'İşlem biraz uzun sürdü, tekrar denemek ister misin?'
  },
  server: {
    title: 'Bir şeyler ters gitti',
    message: 'Sorunla ilgileniyoruz, biraz sonra tekrar dene'
  },
  notFound: {
    title: 'Sayfa bulunamadı',
    message: 'Aradığın sayfa mevcut değil veya taşınmış olabilir'
  },
  forbidden: {
    title: 'Erişim yok',
    message: 'Bu sayfayı görüntüleme yetkin bulunmuyor'
  },
  rateLimit: {
    title: 'Çok hızlı',
    message: 'Biraz yavaşla, birkaç saniye bekle ve tekrar dene'
  },
  validation: {
    title: 'Bilgiler eksik',
    message: 'Girdiğin bilgileri kontrol et ve tekrar dene'
  },
  generic: {
    title: 'Bir şeyler ters gitti',
    message: 'Tekrar denemek ister misin?'
  }
}

export function UserFriendlyError({
  title,
  message,
  showRetry = true,
  showHome = true,
  showSupport = false,
  onRetry,
  className
}: UserFriendlyErrorProps) {
  const errorContent = errorMessages.generic

  return (
    <div className={cn('flex flex-col items-center justify-center min-h-[400px] p-8 text-center', className)}>
      {/* Error Icon */}
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>

      {/* Error Content */}
      <div className="mb-8 max-w-md">
        <h2 className="text-xl font-semibold text-foreground mb-3">
          {title || errorContent.title}
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          {message || errorContent.message}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        {showRetry && (
          <Button 
            onClick={onRetry || (() => window.location.reload())}
            className="flex-1"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tekrar Dene
          </Button>
        )}

        {showHome && (
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="flex-1"
          >
            <Home className="h-4 w-4 mr-2" />
            Ana Sayfa
          </Button>
        )}
      </div>

      {/* Support Link */}
      {showSupport && (
        <button 
          onClick={() => window.open('mailto:destek@synexa.ai')}
          className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          Yardım al
        </button>
      )}
    </div>
  )
}

// Specific error components for common scenarios
export function NetworkError({ onRetry, className }: { onRetry?: () => void; className?: string }) {
  return (
    <UserFriendlyError
      title={errorMessages.network.title}
      message={errorMessages.network.message}
      onRetry={onRetry}
      showSupport={true}
      className={className}
    />
  )
}

export function TimeoutError({ onRetry, className }: { onRetry?: () => void; className?: string }) {
  return (
    <UserFriendlyError
      title={errorMessages.timeout.title}
      message={errorMessages.timeout.message}
      onRetry={onRetry}
      className={className}
    />
  )
}

export function ServerError({ className }: { className?: string }) {
  return (
    <UserFriendlyError
      title={errorMessages.server.title}
      message={errorMessages.server.message}
      showRetry={false}
      showSupport={true}
      className={className}
    />
  )
}

export function NotFoundError({ className }: { className?: string }) {
  return (
    <UserFriendlyError
      title={errorMessages.notFound.title}
      message={errorMessages.notFound.message}
      showRetry={false}
      className={className}
    />
  )
}

export function RateLimitError({ onRetry, className }: { onRetry?: () => void; className?: string }) {
  return (
    <UserFriendlyError
      title={errorMessages.rateLimit.title}
      message={errorMessages.rateLimit.message}
      onRetry={onRetry}
      className={className}
    />
  )
}

// Loading Error (for when something fails to load)
export function LoadingError({ 
  onRetry, 
  itemName = 'içerik',
  className 
}: { 
  onRetry?: () => void
  itemName?: string
  className?: string 
}) {
  return (
    <UserFriendlyError
      title="Yüklenemedi"
      message={`${itemName} yüklenirken bir sorun oluştu`}
      onRetry={onRetry}
      showHome={false}
      className={className}
    />
  )
}





