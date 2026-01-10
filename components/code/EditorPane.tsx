'use client'

import { useEffect, useRef, useState, useCallback, memo } from 'react'
import Editor from '@monaco-editor/react'
import { Workspace } from '@/lib/types'
import { VirtualFileSystem } from '@/lib/fs/virtualFs'
import { FileText, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui'
import { useTheme } from '@/components/providers/ThemeProvider'

interface EditorPaneProps {
  workspace: Workspace
  onContentChange: (path: string, content: string) => void
}

function EditorPane({ workspace, onContentChange }: EditorPaneProps) {
  const editorRef = useRef<any>(null)
  const [isSaved, setIsSaved] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { resolvedTheme } = useTheme()

  const currentFile = workspace.activeFile
  const currentContent = currentFile ? VirtualFileSystem.getFileContent(workspace, currentFile) : ''

  // Auto-save with debounce
  const handleEditorChange = useCallback((value: string | undefined) => {
    if (currentFile && value !== undefined) {
      setIsSaved(false)
      
      // Clear previous timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      
      // Set new timeout for auto-save indicator
      saveTimeoutRef.current = setTimeout(() => {
        setIsSaved(true)
      }, 1000)
      
      onContentChange(currentFile, value)
    }
  }, [currentFile, onContentChange])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor
    setIsLoading(false)
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 22,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      bracketPairColorization: { enabled: true },
      padding: { top: 16, bottom: 16 },
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
    })

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      window.dispatchEvent(new CustomEvent('studio-action:save'))
      setIsSaved(true)
    })

    // Ctrl+Enter for AI generate
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      window.dispatchEvent(new CustomEvent('studio-action:ai-generate'))
    })
  }, [])

  const getLanguage = useCallback((filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase()
    
    const languageMap: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      json: 'json',
      md: 'markdown',
      css: 'css',
      scss: 'scss',
      less: 'less',
      html: 'html',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      cc: 'cpp',
      cxx: 'cpp',
      c: 'c',
      rs: 'rust',
      go: 'go',
      php: 'php',
      rb: 'ruby',
      sh: 'shell',
      bash: 'shell',
      yml: 'yaml',
      yaml: 'yaml',
      xml: 'xml',
      sql: 'sql',
      graphql: 'graphql',
      vue: 'vue',
      svelte: 'svelte',
    }
    
    return languageMap[ext || ''] || 'plaintext'
  }, [])

  if (!currentFile) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground max-w-xs">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary/50 flex items-center justify-center">
            <FileText className="h-8 w-8 opacity-50" />
          </div>
          <p className="text-lg font-medium mb-2 text-foreground">Dosya Seçin</p>
          <p className="text-sm">
            Sol panelden bir dosya seçin veya yeni bir dosya oluşturun
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Sticky File Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium text-foreground truncate">
              {currentFile.split('/').pop()}
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block truncate">
              {currentFile}
            </span>
          </div>
        </div>
        
        {/* Save status */}
        <div className="flex items-center gap-2">
          {isSaved ? (
            <Badge variant="success">
              <Check className="h-3 w-3 mr-1" />
              Kaydedildi
            </Badge>
          ) : (
            <Badge variant="warning">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Kaydediliyor...
            </Badge>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        
        <Editor
          height="100%"
          language={getLanguage(currentFile)}
          value={currentContent}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
          loading={
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          }
          options={{
            fontSize: 14,
            lineHeight: 22,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            suggest: {
              showKeywords: true,
              showSnippets: true,
            },
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true,
            },
          }}
        />
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="px-4 py-2 border-t border-border bg-secondary/30 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span>
          <kbd className="px-1.5 py-0.5 bg-secondary rounded font-mono">Ctrl+S</kbd> Kaydet
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-secondary rounded font-mono">Ctrl+Enter</kbd> AI Generate
        </span>
      </div>
    </div>
  )
}

export default memo(EditorPane)
