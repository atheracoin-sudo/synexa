'use client'

import { ArrowLeft, Settings, MoreHorizontal, Sparkles, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconButton } from '@/components/ui'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { WhatsNewHeaderButton } from '@/components/changelog/WhatsNewButton'

interface GlobalHeaderProps {
  title: string
  showBack?: boolean
  showBackButton?: boolean
  backUrl?: string
  onBackPress?: () => void
  rightActions?: React.ReactNode
  className?: string
  variant?: 'default' | 'transparent' | 'blur'
}

export function GlobalHeader({
  title,
  showBack = false,
  showBackButton = false,
  backUrl,
  onBackPress,
  rightActions,
  className,
  variant = 'blur'
}: GlobalHeaderProps) {
  const shouldShowBack = showBack || showBackButton
  const headerVariants = {
    default: 'bg-background/95 border-b border-border',
    transparent: 'bg-transparent',
    blur: 'bg-background/80 backdrop-blur-md border-b border-border/50'
  }

  return (
    <header 
      className={cn(
        // Base styles
        'sticky top-0 z-50 w-full transition-all duration-200',
        // Height and padding (SafeArea compatible)
        'h-16 md:h-18 px-4 md:px-6',
        // Flex layout
        'flex items-center justify-between',
        // Variant styles
        headerVariants[variant],
        className
      )}
    >
      {/* Left Section */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {shouldShowBack && (
          <IconButton
            variant="ghost"
            size="sm"
            onClick={onBackPress || (() => backUrl && (window.location.href = backUrl))}
            className="shrink-0 -ml-2"
            aria-label="Geri"
          >
            <ArrowLeft className="h-5 w-5" />
          </IconButton>
        )}
        
        {/* App Logo/Icon (only show when no back button) */}
        {!showBackButton && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-premium">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Center Section - Title */}
      <div className="flex-1 flex justify-center min-w-0">
        <h1 className="text-lg md:text-xl font-semibold text-foreground truncate max-w-xs md:max-w-sm">
          {title}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
        {rightActions || (
          <div className="flex items-center gap-1">
            <WhatsNewHeaderButton userId="user_1" />
            <NotificationBell userId="user_1" />
            <IconButton
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={() => {
                // Open help modal instead of navigating
                const event = new CustomEvent('openGlobalHelp')
                window.dispatchEvent(event)
              }}
              aria-label="Help Center"
            >
              <HelpCircle className="h-5 w-5" />
            </IconButton>
            <IconButton
              variant="ghost"
              size="sm"
              className="shrink-0"
              aria-label="Ayarlar"
            >
              <Settings className="h-5 w-5" />
            </IconButton>
            <IconButton
              variant="ghost"
              size="sm"
              className="shrink-0"
              aria-label="Daha fazla"
            >
              <MoreHorizontal className="h-5 w-5" />
            </IconButton>
          </div>
        )}
      </div>
    </header>
  )
}

// Specialized header variants for different screens
export function ChatHeader({ onSettingsPress }: { onSettingsPress?: () => void }) {
  return (
    <GlobalHeader
      title="Nova Chat"
      rightActions={
        <IconButton
          variant="ghost"
          size="sm"
          onClick={onSettingsPress}
          aria-label="Chat Ayarları"
        >
          <Settings className="h-5 w-5" />
        </IconButton>
      }
    />
  )
}

export function StudioHeader({ 
  title, 
  showBack = false, 
  onBackPress 
}: { 
  title: string
  showBack?: boolean
  onBackPress?: () => void 
}) {
  return (
    <GlobalHeader
      title={title}
      showBackButton={showBack}
      onBackPress={onBackPress}
      rightActions={
        <div className="flex items-center gap-1">
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Ayarlar"
          >
            <Settings className="h-5 w-5" />
          </IconButton>
        </div>
      }
    />
  )
}

export function ProfileHeader() {
  return (
    <GlobalHeader
      title="Profile"
      rightActions={
        <IconButton
          variant="ghost"
          size="sm"
          aria-label="Ayarlar"
        >
          <Settings className="h-5 w-5" />
        </IconButton>
      }
    />
  )
}
