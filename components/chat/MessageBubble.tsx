'use client'

import { useState, useCallback, memo } from 'react'
import { Message } from '@/lib/types'
import { formatTime, cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { User, Bot, Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, Code2 } from 'lucide-react'
import { IconButton } from '@/components/ui'
import { PremiumMessageGlow } from '@/components/premium/PremiumBadge'
import { MemoryFeedback } from '@/components/memory/MemoryFeedback'
import { GracefulFallback } from '@/components/chat/GracefulFallback'
import { useMemory } from '@/lib/hooks/useMemory'
// import { motion } from 'framer-motion'

interface MessageBubbleProps {
  message: Message
  isLast?: boolean
  onCopy?: (content: string) => void
  onRegenerate?: (messageId: string) => void
  onThumbsUp?: (messageId: string) => void
  onThumbsDown?: (messageId: string) => void
  onConvertToApp?: (messageId: string, content: string) => void
}

// Code block with copy button
interface CodeBlockProps {
  language: string
  children: string
}

const CodeBlock = memo(function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [children])

  return (
    <div className="relative group my-3 rounded-lg overflow-hidden border border-border/50">
      {/* Header with language and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-secondary/80 border-b border-border/50">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {language || 'code'}
        </span>
        <IconButton
          aria-label={copied ? 'Kopyalandı' : 'Kodu kopyala'}
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </IconButton>
      </div>
      
      <SyntaxHighlighter
        style={oneDark as any}
        language={language}
        PreTag="div"
        className="!m-0 !rounded-none !bg-[#282c34]"
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
})

function MessageBubble({ 
  message, 
  isLast, 
  onCopy, 
  onRegenerate, 
  onThumbsUp, 
  onThumbsDown,
  onConvertToApp
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const isUser = message.role === 'user'
  const { activeMemory, markMemoryUsed } = useMemory()
  
  // Simulate memory usage detection for assistant messages
  // In a real implementation, this would come from the AI response metadata
  const usedMemory = !isUser && activeMemory.length > 0 && !message.isError ? activeMemory.slice(0, 2) : []
  
  // Handle retry for error messages
  const handleRetry = () => {
    if (onRegenerate) {
      onRegenerate(message.id)
    }
  }

  // Check if message is convertible to app
  const isConvertibleToApp = !isUser && !message.isError && message.content.length > 50 && (
    message.content.toLowerCase().includes('app') ||
    message.content.toLowerCase().includes('uygulama') ||
    message.content.toLowerCase().includes('web') ||
    message.content.toLowerCase().includes('site') ||
    message.content.toLowerCase().includes('dashboard') ||
    message.content.toLowerCase().includes('interface') ||
    message.content.toLowerCase().includes('component') ||
    message.content.toLowerCase().includes('feature') ||
    message.content.toLowerCase().includes('özellik') ||
    message.content.toLowerCase().includes('proje') ||
    message.content.toLowerCase().includes('project')
  )

  const handleConvertToApp = () => {
    if (onConvertToApp) {
      onConvertToApp(message.id, message.content)
    }
  }
  
  return (
    <div className={cn(
      "flex w-full gap-3 px-4 py-3 group animate-in fade-in slide-in-from-bottom-2 duration-300",
      isUser ? "justify-end" : "justify-start",
      isLast && "pb-6"
    )}>
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-premium">
          <Bot className="h-5 w-5 text-white" />
        </div>
      )}
      
      <div className={cn(
        "flex flex-col",
        isUser ? "items-end max-w-[85%] sm:max-w-[70ch]" : "items-start max-w-[85%] sm:max-w-[70ch]"
      )}>
        {/* Memory Feedback for Assistant Messages */}
        {!isUser && usedMemory.length > 0 && (
          <MemoryFeedback usedMemory={usedMemory} className="mb-2" />
        )}
        
        <PremiumMessageGlow>
          <div className={cn(
            "rounded-[18px] px-4 py-3 shadow-card transition-all duration-200 hover:shadow-lg",
            isUser 
              ? "bg-gradient-primary text-white" 
              : "bg-background border border-border/50"
          )}>
            {isUser ? (
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
            ) : message.isError ? (
              <GracefulFallback onRetry={handleRetry} />
            ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:my-0 prose-pre:p-0 prose-pre:bg-transparent">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    const codeString = String(children).replace(/\n$/, '')
                    
                    return !inline && match ? (
                      <CodeBlock language={match[1]}>
                        {codeString}
                      </CodeBlock>
                    ) : (
                      <code 
                        className="px-2 py-1 rounded-lg bg-muted text-sm font-mono" 
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  },
                  // Better list styling
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>
                  ),
                  // Better heading styling
                  h1: ({ children }) => (
                    <h1 className="text-lg font-bold mt-4 mb-2">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-bold mt-3 mb-2">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-bold mt-3 mb-1">{children}</h3>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          </div>
        </PremiumMessageGlow>
        
        <span className="text-xs text-muted-foreground mt-2 px-2">
          {formatTime(message.createdAt)}
        </span>

        {/* Action Buttons - Only for assistant messages */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {/* Copy Button */}
            <button
              onClick={async () => {
                if (onCopy) {
                  onCopy(message.content)
                }
                try {
                  await navigator.clipboard.writeText(message.content)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                } catch (error) {
                  console.error('Failed to copy:', error)
                }
              }}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Copy message"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {/* Regenerate Button */}
            <button
              onClick={() => onRegenerate?.(message.id)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Regenerate response"
            >
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Thumbs Up */}
            <button
              onClick={() => {
                setFeedback(feedback === 'up' ? null : 'up')
                onThumbsUp?.(message.id)
              }}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Good response"
            >
              <ThumbsUp className={cn(
                "h-4 w-4 transition-colors",
                feedback === 'up' ? "text-green-500" : "text-muted-foreground"
              )} />
            </button>

            {/* Thumbs Down */}
            <button
              onClick={() => {
                setFeedback(feedback === 'down' ? null : 'down')
                onThumbsDown?.(message.id)
              }}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Poor response"
            >
              <ThumbsDown className={cn(
                "h-4 w-4 transition-colors",
                feedback === 'down' ? "text-red-500" : "text-muted-foreground"
              )} />
            </button>
          </div>
        )}

        {/* Convert to App Action - Only for convertible assistant messages */}
        {isConvertibleToApp && (
          <div className="mt-3 pt-3 border-t border-border/30">
            <button
              onClick={handleConvertToApp}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 bg-gradient-primary text-white text-sm font-medium rounded-xl",
                "hover:scale-[1.02] transition-all duration-200 shadow-lg",
                "group"
              )}
              title="Bu yanıtla bir uygulama oluştur"
            >
              <Code2 className="h-4 w-4" />
              <span>Uygulamaya Dönüştür</span>
            </button>
          </div>
        )}
      </div>
      
      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-muted flex items-center justify-center">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
    </div>
  )
}

export default memo(MessageBubble)
