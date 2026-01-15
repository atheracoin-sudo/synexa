'use client'

import { cn } from '@/lib/utils'
import { ChatMode } from '@/app/(app)/chat/page'

interface ChatHeaderProps {
  mode: ChatMode
  onModeChange: (mode: ChatMode) => void
}

const modes = [
  { id: 'chat' as const, label: 'Chat' },
  { id: 'build' as const, label: 'Build' },
  { id: 'review' as const, label: 'Review' }
]

export function ChatHeader({ mode, onModeChange }: ChatHeaderProps) {
  return (
    <div className="border-b border-border bg-background">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Mode Toggle */}
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {modes.map((modeOption) => (
              <button
                key={modeOption.id}
                onClick={() => onModeChange(modeOption.id)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-all',
                  mode === modeOption.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {modeOption.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Hint Text */}
        <p className="text-center text-sm text-muted-foreground">
          Synexa, cevap vermeden önce 1 varsayım yapar ve ilerler.
        </p>
      </div>
    </div>
  )
}