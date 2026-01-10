'use client'

import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { Send, Square, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconButton } from '@/components/ui'
import { PromptEnhancer } from '@/components/prompt/PromptEnhancer'
// import { motion, AnimatePresence } from 'framer-motion'

interface ComposerProps {
  onSendMessage: (message: string) => void
  onStopGeneration?: () => void
  disabled?: boolean
  isLoading?: boolean
  placeholder?: string
  limitReached?: boolean
  onUpgradeClick?: () => void
}

function Composer({ 
  onSendMessage, 
  onStopGeneration,
  disabled = false,
  isLoading = false,
  placeholder = "Mesajınızı yazın...",
  limitReached = false,
  onUpgradeClick
}: ComposerProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const newHeight = Math.min(textarea.scrollHeight, 200)
      textarea.style.height = newHeight + 'px'
    }
  }, [])

  useEffect(() => {
    adjustHeight()
  }, [message, adjustHeight])

  // Listen for example prompt clicks
  useEffect(() => {
    const handleExamplePrompt = (event: CustomEvent) => {
      setMessage(event.detail)
      textareaRef.current?.focus()
    }

    window.addEventListener('example-prompt-click', handleExamplePrompt as EventListener)
    return () => {
      window.removeEventListener('example-prompt-click', handleExamplePrompt as EventListener)
    }
  }, [])

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault()
    if (message.trim() && !disabled && !isLoading) {
      onSendMessage(message.trim())
      setMessage('')
      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }, [message, disabled, isLoading, onSendMessage])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter to send (alternative)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
      return
    }
    
    // Enter to send, Shift+Enter for newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  const handleStop = useCallback(() => {
    onStopGeneration?.()
  }, [onStopGeneration])

  const handleEnhancedPrompt = useCallback((enhanced: string) => {
    setMessage(enhanced)
    textareaRef.current?.focus()
  }, [])

  const canSend = message.trim().length > 0 && !disabled && !isLoading && !limitReached

  return (
    <div className="border-t border-border/50 bg-background/80 backdrop-blur-md p-4 pb-safe-area-inset-bottom">
      {/* Limit reached overlay */}
      {limitReached && (
        <div className="mb-4 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl text-center">
          <p className="text-sm font-medium text-foreground mb-2">
            Günlük mesaj limitine ulaştın
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Premium ile sınırsız mesaj gönderebilirsin
          </p>
          <button 
            onClick={onUpgradeClick}
            className="px-4 py-2 bg-gradient-primary text-white text-sm font-medium rounded-lg hover:scale-105 transition-transform"
          >
            Premium'a Geç
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3">
          {/* Input Container with iMessage-style design */}
          <div className="flex-1 relative">
            <div className={cn(
              "relative rounded-[24px] border border-border/50 bg-background shadow-card",
              "transition-all duration-200",
              "focus-within:border-primary/50 focus-within:shadow-premium"
            )}>
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={limitReached ? "Premium ile sınırsız mesaj gönder..." : placeholder}
                disabled={disabled || limitReached}
                rows={1}
                className={cn(
                  "w-full resize-none bg-transparent px-5 py-3 text-sm",
                  "placeholder:text-muted-foreground",
                  "focus:outline-none",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "scrollbar-thin"
                )}
                style={{ minHeight: '48px', maxHeight: '200px' }}
                aria-label="Mesaj yaz"
              />
              
              {/* Inner shadow effect */}
              <div className="absolute inset-0 rounded-[24px] pointer-events-none shadow-inner opacity-20" />
            </div>
          </div>
          
          {/* Send/Stop Button - Modern circular design */}
          {isLoading ? (
            <button
              type="button"
              onClick={handleStop}
              className={cn(
                "flex-shrink-0 w-12 h-12 rounded-full",
                "bg-muted hover:bg-muted/80",
                "flex items-center justify-center",
                "transition-all duration-200 hover:scale-105 active:scale-95",
                "shadow-card"
              )}
              aria-label="Durdur"
            >
              <Square className="h-5 w-5 text-muted-foreground" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canSend}
              className={cn(
                "flex-shrink-0 w-12 h-12 rounded-full",
                "flex items-center justify-center",
                "transition-all duration-200",
                "shadow-card",
                canSend
                  ? "bg-gradient-primary text-white hover:scale-105 active:scale-95 shadow-premium"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              aria-label="Gönder"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        {/* Prompt Enhancer */}
        <PromptEnhancer
          originalPrompt={message}
          onEnhancedPrompt={handleEnhancedPrompt}
          context="chat"
          className="mt-3"
        />
        
        {/* Helper text - More subtle */}
        <div className="flex items-center justify-center gap-6 mt-3">
          <p className="text-xs text-muted-foreground/70">
            <kbd className="px-2 py-1 bg-muted/50 rounded-lg text-xs font-mono">Enter</kbd>
            {' '}to send
          </p>
          <p className="text-xs text-muted-foreground/70">
            <kbd className="px-2 py-1 bg-muted/50 rounded-lg text-xs font-mono">⇧ Enter</kbd>
            {' '}new line
          </p>
        </div>
      </form>
    </div>
  )
}

export default memo(Composer)
