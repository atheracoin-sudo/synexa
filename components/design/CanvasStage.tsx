'use client'

import { useState, useEffect } from 'react'
import { DesignScene, DesignNode } from '@/lib/types'
import dynamic from 'next/dynamic'

// Dynamically import the client component to avoid SSR issues
const CanvasStageClient = dynamic(() => import('./CanvasStageClient'), { 
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-muted-foreground">Canvas yükleniyor...</div>
    </div>
  )
})

interface CanvasStageProps {
  scene: DesignScene
  selectedNodeId: string | null
  tool: 'select' | 'text' | 'rect' | 'circle'
  onNodeSelect: (nodeId: string | null) => void
  onNodeUpdate: (nodeId: string, updates: Partial<DesignNode>) => void
  onSceneUpdate: (updates: Partial<DesignScene>) => void
}

export default function CanvasStage(props: CanvasStageProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-muted-foreground">Canvas yükleniyor...</div>
      </div>
    )
  }

  return <CanvasStageClient {...props} onNodeDelete={() => {}} onNodeAdd={() => {}} />
}
