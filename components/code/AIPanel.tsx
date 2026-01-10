'use client'

import { useState, useEffect, useCallback, memo, useRef } from 'react'
import { Workspace, CodePatch } from '@/lib/types'
import { VirtualFileSystem } from '@/lib/fs/virtualFs'
import { Sparkles, Send, Check, X, Loader2, Undo2, Wand2 } from 'lucide-react'
import { Button, IconButton, Card, Textarea } from '@/components/ui'
import { useToast } from '@/components/ui/Toast'
import DiffPreview from './DiffPreview'
import { analyticsManager } from '@/lib/analytics'

interface AIPanelProps {
  workspace: Workspace
  onWorkspaceUpdate: (workspace: Workspace) => void
}

function AIPanel({ workspace, onWorkspaceUpdate }: AIPanelProps) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [patch, setPatch] = useState<CodePatch | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previousWorkspace, setPreviousWorkspace] = useState<Workspace | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { addToast } = useToast()

  // Listen for AI generate shortcut from editor
  useEffect(() => {
    const handleAIGenerate = () => {
      if (prompt.trim() && !isLoading) {
        handleSubmit()
      } else {
        textareaRef.current?.focus()
      }
    }

    window.addEventListener('studio-action:ai-generate', handleAIGenerate)
    return () => window.removeEventListener('studio-action:ai-generate', handleAIGenerate)
  }, [prompt, isLoading])

  // Keyboard shortcut: Ctrl+Enter to submit
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      if (prompt.trim() && !isLoading) {
        handleSubmit()
      }
    }
  }, [prompt, isLoading])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!prompt.trim() || isLoading) return

    setIsLoading(true)
    setError(null)
    setPatch(null)

    try {
      // Use backend API client for authentication
      const { apiClient } = await import('@/lib/api/client')
      
      const response = await apiClient.generateCode({
        prompt: prompt.trim(),
        files: workspace.files,
        activeFilePath: workspace.activeFile,
      })

      if (!response.success) {
        throw new Error(typeof response.error === 'string' ? response.error : 'Backend API error')
      }

            setPatch(response.data || null)
            
            // Track analytics
            // analyticsManager.codeGeneration(
            //   Object.keys(workspace.files).length,
            //   response.data.operations?.length || 0
            // )
            
            addToast({
              type: 'info',
              title: 'Değişiklikler hazır',
              description: 'Uygulamak veya reddetmek için seçim yapın',
            })
    } catch (error) {
      console.error('AI request failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Bir hata oluştu'
      setError(errorMessage)
      addToast({
        type: 'error',
        title: 'AI isteği başarısız',
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyPatch = useCallback(() => {
    if (!patch) return

    // Store previous state for undo
    setPreviousWorkspace({ ...workspace })

    let updatedWorkspace = { ...workspace }

    // Apply each operation
    for (const op of patch.operations) {
      switch (op.op) {
        case 'write':
          updatedWorkspace = VirtualFileSystem.updateFileContent(
            updatedWorkspace,
            op.path,
            op.content || ''
          )
          break
        case 'delete':
          updatedWorkspace = VirtualFileSystem.deleteFile(updatedWorkspace, op.path)
          break
        case 'rename':
          if (op.newPath) {
            updatedWorkspace = VirtualFileSystem.renameFile(
              updatedWorkspace,
              op.path,
              op.newPath
            )
          }
          break
      }
    }

    onWorkspaceUpdate(updatedWorkspace)
    setPatch(null)
    setPrompt('')
    
    addToast({
      type: 'success',
      title: 'Değişiklikler uygulandı',
      description: `${patch.operations.length} işlem başarıyla tamamlandı`,
    })
  }, [patch, workspace, onWorkspaceUpdate, addToast])

  const handleRejectPatch = useCallback(() => {
    setPatch(null)
    addToast({
      type: 'info',
      title: 'Değişiklikler reddedildi',
    })
  }, [addToast])

  const handleUndo = useCallback(() => {
    if (previousWorkspace) {
      onWorkspaceUpdate(previousWorkspace)
      setPreviousWorkspace(null)
      addToast({
        type: 'success',
        title: 'Geri alındı',
        description: 'Önceki duruma dönüldü',
      })
    }
  }, [previousWorkspace, onWorkspaceUpdate, addToast])

  const examplePrompts = [
    'Bir TODO listesi bileşeni ekle',
    'Bu fonksiyonu TypeScript\'e çevir',
    'Error handling ekle',
    'Unit testler yaz',
    'Kodu optimize et',
  ]

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">AI Asistan</h3>
          </div>
          
          {previousWorkspace && (
            <IconButton
              aria-label="Geri al"
              variant="ghost"
              size="sm"
              onClick={handleUndo}
            >
              <Undo2 className="h-4 w-4" />
            </IconButton>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Kod değişiklikleri için AI'dan yardım alın
        </p>
      </div>

      {/* Prompt Input */}
      <div className="p-4 border-b border-border">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ne yapmak istiyorsunuz? Örn: 'Bir kullanıcı authentication sistemi ekle'"
            disabled={isLoading}
            autoResize
            className="min-h-[80px] text-sm"
          />
          
          <Button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            loading={isLoading}
            className="w-full"
          >
            {isLoading ? 'İşleniyor...' : 'Patch Oluştur'}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            <kbd className="px-1.5 py-0.5 bg-secondary rounded font-mono">Ctrl+Enter</kbd> ile gönder
          </p>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 border-b border-border">
          <Card variant="outline" padding="sm" className="border-destructive/30 bg-destructive/5">
            <p className="text-sm text-destructive">{error}</p>
          </Card>
        </div>
      )}

      {/* Patch Preview */}
      {patch && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b border-border">
            <h4 className="font-medium text-foreground mb-2">Önerilen Değişiklikler</h4>
            <p className="text-sm text-muted-foreground mb-4">{patch.plan}</p>
            
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleApplyPatch}
                className="flex-1"
              >
                <Check className="h-4 w-4 mr-2" />
                Uygula
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRejectPatch}
              >
                <X className="h-4 w-4 mr-2" />
                Reddet
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <DiffPreview patch={patch} />
          </div>
        </div>
      )}

      {/* Help Text / Example Prompts */}
      {!patch && !error && !isLoading && (
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-3">Örnek istekler:</p>
            <div className="space-y-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setPrompt(example)
                    textareaRef.current?.focus()
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-foreground text-sm"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(AIPanel)
