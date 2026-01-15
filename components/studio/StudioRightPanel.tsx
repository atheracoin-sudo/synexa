'use client'

import { useState, useEffect } from 'react'
import { CanvasItem } from '@/app/(app)/studio/page'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  AlertTriangle,
  Eye,
  Smartphone,
  PenTool,
  User,
  Settings,
  Lock
} from 'lucide-react'
import { usePremium } from '@/lib/context/PremiumContext'
import { UpgradeModal } from '@/components/premium/UpgradeModal'

interface StudioRightPanelProps {
  selectedItem?: CanvasItem
  onUpdateItem: (itemId: string, updates: Partial<CanvasItem>) => void
}

type AISuggestionTab = 'ux' | 'accessibility' | 'mobile' | 'copywriting'

const aiTabs = [
  { id: 'ux' as const, label: 'UX Improvements', icon: Eye },
  { id: 'accessibility' as const, label: 'Accessibility', icon: User },
  { id: 'mobile' as const, label: 'Mobile Optimization', icon: Smartphone },
  { id: 'copywriting' as const, label: 'Copywriting', icon: PenTool }
]

const mockSuggestions = {
  ux: [
    'Add visual hierarchy with better spacing',
    'Include loading states for better UX',
    'Consider adding micro-interactions',
    'Improve button contrast ratios'
  ],
  accessibility: [
    'Add alt text for images',
    'Ensure keyboard navigation support',
    'Increase color contrast to WCAG AA',
    'Add focus indicators for interactive elements'
  ],
  mobile: [
    'Optimize touch targets (min 44px)',
    'Improve responsive breakpoints',
    'Consider thumb-friendly navigation',
    'Optimize for one-handed use'
  ],
  copywriting: [
    'Make CTA buttons more action-oriented',
    'Simplify technical language',
    'Add helpful error messages',
    'Include progress indicators with clear labels'
  ]
}

export function StudioRightPanel({ selectedItem, onUpdateItem }: StudioRightPanelProps) {
  const [activeAITab, setActiveAITab] = useState<AISuggestionTab>('ux')
  const [itemTitle, setItemTitle] = useState(selectedItem?.title || '')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  
  const { canUseFeature } = usePremium()

  // Update local title when selectedItem changes
  useEffect(() => {
    setItemTitle(selectedItem?.title || '')
  }, [selectedItem?.title])

  const handleTitleChange = (newTitle: string) => {
    setItemTitle(newTitle)
    if (selectedItem) {
      onUpdateItem(selectedItem.id, { title: newTitle })
    }
  }

  const handleApplyChanges = () => {
    if (!canUseFeature('advancedStudio')) {
      setShowUpgradeModal(true)
      return
    }
    
    // Mock apply changes functionality
    console.log(`Applying ${activeAITab} suggestions to ${selectedItem?.title || 'canvas'}`)
    // In a real app, this would apply the AI suggestions to the selected item
  }

  const handleAITabClick = (tabId: AISuggestionTab) => {
    // Only allow UX tab for free users, gate other tabs
    if (tabId !== 'ux' && !canUseFeature('advancedStudio')) {
      setShowUpgradeModal(true)
      return
    }
    setActiveAITab(tabId)
  }

  return (
    <div className="w-80 bg-background border-l border-border flex flex-col">
      {/* Properties Section */}
      <div className="border-b border-border">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">Properties</h2>
          
          {selectedItem ? (
            <div className="space-y-4">
              {/* Item Info */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground capitalize">
                    {selectedItem.type}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ID: {selectedItem.id}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={itemTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="Enter title..."
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Position
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">X</label>
                    <input
                      type="number"
                      value={selectedItem.position.x}
                      onChange={(e) => onUpdateItem(selectedItem.id, {
                        position: { ...selectedItem.position, x: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full px-2 py-1 bg-muted border border-border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Y</label>
                    <input
                      type="number"
                      value={selectedItem.position.y}
                      onChange={(e) => onUpdateItem(selectedItem.id, {
                        position: { ...selectedItem.position, y: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full px-2 py-1 bg-muted border border-border rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Type-specific properties */}
              {selectedItem.type === 'screen' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Screen Size
                  </label>
                  <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                    <option>Desktop (1440px)</option>
                    <option>Tablet (768px)</option>
                    <option>Mobile (375px)</option>
                  </select>
                </div>
              )}

              {selectedItem.type === 'component' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Component Type
                  </label>
                  <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                    <option>Button</option>
                    <option>Input</option>
                    <option>Card</option>
                    <option>Modal</option>
                  </select>
                </div>
              )}

              {selectedItem.type === 'flow' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Flow Type
                  </label>
                  <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                    <option>User Journey</option>
                    <option>Process Flow</option>
                    <option>Decision Tree</option>
                  </select>
                </div>
              )}

              {selectedItem.type === 'note' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Note Content
                  </label>
                  <textarea
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    rows={3}
                    placeholder="Add your notes here..."
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-2">
                Select an item to edit properties
              </h3>
              <p className="text-xs text-muted-foreground">
                Click on any item in the canvas to view and edit its properties
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Suggestions Section */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Synexa Suggestions</h2>
          
          {/* AI Tabs */}
          <div className="grid grid-cols-2 gap-1 mb-4">
            {aiTabs.map((tab) => {
              const isLocked = tab.id !== 'ux' && !canUseFeature('advancedStudio')
              return (
                <button
                  key={tab.id}
                  onClick={() => handleAITabClick(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors relative',
                    activeAITab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                    isLocked && 'opacity-60'
                  )}
                >
                  <tab.icon className="w-3 h-3" />
                  {tab.label}
                  {isLocked && (
                    <Lock className="w-3 h-3 absolute -top-1 -right-1 text-muted-foreground" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Suggestions Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedItem ? (
            <div className="space-y-3">
              {mockSuggestions[activeAITab].map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 bg-muted rounded-lg border border-border hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">{suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Select an item to see AI suggestions
              </p>
            </div>
          )}
        </div>

        {/* Apply Changes Button */}
        <div className="p-4 border-t border-border">
          <button 
            onClick={handleApplyChanges}
            disabled={!selectedItem}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors mb-3 relative",
              selectedItem
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Sparkles className="w-4 h-4" />
            Apply Changes to Canvas
            {!canUseFeature('advancedStudio') && (
              <Lock className="w-3 h-3 absolute -top-1 -right-1" />
            )}
          </button>
          
          {/* Warning */}
          <div className="flex items-start gap-2 p-2 bg-muted/50 border border-border rounded-lg">
            <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              {canUseFeature('advancedStudio') 
                ? 'Uygulanan değişiklikler geri alınabilir.'
                : 'Advanced AI features require Pro plan.'
              }
            </p>
          </div>
        </div>

        {/* Upgrade Modal */}
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          feature="advancedStudio"
        />
      </div>
    </div>
  )
}