"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const Sheet = ({ open, onOpenChange, children }: SheetProps) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && onOpenChange) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      // Lock body scroll
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '0px' // Prevent layout shift
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      // Restore body scroll
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = ''
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
        onClick={() => onOpenChange?.(false)}
      />
      
      {/* Sheet content container */}
      <div className="fixed inset-0 overflow-hidden">
        {children}
      </div>
    </div>
  )
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = 'right', size = 'md', className, children, ...props }, ref) => {
    const sideClasses = {
      top: 'inset-x-0 top-0 border-b animate-in slide-in-from-top-full',
      bottom: 'inset-x-0 bottom-0 border-t animate-in slide-in-from-bottom-full',
      left: 'inset-y-0 left-0 border-r animate-in slide-in-from-left-full',
      right: 'inset-y-0 right-0 border-l animate-in slide-in-from-right-full'
    }

    const sizeClasses = {
      sm: side === 'top' || side === 'bottom' ? 'h-1/3' : 'w-80',
      md: side === 'top' || side === 'bottom' ? 'h-1/2' : 'w-96',
      lg: side === 'top' || side === 'bottom' ? 'h-2/3' : 'w-[28rem]',
      xl: side === 'top' || side === 'bottom' ? 'h-5/6' : 'w-[32rem]',
      full: side === 'top' || side === 'bottom' ? 'h-full' : 'w-full'
    }

    // Mobile responsive adjustments
    const mobileClasses = {
      top: 'sm:h-1/2 h-2/3',
      bottom: 'sm:h-1/2 h-2/3', 
      left: 'sm:w-96 w-full',
      right: 'sm:w-96 w-full'
    }

    return (
      <div
        ref={ref}
        className={cn(
          "fixed bg-background border-border shadow-lg flex flex-col",
          sideClasses[side],
          size === 'full' ? sizeClasses[size] : `${sizeClasses[size]} max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]`,
          // Mobile responsive
          `sm:${sizeClasses[size]}`,
          side === 'right' || side === 'left' ? mobileClasses[side] : mobileClasses[side],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SheetContent.displayName = "SheetContent"

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center justify-between p-4 border-b border-border shrink-0", className)}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex-1 overflow-y-auto p-4", className)}
    {...props}
  />
)
SheetBody.displayName = "SheetBody"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("p-4 border-t border-border shrink-0", className)}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = "SheetDescription"

const SheetClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </button>
))
SheetClose.displayName = "SheetClose"

export {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
}