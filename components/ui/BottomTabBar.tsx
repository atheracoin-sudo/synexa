'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  MessageSquare, 
  Plus, 
  FolderOpen, 
  User,
  Sparkles,
  Store
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CreateStudioModal } from './CreateStudioModal'

const tabs = [
  {
    id: 'home',
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    id: 'chat',
    name: 'Chat',
    href: '/chat',
    icon: MessageSquare,
  },
  {
    id: 'create',
    name: 'Create',
    href: '/create',
    icon: Plus,
    special: true, // Special styling for create button
  },
  {
    id: 'marketplace',
    name: 'Market',
    href: '/marketplace',
    icon: Store,
  },
  {
    id: 'profile',
    name: 'Profile',
    href: '/profile',
    icon: User,
  },
]

interface BottomTabBarProps {
  className?: string
}

export function BottomTabBar({ className }: BottomTabBarProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  const handleCreateClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsCreateModalOpen(true)
  }

  const handleStudioSelect = (studio: string) => {
    setIsCreateModalOpen(false)
    // Navigation will be handled by the modal
  }

  const getActiveTab = () => {
    // Handle studio routes
    if (pathname.startsWith('/chat')) return 'chat'
    if (pathname.startsWith('/code') || pathname.startsWith('/design')) return 'create'
    if (pathname.startsWith('/library')) return 'library'
    if (pathname.startsWith('/profile')) return 'profile'
    return 'home'
  }

  const activeTab = getActiveTab()

  return (
    <div 
      className={cn(
        // Base container
        'fixed bottom-0 left-0 right-0 z-50',
        // Safe area padding for mobile devices
        'pb-safe-area-inset-bottom',
        className
      )}
    >
      {/* Tab bar background with blur effect */}
      <div className="bg-background/80 backdrop-blur-md border-t border-border/50">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon

            // Special styling for create button
            if (tab.special) {
              return (
                <button
                  key={tab.id}
                  onClick={handleCreateClick}
                  className={cn(
                    // Base create button styles
                    'flex flex-col items-center justify-center',
                    'w-14 h-14 rounded-2xl',
                    'bg-gradient-primary shadow-premium',
                    'transition-all duration-200',
                    // Active/hover states
                    'hover:scale-105 active:scale-95',
                    // Focus styles
                    'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2'
                  )}
                  aria-label={tab.name}
                >
                  <Icon className="h-6 w-6 text-white" />
                </button>
              )
            }

            // Regular tab styling
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  // Base tab styles - optimized for thumb reach
                  'flex flex-col items-center justify-center',
                  'min-w-[64px] min-h-[48px] py-2 px-3 rounded-xl',
                  'transition-all duration-200',
                  // Active/inactive states
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                  // Hover and focus states
                  'hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50',
                  // Active scale animation
                  isActive && 'scale-105',
                  // Touch optimization
                  'touch-manipulation'
                )}
                aria-label={tab.name}
              >
                <div className="relative">
                  <Icon 
                    className={cn(
                      'h-6 w-6 transition-all duration-200',
                      isActive && 'scale-110'
                    )} 
                  />
                  
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
                
                <span 
                  className={cn(
                    'text-xs font-medium mt-1 transition-all duration-200',
                    isActive ? 'opacity-100' : 'opacity-70'
                  )}
                >
                  {tab.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Create Studio Modal */}
      <CreateStudioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSelect={handleStudioSelect}
      />
    </div>
  )
}

// Hook to get current tab info
export function useActiveTab() {
  const pathname = usePathname()
  
  const getActiveTab = () => {
    if (pathname.startsWith('/chat')) return tabs.find(t => t.id === 'chat')
    if (pathname.startsWith('/code') || pathname.startsWith('/design')) return tabs.find(t => t.id === 'create')
    if (pathname.startsWith('/library')) return tabs.find(t => t.id === 'library')
    if (pathname.startsWith('/profile')) return tabs.find(t => t.id === 'profile')
    return tabs.find(t => t.id === 'home')
  }

  return getActiveTab()
}
