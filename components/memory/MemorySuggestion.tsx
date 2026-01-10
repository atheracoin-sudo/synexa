'use client'

import { useState } from 'react'
import { Save, X, Brain } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MemorySuggestion as MemorySuggestionType } from '@/lib/types'
import { useToast } from '@/components/ui/Toast'

interface MemorySuggestionProps {
  suggestion: MemorySuggestionType
  onAccept: (suggestionId: string) => void
  onReject: (suggestionId: string) => void
  className?: string
}

export function MemorySuggestion({ 
  suggestion, 
  onAccept, 
  onReject, 
  className 
}: MemorySuggestionProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { addToast } = useToast()

  const handleAccept = async () => {
    setIsProcessing(true)
    try {
      onAccept(suggestion.id)
      addToast({
        type: 'success',
        message: 'Tercih kaydedildi! 💾',
        duration: 2000,
      })
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Tercih kaydedilemedi',
      })
    }
    setIsProcessing(false)
  }

  const handleReject = () => {
    onReject(suggestion.id)
  }

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-xl",
      "animate-in fade-in slide-in-from-bottom-2 duration-300",
      className
    )}>
      {/* Memory Icon */}
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Brain className="h-4 w-4 text-primary" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          Tercihini hatırlamamı ister misin? 💾
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          <span className="font-medium">{suggestion.title}:</span> {suggestion.value}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleAccept}
          disabled={isProcessing}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center gap-1.5"
          )}
        >
          {isProcessing ? (
            <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="h-3 w-3" />
          )}
          Hatırla
        </button>
        
        <button
          onClick={handleReject}
          disabled={isProcessing}
          className={cn(
            "px-2 py-1.5 text-xs font-medium rounded-lg transition-all duration-200",
            "bg-muted text-muted-foreground hover:bg-muted/80",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}





