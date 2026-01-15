'use client'

import { AlertTriangle, RefreshCw, Activity, X } from 'lucide-react'

interface ChatErrorBannerProps {
  error: string
  onRetry: () => void
  onGoToHealth: () => void
  onDismiss: () => void
}

export function ChatErrorBanner({ error, onRetry, onGoToHealth, onDismiss }: ChatErrorBannerProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-2">
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Bağlantı sorunu
            </h3>
            <div className="mt-1 text-sm text-red-700">
              <p>Sunucu yanıt vermedi. Deploy Health ekranından kontrol edebilirsin.</p>
              {error && (
                <p className="mt-1 text-xs text-red-600 font-mono">
                  Hata: {error}
                </p>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-800 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Tekrar Dene
              </button>
              <button
                onClick={onGoToHealth}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-800 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
              >
                <Activity className="h-3 w-3" />
                Deploy Health'e Git
              </button>
            </div>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className="inline-flex text-red-400 hover:text-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}