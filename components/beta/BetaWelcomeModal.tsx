'use client'

import { useState, useEffect } from 'react'
import { Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface BetaWelcomeModalProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function BetaWelcomeModal({ isOpen, onClose, className }: BetaWelcomeModalProps) {
  if (!isOpen) return null

  const handleStart = () => {
    // Mark beta welcome as seen
    localStorage.setItem('beta_welcome_seen', 'true')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className={cn('w-full max-w-md bg-background p-8 text-center', className)}>
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-premium">
          <Sparkles className="h-8 w-8 text-white" />
        </div>

        {/* Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Synexa Beta'ya hoş geldin 👋
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Geri bildirimin bizim için çok değerli.
          </p>
        </div>

        {/* CTA */}
        <Button 
          onClick={handleStart}
          size="lg"
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-premium"
        >
          Başla
        </Button>

        {/* Close button (subtle) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-lg transition-colors opacity-50 hover:opacity-100"
          aria-label="Kapat"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </Card>
    </div>
  )
}

// Hook to manage beta welcome state
export function useBetaWelcome() {
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // Check if user has seen beta welcome
    const hasSeenWelcome = localStorage.getItem('beta_welcome_seen')
    
    // Only show for new users who haven't seen it
    if (!hasSeenWelcome) {
      // Small delay to let the page load
      setTimeout(() => {
        setShowWelcome(true)
      }, 1000)
    }
  }, [])

  const closeWelcome = () => {
    setShowWelcome(false)
  }

  return {
    showWelcome,
    closeWelcome
  }
}






