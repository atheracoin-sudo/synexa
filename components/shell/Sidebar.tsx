'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  MessageSquare, 
  Code2, 
  Palette, 
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconButton } from '@/components/ui'
import { Tooltip } from '@/components/ui/Tooltip'
// import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  {
    name: 'Chat',
    href: '/chat',
    icon: MessageSquare,
    description: 'AI Sohbet'
  },
  {
    name: 'Code',
    href: '/code',
    icon: Code2,
    description: 'Kod Editörü'
  },
  {
    name: 'Design',
    href: '/design',
    icon: Palette,
    description: 'Tasarım Stüdyosu'
  }
]

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  // Close mobile sidebar on route change
  useEffect(() => {
    onMobileClose?.()
  }, [pathname, onMobileClose])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        onMobileClose?.()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [mobileOpen, onMobileClose])

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold text-foreground">Synexa</span>
          </div>
        )}
        
        {/* Desktop collapse button */}
        <div className="hidden md:block">
          <IconButton
            aria-label={collapsed ? 'Genişlet' : 'Daralt'}
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </IconButton>
        </div>

        {/* Mobile close button */}
        <div className="md:hidden">
          <IconButton
            aria-label="Menüyü kapat"
            variant="ghost"
            size="sm"
            onClick={onMobileClose}
          >
            <X className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <Icon className={cn(
                  'h-5 w-5 flex-shrink-0 transition-transform duration-200',
                  !isActive && 'group-hover:scale-110'
                )} />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">
                      {item.name}
                    </div>
                    <div className={cn(
                      'text-xs truncate',
                      isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      {item.description}
                    </div>
                  </div>
                )}
              </Link>
            )

            return collapsed ? (
              <Tooltip key={item.name} content={item.name} side="right">
                {linkContent}
              </Tooltip>
            ) : (
              <div key={item.name}>{linkContent}</div>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <div className="font-medium text-foreground/80">Synexa Studio</div>
            <div className="mt-0.5">All-in-one AI Studio</div>
          </div>
        </div>
      )}
    </>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-200"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-card border-r border-border md:hidden',
          'transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
