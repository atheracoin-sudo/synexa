'use client'

import { Bot } from 'lucide-react'

export default function TypingIndicator() {
  return (
    <div className="flex w-full gap-3 px-4 py-6">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
        <Bot className="h-4 w-4 text-primary-foreground" />
      </div>
      
      <div className="flex flex-col items-start">
        <div className="bg-secondary text-secondary-foreground rounded-2xl px-4 py-3 shadow-sm">
          <div className="flex items-center space-x-1">
            <div className="typing-dot w-2 h-2 bg-muted-foreground rounded-full"></div>
            <div className="typing-dot w-2 h-2 bg-muted-foreground rounded-full"></div>
            <div className="typing-dot w-2 h-2 bg-muted-foreground rounded-full"></div>
          </div>
        </div>
        
        <span className="text-xs text-muted-foreground mt-1 px-1">
          Yazıyor...
        </span>
      </div>
    </div>
  )
}
