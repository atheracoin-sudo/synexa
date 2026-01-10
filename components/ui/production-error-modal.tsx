'use client'

import { useState, useEffect } from 'react'
import { X, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SupportWidget } from '@/components/help/SupportEscalation'

interface ProductionErrorModalProps {
  isOpen: boolean
  onClose: () => void
  onRetry: () => void
  title?: string
  message?: string
}

export function ProductionErrorModal({ 
  isOpen, 
  onClose, 
  onRetry,
  title = "Şu anda bir sorun yaşıyoruz",
  message = "Synexa geçici olarak yanıt veremiyor. Lütfen biraz sonra tekrar dene."
}: ProductionErrorModalProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await onRetry()
    } finally {
      setIsRetrying(false)
    }
  }

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={cn(
          "bg-card border border-border/50 rounded-2xl shadow-2xl max-w-md w-full",
          "animate-in fade-in slide-in-from-bottom-4 duration-300"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          
          {/* Content */}
          <div className="px-6 pb-2">
            <p className="text-muted-foreground leading-relaxed">
              {message}
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 p-6 pt-4">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className={cn(
                "flex-1 px-4 py-2.5 bg-gradient-primary text-white font-medium rounded-xl",
                "hover:scale-[1.02] transition-all duration-200 shadow-lg",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                "flex items-center justify-center gap-2"
              )}
            >
              {isRetrying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Deneniyor...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Tekrar Dene</span>
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className={cn(
                "px-4 py-2.5 bg-muted text-muted-foreground font-medium rounded-xl",
                "hover:bg-muted/80 transition-colors"
              )}
            >
              Kapat
            </button>
          </div>
          
          {/* Support Escalation */}
          <div className="border-t border-border/50 p-6 pt-4">
            <SupportWidget context="Error Modal" />
          </div>
        </div>
      </div>
    </>
  )
}
