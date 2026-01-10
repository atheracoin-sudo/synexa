'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  autoResize?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, autoResize = false, onChange, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

    const handleResize = React.useCallback(() => {
      const textarea = textareaRef.current
      if (textarea && autoResize) {
        textarea.style.height = 'auto'
        textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px'
      }
    }, [autoResize])

    React.useEffect(() => {
      handleResize()
    }, [props.value, handleResize])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleResize()
      onChange?.(e)
    }

    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm',
            'placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200 resize-none scrollbar-thin',
            error && 'border-destructive focus:ring-destructive/50 focus:border-destructive',
            className
          )}
          ref={(node) => {
            textareaRef.current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
          onChange={handleChange}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }









