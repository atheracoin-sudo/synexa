import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ToastProvider } from '@/components/ui/toast'
import { AppProvider } from '@/lib/context/AppContext'
import { HelpProvider } from '@/components/providers/HelpProvider'
import { SmartReminderTrigger } from '@/components/notifications/SmartReminderTrigger'
import ChangelogUpdateTrigger from '@/components/changelog/ChangelogUpdateTrigger'
import { BottomTabBar } from '@/components/ui/bottom-tab-bar'
// import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Synexa - AI Studio',
  description: 'All-in-one AI Studio: Chat, Code, Design',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // For iPhone notch/safe area
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full antialiased bg-background text-foreground`}>
        <ThemeProvider>
          <AppProvider>
            <ToastProvider>
              <HelpProvider>
                <SmartReminderTrigger userId="user_1" />
                <ChangelogUpdateTrigger userId="user_1" />
                
                {/* Main content with bottom padding for mobile navigation */}
                <div className="min-h-full pb-24 md:pb-0">
                  {children}
                </div>
                
                {/* Mobile bottom navigation - hidden on desktop */}
                <div className="md:hidden">
                  <BottomTabBar />
                </div>
              </HelpProvider>
            </ToastProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
