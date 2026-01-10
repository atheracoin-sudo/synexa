'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  'aria-label': string
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 
    className, 
    variant = 'ghost', 
    size = 'md', 
    isLoading = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg'
    
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95',
      ghost: 'text-muted-foreground hover:text-foreground hover:bg-secondary active:bg-secondary/80',
      danger: 'text-destructive hover:bg-destructive/10 active:bg-destructive/20',
    }

    const sizes = {
      sm: 'h-7 w-7',
      md: 'h-9 w-9',
      lg: 'h-11 w-11',
    }

    const iconSizes = {
      sm: '[&>svg]:h-3.5 [&>svg]:w-3.5',
      md: '[&>svg]:h-4 [&>svg]:w-4',
      lg: '[&>svg]:h-5 [&>svg]:w-5',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], iconSizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          children
        )}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'

export { IconButton }









