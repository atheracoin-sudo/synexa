'use client'

import { AppSidebar } from './AppSidebar'
import { AppTopbar } from './AppTopbar'
import { cn } from '@/lib/utils'
import { PremiumProvider } from '@/lib/context/PremiumContext'

interface AppShellProps {
  children: React.ReactNode
  className?: string
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <PremiumProvider>
      <div className={cn('h-screen flex bg-background', className)}>
        {/* Sidebar */}
        <AppSidebar />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col md:ml-0">
          {/* Topbar */}
          <AppTopbar />
          
          {/* Page content */}
          <main className="flex-1 overflow-auto">
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </PremiumProvider>
  )
}