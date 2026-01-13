'use client'

import { useState, useCallback, useRef, useEffect, memo } from 'react'
import dynamic from 'next/dynamic'
import { Message } from '@/lib/types'
import { generateId, isNearBottom, cn } from '@/lib/utils'
import MessageList from './MessageList'
import Composer from './Composer'
import ErrorMessage from './ErrorMessage'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/hooks/useAuth'
import { useWorkspaces } from '@/lib/hooks/useWorkspaces'
import { useSync } from '@/lib/hooks/useSync'
import { useOnboarding } from '@/lib/hooks/useOnboarding'
import { usePremium } from '@/lib/hooks/usePremium'
import { useMemory } from '@/lib/hooks/useMemory'
import { useAgents } from '@/lib/hooks/useAgents'
import { AgentSelector } from '@/components/agents/AgentSelector'
import { SmartUsageBanner } from '@/components/premium/UsageTease'
import { PremiumBadge } from '@/components/premium/PremiumBadge'
import { MemorySuggestion } from '@/components/memory/MemorySuggestion'
import { SystemStatus } from '@/components/ui/system-status'
import { PoweredBy } from '@/components/ui/powered-by'
import { ProductionErrorModal } from '@/components/ui/production-error-modal'
import { GracefulFallback } from '@/components/chat/GracefulFallback'
import { CodeStudioContextModal, CodeStudioContext } from '@/components/chat/CodeStudioContextModal'
import { usePageTips } from '@/lib/hooks/useTips'
import InlineTip, { WelcomeTip } from '@/components/tips/InlineTip'
import AICoachingPanel from '@/components/tips/AICoachingPanel'
import ContextHelp from '@/components/help/ContextHelp'
import ProgressCoaching from '@/components/tips/ProgressCoaching'
import { useAchievements } from '@/lib/hooks/useAchievements'
import AchievementUnlockModal from '@/components/achievements/achievement-unlock-modal'
import { RotateCcw, Settings, Plus } from 'lucide-react'
import { analyticsManager } from '@/lib/analytics'
import { SyncStatus } from '@/components/ui/sync-status'
// import { TypingIndicator } from '@/components/ui/LoadingSpinner'
// import { FadeIn, AnimatedList } from '@/components/ui/FadeIn'
import { Button } from '@/components/ui/button'
import { GlobalHeader } from '@/components/ui/global-header'
import { BottomTabBar } from '@/components/ui/bottom-tab-bar'

// Debug state type
interface DebugInfo {
  lastApiStatus: number | null
  lastErrorCode: string | null
  lastLatencyMs: number | null
  apiHealthy: boolean | null
  hasApiKey: boolean | null
}

