'use client'

import { useEffect, useRef } from 'react'
import { Message } from '@/app/(app)/chat/page'
import { MessageBubble } from './MessageBubble'

interface MessagesListProps {
  messages: Message[]
}

// Helper function to determine if we should show a time group separator
function shouldShowTimeGroup(currentMessage: Message, prevMessage?: Message): boolean {
  if (!prevMessage) return true // Always show for first message
  
  const currentTime = currentMessage.timestamp.getTime()
  const prevTime = prevMessage.timestamp.getTime()
  const timeDiff = currentTime - prevTime
  
  // Show separator if more than 30 minutes apart
  return timeDiff > 30 * 60 * 1000
}

// Helper function to format time group label
function formatTimeGroup(timestamp: Date): string {
  const now = new Date()
  const messageDate = new Date(timestamp)
  
  // Check if it's today
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
  
  // Check if it's yesterday
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return `Dün ${messageDate.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`
  }
  
  // Show full date for older messages
  return messageDate.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function MessagesList({ messages }: MessagesListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-muted/60 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Sohbete başlayın
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Bir soru sorun veya yapmak istediğiniz şeyi açıklayın
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-4xl mx-auto py-4 space-y-2">
        {messages.map((message, index) => {
          const prevMessage = messages[index - 1]
          const showTimeGroup = shouldShowTimeGroup(message, prevMessage)
          
          return (
            <div key={message.id}>
              {showTimeGroup && (
                <div className="flex justify-center my-6">
                  <div className="text-xs text-[hsl(var(--chat-timestamp))] bg-muted/50 px-3 py-1.5 rounded-full border border-border/30">
                    {formatTimeGroup(message.timestamp)}
                  </div>
                </div>
              )}
              <MessageBubble message={message} />
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}