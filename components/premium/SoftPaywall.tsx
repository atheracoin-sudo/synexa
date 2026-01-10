'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Crown, Lock, ArrowRight } from 'lucide-react'

interface SoftPaywallProps {
  feature: string
  description?: string
  className?: string
  onUpgrade?: () => void
  children?: React.ReactNode
}

export function SoftPaywall({ 
  feature, 
  description, 
  className, 
  onUpgrade,
  children 
}: SoftPaywallProps) {
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade()
    } else {
      window.open('/pricing', '_blank')
    }
  }

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border border-border",
      className
    )}>
      {/* Blurred Content */}
      <div className="relative">
        <div className="blur-sm pointer-events-none select-none">
          {children}
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        {/* Lock Icon */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30">
            <Crown className="h-4 w-4 text-yellow-500" />
          </div>
        </div>
      </div>
      
      {/* CTA Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-6 max-w-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary mb-4">
            <Crown className="h-6 w-6 text-white" />
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {feature}
          </h3>
          
          {description && (
            <p className="text-sm text-muted-foreground mb-4">
              {description}
            </p>
          )}
          
          <div className="space-y-2">
            <Button 
              onClick={handleUpgrade}
              className="bg-gradient-primary hover:opacity-90 w-full"
            >
              <Crown className="h-4 w-4 mr-2" />
              Premium ile açılır
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Premium ile açılır
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface FeatureLockProps {
  feature: string
  tooltip?: string
  className?: string
  onUpgrade?: () => void
}

export function FeatureLock({ 
  feature, 
  tooltip, 
  className, 
  onUpgrade 
}: FeatureLockProps) {
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade()
    } else {
      window.open('/pricing', '_blank')
    }
  }

  return (
    <div className={cn(
      "group relative p-4 rounded-lg border border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer",
      className
    )}
    onClick={handleUpgrade}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20">
            <Crown className="h-4 w-4 text-yellow-500" />
          </div>
          
          <div>
            <h4 className="font-medium text-foreground">{feature}</h4>
            {tooltip && (
              <p className="text-sm text-muted-foreground">{tooltip}</p>
            )}
          </div>
        </div>
        
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
      
      <div className="mt-3 pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          Premium ile açılır • <span className="text-blue-500 hover:underline">Upgrade</span>
        </p>
      </div>
    </div>
  )
}

interface PreviewModeProps {
  feature: string
  children: React.ReactNode
  onUpgrade?: () => void
}

export function PreviewMode({ feature, children, onUpgrade }: PreviewModeProps) {
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade()
    } else {
      window.open('/pricing', '_blank')
    }
  }

  return (
    <div className="relative">
      {/* Preview Banner */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-medium text-foreground">
              Bu özelliğin ön izlemesindesin
            </span>
          </div>
          
          <Button 
            size="sm" 
            onClick={handleUpgrade}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Crown className="h-3 w-3 mr-1" />
            Upgrade
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-1">
          {feature} özelliğini tam olarak kullanmak için Premium'a geç
        </p>
      </div>
      
      {/* Preview Content */}
      <div className="relative">
        {children}
        
        {/* Subtle overlay to indicate preview */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-blue-500/5 to-transparent rounded-lg" />
      </div>
    </div>
  )
}





