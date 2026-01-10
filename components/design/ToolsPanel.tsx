'use client'

import { useEffect, memo } from 'react'
import { MousePointer, Type, Square, Circle, Sparkles, Image } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip } from '@/components/ui/Tooltip'

interface ToolsPanelProps {
  activeTool: 'select' | 'text' | 'rect' | 'circle'
  onToolChange: (tool: 'select' | 'text' | 'rect' | 'circle') => void
  onAddNode: (type: 'text' | 'rect' | 'circle') => void
  onAIGenerate?: () => void
}

const tools = [
  {
    id: 'select' as const,
    icon: MousePointer,
    label: 'Seç',
    shortcut: 'V',
    isSelector: true
  },
  {
    id: 'rect' as const,
    icon: Square,
    label: 'Dikdörtgen',
    shortcut: 'R',
    isSelector: false
  },
  {
    id: 'circle' as const,
    icon: Circle,
    label: 'Daire',
    shortcut: 'C',
    isSelector: false
  },
  {
    id: 'text' as const,
    icon: Type,
    label: 'Metin',
    shortcut: 'T',
    isSelector: false
  }
]

function ToolsPanel({ activeTool, onToolChange, onAddNode, onAIGenerate }: ToolsPanelProps) {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case 'v':
          onToolChange('select')
          break
        case 'r':
          onToolChange('rect')
          onAddNode('rect')
          break
        case 'c':
          onToolChange('circle')
          onAddNode('circle')
          break
        case 't':
          onToolChange('text')
          onAddNode('text')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onToolChange, onAddNode])

  const handleToolClick = (toolId: typeof activeTool) => {
    if (toolId === 'select') {
      onToolChange(toolId)
    } else {
      onToolChange(toolId)
      onAddNode(toolId)
    }
  }

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-center">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
      </div>

      {/* Tools */}
      <div className="flex-1 p-2 space-y-1">
        {tools.map((tool) => {
          const Icon = tool.icon
          const isActive = activeTool === tool.id
          
          return (
            <Tooltip key={tool.id} content={`${tool.label} (${tool.shortcut})`} side="right">
              <button
                onClick={() => handleToolClick(tool.id)}
                className={cn(
                  "w-full p-3 rounded-lg transition-all duration-150 group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
                aria-label={tool.label}
              >
                <Icon className={cn(
                  "h-5 w-5 mx-auto transition-transform duration-150",
                  !isActive && "group-hover:scale-110"
                )} />
              </button>
            </Tooltip>
          )
        })}
      </div>

      {/* AI Generate Button */}
      <div className="p-2 border-t border-border">
        <Tooltip content="AI ile Tasarım Oluştur" side="right">
          <button
            onClick={() => {
              onAIGenerate?.()
            }}
            className="w-full p-3 text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors flex flex-col items-center gap-1"
            aria-label="AI ile tasarım oluştur"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-medium">AI</span>
          </button>
        </Tooltip>
      </div>
    </div>
  )
}

export default memo(ToolsPanel)
