'use client'

import { CanvasItem } from '@/app/(app)/studio/page'
import { cn } from '@/lib/utils'
import {
  PlusIcon,
  Square3Stack3DIcon,
  ArrowsPointingOutIcon,
  RectangleGroupIcon,
  SparklesIcon,
  DocumentIcon,
  CubeIcon,
  ArrowPathIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'

interface StudioCanvasProps {
  items: CanvasItem[]
  onAddItem: (type: CanvasItem['type']) => void
  onSelectItem: (itemId: string) => void
  onUpdateItem: (itemId: string, updates: Partial<CanvasItem>) => void
}

const addButtons = [
  { type: 'screen' as const, label: 'Section', icon: Square3Stack3DIcon },
  { type: 'component' as const, label: 'Component', icon: CubeIcon },
  { type: 'flow' as const, label: 'Flow', icon: ArrowPathIcon },
  { type: 'note' as const, label: 'Note', icon: ChatBubbleLeftIcon }
]

const arrangeButtons = [
  { label: 'Align', icon: ArrowsPointingOutIcon, disabled: true },
  { label: 'Distribute', icon: RectangleGroupIcon, disabled: true },
  { label: 'Group', icon: Square3Stack3DIcon, disabled: true }
]

const autoLayoutButtons = [
  { label: 'Stack', disabled: false },
  { label: 'Grid', disabled: false },
  { label: 'Responsive', disabled: false }
]

export function StudioCanvas({ items, onAddItem, onSelectItem, onUpdateItem }: StudioCanvasProps) {
  const getItemIcon = (type: CanvasItem['type']) => {
    switch (type) {
      case 'screen': return DocumentIcon
      case 'component': return CubeIcon
      case 'flow': return ArrowPathIcon
      case 'note': return ChatBubbleLeftIcon
      default: return DocumentIcon
    }
  }

  const getItemColor = (type: CanvasItem['type']) => {
    switch (type) {
      case 'screen': return 'bg-blue-50 border-blue-200 text-blue-700'
      case 'component': return 'bg-green-50 border-green-200 text-green-700'
      case 'flow': return 'bg-purple-50 border-purple-200 text-purple-700'
      case 'note': return 'bg-yellow-50 border-yellow-200 text-yellow-700'
      default: return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-border bg-background p-4">
        <div className="flex items-center gap-6">
          {/* Add Section */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Add:</span>
            {addButtons.map((button) => (
              <button
                key={button.type}
                onClick={() => onAddItem(button.type)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <button.icon className="w-4 h-4" />
                {button.label}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Arrange Section */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Arrange:</span>
            {arrangeButtons.map((button) => (
              <button
                key={button.label}
                disabled={button.disabled}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  button.disabled
                    ? 'text-muted-foreground/50 cursor-not-allowed'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <button.icon className="w-4 h-4" />
                {button.label}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Auto-layout Section */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Auto-layout:</span>
            {autoLayoutButtons.map((button) => (
              <button
                key={button.label}
                disabled={button.disabled}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  button.disabled
                    ? 'text-muted-foreground/50 cursor-not-allowed'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {button.label}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-border" />

          {/* AI Assist */}
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            <SparklesIcon className="w-4 h-4" />
            Improve this screen
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-auto bg-muted/20">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Canvas Items */}
        <div className="relative min-h-full p-8">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                  <PlusIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Start designing
                </h3>
                <p className="text-muted-foreground text-sm">
                  Add sections, components, or flows to get started
                </p>
              </div>
            </div>
          ) : (
            items.map((item) => {
              const Icon = getItemIcon(item.type)
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item.id)}
                  className={cn(
                    'absolute w-48 p-4 border-2 rounded-lg cursor-pointer transition-all',
                    item.selected 
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                      : 'hover:shadow-md',
                    getItemColor(item.type)
                  )}
                  style={{
                    left: item.position.x,
                    top: item.position.y
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/50 rounded flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs opacity-70 capitalize">{item.type}</div>
                    </div>
                  </div>
                  
                  {/* Preview Content */}
                  <div className="mt-3 space-y-1">
                    {item.type === 'screen' && (
                      <>
                        <div className="h-2 bg-white/30 rounded" />
                        <div className="h-2 bg-white/20 rounded w-3/4" />
                        <div className="h-2 bg-white/20 rounded w-1/2" />
                      </>
                    )}
                    {item.type === 'component' && (
                      <div className="h-6 bg-white/30 rounded flex items-center justify-center text-xs">
                        Button
                      </div>
                    )}
                    {item.type === 'flow' && (
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-white/30 rounded-full" />
                        <div className="flex-1 h-px bg-white/30" />
                        <div className="w-3 h-3 bg-white/30 rounded-full" />
                      </div>
                    )}
                    {item.type === 'note' && (
                      <div className="text-xs opacity-70">
                        Click to add notes...
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}