'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Copy, 
  RefreshCw, 
  ThumbsUp, 
  ThumbsDown, 
  Code2, 
  Palette,
  Bot,
  Check,
  ExternalLink
} from 'lucide-react'
import { ChatMessage as ChatMessageType } from '@/lib/api/chat'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/context/AppContext'

interface ChatMessageProps {
  message: ChatMessageType
  onRegenerate?: () => void
  onCopy?: () => void
  onFeedback?: (type: 'like' | 'dislike') => void
}

export function ChatMessage({ 
  message, 
  onRegenerate, 
  onCopy,
  onFeedback 
}: ChatMessageProps) {
  const router = useRouter()
  const { actions } = useApp()
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null)

  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    onCopy?.()
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFeedback = (type: 'like' | 'dislike') => {
    setFeedback(type)
    onFeedback?.(type)
  }

  const handleConvertToApp = () => {
    // Pass context to Code Studio
    const context = {
      userMessage: message.content,
      aiResponse: message.content,
      conversationId: 'current', // This would be passed from parent
      timestamp: message.timestamp
    }
    
    // Store context for Code Studio
    localStorage.setItem('code_studio_context', JSON.stringify(context))
    
    // Navigate to Code Studio with app builder mode
    router.push('/code?mode=app-builder&from=chat')
    
    // Track usage
    actions.incrementUsage('codeGenerations')
  }

  const handleConvertToDesign = () => {
    // Pass context to Image Studio
    const context = {
      userMessage: message.content,
      aiResponse: message.content,
      conversationId: 'current',
      timestamp: message.timestamp
    }
    
    localStorage.setItem('image_studio_context', JSON.stringify(context))
    router.push('/design?mode=ai-generate&from=chat')
    actions.incrementUsage('imageGenerations')
  }

  const handleCreateAgent = () => {
    // Pass context to Agents
    const context = {
      userMessage: message.content,
      aiResponse: message.content,
      conversationId: 'current',
      timestamp: message.timestamp
    }
    
    localStorage.setItem('agent_context', JSON.stringify(context))
    router.push('/agents/create?from=chat')
    actions.incrementUsage('agents')
  }

  // Detect if message content suggests code/app building
  const suggestsCodeBuilding = message.content.toLowerCase().includes('app') || 
                              message.content.toLowerCase().includes('code') ||
                              message.content.toLowerCase().includes('build') ||
                              message.content.toLowerCase().includes('website')

  // Detect if message content suggests design work
  const suggestsDesign = message.content.toLowerCase().includes('design') ||
                        message.content.toLowerCase().includes('image') ||
                        message.content.toLowerCase().includes('logo') ||
                        message.content.toLowerCase().includes('visual')

  return (
    <div className={cn(
      'flex gap-4 p-4 rounded-2xl',
      isUser ? 'bg-primary/10 ml-8' : 'bg-card mr-8'
    )}>
      {/* Avatar */}
      <div className={cn(
        'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0',
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-gradient-primary text-white'
      )}>
        {isUser ? (
          <span className="text-sm font-medium">U</span>
        ) : (
          <span className="text-sm font-medium">AI</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Message Content */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap text-foreground leading-relaxed">
            {message.content}
          </p>
        </div>

        {/* Metadata */}
        {message.metadata && (
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
            {message.metadata.model && (
              <span>Model: {message.metadata.model}</span>
            )}
            {message.metadata.processingTime && (
              <span>{message.metadata.processingTime}ms</span>
            )}
          </div>
        )}

        {/* Actions */}
        {isAssistant && (
          <div className="flex items-center gap-2 mt-4">
            {/* Primary Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regenerate
                </button>
              )}
            </div>

            {/* Conversion Actions - Show if content suggests building something */}
            {(suggestsCodeBuilding || suggestsDesign) && (
              <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border">
                {suggestsCodeBuilding && (
                  <button
                    onClick={handleConvertToApp}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                  >
                    <Code2 className="w-3 h-3" />
                    Build App
                  </button>
                )}

                {suggestsDesign && (
                  <button
                    onClick={handleConvertToDesign}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors"
                  >
                    <Palette className="w-3 h-3" />
                    Create Design
                  </button>
                )}

                <button
                  onClick={handleCreateAgent}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <Bot className="w-3 h-3" />
                  Make Agent
                </button>
              </div>
            )}

            {/* Feedback Actions */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => handleFeedback('like')}
                className={cn(
                  'p-1 rounded-lg transition-colors',
                  feedback === 'like'
                    ? 'text-green-500 bg-green-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <ThumbsUp className="w-3 h-3" />
              </button>

              <button
                onClick={() => handleFeedback('dislike')}
                className={cn(
                  'p-1 rounded-lg transition-colors',
                  feedback === 'dislike'
                    ? 'text-red-500 bg-red-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <ThumbsDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Conversion Suggestion Component
export function ConversionSuggestion({ 
  message, 
  onConvert 
}: { 
  message: ChatMessageType
  onConvert: (type: 'code' | 'design' | 'agent') => void 
}) {
  const content = message.content.toLowerCase()
  
  // Don't show if message doesn't suggest building something
  if (!content.includes('app') && !content.includes('build') && 
      !content.includes('create') && !content.includes('design')) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 mt-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
          <ExternalLink className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-foreground mb-1">Ready to build this?</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Take this conversation to our studios and turn your idea into reality.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onConvert('code')}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
            >
              <Code2 className="w-4 h-4" />
              Code Studio
            </button>
            <button
              onClick={() => onConvert('design')}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
            >
              <Palette className="w-4 h-4" />
              Design Studio
            </button>
            <button
              onClick={() => onConvert('agent')}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
            >
              <Bot className="w-4 h-4" />
              Create Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}





