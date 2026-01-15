'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  FolderIcon,
  ChatBubbleLeftIcon,
  CubeIcon,
  EyeIcon,
  HeartIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  CodeBracketIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'

const navigationItems = [
  { name: 'Projects', href: '/projects', icon: FolderIcon },
  { name: 'Chat', href: '/chat', icon: ChatBubbleLeftIcon },
  { name: 'Studio', href: '/studio', icon: CubeIcon },
  { name: 'Code', href: '/code', icon: CodeBracketIcon },
  { name: 'Preview', href: '/preview', icon: EyeIcon },
  { name: 'Deploy Health', href: '/health', icon: HeartIcon },
  { name: 'Templates', href: '/templates', icon: DocumentDuplicateIcon },
  { name: 'Billing', href: '/billing', icon: CreditCardIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

interface AppSidebarProps {
  className?: string
}

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-background border border-border shadow-sm"
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-64 transform bg-background border-r border-border transition-transform duration-200 ease-in-out',
          'md:translate-x-0 md:static md:z-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center px-6 border-b border-border">
            <h1 className="text-xl font-semibold text-foreground">Synexa</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Synexa AI Studio
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              v1.0.0
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}