'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Download, 
  Type, 
  Square, 
  Circle, 
  Palette,
  Trash2,
  Move,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo
} from 'lucide-react'
import { GlobalHeader } from '@/components/ui/GlobalHeader'
import { BottomTabBar } from '@/components/ui/BottomTabBar'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/context/AppContext'

interface CanvasElement {
  id: string
  type: 'text' | 'rectangle' | 'circle'
  x: number
  y: number
  width: number
  height: number
  content?: string
  color: string
  fontSize?: number
}

export default function SimpleImageStudio() {
  const { actions } = useApp()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [elements, setElements] = useState<CanvasElement[]>([])
  const [selectedTool, setSelectedTool] = useState<'select' | 'text' | 'rectangle' | 'circle'>('select')
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentColor, setCurrentColor] = useState('#3B82F6')
  const [zoom, setZoom] = useState(1)

  // Canvas dimensions
  const canvasWidth = 800
  const canvasHeight = 600

  useEffect(() => {
    drawCanvas()
  }, [elements, zoom])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    
    // Set zoom
    ctx.save()
    ctx.scale(zoom, zoom)

    // Draw background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasWidth / zoom, canvasHeight / zoom)

    // Draw elements
    elements.forEach(element => {
      ctx.fillStyle = element.color
      ctx.strokeStyle = element.color

      switch (element.type) {
        case 'rectangle':
          ctx.fillRect(element.x, element.y, element.width, element.height)
          break
        case 'circle':
          ctx.beginPath()
          ctx.arc(
            element.x + element.width / 2, 
            element.y + element.height / 2, 
            Math.min(element.width, element.height) / 2, 
            0, 
            2 * Math.PI
          )
          ctx.fill()
          break
        case 'text':
          ctx.font = `${element.fontSize || 24}px Arial`
          ctx.fillText(element.content || 'Text', element.x, element.y + (element.fontSize || 24))
          break
      }

      // Draw selection outline
      if (selectedElement === element.id) {
        ctx.strokeStyle = '#3B82F6'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.strokeRect(element.x - 2, element.y - 2, element.width + 4, element.height + 4)
        ctx.setLineDash([])
      }
    })

    ctx.restore()
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    if (selectedTool === 'select') {
      // Find clicked element
      const clickedElement = elements.find(el => 
        x >= el.x && x <= el.x + el.width &&
        y >= el.y && y <= el.y + el.height
      )
      setSelectedElement(clickedElement?.id || null)
    } else {
      // Add new element
      const newElement: CanvasElement = {
        id: `element_${Date.now()}`,
        type: selectedTool as 'text' | 'rectangle' | 'circle',
        x: x - 50,
        y: y - 25,
        width: 100,
        height: 50,
        color: currentColor,
        content: selectedTool === 'text' ? 'New Text' : undefined,
        fontSize: selectedTool === 'text' ? 24 : undefined
      }

      setElements(prev => [...prev, newElement])
      setSelectedElement(newElement.id)
      setSelectedTool('select')
      
      // Track usage
      actions.incrementUsage('imageGenerations')
    }
  }

  const deleteSelectedElement = () => {
    if (selectedElement) {
      setElements(prev => prev.filter(el => el.id !== selectedElement))
      setSelectedElement(null)
    }
  }

  const exportCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Create a temporary canvas for export
    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = canvasWidth
    exportCanvas.height = canvasHeight
    const ctx = exportCanvas.getContext('2d')
    
    if (!ctx) return

    // Draw white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Draw all elements
    elements.forEach(element => {
      ctx.fillStyle = element.color

      switch (element.type) {
        case 'rectangle':
          ctx.fillRect(element.x, element.y, element.width, element.height)
          break
        case 'circle':
          ctx.beginPath()
          ctx.arc(
            element.x + element.width / 2, 
            element.y + element.height / 2, 
            Math.min(element.width, element.height) / 2, 
            0, 
            2 * Math.PI
          )
          ctx.fill()
          break
        case 'text':
          ctx.font = `${element.fontSize || 24}px Arial`
          ctx.fillText(element.content || 'Text', element.x, element.y + (element.fontSize || 24))
          break
      }
    })

    // Download
    const link = document.createElement('a')
    link.download = `design_${Date.now()}.png`
    link.href = exportCanvas.toDataURL()
    link.click()
  }

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#6B7280', '#000000'
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <GlobalHeader title="Design Studio" />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Toolbar */}
        <div className="w-16 bg-card border-r border-border flex flex-col items-center py-4 space-y-2">
          <button
            onClick={() => setSelectedTool('select')}
            className={cn(
              'p-3 rounded-lg transition-colors',
              selectedTool === 'select' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            )}
          >
            <Move className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSelectedTool('text')}
            className={cn(
              'p-3 rounded-lg transition-colors',
              selectedTool === 'text' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            )}
          >
            <Type className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSelectedTool('rectangle')}
            className={cn(
              'p-3 rounded-lg transition-colors',
              selectedTool === 'rectangle' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            )}
          >
            <Square className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSelectedTool('circle')}
            className={cn(
              'p-3 rounded-lg transition-colors',
              selectedTool === 'circle' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            )}
          >
            <Circle className="w-5 h-5" />
          </button>

          <div className="h-px bg-border w-8 my-2" />

          {selectedElement && (
            <button
              onClick={deleteSelectedElement}
              className="p-3 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Controls */}
          <div className="h-12 bg-card border-b border-border flex items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={exportCanvas}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export PNG
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-hidden">
            <div className="bg-white shadow-lg">
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                onClick={handleCanvasClick}
                className="cursor-crosshair"
                style={{ 
                  width: canvasWidth * zoom, 
                  height: canvasHeight * zoom,
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              />
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-64 bg-card border-l border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">Properties</h3>
          
          {/* Color Picker */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  className={cn(
                    'w-8 h-8 rounded-lg border-2 transition-all',
                    currentColor === color 
                      ? 'border-primary scale-110' 
                      : 'border-gray-300'
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Element Info */}
          {selectedElement && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Selected Element
                </label>
                <p className="text-sm text-muted-foreground">
                  {elements.find(el => el.id === selectedElement)?.type || 'None'}
                </p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-foreground mb-2">How to use:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Select a tool from the toolbar</li>
              <li>• Click on canvas to add elements</li>
              <li>• Use select tool to move elements</li>
              <li>• Export as PNG when done</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}





