'use client'

import { MessageSquare, Code2, Image, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface EmptyStateProps {
  className?: string
}

// Chat Empty State
export function ChatLibraryEmptyState({ className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-6 text-center', className)}>
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
        <MessageSquare className="h-8 w-8 text-blue-500" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Henüz sohbetin yok
      </h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-xs">
        AI ile ilk konuşmanı başlat, sorular sor
      </p>
      
      <Link href="/chat">
        <Button className="bg-blue-500 hover:bg-blue-600">
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat'e Başla
        </Button>
      </Link>
    </div>
  )
}

// Apps Empty State
export function AppsLibraryEmptyState({ className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-6 text-center', className)}>
      <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4">
        <Code2 className="h-8 w-8 text-green-500" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Henüz uygulama yok
      </h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-xs">
        İlk uygulamanı oluştur, kod yaz, canlı test et
      </p>
      
      <Link href="/code">
        <Button className="bg-green-500 hover:bg-green-600">
          <Code2 className="h-4 w-4 mr-2" />
          App Oluştur
        </Button>
      </Link>
    </div>
  )
}

// Designs Empty State
export function DesignsLibraryEmptyState({ className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-6 text-center', className)}>
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
        <Image className="h-8 w-8 text-purple-500" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Henüz tasarım yok
      </h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-xs">
        İlk tasarımını oluştur, görsel üret, düzenle
      </p>
      
      <Link href="/design">
        <Button className="bg-purple-500 hover:bg-purple-600">
          <Image className="h-4 w-4 mr-2" />
          Tasarım Yap
        </Button>
      </Link>
    </div>
  )
}

// Generic Empty State with Custom Action
interface GenericEmptyStateProps extends EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  actionText: string
  onAction: () => void
  iconColor?: string
  buttonColor?: string
}

export function GenericEmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onAction,
  iconColor = 'text-primary',
  buttonColor = 'bg-primary hover:bg-primary/90',
  className 
}: GenericEmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-6 text-center', className)}>
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className={cn('h-8 w-8', iconColor)} />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-xs">
        {description}
      </p>
      
      <Button 
        onClick={onAction}
        className={buttonColor}
      >
        <Plus className="h-4 w-4 mr-2" />
        {actionText}
      </Button>
    </div>
  )
}

// Quick Action Empty State (with multiple CTAs)
interface QuickActionEmptyStateProps extends EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  actions: Array<{
    text: string
    href?: string
    onClick?: () => void
    variant?: 'default' | 'outline'
    icon?: React.ComponentType<{ className?: string }>
  }>
  iconColor?: string
}

export function QuickActionEmptyState({
  icon: Icon,
  title,
  description,
  actions,
  iconColor = 'text-primary',
  className
}: QuickActionEmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-6 text-center', className)}>
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className={cn('h-8 w-8', iconColor)} />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-xs">
        {description}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-2 w-full max-w-sm">
        {actions.map((action, index) => {
          const ActionIcon = action.icon
          const buttonContent = (
            <>
              {ActionIcon && <ActionIcon className="h-4 w-4 mr-2" />}
              {action.text}
            </>
          )

          if (action.href) {
            return (
              <Link key={index} href={action.href} className="flex-1">
                <Button 
                  variant={action.variant || 'default'}
                  className="w-full"
                >
                  {buttonContent}
                </Button>
              </Link>
            )
          }

          return (
            <Button
              key={index}
              variant={action.variant || 'default'}
              onClick={action.onClick}
              className="flex-1"
            >
              {buttonContent}
            </Button>
          )
        })}
      </div>
    </div>
  )
}





