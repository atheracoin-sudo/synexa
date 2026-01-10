'use client'

import { useRef, useEffect } from 'react'
import { DesignScene, DesignNode } from '@/lib/types'
import { Stage, Layer, Rect, Circle, Text, Transformer } from 'react-konva'

interface CanvasStageClientProps {
  scene: DesignScene
  selectedNodeId: string | null
  tool: 'select' | 'text' | 'rect' | 'circle'
  onNodeSelect: (nodeId: string | null) => void
  onNodeUpdate: (nodeId: string, updates: Partial<DesignNode>) => void
  onSceneUpdate: (updates: Partial<DesignScene>) => void
}

export default function CanvasStageClient({
  scene,
  selectedNodeId,
  tool,
  onNodeSelect,
  onNodeUpdate,
  onSceneUpdate
}: CanvasStageClientProps) {
  const stageRef = useRef<any>(null)
  const transformerRef = useRef<any>(null)

  // Handle export
  useEffect(() => {
    const handleExport = () => {
      if (stageRef.current) {
        const dataURL = stageRef.current.toDataURL({
          mimeType: 'image/png',
          quality: 1,
          pixelRatio: 2
        })
        
        // Create download link
        const link = document.createElement('a')
        link.download = `${scene.name || 'design'}.png`
        link.href = dataURL
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }

    window.addEventListener('design-export', handleExport)
    return () => window.removeEventListener('design-export', handleExport)
  }, [scene.name])

  // Update transformer when selection changes
  useEffect(() => {
    if (transformerRef.current && stageRef.current) {
      const transformer = transformerRef.current
      const stage = stageRef.current
      
      if (selectedNodeId) {
        const selectedNode = stage.findOne(`#${selectedNodeId}`)
        if (selectedNode) {
          transformer.nodes([selectedNode])
          transformer.getLayer()?.batchDraw()
        }
      } else {
        transformer.nodes([])
        transformer.getLayer()?.batchDraw()
      }
    }
  }, [selectedNodeId])

  const handleStageClick = (e: any) => {
    // Deselect when clicking on empty area
    if (e.target === e.target.getStage()) {
      onNodeSelect(null)
    }
  }

  const handleNodeClick = (nodeId: string) => {
    onNodeSelect(nodeId)
  }

  const handleNodeDragEnd = (nodeId: string, e: any) => {
    const node = e.target
    onNodeUpdate(nodeId, {
      x: node.x(),
      y: node.y()
    })
  }

  const handleTransformEnd = (nodeId: string, e: any) => {
    const node = e.target
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    // Reset scale and update width/height instead
    node.scaleX(1)
    node.scaleY(1)

    onNodeUpdate(nodeId, {
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      rotation: node.rotation()
    })
  }

  const renderNode = (node: DesignNode) => {
    const commonProps = {
      id: node.id,
      key: node.id,
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      fill: node.fill,
      stroke: node.stroke,
      strokeWidth: node.strokeWidth || 0,
      rotation: node.rotation || 0,
      draggable: true,
      onClick: () => handleNodeClick(node.id),
      onDragEnd: (e: any) => handleNodeDragEnd(node.id, e),
      onTransformEnd: (e: any) => handleTransformEnd(node.id, e)
    }

    switch (node.type) {
      case 'rect':
        return <Rect {...commonProps} />
      
      case 'circle':
        return (
          <Circle
            {...commonProps}
            radius={Math.min(node.width, node.height) / 2}
            x={node.x + node.width / 2}
            y={node.y + node.height / 2}
          />
        )
      
      case 'text':
        return (
          <Text
            {...commonProps}
            text={node.text || 'Text'}
            fontSize={node.fontSize || 16}
            fontFamily={node.fontFamily || 'Arial'}
            onDblClick={() => {
              const newText = prompt('Metni düzenleyin:', node.text || '')
              if (newText !== null) {
                onNodeUpdate(node.id, { text: newText })
              }
            }}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Canvas Info */}
      <div className="px-4 py-2 border-b border-border bg-background text-sm text-muted-foreground">
        {scene.width} × {scene.height}px • {scene.nodes.length} öğe
      </div>

      {/* Canvas Container */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div 
          className="bg-white shadow-lg"
          style={{ 
            width: scene.width, 
            height: scene.height,
            minWidth: scene.width,
            minHeight: scene.height
          }}
        >
          <Stage
            ref={stageRef}
            width={scene.width}
            height={scene.height}
            onClick={handleStageClick}
            onTap={handleStageClick}
          >
            <Layer>
              {/* Background */}
              <Rect
                width={scene.width}
                height={scene.height}
                fill={scene.background || '#ffffff'}
              />
              
              {/* Nodes */}
              {scene.nodes.map(renderNode)}
              
              {/* Transformer */}
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  // Limit resize
                  if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox
                  }
                  return newBox
                }}
              />
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  )
}
