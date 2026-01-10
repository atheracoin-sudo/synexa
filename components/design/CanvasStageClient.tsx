'use client'

import React from 'react'
import { useRef, useEffect } from 'react'
import { DesignScene, DesignNode } from '@/lib/types'
// import { Stage, Layer, Rect, Circle, Text, Transformer } from 'react-konva'

interface CanvasStageClientProps {
  scene: DesignScene
  selectedNodeId: string | null
  onNodeSelect: (nodeId: string | null) => void
  onNodeUpdate: (nodeId: string, updates: Partial<DesignNode>) => void
  onNodeDelete: (nodeId: string) => void
  onNodeAdd: (node: Omit<DesignNode, 'id'>) => void
  onSceneUpdate: (updates: Partial<DesignScene>) => void
}

export default function CanvasStageClient({
  scene,
  selectedNodeId,
  onNodeSelect,
  onNodeUpdate,
  onNodeDelete,
  onNodeAdd,
  onSceneUpdate
}: CanvasStageClientProps) {
  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">
        Canvas component requires react-konva package
      </div>
    </div>
  )
}