'use client'

import { useState, useMemo, useCallback, memo } from 'react'
import { FileNode, Workspace } from '@/lib/types'
import { VirtualFileSystem } from '@/lib/fs/virtualFs'
import { 
  File, 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown,
  Trash2,
  Plus,
  Search,
  Edit3,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input, IconButton } from '@/components/ui'

interface FileTreeProps {
  workspace: Workspace
  onFileSelect: (path: string) => void
  onFileDelete: (path: string) => void
  onFileRename?: (path: string, newName: string) => void
}

function FileTree({ workspace, onFileSelect, onFileDelete, onFileRename }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']))
  const [searchQuery, setSearchQuery] = useState('')
  const [renamingPath, setRenamingPath] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  
  const fileTree = useMemo(() => 
    VirtualFileSystem.buildFileTree(workspace.files),
    [workspace.files]
  )

  // Filter files based on search query
  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) return fileTree

    const query = searchQuery.toLowerCase()
    
    const filterNode = (node: FileNode): FileNode | null => {
      if (node.type === 'file') {
        return node.name.toLowerCase().includes(query) ? node : null
      }
      
      const filteredChildren = node.children
        ?.map(filterNode)
        .filter((child): child is FileNode => child !== null)
      
      if (filteredChildren && filteredChildren.length > 0) {
        return { ...node, children: filteredChildren }
      }
      
      return node.name.toLowerCase().includes(query) ? node : null
    }

    return fileTree.map(filterNode).filter((node): node is FileNode => node !== null)
  }, [fileTree, searchQuery])

  const toggleFolder = useCallback((path: string) => {
    setExpandedFolders(prev => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(path)) {
        newExpanded.delete(path)
      } else {
        newExpanded.add(path)
      }
      return newExpanded
    })
  }, [])

  const handleCreateFile = useCallback((folderPath: string) => {
    const fileName = prompt('Yeni dosya adı:')
    if (fileName && fileName.trim()) {
      const fullPath = folderPath ? `${folderPath}/${fileName}` : fileName
      onFileSelect(fullPath)
    }
  }, [onFileSelect])

  const handleStartRename = useCallback((path: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setRenamingPath(path)
    setRenameValue(name)
  }, [])

  const handleRename = useCallback(() => {
    if (renamingPath && renameValue.trim() && onFileRename) {
      onFileRename(renamingPath, renameValue.trim())
    }
    setRenamingPath(null)
    setRenameValue('')
  }, [renamingPath, renameValue, onFileRename])

  const handleCancelRename = useCallback(() => {
    setRenamingPath(null)
    setRenameValue('')
  }, [])

  const renderNode = useCallback((node: FileNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.path) || searchQuery.trim().length > 0
    const isActive = workspace.activeFile === node.path
    const isRenaming = renamingPath === node.path
    const paddingLeft = level * 16 + 8

    return (
      <div key={node.id}>
        <div
          className={cn(
            "flex items-center py-1.5 px-2 text-sm cursor-pointer group transition-colors",
            isActive 
              ? "bg-primary/10 text-primary border-l-2 border-primary" 
              : "hover:bg-secondary/50 border-l-2 border-transparent"
          )}
          style={{ paddingLeft }}
          onClick={() => {
            if (isRenaming) return
            if (node.type === 'file') {
              onFileSelect(node.path)
            } else {
              toggleFolder(node.path)
            }
          }}
        >
          {/* Folder expand icon */}
          {node.type === 'folder' && (
            <div className="flex items-center mr-1 flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
          )}
          
          {/* File/Folder icon */}
          <div className="flex items-center mr-2 flex-shrink-0">
            {node.type === 'file' ? (
              <File className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
            ) : isExpanded ? (
              <FolderOpen className="h-4 w-4 text-yellow-500" />
            ) : (
              <Folder className="h-4 w-4 text-yellow-500" />
            )}
          </div>
          
          {/* Name or rename input */}
          {isRenaming ? (
            <div className="flex items-center gap-1 flex-1" onClick={e => e.stopPropagation()}>
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename()
                  if (e.key === 'Escape') handleCancelRename()
                }}
                className="flex-1 px-1.5 py-0.5 text-sm bg-background border border-primary rounded focus:outline-none"
                autoFocus
              />
              <IconButton
                aria-label="Kaydet"
                variant="ghost"
                size="sm"
                onClick={handleRename}
              >
                <File className="h-3 w-3" />
              </IconButton>
              <IconButton
                aria-label="İptal"
                variant="ghost"
                size="sm"
                onClick={handleCancelRename}
              >
                <X className="h-3 w-3" />
              </IconButton>
            </div>
          ) : (
            <span className="flex-1 truncate text-sm">{node.name}</span>
          )}
          
          {/* Actions */}
          {!isRenaming && (
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-1">
              {node.type === 'folder' && (
                <IconButton
                  aria-label="Yeni dosya"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCreateFile(node.path)
                  }}
                >
                  <Plus className="h-3 w-3" />
                </IconButton>
              )}
              
              {node.type === 'file' && onFileRename && (
                <IconButton
                  aria-label="Yeniden adlandır"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleStartRename(node.path, node.name, e)}
                >
                  <Edit3 className="h-3 w-3" />
                </IconButton>
              )}
              
              {node.type === 'file' && (
                <IconButton
                  aria-label="Dosyayı sil"
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onFileDelete(node.path)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </IconButton>
              )}
            </div>
          )}
        </div>
        
        {/* Children */}
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }, [
    expandedFolders, 
    searchQuery, 
    workspace.activeFile, 
    renamingPath, 
    renameValue, 
    onFileSelect, 
    toggleFolder, 
    handleCreateFile, 
    handleStartRename,
    handleRename,
    handleCancelRename,
    onFileDelete,
    onFileRename
  ])

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-foreground">{workspace.name}</h3>
          <IconButton
            aria-label="Yeni dosya"
            variant="ghost"
            size="sm"
            onClick={() => handleCreateFile('')}
          >
            <Plus className="h-4 w-4" />
          </IconButton>
        </div>
        
        {/* Search */}
        <Input
          placeholder="Dosya ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="h-3.5 w-3.5" />}
          rightIcon={
            searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X className="h-3.5 w-3.5 hover:text-foreground transition-colors" />
              </button>
            )
          }
          className="h-8 text-xs"
        />
      </div>
      
      {/* Tree */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredTree.length > 0 ? (
          filteredTree.map(node => renderNode(node))
        ) : searchQuery ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Sonuç bulunamadı
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Dosya yok
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(FileTree)
