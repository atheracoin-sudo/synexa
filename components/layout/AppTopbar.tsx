'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  ChevronDownIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  UserCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

interface AppTopbarProps {
  className?: string
}

export function AppTopbar({ className }: AppTopbarProps) {
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [environment, setEnvironment] = useState<'Local' | 'Vercel'>('Local')

  return (
    <header
      className={cn(
        'h-16 bg-background border-b border-border flex items-center justify-between px-6',
        className
      )}
    >
      {/* Left section - Project dropdown */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
          >
            <span>Select Project</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>

          {/* Project dropdown */}
          {isProjectDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-80 bg-background border border-border rounded-md shadow-lg z-50">
              <div className="p-4">
                <div className="text-center py-8">
                  <div className="text-muted-foreground text-sm mb-2">
                    Henüz proje yok. Template ile başla veya sıfırdan oluştur.
                  </div>
                  <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Yeni Proje
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right section - Environment, Share, Export, Profile */}
      <div className="flex items-center space-x-4">
        {/* Environment toggle */}
        <div className="flex items-center bg-muted rounded-md p-1">
          <button
            onClick={() => setEnvironment('Local')}
            className={cn(
              'px-3 py-1 text-sm font-medium rounded transition-colors',
              environment === 'Local'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Local
          </button>
          <button
            onClick={() => setEnvironment('Vercel')}
            className={cn(
              'px-3 py-1 text-sm font-medium rounded transition-colors',
              environment === 'Vercel'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Vercel
          </button>
        </div>

        {/* Share button */}
        <button className="flex items-center px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors">
          <ShareIcon className="h-4 w-4 mr-2" />
          Share
        </button>

        {/* Export button */}
        <button className="flex items-center px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors">
          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
          Export
        </button>

        {/* Profile menu */}
        <div className="relative">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
          >
            <UserCircleIcon className="h-6 w-6" />
            <ChevronDownIcon className="h-4 w-4" />
          </button>

          {/* Profile dropdown */}
          {isProfileDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-background border border-border rounded-md shadow-lg z-50">
              <div className="py-1">
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  Profile
                </a>
                <a
                  href="/settings"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  Settings
                </a>
                <div className="border-t border-border my-1" />
                <button className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside handlers */}
      {(isProjectDropdownOpen || isProfileDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProjectDropdownOpen(false)
            setIsProfileDropdownOpen(false)
          }}
        />
      )}
    </header>
  )
}