'use client'

import { AlertCircle, RefreshCw, X } from 'lucide-react'
import { Button, IconButton, Card } from '@/components/ui'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  onDismiss?: () => void
}

export default function ErrorMessage({ message, onRetry, onDismiss }: ErrorMessageProps) {
  // Parse error type for better UX
  const isTimeout = message.toLowerCase().includes('timeout') || message.includes('504')
  const isRateLimit = message.includes('429') || message.toLowerCase().includes('rate')
  const isServerError = message.includes('500') || message.includes('502') || message.includes('503')
  const isNetworkError = message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch')

  const getErrorTitle = () => {
    if (isRateLimit) return 'Çok Fazla İstek'
    if (isTimeout) return 'Zaman Aşımı'
    if (isServerError) return 'Sunucu Hatası'
    if (isNetworkError) return 'Bağlantı Hatası'
    return 'Hata Oluştu'
  }

  const getErrorDescription = () => {
    if (isRateLimit) return 'Çok fazla istek gönderildi. Lütfen birkaç saniye bekleyip tekrar deneyin.'
    if (isTimeout) return 'İstek zaman aşımına uğradı. Sunucu meşgul olabilir.'
    if (isServerError) return 'Sunucuda bir sorun oluştu. Lütfen daha sonra tekrar deneyin.'
    if (isNetworkError) return 'İnternet bağlantınızı kontrol edip tekrar deneyin.'
    return message
  }

  return (
    <div className="px-4 py-3">
      <Card 
        variant="outline" 
        padding="md" 
        className="border-destructive/30 bg-destructive/5 max-w-2xl mx-auto"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-destructive text-sm mb-1">
              {getErrorTitle()}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {getErrorDescription()}
            </p>
            
            <div className="flex items-center gap-2">
              {onRetry && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={onRetry}
                  leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                >
                  Tekrar Dene
                </Button>
              )}
              
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                >
                  Kapat
                </Button>
              )}
            </div>
          </div>
          
          {onDismiss && (
            <IconButton
              aria-label="Kapat"
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </IconButton>
          )}
        </div>
      </Card>
    </div>
  )
}
