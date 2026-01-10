'use client'

import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

// Standard Loading Spinner
export function LoadingSpinner({ 
  size = 'md', 
  className 
}: { 
  size?: 'sm' | 'md' | 'lg'
  className?: string 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  return (
    <Loader2 
      className={cn(
        'animate-spin text-primary',
        sizeClasses[size],
        className
      )} 
    />
  )
}

// Page Loading State
export function PageLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}

// Skeleton Components
export function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-muted rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

// Empty States
export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground max-w-md">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}

// Error States
export function ErrorState({ 
  title = 'Something went wrong',
  description = 'Please try again',
  onRetry,
  showRetry = true
}: {
  title?: string
  description?: string
  onRetry?: () => void
  showRetry?: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
      <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground max-w-md">{description}</p>
      </div>
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  )
}

// Button Loading State
export function ButtonLoading({ 
  children, 
  loading = false, 
  ...props 
}: {
  children: React.ReactNode
  loading?: boolean
  [key: string]: any
}) {
  return (
    <button 
      {...props}
      disabled={loading || props.disabled}
      className={cn(
        props.className,
        loading && 'cursor-not-allowed opacity-75'
      )}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

// Inline Loading
export function InlineLoading({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <LoadingSpinner size="sm" />
      {message && <span className="text-sm">{message}</span>}
    </div>
  )
}

// Success State
export function SuccessState({ 
  title = 'Success!',
  description,
  action
}: {
  title?: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
      <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}






