'use client'

import { Message } from '@/app/(app)/chat/page'
import { cn } from '@/lib/utils'
import { 
  CubeIcon, 
  BookmarkIcon, 
  ListBulletIcon, 
  ArrowDownTrayIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isLoading = message.isLoading
  
  const handleAction = (action: string) => {
    // Mock action handlers - no backend calls
    console.log(`Action: ${action} for message:`, message.id)
  }

  return (
    <div className={cn('flex gap-4 max-w-4xl mx-auto px-4 py-3', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm',
        isUser 
          ? 'bg-primary text-white' 
          : 'bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800 text-white'
      )}>
        {isUser ? (
          <UserIcon className="w-5 h-5" />
        ) : (
          <span className="text-sm font-semibold">AI</span>
        )}
      </div>

      {/* Message Content */}
      <div className={cn('flex-1 min-w-0', isUser && 'flex flex-col items-end')}>
        <div className={cn(
          'rounded-2xl px-5 py-4 max-w-3xl shadow-sm border',
          isUser 
            ? 'bg-primary text-white border-primary/20' 
            : 'bg-card text-card-foreground border-border/50 dark:bg-[hsl(var(--chat-assistant-bg))] dark:text-[hsl(var(--chat-assistant-text))]'
        )}>
          <div className={cn(
            "prose prose-sm max-w-none",
            isUser 
              ? "prose-invert" 
              : "dark:prose-invert"
          )}>
            <div className={cn(
              "whitespace-pre-wrap text-[15px] leading-[1.6] m-0",
              isLoading && "flex items-center gap-2"
            )}>
              {isLoading && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0 opacity-60" />
              )}
              {message.content}
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className={cn(
          'text-xs mt-2 px-2 opacity-70',
          isUser ? 'text-right text-foreground' : 'text-left text-[hsl(var(--chat-timestamp))]'
        )}>
          {message.timestamp.toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>

        {/* Action Buttons for AI Messages */}
        {!isUser && !isLoading && (
          <div className="flex items-center gap-1 mt-3 flex-wrap">
            <button
              onClick={() => handleAction('send-to-studio')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <CubeIcon className="w-3.5 h-3.5" />
              Send to Studio
            </button>
            
            <button
              onClick={() => handleAction('pin')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <BookmarkIcon className="w-3.5 h-3.5" />
              Pin
            </button>
            
            <button
              onClick={() => handleAction('turn-into-tasks')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <ListBulletIcon className="w-3.5 h-3.5" />
              Turn into Tasks
            </button>
            
            <button
              onClick={() => handleAction('export')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <ArrowDownTrayIcon className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        )}
      </div>
    </div>
  )
}