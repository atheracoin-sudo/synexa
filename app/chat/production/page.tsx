'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Plus, MessageSquare, MoreVertical, Pin, Archive, Trash2, Edit3, Search } from 'lucide-react'
import { GlobalHeader } from '@/components/ui/global-header'
import { BottomTabBar } from '@/components/ui/bottom-tab-bar'
import { ChatMessage } from '@/components/chat/ChatMessage'
import { LoadingSpinner, EmptyState } from '@/components/ui/loading-states'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { ChatAPI, ChatConversation, ChatMessage as ChatMessageType, streamChatResponse } from '@/lib/api/chat'
import { useApp } from '@/lib/context/AppContext'

export default function ProductionChatPage() {
  const { state, actions } = useApp()
  const { toast } = useToast()
  
  // Chat state
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

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

      // Create abort controller for this request
      abortControllerRef.current = new AbortController()

      // Stream the response
      const stream = streamChatResponse(userMessage, activeConversation?.id)
      
      for await (const chunk of stream) {
        if (abortControllerRef.current?.signal.aborted) {
          break
        }
        
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
          
          setIsStreaming(false)
          setStreamingContent('')
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
    }
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

  const handleConversationAction = async (conversationId: string, action: 'pin' | 'archive' | 'delete' | 'rename') => {
    try {
      switch (action) {
        case 'pin':
          await ChatAPI.updateConversation(conversationId, { pinned: true })
          break
        case 'archive':
          await ChatAPI.updateConversation(conversationId, { archived: true })
          break
        case 'delete':
          await ChatAPI.deleteConversation(conversationId)
          if (activeConversation?.id === conversationId) {
            setActiveConversation(null)
          }
          break
        case 'rename':
          const newTitle = prompt('Enter new title:')
          if (newTitle) {
            await ChatAPI.updateConversation(conversationId, { title: newTitle })
          }
          break
      }
      
      loadConversations()
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} conversation`,
        variant: 'destructive'
      })
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={cn(
        'w-80 bg-card border-r border-border flex flex-col transition-all duration-200',
        showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Conversations</h2>
            <button
              onClick={handleNewConversation}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={cn(
                    'p-3 rounded-lg cursor-pointer transition-colors group',
                    activeConversation?.id === conversation.id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-muted'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm text-foreground truncate">
                          {conversation.title}
                        </h3>
                        {conversation.pinned && (
                          <Pin className="w-3 h-3 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {conversation.messages[conversation.messages.length - 1]?.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(conversation.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // Show context menu
                        }}
                        className="p-1 hover:bg-muted rounded"
                      >
                        <MoreVertical className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <GlobalHeader
          title={activeConversation?.title || 'New Chat'}
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
              title="Start a new conversation"
              description="Ask me anything or choose from the suggestions below"
              action={
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => setMessage('Help me build a todo app')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
                  >
                    Build a todo app
                  </button>
                  <button
                    onClick={() => setMessage('Design a logo for my startup')}
                    className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-muted/80 transition-colors"
                  >
                    Design a logo
                  </button>
                  <button
                    onClick={() => setMessage('Explain machine learning')}
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
                  onRegenerate={() => {
                    // Implement regenerate
                  }}
                  onCopy={() => {
                    toast({
                      title: 'Copied',
                      description: 'Message copied to clipboard'
                    })
                  }}
                  onFeedback={(type) => {
                    toast({
                      title: 'Feedback received',
                      description: `Thank you for your ${type === 'like' ? 'positive' : 'negative'} feedback`
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

        {/* Input Area */}
        <div className="border-t border-border p-4">
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

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}








