'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { DesignScene, DesignNode } from '@/lib/types'
import { generateId } from '@/lib/utils'
import ToolsPanel from './ToolsPanel'
import SimpleCanvas from './SimpleCanvas'
import PropertiesPanel from './PropertiesPanel'
import LayersPanel from './LayersPanel'
import { useToast } from '@/components/ui/use-toast'
import { Button, Textarea } from '@/components/ui'
import { analyticsManager } from '@/lib/analytics'
import { X, Sparkles, Loader2 } from 'lucide-react'

const DEFAULT_SCENE: DesignScene = {
  id: 'default',
  name: 'Untitled Design',
  width: 1080,
  height: 1080,
  nodes: [],
  background: '#ffffff'
}

function DesignStudio() {
  const [scene, setScene] = useState<DesignScene>(DEFAULT_SCENE)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [tool, setTool] = useState<'select' | 'text' | 'rect' | 'circle'>('select')
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  // Load scene from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('synexa-design-scene')
    if (saved) {
      try {
        setScene(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to load scene:', error)
      }
    }
  }, [])

  // Save scene to localStorage
  useEffect(() => {
    localStorage.setItem('synexa-design-scene', JSON.stringify(scene))
  }, [scene])

  // Listen for actions from topbar
  useEffect(() => {
    const handleNewDesign = () => {
      setScene(DEFAULT_SCENE)
      setSelectedNodeId(null)
      localStorage.removeItem('synexa-design-scene')
      toast({
        type: 'success',
        title: 'Yeni tasarım oluşturuldu',
      })
    }

    const handleExport = () => {
      window.dispatchEvent(new CustomEvent('design-export'))
    }

    window.addEventListener('studio-action:new-design', handleNewDesign)
    window.addEventListener('studio-action:export', handleExport)
    
    return () => {
      window.removeEventListener('studio-action:new-design', handleNewDesign)
      window.removeEventListener('studio-action:export', handleExport)
    }
  }, [toast])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected node
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        // Don't delete if user is typing
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return
        }
        e.preventDefault()
        handleNodeDelete(selectedNodeId)
      }

      // Escape to deselect
      if (e.key === 'Escape') {
        setSelectedNodeId(null)
        setTool('select')
      }

      // Ctrl+N for new design
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('studio-action:new-design'))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNodeId])

  const handleAIGenerate = useCallback(async (prompt: string) => {
    setIsGenerating(true)
    setShowAIDialog(false)

    try {
      // Use backend API client
      const { apiClient } = await import('@/lib/api/client')
      
      const response = await apiClient.generateDesign({
        prompt: prompt.trim(),
        width: scene.width,
        height: scene.height,
      })

      if (!response.success) {
        throw new Error(typeof response.error === 'string' ? response.error : 'Backend API error')
      }

      // Update scene with AI-generated design
      const aiScene = response.data?.scene
      const nodes = aiScene?.nodes || []
      setScene(prev => ({
        ...prev,
        nodes: nodes.map((node: any) => ({
          ...node,
          id: generateId(),
        })),
        background: aiScene?.background || prev.background,
      }))
      
      // Track analytics
      // analyticsManager.designGeneration(
      //   nodes.length,
      //   { width: scene.width, height: scene.height }
      // )

      toast({
        type: 'success',
        title: 'AI tasarım oluşturuldu',
        description: `${nodes.length} öğe eklendi`,
      })
    } catch (error) {
      console.error('AI generation failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Bir hata oluştu'
      toast({
        type: 'error',
        title: 'AI tasarım başarısız',
        description: errorMessage,
      })
    } finally {
      setIsGenerating(false)
    }
  }, [scene.width, scene.height, toast])

  const handleAddNode = useCallback((type: 'text' | 'rect' | 'circle') => {
    const newNode: DesignNode = {
      id: generateId(),
      type,
      x: scene.width / 2 - 50,
      y: scene.height / 2 - 25,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 50 : 100,
      fill: type === 'text' ? '#000000' : '#3b82f6',
      stroke: type === 'text' ? undefined : '#1e40af',
      strokeWidth: type === 'text' ? undefined : 2,
      text: type === 'text' ? 'Metin ekleyin' : undefined,
      fontSize: type === 'text' ? 24 : undefined,
      fontFamily: type === 'text' ? 'Arial' : undefined,
    }

    setScene(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }))
    
    setSelectedNodeId(newNode.id)
    setTool('select')
    
    toast({
      type: 'success',
      title: `${type === 'text' ? 'Metin' : type === 'rect' ? 'Dikdörtgen' : 'Daire'} eklendi`,
    })
  }, [scene.width, scene.height, toast])

  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<DesignNode>) => {
    setScene(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }))
  }, [])

  const handleNodeDelete = useCallback((nodeId: string) => {
    setScene(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId)
    }))
    
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null)
    }
    
    toast({
      type: 'success',
      title: 'Öğe silindi',
    })
  }, [selectedNodeId, toast])

  const handleSceneUpdate = useCallback((updates: Partial<DesignScene>) => {
    setScene(prev => ({ ...prev, ...updates }))
  }, [])

  const handleReorderNodes = useCallback((fromIndex: number, toIndex: number) => {
    setScene(prev => {
      const newNodes = [...prev.nodes]
      const [removed] = newNodes.splice(fromIndex, 1)
      newNodes.splice(toIndex, 0, removed)
      return { ...prev, nodes: newNodes }
    })
  }, [])

  const selectedNode = selectedNodeId 
    ? scene.nodes.find(node => node.id === selectedNodeId) || null
    : null

  return (
    <div className="flex h-full bg-background">
      {/* Tools Panel */}
      <div className="w-16 border-r border-border flex-shrink-0">
        <ToolsPanel
          activeTool={tool}
          onToolChange={setTool}
          onAddNode={handleAddNode}
          onAIGenerate={() => setShowAIDialog(true)}
        />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <SimpleCanvas
          scene={scene}
          selectedNodeId={selectedNodeId}
          tool={tool}
          onNodeSelect={setSelectedNodeId}
          onNodeUpdate={handleNodeUpdate}
          onSceneUpdate={handleSceneUpdate}
        />
      </div>

      {/* Right Panels */}
      <div className="w-80 border-l border-border flex-shrink-0 flex flex-col hidden lg:flex">
        {/* Properties Panel */}
        <div className="flex-1 border-b border-border overflow-hidden">
          <PropertiesPanel
            scene={scene}
            selectedNode={selectedNode}
            onNodeUpdate={handleNodeUpdate}
            onSceneUpdate={handleSceneUpdate}
          />
        </div>

        {/* Layers Panel */}
        <div className="h-72 flex-shrink-0">
          <LayersPanel
            nodes={scene.nodes}
            selectedNodeId={selectedNodeId}
            onNodeSelect={setSelectedNodeId}
            onNodeDelete={handleNodeDelete}
            onNodeUpdate={handleNodeUpdate}
            onReorderNodes={handleReorderNodes}
          />
        </div>
      </div>

      {/* AI Dialog */}
      {showAIDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">AI ile Tasarım Oluştur</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIDialog(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const prompt = formData.get('prompt') as string
              if (prompt.trim()) {
                handleAIGenerate(prompt)
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                    Tasarım açıklaması
                  </label>
                  <Textarea
                    id="prompt"
                    name="prompt"
                    placeholder="Örn: Modern bir sosyal medya postu tasarımı, mavi tonlarda, merkeze logo yerleştir"
                    rows={3}
                    required
                    disabled={isGenerating}
                  />
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAIDialog(false)}
                    disabled={isGenerating}
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Oluştur
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(DesignStudio)
