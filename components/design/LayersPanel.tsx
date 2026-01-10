'use client'

import { useState, useCallback, memo } from 'react'
import { DesignNode } from '@/lib/types'
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Trash2, 
  Type, 
  Square, 
  Circle,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Edit3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconButton, Card, Badge } from '@/components/ui'
import { Tooltip } from '@/components/ui/Tooltip'

interface LayersPanelProps {
  nodes: DesignNode[]
  selectedNodeId: string | null
  onNodeSelect: (nodeId: string) => void
  onNodeDelete: (nodeId: string) => void
  onNodeUpdate: (nodeId: string, updates: Partial<DesignNode>) => void
  onReorderNodes?: (fromIndex: number, toIndex: number) => void
}

function LayersPanel({
  nodes,
  selectedNodeId,
  onNodeSelect,
  onNodeDelete,
  onNodeUpdate,
  onReorderNodes
}: LayersPanelProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const getNodeIcon = useCallback((type: string) => {
    switch (type) {
      case 'text':
        return Type
      case 'rect':
        return Square
      case 'circle':
        return Circle
      default:
        return Square
    }
  }, [])

  const getNodeLabel = useCallback((node: DesignNode) => {
    if (node.name) return node.name
    switch (node.type) {
      case 'text':
        return node.text?.slice(0, 20) || 'Metin'
      case 'rect':
        return 'Dikdörtgen'
      case 'circle':
        return 'Daire'
      default:
        return 'Öğe'
    }
  }, [])

  const handleStartRename = useCallback((node: DesignNode, e: React.MouseEvent) => {
    e.stopPropagation()
    setRenamingId(node.id)
    setRenameValue(node.name || getNodeLabel(node))
  }, [getNodeLabel])

  const handleRename = useCallback(() => {
    if (renamingId && renameValue.trim()) {
      onNodeUpdate(renamingId, { name: renameValue.trim() })
    }
    setRenamingId(null)
    setRenameValue('')
  }, [renamingId, renameValue, onNodeUpdate])

  const handleMoveUp = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (index < nodes.length - 1 && onReorderNodes) {
      onReorderNodes(index, index + 1)
    }
  }, [nodes.length, onReorderNodes])

  const handleMoveDown = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (index > 0 && onReorderNodes) {
      onReorderNodes(index, index - 1)
    }
  }, [onReorderNodes])

  // Reversed order (top layers first in display)
  const reversedNodes = [...nodes].reverse()

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Katmanlar</h3>
          </div>
          <Badge variant="default" size="sm">{nodes.length}</Badge>
        </div>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {nodes.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground p-4">
            <div className="text-center">
              <Layers className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Henüz öğe yok</p>
              <p className="text-xs mt-1">Sol panelden öğe ekleyin</p>
            </div>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {reversedNodes.map((node, reversedIndex) => {
              const actualIndex = nodes.length - 1 - reversedIndex
              const Icon = getNodeIcon(node.type)
              const isSelected = selectedNodeId === node.id
              const isRenaming = renamingId === node.id
              
              return (
                <div
                  key={node.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg cursor-pointer group transition-all duration-150",
                    isSelected 
                      ? "bg-primary/10 border border-primary/30" 
                      : "hover:bg-secondary/50 border border-transparent"
                  )}
                  onClick={() => !isRenaming && onNodeSelect(node.id)}
                >
                  {/* Drag Handle */}
                  <GripVertical className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />

                  {/* Icon */}
                  <div className={cn(
                    "p-1.5 rounded-md",
                    isSelected ? "bg-primary/20" : "bg-secondary"
                  )}>
                    <Icon className={cn(
                      "h-3.5 w-3.5",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>

                  {/* Label or Rename Input */}
                  {isRenaming ? (
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename()
                        if (e.key === 'Escape') {
                          setRenamingId(null)
                          setRenameValue('')
                        }
                      }}
                      onBlur={handleRename}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 px-2 py-0.5 text-sm bg-background border border-primary rounded focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <span 
                      className="flex-1 text-sm truncate text-foreground"
                      onDoubleClick={(e) => handleStartRename(node, e)}
                    >
                      {getNodeLabel(node)}
                    </span>
                  )}

                  {/* Actions */}
                  {!isRenaming && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Move Up (bring forward) */}
                      <Tooltip content="Öne getir" side="top">
                        <IconButton
                          aria-label="Öne getir"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleMoveUp(actualIndex, e)}
                          disabled={actualIndex === nodes.length - 1}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </IconButton>
                      </Tooltip>

                      {/* Move Down (send back) */}
                      <Tooltip content="Arkaya gönder" side="top">
                        <IconButton
                          aria-label="Arkaya gönder"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleMoveDown(actualIndex, e)}
                          disabled={actualIndex === 0}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </IconButton>
                      </Tooltip>

                      {/* Rename */}
                      <Tooltip content="Yeniden adlandır" side="top">
                        <IconButton
                          aria-label="Yeniden adlandır"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleStartRename(node, e)}
                        >
                          <Edit3 className="h-3 w-3" />
                        </IconButton>
                      </Tooltip>

                      {/* Delete */}
                      <Tooltip content="Sil" side="top">
                        <IconButton
                          aria-label="Sil"
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onNodeDelete(node.id)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Help */}
      <div className="p-3 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Çift tık ile yeniden adlandır
        </p>
      </div>
    </div>
  )
}

export default memo(LayersPanel)
