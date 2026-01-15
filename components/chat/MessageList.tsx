'use client'

import { useEffect, useRef, memo } from 'react'
import { Message, OnboardingData } from '@/lib/types'
import { MessageBubble } from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import { scrollToBottom, isNearBottom } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { IconButton } from '@/components/ui'
import { ChatEmptyState } from '@/components/empty-states/ChatEmptyState'
import { MemorySuggestion } from '@/components/memory/MemorySuggestion'
import { useMemory } from '@/lib/hooks/useMemory'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
  showScrollButton: boolean
  onScrollToBottom: () => void
  onCopy?: (content: string) => void
  onRegenerate?: (messageId: string) => void
  onThumbsUp?: (messageId: string) => void
  onThumbsDown?: (messageId: string) => void
  onConvertToApp?: (messageId: string, content: string) => void
  onboardingData?: OnboardingData | null
}


function MessageList({ 
  messages, 
  isLoading, 
  showScrollButton,
  onScrollToBottom,
  onCopy,
  onRegenerate,
  onThumbsUp,
  onThumbsDown,
  onConvertToApp,
  onboardingData
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { getPendingSuggestions, acceptSuggestion, rejectSuggestion } = useMemory()

  useEffect(() => {
    if (messagesEndRef.current && containerRef.current) {
      const container = containerRef.current
      if (isNearBottom(container) || messages.length <= 1) {
        scrollToBottom(container)
      }
    }
  }, [messages, isLoading])

  const handlePromptClick = (prompt: string) => {
    const event = new CustomEvent('example-prompt-click', { detail: prompt })
    window.dispatchEvent(event)
  }

  return (
    <div className="flex-1 relative h-full">
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto scrollbar-thin"
      >
        <div className="min-h-full flex flex-col">
          {messages.length === 0 ? (
            <ChatEmptyState onStartChat={() => {}} />
          ) : (
            <div className="flex-1">
              {messages.map((message, index) => (
              <MessageBubble 
                key={message.id}
                message={message}
              />
              ))}
              
              {isLoading && <TypingIndicator />}
              
              {/* Memory Suggestions */}
              {messages.length > 0 && (() => {
                const lastMessage = messages[messages.length - 1]
                if (lastMessage?.role === 'user') {
                  const suggestions = getPendingSuggestions(lastMessage.id)
                  return suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="px-4 py-2">
                      <MemorySuggestion
                        suggestion={suggestion}
                        onAccept={acceptSuggestion}
                        onReject={rejectSuggestion}
                      />
                    </div>
                  ))
                }
                return null
              })()}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
      
      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="absolute bottom-4 right-4">
          <IconButton
            aria-label="En alta in"
            variant="secondary"
            size="md"
            onClick={onScrollToBottom}
            className="shadow-lg border border-border"
          >
            <ChevronDown className="h-4 w-4" />
          </IconButton>
        </div>
      )}
    </div>
  )
}

export default memo(MessageList)
