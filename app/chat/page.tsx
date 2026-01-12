'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Plus, MessageSquare, Search } from 'lucide-react'
import { GlobalHeader } from '@/components/ui/global-header'
import { ChatMessage } from '@/components/chat/ChatMessage'
import { ConversationSidebar } from '@/components/chat/ConversationSidebar'
import { LoadingSpinner, EmptyState } from '@/components/ui/loading-states'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { ChatAPI, ChatConversation, ChatMessage as ChatMessageType, streamChatResponse } from '@/lib/api/chat'
import { useApp } from '@/lib/context/AppContext'
import { LimitReachedModal } from '@/components/usage/LimitReachedModal'
import { betaMetrics } from '@/lib/analytics/betaMetrics'
import { getUserPlanLimits } from '@/lib/config'

export default function ChatPage() {
  const { state, actions } = useApp()
  // Use toast function directly
  
  // Chat state
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [lastFailedMessage, setLastFailedMessage] = useState<string>('')
  const [retryCount, setRetryCount] = useState(0)
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom()
  }, [activeConversation?.messages, streamingContent])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const loadConversations = async () => {
    try {
      const convs = await ChatAPI.getConversations()
      setConversations(convs)
      
      // Set first conversation as active if none selected
      if (!activeConversation && convs.length > 0) {
        setActiveConversation(convs[0])
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load conversations',
        variant: 'destructive'
      })
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    // Check usage limits
    const user = state.user
    if (user && user.plan === 'free') {
      const limits = getUserPlanLimits(user.plan)
      if (user.usage.chatMessages >= limits.chatMessages) {
        setShowLimitModal(true)
        return
      }
    }

    const userMessage = message.trim()
    setMessage('')
    setIsLoading(true)
    setIsStreaming(true)
    setStreamingContent('')

    try {
      // Check usage limits
      if (state.user && state.user.usage.chatMessages >= 50 && state.user.plan === 'free') {
        toast({
          title: 'Usage Limit Reached',
          description: 'Upgrade to Premium for unlimited chat messages',
          variant: 'destructive'
        })
        setIsLoading(false)
        setIsStreaming(false)
        return
      }

      // Stream the response
      const stream = streamChatResponse(userMessage, activeConversation?.id)
      
      for await (const chunk of stream) {
        setStreamingContent(chunk.content)
        
        if (chunk.done) {
          // Save the complete conversation
          const response = await ChatAPI.sendMessage(userMessage, activeConversation?.id)
          
          // Update active conversation
          setActiveConversation(response.conversation)
          
          // Update conversations list
          setConversations(prev => {
            const updated = prev.filter(c => c.id !== response.conversation.id)
            return [response.conversation, ...updated]
          })
          
          // Update usage
          actions.incrementUsage('chatMessages')
          
          // Track beta metrics
          if (state.user) {
            betaMetrics.trackFirstDayChat(state.user.id)
            betaMetrics.trackFeatureUsage(state.user.id, 'chat', 'message_sent')
          }
          
          setIsStreaming(false)
          setStreamingContent('')
        }
      }
    } catch (error: any) {
      console.error('Chat error:', error)
      setLastFailedMessage(userMessage)
      
      // Determine error message based on error type
      let errorMessage = 'Failed to send message. Please try again.'
      let showRetry = true
      
      if (error?.message?.includes('network') || error?.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Check your connection and try again.'
      } else if (error?.code === 'RATE_LIMITED') {
        errorMessage = 'Too many requests. Please wait a moment and try again.'
        showRetry = false
      } else if (error?.code === 'SERVICE_UNAVAILABLE') {
        errorMessage = 'AI service is temporarily unavailable. Please try again later.'
      }
      
      toast({
        title: 'Message Failed',
        description: errorMessage,
        variant: 'destructive',
        action: showRetry ? (
          <button
            onClick={() => handleRetryMessage()}
            className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
          >
            Retry
          </button>
        ) : undefined
      })
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  const handleRetryMessage = async () => {
    if (!lastFailedMessage || retryCount >= 3) return
    
    setMessage(lastFailedMessage)
    setRetryCount(prev => prev + 1)
    
    // Wait a bit before retrying
    setTimeout(() => {
      handleSendMessage()
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNewConversation = () => {
    setActiveConversation(null)
    setShowSidebar(false)
  }

  const handleSelectConversation = (conversation: ChatConversation) => {
    setActiveConversation(conversation)
    setShowSidebar(false)
  }

  const handleDeleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId))
    if (activeConversation?.id === conversationId) {
      setActiveConversation(null)
    }
  }

  const handleRenameConversation = (conversationId: string, newTitle: string) => {
    setConversations(prev => 
      prev.map(c => 
        c.id === conversationId 
          ? { ...c, title: newTitle, updatedAt: new Date().toISOString() }
          : c
      )
    )
    if (activeConversation?.id === conversationId) {
      setActiveConversation(prev => prev ? { ...prev, title: newTitle } : null)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Mobile Hidden by Default */}
      <div className={cn(
        'w-80 transition-all duration-200 hidden md:block',
        showSidebar && 'block'
      )}>
        <ConversationSidebar
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
          className="h-full"
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <GlobalHeader
          title={activeConversation?.title || 'Chat'}
          rightActions={
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          }
        />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {!activeConversation ? (
            <EmptyState
              icon={MessageSquare}
              title="Start a conversation"
              description="Ask me anything to get started"
              action={
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => setMessage('Help me build a todo app')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
                  >
                    Build an app
                  </button>
                  <button
                    onClick={() => setMessage('Design a logo for my startup')}
                    className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-muted/80 transition-colors"
                  >
                    Create design
                  </button>
                  <button
                    onClick={() => setMessage('Explain how AI works')}
                    className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-muted/80 transition-colors"
                  >
                    Learn about AI
                  </button>
                </div>
              }
            />
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {activeConversation.messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onCopy={() => {
                    toast({
                      title: 'Copied',
                      description: 'Message copied to clipboard'
                    })
                  }}
                  onFeedback={(type) => {
                    toast({
                      title: 'Thanks for feedback!',
                      description: `Your ${type} helps us improve`
                    })
                  }}
                />
              ))}
              
              {/* Streaming Message */}
              {isStreaming && streamingContent && (
                <div className="flex gap-4 p-4 rounded-2xl bg-card mr-8">
                  <div className="w-8 h-8 rounded-xl bg-gradient-primary text-white flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium">AI</span>
                  </div>
                  <div className="flex-1">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                        {streamingContent}
                        <span className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse" />
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area - Fixed at bottom with safe area */}
        <div className="sticky bottom-0 border-t border-border bg-background/80 backdrop-blur-md p-4 pb-safe-area-inset-bottom z-40">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 pr-12 bg-muted border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary min-h-[52px] max-h-32"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className={cn(
                    'absolute right-2 bottom-2 p-2 rounded-xl transition-colors',
                    message.trim() && !isLoading
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted-foreground/20 text-muted-foreground cursor-not-allowed'
                  )}
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Usage indicator */}
            {state.user && (
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>
                  {state.user.usage.chatMessages}/50 messages used
                </span>
                {state.user.plan === 'free' && state.user.usage.chatMessages > 40 && (
                  <button
                    onClick={() => window.open('/pricing', '_blank')}
                    className="text-primary hover:underline"
                  >
                    Upgrade for unlimited
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Limit Reached Modal */}
      <LimitReachedModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        limitType="chat"
      />
    </div>
  )
}
