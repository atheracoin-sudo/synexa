'use client'

import { useState } from 'react'
import { StudioLeftPanel } from '@/components/studio/StudioLeftPanel'
import { StudioCanvas } from '@/components/studio/StudioCanvas'
import { StudioRightPanel } from '@/components/studio/StudioRightPanel'

export type CanvasItem = {
  id: string
  type: 'screen' | 'component' | 'flow' | 'note'
  title: string
  position: { x: number; y: number }
  selected: boolean
}

export type LeftPanelTab = 'pages' | 'components' | 'assets'

const initialCanvasItems: CanvasItem[] = [
  {
    id: '1',
    type: 'screen',
    title: 'Login Screen',
    position: { x: 100, y: 100 },
    selected: false
  },
  {
    id: '2',
    type: 'component',
    title: 'Primary Button',
    position: { x: 300, y: 150 },
    selected: false
  }
]

export default function StudioPage() {
  const [activeLeftTab, setActiveLeftTab] = useState<LeftPanelTab>('pages')
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>(initialCanvasItems)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  const handleAddCanvasItem = (type: CanvasItem['type']) => {
    const titles = {
      screen: 'New Screen',
      component: 'New Component',
      flow: 'New Flow',
      note: 'New Note'
    }

    const newItem: CanvasItem = {
      id: Date.now().toString(),
      type,
      title: titles[type],
      position: { 
        x: 50 + Math.random() * 200, 
        y: 50 + Math.random() * 200 
      },
      selected: false
    }

    setCanvasItems(prev => [...prev, newItem])
  }

  const handleSelectItem = (itemId: string) => {
    setSelectedItemId(itemId)
    setCanvasItems(prev => 
      prev.map(item => ({
        ...item,
        selected: item.id === itemId
      }))
    )
  }

  const handleUpdateItem = (itemId: string, updates: Partial<CanvasItem>) => {
    setCanvasItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    )
  }

  const selectedItem = canvasItems.find(item => item.id === selectedItemId)

  return (
    <div className="h-full flex bg-background">
      {/* Left Panel */}
      <StudioLeftPanel
        activeTab={activeLeftTab}
        onTabChange={setActiveLeftTab}
      />
      
      {/* Center Canvas */}
      <div className="flex-1 flex flex-col">
        <StudioCanvas
          items={canvasItems}
          onAddItem={handleAddCanvasItem}
          onSelectItem={handleSelectItem}
          onUpdateItem={handleUpdateItem}
        />
      </div>
      
      {/* Right Panel */}
      <StudioRightPanel
        selectedItem={selectedItem}
        onUpdateItem={handleUpdateItem}
      />
    </div>
  )
}