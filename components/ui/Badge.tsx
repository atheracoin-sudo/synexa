import * as React from "react"
import { cn } from "@/lib/utils"

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'premium'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
}

// Simple variant function without cva - returns className string
const badgeVariants = (variant: BadgeVariant = 'default'): string => {
  const variantClasses = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
    destructive: "border-transparent bg-red-500 text-white hover:bg-red-500/80",
    outline: "text-foreground border-border",
    success: "border-transparent bg-green-500 text-white hover:bg-green-500/80",
    warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80",
    premium: "border-transparent bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
  }
  
  return cn(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
    variantClasses[variant]
  )
}

const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => {
  return (
    <div 
      className={cn(badgeVariants(variant), className)} 
      {...props} 
    />
  )
}

export { Badge, badgeVariants }
