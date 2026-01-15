'use client'

import { useState } from 'react'
import { Brain, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MemoryItem } from '@/lib/types'

interface MemoryFeedbackProps {
  usedMemory: MemoryItem[]
  className?: string
}

export function MemoryFeedback({ usedMemory, className }: MemoryFeedbackProps) {
  const [showDetails, setShowDetails] = useState(false)

  if (usedMemory.length === 0) return null

  return (
    <div className={cn("mb-2", className)}>
      <div className="relative">
        {/* Main Badge */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full",
            "bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20",
            "text-primary hover:bg-primary/20 transition-colors duration-200",
            "cursor-pointer"
          )}
        >
          <Brain className="h-3 w-3" />
          <span>Yanıt kişisel tercihlerine göre hazırlandı</span>
          <Info className="h-3 w-3 opacity-60" />
        </button>

        {/* Details Dropdown */}
        {showDetails && (
          <div className={cn(
            "absolute top-full left-0 mt-2 p-3 bg-card border border-border/50 rounded-xl shadow-lg z-10",
            "min-w-[200px] max-w-[300px]",
            "animate-in fade-in slide-in-from-top-2 duration-200"
          )}>
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">
                Kullanılan tercihler:
              </p>
              <div className="space-y-1">
                {usedMemory.map((memory) => (
                  <div key={memory.id} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      <span className="font-medium">{memory.title}:</span> {memory.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Arrow */}
            <div className="absolute -top-1 left-4 w-2 h-2 bg-card border-l border-t border-border/50 rotate-45" />
          </div>
        )}
      </div>
    </div>
  )
}











