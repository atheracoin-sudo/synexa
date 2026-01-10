'use client'

import { memo, useCallback } from 'react'
import { DesignScene, DesignNode } from '@/lib/types'
import { Settings, Palette, Type, Move, RotateCw, Maximize } from 'lucide-react'
import { Card, Badge, Input, Separator } from '@/components/ui'
import { cn } from '@/lib/utils'

interface PropertiesPanelProps {
  scene: DesignScene
  selectedNode: DesignNode | null
  onNodeUpdate: (nodeId: string, updates: Partial<DesignNode>) => void
  onSceneUpdate: (updates: Partial<DesignScene>) => void
}

function PropertiesPanel({
  scene,
  selectedNode,
  onNodeUpdate,
  onSceneUpdate
}: PropertiesPanelProps) {
  const handleNodeChange = useCallback((field: keyof DesignNode, value: any) => {
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { [field]: value })
    }
  }, [selectedNode, onNodeUpdate])

  const handleSceneChange = useCallback((field: keyof DesignScene, value: any) => {
    onSceneUpdate({ [field]: value })
  }, [onSceneUpdate])

  const InputGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )

  const NumberInput = ({ 
    value, 
    onChange, 
    min, 
    placeholder 
  }: { 
    value: number; 
    onChange: (v: number) => void; 
    min?: number; 
    placeholder?: string 
  }) => (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      min={min}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
    />
  )

  const ColorInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-lg border border-border cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-mono uppercase"
      />
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Özellikler</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-6">
        {/* Canvas Properties */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Maximize className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-medium text-foreground">Canvas</h4>
          </div>
          
          <div className="space-y-3">
            <InputGroup label="Boyut (px)">
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">W</div>
                  <NumberInput
                    value={scene.width}
                    onChange={(v) => handleSceneChange('width', v || 1080)}
                    min={1}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">H</div>
                  <NumberInput
                    value={scene.height}
                    onChange={(v) => handleSceneChange('height', v || 1080)}
                    min={1}
                  />
                </div>
              </div>
            </InputGroup>

            <InputGroup label="Arka Plan">
              <ColorInput
                value={scene.background || '#ffffff'}
                onChange={(v) => handleSceneChange('background', v)}
              />
            </InputGroup>
          </div>
        </div>

        <Separator />

        {/* Node Properties */}
        {selectedNode ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium text-foreground">Seçili Öğe</h4>
              </div>
              <Badge variant="primary" size="sm">
                {selectedNode.type === 'text' ? 'Metin' : 
                 selectedNode.type === 'rect' ? 'Dikdörtgen' : 'Daire'}
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Position */}
              <InputGroup label="Konum (px)">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">X</div>
                    <NumberInput
                      value={Math.round(selectedNode.x)}
                      onChange={(v) => handleNodeChange('x', v)}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">Y</div>
                    <NumberInput
                      value={Math.round(selectedNode.y)}
                      onChange={(v) => handleNodeChange('y', v)}
                    />
                  </div>
                </div>
              </InputGroup>

              {/* Size */}
              <InputGroup label="Boyut (px)">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">W</div>
                    <NumberInput
                      value={Math.round(selectedNode.width)}
                      onChange={(v) => handleNodeChange('width', v || 1)}
                      min={1}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">H</div>
                    <NumberInput
                      value={Math.round(selectedNode.height)}
                      onChange={(v) => handleNodeChange('height', v || 1)}
                      min={1}
                    />
                  </div>
                </div>
              </InputGroup>

              {/* Rotation */}
              <InputGroup label="Döndürme (°)">
                <div className="flex items-center gap-2">
                  <RotateCw className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={selectedNode.rotation || 0}
                    onChange={(e) => handleNodeChange('rotation', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-10 text-right">
                    {selectedNode.rotation || 0}°
                  </span>
                </div>
              </InputGroup>

              <Separator />

              {/* Fill Color */}
              <InputGroup label="Dolgu Rengi">
                <ColorInput
                  value={selectedNode.fill || '#000000'}
                  onChange={(v) => handleNodeChange('fill', v)}
                />
              </InputGroup>

              {/* Stroke (for shapes) */}
              {selectedNode.type !== 'text' && (
                <>
                  <InputGroup label="Çerçeve Rengi">
                    <ColorInput
                      value={selectedNode.stroke || '#000000'}
                      onChange={(v) => handleNodeChange('stroke', v)}
                    />
                  </InputGroup>

                  <InputGroup label="Çerçeve Kalınlığı">
                    <NumberInput
                      value={selectedNode.strokeWidth || 0}
                      onChange={(v) => handleNodeChange('strokeWidth', v)}
                      min={0}
                    />
                  </InputGroup>
                </>
              )}

              {/* Text Properties */}
              {selectedNode.type === 'text' && (
                <>
                  <Separator />
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Type className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium text-foreground">Metin</h4>
                  </div>

                  <InputGroup label="İçerik">
                    <textarea
                      value={selectedNode.text || ''}
                      onChange={(e) => handleNodeChange('text', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                    />
                  </InputGroup>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <InputGroup label="Font Boyutu">
                        <NumberInput
                          value={selectedNode.fontSize || 16}
                          onChange={(v) => handleNodeChange('fontSize', v || 16)}
                          min={8}
                        />
                      </InputGroup>
                    </div>
                    <div className="flex-1">
                      <InputGroup label="Font">
                        <select
                          value={selectedNode.fontFamily || 'Arial'}
                          onChange={(e) => handleNodeChange('fontFamily', e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        >
                          <option value="Arial">Arial</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Courier New">Courier New</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Verdana">Verdana</option>
                        </select>
                      </InputGroup>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <Palette className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Öğe seçilmedi</p>
            <p className="text-xs mt-1">Düzenlemek için canvas'tan bir öğe seçin</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(PropertiesPanel)
