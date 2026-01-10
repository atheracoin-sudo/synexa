'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn('animate-spin', sizeClasses[size], className)}>
      <svg
        className="w-full h-full text-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn('flex space-x-1', className)}>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg max-w-fit">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0s]"></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.2s]"></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.4s]"></div>
      </div>
      <span className="text-sm text-muted-foreground">AI yazıyor...</span>
    </div>
  )
}