function ChatView() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [showProductionError, setShowProductionError] = useState(false)
  const [isRetryingError, setIsRetryingError] = useState(false)
  
  // Tips integration
  const { inlineTips, dismissTip, completeTipAction } = usePageTips('chat')
  
  // Achievements integration
  const { trackAction, currentUnlock, showUnlockModal, closeUnlockModal } = useAchievements()
  const [showCodeStudioModal, setShowCodeStudioModal] = useState(false)
  const [selectedMessageForCode, setSelectedMessageForCode] = useState<Message | null>(null)
  const [mounted, setMounted] = useState(false)
  const { canPerformAction, incrementUsage, getRemainingUsage, isPremium } = usePremium()
  const { 
    detectMemoryFromMessage, 
    getPendingSuggestions, 
    acceptSuggestion, 
    rejectSuggestion,
    parseRememberCommand,
    addMemory,
    getMemoryPromptContext
  } = useMemory()
  const { getCurrentSystemPrompt, updateAgentMemory, currentAgent } = useAgents()

  // New chat handler
  const handleNewChat = useCallback(() => {
    setMessages([])
    setError(null)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])
  const abortControllerRef = useRef<AbortController | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const lastUserMessageRef = useRef<string | null>(null)
  const { toast } = useToast()
  
  // Auth and workspace hooks (only on client)
  const { isAuthenticated, user, login, isLoading: authLoading } = useAuth()
  const { isOnline } = useSync()
  const { activeWorkspaceId, workspaces, createWorkspace } = useWorkspaces()
  const { onboardingData } = useOnboarding()

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Debug state (only in development)
  const [debug, setDebug] = useState<DebugInfo>({
    lastApiStatus: null,
    lastErrorCode: null,
    lastLatencyMs: null,
    apiHealthy: null,
    hasApiKey: null,
  })
  const isDev = process.env.NODE_ENV === 'development'

  // Check API health on mount
  useEffect(() => {
    if (!isDev) return
    
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setDebug(prev => ({
          ...prev,
          apiHealthy: data.backend?.healthy || false,
          hasApiKey: data.backend?.healthy || false, // Backend has the key
          backendStatus: data.backend?.healthy ? 'OK' : 'FAIL',
          backendError: data.backend?.error,
        }))
      })
      .catch(err => {
        console.error('Health check failed:', err)
        setDebug(prev => ({
          ...prev,
          apiHealthy: false,
        }))
      })
  }, [isDev])

  // Load messages from localStorage on mount (client-side only)
  useEffect(() => {
    if (!mounted) return // Wait for client-side mount
    
    const savedMessages = localStorage.getItem('synexa-chat-messages')
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          createdAt: new Date(msg.createdAt)
        })))
      } catch (error) {
        console.error('Failed to load saved messages:', error)
      }
    }
  }, [mounted])

  // Save messages to localStorage (client-side only)
  useEffect(() => {
    if (!mounted || messages.length === 0) return
    
    localStorage.setItem('synexa-chat-messages', JSON.stringify(messages))
  }, [messages, mounted])

  // Monitor scroll position
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      setShowScrollButton(!isNearBottom(container, 100))
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // Listen for new chat action from topbar
  useEffect(() => {
    const handleNewChat = () => {
      setMessages([])
      setError(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('synexa-chat-messages')
      }
      toast({
        type: 'success',
        title: 'Yeni sohbet başlatıldı',
      })
    }

    window.addEventListener('studio-action:new-chat', handleNewChat)
    return () => window.removeEventListener('studio-action:new-chat', handleNewChat)
  }, [toast])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+N for new chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('studio-action:new-chat'))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle authentication
  const handleLogin = async () => {
    const result = await login()
    if (result.success) {
      // analyticsManager.userLogin('demo')
      toast({
        type: 'success',
        title: 'Giriş başarılı',
      })
    } else {
      // analyticsManager.error('login_failed', result.error || 'Unknown error', 'ChatView')
      toast({
        type: 'error',
        title: 'Giriş başarısız',
        description: result.error,
      })
    }
  }

  // Auto-create workspace if none exists
  useEffect(() => {
    if (isAuthenticated && Array.isArray(workspaces) && workspaces.length === 0) {
      createWorkspace('Ana Çalışma Alanı')
    }
  }, [isAuthenticated, workspaces, createWorkspace])

  const handleSendMessage = useCallback(async (content: string) => {
    // Check authentication first
    if (!isAuthenticated) {
      setError('Mesaj göndermek için giriş yapmanız gerekiyor.')
      return
    }

    // Handle /remember command
    if (content.trim().startsWith('/remember')) {
      const memoryData = parseRememberCommand(content.trim())
      if (memoryData) {
        addMemory(memoryData.category, memoryData.title, memoryData.value, 'command')
        toast({
          type: 'success',
          title: 'Bu tercih kaydedildi! 💾',
          duration: 3000,
        })
        return
      } else {
        setError('Geçersiz /remember komutu. Örnek: /remember React kullanıyorum')
        return
      }
    }

    // Check if user can send messages (usage limit)
    if (!canPerformAction('chatMessages')) {
      const remaining = getRemainingUsage('chatMessages')
      setError(`Günlük mesaj limitinize ulaştınız. ${remaining === 0 ? 'Premium ile sınırsız mesaj gönderebilirsiniz.' : `${remaining} mesaj hakkınız kaldı.`}`)
      return
    }
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      createdAt: new Date(),
    }

    lastUserMessageRef.current = content
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)
    
    // Reset debug info
    setDebug(prev => ({
      ...prev,
      lastApiStatus: null,
      lastErrorCode: null,
      lastLatencyMs: null,
    }))

    // Create abort controller for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController
    
    const startTime = Date.now()

    try {
      // Real API call to backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          memoryContext: getMemoryPromptContext(), // Add memory context for AI
          stream: true // Enable streaming for production experience
        }),
        signal: abortController.signal
      })

      const latency = Date.now() - startTime

      // Update debug info
      setDebug(prev => ({
        ...prev,
        lastApiStatus: response.status,
        lastLatencyMs: latency,
        lastErrorCode: null,
      }))

      if (!response.ok) {
        // Handle API errors gracefully
        let errorMessage = 'AI service is temporarily unavailable. Please try again in a moment.'
        
        try {
          const errorData = await response.json()
          if (errorData.error?.message) {
            errorMessage = errorData.error.message
          }
        } catch (e) {
          // Use default message if can't parse error
        }
        
        throw new Error(errorMessage)
      }

      // Handle streaming response
      if (response.headers.get('content-type')?.includes('text/event-stream')) {
        // Create assistant message for streaming
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: '',
          createdAt: new Date(),
        }
        
        // Add assistant message to UI immediately
        setMessages(prev => [...prev, assistantMessage])
        
        // Process streaming response
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let fullContent = ''
        
        if (reader) {
          try {
            while (true) {
              const { done, value } = await reader.read()
              
              if (done) break
              
              const chunk = decoder.decode(value)
              const lines = chunk.split('\n')
              
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  try {
                    const data = JSON.parse(line.slice(6))
                    
                    if (data.error) {
                      throw new Error(data.error.message || 'Stream error')
                    }
                    
                    if (data.content) {
                      fullContent += data.content
                      
                      // Update message content in real-time
                      setMessages(prev => prev.map(msg => 
                        msg.id === assistantMessage.id 
                          ? { ...msg, content: fullContent }
                          : msg
                      ))
                    }
                    
                    if (data.done) {
                      break
                    }
                  } catch (e) {
                    // Skip invalid JSON lines
                  }
                }
              }
            }
          } finally {
            reader.releaseLock()
          }
        }
        
        // Detect memory from user message
        detectMemoryFromMessage(userMessage.content, userMessage.id)
        
        // Increment usage count
        incrementUsage('chatMessages')
        
        // Track achievement
        trackAction('send_chat_message')
        
        setIsLoading(false)
        return
      }

      // Handle non-streaming response (fallback)
      const data = await response.json()
      
      // Check if response has error
      if (data.error) {
        throw new Error(data.error.message || data.error || 'API Error')
      }
      
      // Handle different response formats
      let responseContent = ''
      if (data.success && data.response) {
        responseContent = data.response
      } else if (data.content) {
        responseContent = data.content
      } else if (typeof data === 'string') {
        responseContent = data
      } else {
        throw new Error('Invalid response format from API')
      }

      // Successful response
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: responseContent,
        createdAt: new Date(),
      }
      
      // Track analytics
      // analyticsManager.chatMessage(
      //   userMessage.content.length,
      //   latency
      // )
      
      // Increment usage count
      incrementUsage('chatMessages')
      
      // Detect memory from user message
      detectMemoryFromMessage(userMessage.content, userMessage.id)
      
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
      return
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was aborted, don't show error
        toast({
          type: 'info',
          title: 'Yanıt durduruldu',
        })
        return
      }
      
      console.error('Chat error:', error)
      
      // Production error handling - show graceful fallback instead of technical errors
      // Add graceful fallback message to chat
      const fallbackMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '', // Empty content, will be handled by GracefulFallback component
        createdAt: new Date(),
        isError: true, // Flag to identify error messages
      }
      
      setMessages(prev => [...prev, fallbackMessage])
      
      // Also show production error modal for critical errors
      if (error instanceof Error) {
        if (error.message.includes('SERVICE_UNAVAILABLE') || 
            error.message.includes('503') ||
            error.message.includes('API_KEY_MISSING')) {
          setShowProductionError(true)
        }
      }
      
      setDebug(prev => ({
        ...prev,
        lastLatencyMs: Date.now() - startTime,
      }))
      
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [messages, toast, isAuthenticated, activeWorkspaceId])

  const handleStopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
    }
  }, [])

  const handleScrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [])

  const handleRetry = useCallback(() => {
    const lastContent = lastUserMessageRef.current
    if (lastContent) {
      // Remove any assistant messages after the last user message
      const lastUserIndex = [...messages].reverse().findIndex(msg => msg.role === 'user')
      if (lastUserIndex !== -1) {
        const actualIndex = messages.length - 1 - lastUserIndex
        setMessages(prev => prev.slice(0, actualIndex))
      }
      setError(null)
      handleSendMessage(lastContent)
    }
  }, [messages, handleSendMessage])

  const handleDismissError = useCallback(() => {
    setError(null)
  }, [])

  // Message actions
  const handleCopy = useCallback((content: string) => {
    toast({
      type: 'success',
      title: 'Mesaj kopyalandı!'
    })
  }, [toast])

  const handleRegenerate = useCallback((messageId: string) => {
    // Find the message and regenerate response
    const messageIndex = messages.findIndex(m => m.id === messageId)
    if (messageIndex > 0) {
      const userMessage = messages[messageIndex - 1]
      if (userMessage && userMessage.role === 'user') {
        // Remove the assistant message and regenerate
        setMessages(prev => prev.slice(0, messageIndex))
        handleSendMessage(userMessage.content)
      }
    }
  }, [messages, handleSendMessage])

  const handleThumbsUp = useCallback((messageId: string) => {
    toast({
      type: 'success',
      title: 'Geri bildirim için teşekkürler! 👍'
    })
    // Here you could send feedback to analytics
    // analyticsManager.messageFeedback(messageId, 'positive')
  }, [toast])

  const handleThumbsDown = useCallback((messageId: string) => {
    toast({
      type: 'info',
      title: 'Geri bildirim için teşekkürler! Daha iyi olmaya çalışacağız. 👎'
    })
    // Here you could send feedback to analytics
    // analyticsManager.messageFeedback(messageId, 'negative')
  }, [toast])

  const handleConvertToApp = useCallback((messageId: string, content: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message) {
      setSelectedMessageForCode(message)
      setShowCodeStudioModal(true)
    }
  }, [messages])

  const handleCodeStudioConfirm = useCallback((context: CodeStudioContext) => {
    // Store context in localStorage for Code Studio to pick up
    const codeStudioContext = {
      targetMessage: context.targetMessage,
      recentMessages: context.includeRecentMessages ? context.recentMessages : [],
      memory: context.includeMemory ? getMemoryPromptContext() : '',
      appType: context.appType,
      timestamp: Date.now(),
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('synexa_code_studio_context', JSON.stringify(codeStudioContext))
    }
    
    // Navigate to Code Studio
    window.open('/code', '_blank')
    
    // Show success toast
    toast({
      type: 'success',
      title: 'Code Studio açılıyor... 🚀',
      duration: 2000,
    })
  }, [getMemoryPromptContext, toast])

  // Show loading screen during SSR or initial mount
  if (!mounted) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Yükleniyor...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show login screen if not authenticated
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Synexa AI Studio</h2>
            <p className="text-muted-foreground mb-6">
              AI destekli sohbet için giriş yapın
            </p>
            <Button 
              onClick={handleLogin}
              className="w-full"
              size="lg"
            >
              Giriş Yap
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show loading screen during auth
  if (authLoading) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Kimlik doğrulanıyor...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <GlobalHeader 
        title="AI Chat" 
        variant="blur"
        rightActions={
          <div className="flex items-center gap-2">
            {isPremium && <PremiumBadge variant="crown" size="sm" />}
            <button 
              onClick={handleNewChat}
              className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
              aria-label="New Chat"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        }
      />

      {/* Main Content */}
      <main className="px-4 pb-24 pt-6">
        <div className="max-w-4xl mx-auto">
          {/* Chat Header Card */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-premium">
                {currentAgent ? (
                  <span className="text-2xl">{currentAgent.icon}</span>
                ) : (
                  <span className="text-lg font-bold text-white">S</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold text-foreground">
                    {currentAgent ? currentAgent.name : 'Synexa AI Chat'}
                  </h1>
                  {isPremium && <PremiumBadge variant="crown" size="sm" />}
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentAgent ? currentAgent.description : 'AI Assistant'}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                {/* Agent Selector */}
                <AgentSelector className="mb-2" />
                
                {/* Status indicator */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background/50">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isOnline ? "bg-green-500" : "bg-red-500"
                  )} />
                  <span className="text-xs text-muted-foreground">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="mb-4">
            <SystemStatus showDetails={false} />
          </div>

          {/* Smart Usage Banner */}
          <SmartUsageBanner className="mb-4" />

          {/* Usage Warning for Free Users */}
          {!isPremium && (() => {
            const remaining = getRemainingUsage('chatMessages') || 0
            const limit = 20 // Free user daily limit
            const percentage = ((limit - remaining) / limit) * 100
            
            if (percentage >= 70) { // Show warning when 70% used
              return (
                <div className="mb-4 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {remaining === 0 
                          ? 'Daily limit reached' 
                          : `${remaining} messages left today`
                        }
                      </span>
                    </div>
                    {remaining > 0 && (
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {remaining === 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => {}}
                        className="px-3 py-1 bg-gradient-primary text-white text-xs font-medium rounded-lg hover:scale-105 transition-transform"
                      >
                        Continue with Premium
                      </button>
                      <span className="text-xs text-muted-foreground">
                        Unlimited messages, no waiting
                      </span>
                    </div>
                  )}
                </div>
              )
            }
            return null
          })()}
          
          {/* Usage Limit Warning for Free Users */}
          {!isPremium && (() => {
            const remaining = getRemainingUsage('chatMessages')
            const percentage = remaining !== null ? ((50 - remaining) / 50) * 100 : 0
            
            if (remaining !== null && remaining <= 10) {
              return (
                <div className="mb-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {remaining === 0 ? 'Günlük mesaj limitine ulaştın' : `Bugün için ${remaining} mesajın kaldı`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {remaining === 0 ? 'Premium ile sınırsız devam edebilirsin' : 'Premium ile sınırsız mesaj gönder'}
                      </p>
                    </div>
                    <button 
                      onClick={() => window.open('/pricing', '_blank')}
                      className="px-3 py-1 bg-gradient-primary text-white text-xs font-medium rounded-lg hover:scale-105 transition-transform"
                    >
                      Premium
                    </button>
                  </div>
                </div>
              )
            }
            return null
          })()}

          {/* Tips */}
          {inlineTips.map((tip) => (
            tip.trigger === 'first_visit' ? (
              <WelcomeTip
                key={tip.id}
                tip={tip}
                onDismiss={() => dismissTip(tip.id)}
                onAction={() => completeTipAction(tip.id)}
              />
            ) : (
              <InlineTip
                key={tip.id}
                tip={tip}
                onDismiss={() => dismissTip(tip.id)}
                onAction={() => completeTipAction(tip.id)}
                className="mb-4"
              />
            )
          ))}

          {/* Chat Container */}
          <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden">
            <div ref={messagesContainerRef} className="h-[60vh] overflow-hidden">
              <MessageList 
                messages={messages}
                isLoading={isLoading}
                showScrollButton={showScrollButton}
                onScrollToBottom={handleScrollToBottom}
                onCopy={handleCopy}
                onRegenerate={handleRegenerate}
                onThumbsUp={handleThumbsUp}
                onThumbsDown={handleThumbsDown}
                onConvertToApp={handleConvertToApp}
                onboardingData={onboardingData}
              />
            </div>
            
            {error && (
              <ErrorMessage 
                message={error} 
                onRetry={handleRetry} 
                onDismiss={handleDismissError}
              />
            )}
            
            <Composer 
              onSendMessage={handleSendMessage}
              onStopGeneration={handleStopGeneration}
              disabled={!!error}
              isLoading={isLoading}
              limitReached={!isPremium && !canPerformAction('chatMessages')}
              onUpgradeClick={() => window.open('/pricing', '_blank')}
            />
            
            {/* Powered By */}
            <PoweredBy variant="minimal" className="mt-2" />
          </div>
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />

      {/* Production Error Modal */}
      <ProductionErrorModal
        isOpen={showProductionError}
        onClose={() => setShowProductionError(false)}
        onRetry={async () => {
          setShowProductionError(false)
          // Retry the last message
          const lastUserMessage = messages.filter(m => m.role === 'user').pop()
          if (lastUserMessage) {
            // Remove error messages and retry
            setMessages(prev => prev.filter(m => !m.isError))
            await handleSendMessage(lastUserMessage.content)
          }
        }}
      />

      {/* Code Studio Context Modal */}
      <CodeStudioContextModal
        isOpen={showCodeStudioModal}
        onClose={() => {
          setShowCodeStudioModal(false)
          setSelectedMessageForCode(null)
        }}
        onConfirm={handleCodeStudioConfirm}
        targetMessage={selectedMessageForCode}
        recentMessages={messages.filter(m => m.role === 'user' || m.role === 'assistant')}
      />

      {/* AI Coaching Panel */}
      <AICoachingPanel context="chat" userId="user_1" />

      {/* Progress Coaching */}
      <ProgressCoaching userId="user_1" />
      
      {/* Context Help */}
      <ContextHelp context="chat" />

      {/* Achievement Unlock Modal */}
      <AchievementUnlockModal
        achievement={currentUnlock}
        isOpen={showUnlockModal}
        onClose={closeUnlockModal}
        onShare={(achievement) => {
          if (achievement.shareText) {
            if (navigator.share) {
              navigator.share({
                title: `Synexa Achievement: ${achievement.title}`,
                text: achievement.shareText,
                url: window.location.origin
              })
            } else {
              navigator.clipboard.writeText(`${achievement.shareText} ${window.location.origin}`)
            }
          }
        }}
      />
    </div>
  )
}

export default memo(ChatView)
