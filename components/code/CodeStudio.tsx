'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { Workspace } from '@/lib/types'
import { VirtualFileSystem } from '@/lib/fs/virtualFs'
import FileTree from './FileTree'
import EditorPane from './EditorPane'
import AIPanel from './AIPanel'
import { useToast } from '@/components/ui/Toast'

function CodeStudio() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  useEffect(() => {
    // Load or create default workspace
    let ws = VirtualFileSystem.getWorkspace('default')
    if (!ws) {
      ws = VirtualFileSystem.createDefaultWorkspace()
      VirtualFileSystem.saveWorkspace(ws)
    }
    setWorkspace(ws)
    setLoading(false)
  }, [])

  // Listen for topbar actions
  useEffect(() => {
    const handleNewFile = () => {
      if (!workspace) return
      
      const fileName = prompt('Dosya adı girin:')
      if (fileName && fileName.trim()) {
        const path = fileName.startsWith('src/') ? fileName : `src/${fileName}`
        const updatedWorkspace = VirtualFileSystem.createFile(workspace, path, '')
        setWorkspace(updatedWorkspace)
        VirtualFileSystem.saveWorkspace(updatedWorkspace)
        addToast({
          type: 'success',
          title: 'Dosya oluşturuldu',
          description: path,
        })
      }
    }

    const handleSave = () => {
      if (workspace) {
        VirtualFileSystem.saveWorkspace(workspace)
        addToast({
          type: 'success',
          title: 'Kaydedildi',
          description: 'Tüm değişiklikler kaydedildi',
        })
      }
    }

    window.addEventListener('studio-action:new-file', handleNewFile)
    window.addEventListener('studio-action:save', handleSave)
    
    return () => {
      window.removeEventListener('studio-action:new-file', handleNewFile)
      window.removeEventListener('studio-action:save', handleSave)
    }
  }, [workspace, addToast])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('studio-action:save'))
      }
      
      // Ctrl+N for new file
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('studio-action:new-file'))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleFileSelect = useCallback((path: string) => {
    if (!workspace) return
    
    // Check if file exists, if not create it
    const fileExists = Array.isArray(workspace.files) && workspace.files.some(f => f.path === path)
    
    if (!fileExists) {
      const updatedWorkspace = VirtualFileSystem.createFile(workspace, path, '')
      setWorkspace({
        ...updatedWorkspace,
        activeFile: path
      })
      VirtualFileSystem.saveWorkspace(updatedWorkspace)
    } else {
      setWorkspace({
        ...workspace,
        activeFile: path
      })
    }
  }, [workspace])

  const handleFileContentChange = useCallback((path: string, content: string) => {
    if (!workspace) return
    
    const updatedWorkspace = VirtualFileSystem.updateFileContent(workspace, path, content)
    setWorkspace(updatedWorkspace)
    // Auto-save is handled in EditorPane
  }, [workspace])

  const handleFileDelete = useCallback((path: string) => {
    if (!workspace) return
    
    if (confirm(`"${path}" dosyasını silmek istediğinizden emin misiniz?`)) {
      const updatedWorkspace = VirtualFileSystem.deleteFile(workspace, path)
      setWorkspace(updatedWorkspace)
      VirtualFileSystem.saveWorkspace(updatedWorkspace)
      addToast({
        type: 'success',
        title: 'Dosya silindi',
        description: path,
      })
    }
  }, [workspace, addToast])

  const handleFileRename = useCallback((path: string, newName: string) => {
    if (!workspace) return
    
    const parentPath = path.split('/').slice(0, -1).join('/')
    const newPath = parentPath ? `${parentPath}/${newName}` : newName
    
    const updatedWorkspace = VirtualFileSystem.renameFile(workspace, path, newPath)
    setWorkspace(updatedWorkspace)
    VirtualFileSystem.saveWorkspace(updatedWorkspace)
    addToast({
      type: 'success',
      title: 'Dosya yeniden adlandırıldı',
      description: `${path} → ${newPath}`,
    })
  }, [workspace, addToast])

  const handleWorkspaceUpdate = useCallback((updatedWorkspace: Workspace) => {
    setWorkspace(updatedWorkspace)
    VirtualFileSystem.saveWorkspace(updatedWorkspace)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Workspace yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-center text-destructive">
          <p className="font-medium">Workspace yüklenemedi</p>
          <p className="text-sm mt-1">Lütfen sayfayı yenileyin</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-background">
      {/* File Tree */}
      <div className="w-64 border-r border-border flex-shrink-0 hidden md:block">
        <FileTree
          workspace={workspace}
          onFileSelect={handleFileSelect}
          onFileDelete={handleFileDelete}
          onFileRename={handleFileRename}
        />
      </div>

      {/* Editor */}
      <div className="flex-1 flex min-w-0">
        <div className="flex-1 min-w-0">
          <EditorPane
            workspace={workspace}
            onContentChange={handleFileContentChange}
          />
        </div>

        {/* AI Panel */}
        <div className="w-80 border-l border-border flex-shrink-0 hidden lg:block">
          <AIPanel
            workspace={workspace}
            onWorkspaceUpdate={handleWorkspaceUpdate}
          />
        </div>
      </div>
    </div>
  )
}

export default memo(CodeStudio)
