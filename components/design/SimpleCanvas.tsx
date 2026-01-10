'use client'

import { useRef, useEffect, useState, useCallback, memo } from 'react'
import { DesignScene, DesignNode } from '@/lib/types'
import { ZoomIn, ZoomOut, Maximize2, Grid3X3 } from 'lucide-react'
import { IconButton, Badge } from '@/components/ui'
import { Tooltip } from '@/components/ui/Tooltip'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

interface SimpleCanvasProps {
  scene: DesignScene
  selectedNodeId: string | null
  tool: 'select' | 'text' | 'rect' | 'circle'
  onNodeSelect: (nodeId: string | null) => void
  onNodeUpdate: (nodeId: string, updates: Partial<DesignNode>) => void
  onSceneUpdate: (updates: Partial<DesignScene>) => void
}

const ZOOM_LEVELS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3]
const GRID_SIZE = 20

function SimpleCanvas({
  scene,
  selectedNodeId,
  tool,
  onNodeSelect,
  onNodeUpdate,
  onSceneUpdate
}: SimpleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [showGrid, setShowGrid] = useState(true)
  const [exportScale, setExportScale] = useState<1 | 2>(1)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const { addToast } = useToast()

  // Handle export
  useEffect(() => {
    const handleExport = () => {
      setShowExportMenu(true)
    }

    window.addEventListener('design-export', handleExport)
    return () => window.removeEventListener('design-export', handleExport)
  }, [])

  const performExport = useCallback((scale: 1 | 2) => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Create a temporary canvas with the desired scale
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = scene.width * scale
    tempCanvas.height = scene.height * scale
    const ctx = tempCanvas.getContext('2d')
    if (!ctx) return

    // Scale the context
    ctx.scale(scale, scale)

    // Draw background
    ctx.fillStyle = scene.background || '#ffffff'
    ctx.fillRect(0, 0, scene.width, scene.height)

    // Draw nodes
    scene.nodes.forEach(node => {
      ctx.save()
      ctx.translate(node.x + node.width / 2, node.y + node.height / 2)
      if (node.rotation) {
        ctx.rotate((node.rotation * Math.PI) / 180)
      }
      ctx.translate(-node.width / 2, -node.height / 2)

      switch (node.type) {
        case 'rect':
          if (node.fill) {
            ctx.fillStyle = node.fill
            ctx.fillRect(0, 0, node.width, node.height)
          }
          if (node.stroke && node.strokeWidth) {
            ctx.strokeStyle = node.stroke
            ctx.lineWidth = node.strokeWidth
            ctx.strokeRect(0, 0, node.width, node.height)
          }
          break
        case 'circle':
          const radius = Math.min(node.width, node.height) / 2
          ctx.beginPath()
          ctx.arc(node.width / 2, node.height / 2, radius, 0, 2 * Math.PI)
          if (node.fill) {
            ctx.fillStyle = node.fill
            ctx.fill()
          }
          if (node.stroke && node.strokeWidth) {
            ctx.strokeStyle = node.stroke
            ctx.lineWidth = node.strokeWidth
            ctx.stroke()
          }
          break
        case 'text':
          if (node.text) {
            ctx.fillStyle = node.fill || '#000000'
            ctx.font = `${(node.fontSize || 16)}px ${node.fontFamily || 'Arial'}`
            ctx.textAlign = 'left'
            ctx.textBaseline = 'top'
            ctx.fillText(node.text, 0, 0)
          }
          break
      }
      ctx.restore()
    })

    // Download
    const dataURL = tempCanvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `${scene.name || 'design'}-${scale}x.png`
    link.href = dataURL
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setShowExportMenu(false)
    addToast({
      type: 'success',
      title: 'Export başarılı',
      description: `${scene.width * scale}x${scene.height * scale}px PNG kaydedildi`,
    })
  }, [scene, addToast])

  // Draw scene
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, scene.width, scene.height)

    // Draw background
    ctx.fillStyle = scene.background || '#ffffff'
    ctx.fillRect(0, 0, scene.width, scene.height)

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.lineWidth = 1

      // Vertical lines
      for (let x = 0; x <= scene.width; x += GRID_SIZE) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, scene.height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y <= scene.height; y += GRID_SIZE) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(scene.width, y)
        ctx.stroke()
      }

      // Center lines (stronger)
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.beginPath()
      ctx.moveTo(scene.width / 2, 0)
      ctx.lineTo(scene.width / 2, scene.height)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, scene.height / 2)
      ctx.lineTo(scene.width, scene.height / 2)
      ctx.stroke()
    }

    // Draw nodes
    scene.nodes.forEach(node => {
      ctx.save()
      
      ctx.translate(node.x + node.width / 2, node.y + node.height / 2)
      if (node.rotation) {
        ctx.rotate((node.rotation * Math.PI) / 180)
      }
      ctx.translate(-node.width / 2, -node.height / 2)

      switch (node.type) {
        case 'rect':
          if (node.fill) {
            ctx.fillStyle = node.fill
            ctx.fillRect(0, 0, node.width, node.height)
          }
          if (node.stroke && node.strokeWidth) {
            ctx.strokeStyle = node.stroke
            ctx.lineWidth = node.strokeWidth
            ctx.strokeRect(0, 0, node.width, node.height)
          }
          break

        case 'circle':
          const radius = Math.min(node.width, node.height) / 2
          ctx.beginPath()
          ctx.arc(node.width / 2, node.height / 2, radius, 0, 2 * Math.PI)
          if (node.fill) {
            ctx.fillStyle = node.fill
            ctx.fill()
          }
          if (node.stroke && node.strokeWidth) {
            ctx.strokeStyle = node.stroke
            ctx.lineWidth = node.strokeWidth
            ctx.stroke()
          }
          break

        case 'text':
          if (node.text) {
            ctx.fillStyle = node.fill || '#000000'
            ctx.font = `${node.fontSize || 16}px ${node.fontFamily || 'Arial'}`
            ctx.textAlign = 'left'
            ctx.textBaseline = 'top'
            ctx.fillText(node.text, 0, 0)
          }
          break
      }

      ctx.restore()

      // Draw selection border
      if (selectedNodeId === node.id) {
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.strokeRect(node.x - 2, node.y - 2, node.width + 4, node.height + 4)
        ctx.setLineDash([])

        // Draw resize handles
        const handleSize = 8
        ctx.fillStyle = '#3b82f6'
        const corners = [
          { x: node.x - handleSize/2, y: node.y - handleSize/2 },
          { x: node.x + node.width - handleSize/2, y: node.y - handleSize/2 },
          { x: node.x - handleSize/2, y: node.y + node.height - handleSize/2 },
          { x: node.x + node.width - handleSize/2, y: node.y + node.height - handleSize/2 },
        ]
        corners.forEach(corner => {
          ctx.fillRect(corner.x, corner.y, handleSize, handleSize)
        })
      }
    })
  }, [scene, selectedNodeId, showGrid])

  const getNodeAt = useCallback((x: number, y: number): DesignNode | null => {
    for (let i = scene.nodes.length - 1; i >= 0; i--) {
      const node = scene.nodes[i]
      if (x >= node.x && x <= node.x + node.width && 
          y >= node.y && y <= node.y + node.height) {
        return node
      }
    }
    return null
  }, [scene.nodes])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    const clickedNode = getNodeAt(x, y)
    
    if (clickedNode) {
      onNodeSelect(clickedNode.id)
      setIsDragging(true)
      setDragStart({ x: x - clickedNode.x, y: y - clickedNode.y })
    } else {
      onNodeSelect(null)
    }
  }, [zoom, getNodeAt, onNodeSelect])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedNodeId) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    // Snap to grid (optional)
    const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE

    onNodeUpdate(selectedNodeId, {
      x: showGrid ? snapToGrid(x - dragStart.x) : x - dragStart.x,
      y: showGrid ? snapToGrid(y - dragStart.y) : y - dragStart.y
    })
  }, [isDragging, selectedNodeId, zoom, dragStart, showGrid, onNodeUpdate])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    const clickedNode = getNodeAt(x, y)
    
    if (clickedNode && clickedNode.type === 'text') {
      const newText = prompt('Metni düzenleyin:', clickedNode.text || '')
      if (newText !== null) {
        onNodeUpdate(clickedNode.id, { text: newText })
      }
    }
  }, [zoom, getNodeAt, onNodeUpdate])

  const handleZoomIn = useCallback(() => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom)
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      setZoom(ZOOM_LEVELS[currentIndex + 1])
    }
  }, [zoom])

  const handleZoomOut = useCallback(() => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom)
    if (currentIndex > 0) {
      setZoom(ZOOM_LEVELS[currentIndex - 1])
    }
  }, [zoom])

  const handleResetZoom = useCallback(() => {
    setZoom(1)
  }, [])

  return (
    <div className="flex-1 flex flex-col bg-secondary/30">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm">
            {scene.width} × {scene.height}px
          </Badge>
          <Badge variant="default" size="sm">
            {scene.nodes.length} öğe
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          {/* Grid Toggle */}
          <Tooltip content={showGrid ? 'Izgarayı gizle' : 'Izgarayı göster'}>
            <IconButton
              aria-label="Izgara göster/gizle"
              variant={showGrid ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid3X3 className="h-4 w-4" />
            </IconButton>
          </Tooltip>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Zoom Controls */}
          <Tooltip content="Uzaklaştır">
            <IconButton
              aria-label="Uzaklaştır"
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom === ZOOM_LEVELS[0]}
            >
              <ZoomOut className="h-4 w-4" />
            </IconButton>
          </Tooltip>

          <button
            onClick={handleResetZoom}
            className="px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors min-w-[50px]"
          >
            {Math.round(zoom * 100)}%
          </button>

          <Tooltip content="Yakınlaştır">
            <IconButton
              aria-label="Yakınlaştır"
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom === ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
            >
              <ZoomIn className="h-4 w-4" />
            </IconButton>
          </Tooltip>

          <Tooltip content="Sığdır">
            <IconButton
              aria-label="Sığdır"
              variant="ghost"
              size="sm"
              onClick={handleResetZoom}
            >
              <Maximize2 className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        {/* Grid Background Pattern */}
        <div 
          className="relative shadow-2xl rounded-lg overflow-hidden"
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out'
          }}
        >
          <canvas
            ref={canvasRef}
            width={scene.width}
            height={scene.height}
            className={cn(
              "bg-white cursor-pointer",
              isDragging && "cursor-grabbing"
            )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDoubleClick}
          />
        </div>
      </div>

      {/* Export Menu Modal */}
      {showExportMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
            onClick={() => setShowExportMenu(false)}
          />
          <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl animate-in zoom-in-95 fade-in duration-200 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Export PNG</h3>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => performExport(1)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <div>
                  <div className="font-medium text-foreground">1x</div>
                  <div className="text-sm text-muted-foreground">
                    {scene.width} × {scene.height}px
                  </div>
                </div>
                <Badge variant="outline">Standart</Badge>
              </button>

              <button
                onClick={() => performExport(2)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <div>
                  <div className="font-medium text-foreground">2x</div>
                  <div className="text-sm text-muted-foreground">
                    {scene.width * 2} × {scene.height * 2}px
                  </div>
                </div>
                <Badge variant="primary">Retina</Badge>
              </button>
            </div>

            <button
              onClick={() => setShowExportMenu(false)}
              className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(SimpleCanvas)
