'use client'

import { ConversationList } from '@/components/chat/ConversationList'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* Desktop: Side-by-side layout */}
      <div className="hidden md:flex w-full">
        {/* Conversation List - Left Sidebar */}
        <div className="w-80 flex-shrink-0">
          <ConversationList />
        </div>
        
        {/* Chat View - Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>

      {/* Mobile: Full-width chat (conversation list accessible via modal/drawer) */}
      <div className="md:hidden w-full">
        {children}
      </div>
    </div>
  )
}






