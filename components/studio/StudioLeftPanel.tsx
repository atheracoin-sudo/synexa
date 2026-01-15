'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { LeftPanelTab } from '@/app/(app)/studio/page'
import {
  DocumentIcon,
  CubeIcon,
  PhotoIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

interface StudioLeftPanelProps {
  activeTab: LeftPanelTab
  onTabChange: (tab: LeftPanelTab) => void
}

const tabs = [
  { id: 'pages' as const, label: 'Pages', icon: DocumentIcon },
  { id: 'components' as const, label: 'Components', icon: CubeIcon },
  { id: 'assets' as const, label: 'Assets', icon: PhotoIcon }
]

const mockPages = [
  { id: '1', name: 'Home', type: 'screen' },
  { id: '2', name: 'Auth', type: 'screen' },
  { id: '3', name: 'Dashboard', type: 'screen' }
]

const mockComponents = [
  { id: '1', name: 'Button', category: 'Form' },
  { id: '2', name: 'Input Field', category: 'Form' },
  { id: '3', name: 'Card', category: 'Layout' },
  { id: '4', name: 'Modal', category: 'Overlay' }
]

const brandColors = [
  { name: 'Primary', value: '#3B82F6' },
  { name: 'Secondary', value: '#8B5CF6' },
  { name: 'Success', value: '#10B981' },
  { name: 'Warning', value: '#F59E0B' },
  { name: 'Error', value: '#EF4444' }
]

const typography = [
  { name: 'Heading 1', style: 'text-4xl font-bold' },
  { name: 'Heading 2', style: 'text-3xl font-semibold' },
  { name: 'Heading 3', style: 'text-2xl font-medium' },
  { name: 'Body', style: 'text-base' },
  { name: 'Caption', style: 'text-sm text-muted-foreground' }
]

export function StudioLeftPanel({ activeTab, onTabChange }: StudioLeftPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredComponents = mockComponents.filter(component =>
    component.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-80 bg-background border-r border-border flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-muted text-foreground border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'pages' && (
          <div className="p-4">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mb-4">
              <PlusIcon className="w-4 h-4" />
              New Page
            </button>

            {mockPages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground text-sm mb-2">
                  Studio'da henüz ekran yok. '+ New Page' ile başla.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {mockPages.map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  >
                    <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                      <DocumentIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{page.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{page.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'components' && (
          <div className="p-4">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mb-4">
              <PlusIcon className="w-4 h-4" />
              Create Component
            </button>

            <div className="relative mb-4">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search components…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
            </div>

            <div className="space-y-2">
              {filteredComponents.map((component) => (
                <div
                  key={component.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                    <CubeIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{component.name}</div>
                    <div className="text-xs text-muted-foreground">{component.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="p-4 space-y-6">
            {/* Brand Colors */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Brand Colors</h3>
              <div className="grid grid-cols-2 gap-2">
                {brandColors.map((color) => (
                  <div
                    key={color.name}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  >
                    <div
                      className="w-6 h-6 rounded border border-border"
                      style={{ backgroundColor: color.value }}
                    />
                    <div className="flex-1">
                      <div className="text-xs font-medium text-foreground">{color.name}</div>
                      <div className="text-xs text-muted-foreground">{color.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Typography</h3>
              <div className="space-y-2">
                {typography.map((type) => (
                  <div
                    key={type.name}
                    className="p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  >
                    <div className="text-xs text-muted-foreground mb-1">{type.name}</div>
                    <div className={cn("text-foreground", type.style)}>
                      Sample Text
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Icons */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Icons</h3>
              <div className="grid grid-cols-4 gap-2">
                {[DocumentIcon, CubeIcon, PhotoIcon, PlusIcon, MagnifyingGlassIcon].map((Icon, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 bg-muted rounded flex items-center justify-center hover:bg-muted/80 cursor-pointer transition-colors"
                  >
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Images</h3>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="aspect-square bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 cursor-pointer transition-colors"
                  >
                    <PhotoIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}