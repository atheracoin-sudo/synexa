'use client'

import { useState } from 'react'
import { 
  FolderIcon, 
  DocumentTextIcon, 
  CodeBracketIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentIcon,
  ArrowTopRightOnSquareIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { usePremium } from '@/lib/context/PremiumContext'
import { UpgradeModal } from '@/components/premium/UpgradeModal'

// Mock project files
const projectFiles = [
  { name: 'app', type: 'folder', children: [
    { name: 'page.tsx', type: 'file', language: 'typescript' },
    { name: 'layout.tsx', type: 'file', language: 'typescript' },
    { name: 'globals.css', type: 'file', language: 'css' },
  ]},
  { name: 'components', type: 'folder', children: [
    { name: 'Chat.tsx', type: 'file', language: 'typescript' },
    { name: 'Button.tsx', type: 'file', language: 'typescript' },
    { name: 'Modal.tsx', type: 'file', language: 'typescript' },
  ]},
  { name: 'lib', type: 'folder', children: [
    { name: 'utils.ts', type: 'file', language: 'typescript' },
    { name: 'api.ts', type: 'file', language: 'typescript' },
  ]},
  { name: 'package.json', type: 'file', language: 'json' },
  { name: 'next.config.js', type: 'file', language: 'javascript' },
  { name: 'tailwind.config.js', type: 'file', language: 'javascript' },
]

// Mock code content
const mockCode = {
  generated: `import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ChatApp() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: input,
      sender: 'user'
    }])
    
    setInput('')
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: 'This is a generated AI response.',
        sender: 'ai'
      }])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={\`p-3 rounded-lg \${
              message.sender === 'user' 
                ? 'bg-primary text-primary-foreground ml-auto max-w-xs' 
                : 'bg-muted max-w-xs'
            }\`}
          >
            {message.text}
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  )
}`,
  project: `// Current project file content
export default function HomePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to Synexa
      </h1>
      <p className="text-lg text-muted-foreground">
        Your AI-powered development platform
      </p>
    </div>
  )
}`
}

interface FileItemProps {
  file: any
  level?: number
  onSelect: (file: any) => void
  selectedFile?: any
}

function FileItem({ file, level = 0, onSelect, selectedFile }: FileItemProps) {
  const [isOpen, setIsOpen] = useState(level === 0)
  const isSelected = selectedFile?.name === file.name

  if (file.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center w-full px-2 py-1 text-sm hover:bg-muted rounded-md transition-colors",
            "text-left"
          )}
          style={{ paddingLeft: `${(level * 12) + 8}px` }}
        >
          <FolderIcon className="h-4 w-4 mr-2 text-muted-foreground" />
          {file.name}
        </button>
        {isOpen && file.children && (
          <div>
            {file.children.map((child: any, index: number) => (
              <FileItem
                key={index}
                file={child}
                level={level + 1}
                onSelect={onSelect}
                selectedFile={selectedFile}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => onSelect(file)}
      className={cn(
        "flex items-center w-full px-2 py-1 text-sm rounded-md transition-colors",
        "text-left",
        isSelected 
          ? "bg-primary/10 text-primary border border-primary/20" 
          : "hover:bg-muted text-foreground"
      )}
      style={{ paddingLeft: `${(level * 12) + 8}px` }}
    >
      <DocumentTextIcon className="h-4 w-4 mr-2 text-muted-foreground" />
      {file.name}
    </button>
  )
}

export default function CodePage() {
  const [selectedFile, setSelectedFile] = useState(projectFiles[0].children?.[0])
  const [activeTab, setActiveTab] = useState<'generated' | 'project'>('generated')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState('')
  
  const { isPremium, canUseFeature } = usePremium()

  const handleCopy = () => {
    const content = activeTab === 'generated' ? mockCode.generated : mockCode.project
    navigator.clipboard.writeText(content)
    // Could add toast notification here
  }

  const handleDownload = () => {
    if (!canUseFeature('download')) {
      setUpgradeFeature('download')
      setShowUpgradeModal(true)
      return
    }
    
    const content = activeTab === 'generated' ? mockCode.generated : mockCode.project
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = selectedFile?.name || 'code.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleOpenInNewTab = () => {
    if (!canUseFeature('openInNewTab')) {
      setUpgradeFeature('openInNewTab')
      setShowUpgradeModal(true)
      return
    }
    
    const content = activeTab === 'generated' ? mockCode.generated : mockCode.project
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(`<pre>${content}</pre>`)
    }
  }

  const handleExportZip = () => {
    if (!canUseFeature('zipExport')) {
      setUpgradeFeature('zipExport')
      setShowUpgradeModal(true)
      return
    }
    
    // Mock ZIP export
    alert('ZIP export would happen here')
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Code Studio</h1>
            <p className="text-sm text-muted-foreground">
              Generate, edit, and manage your project files
            </p>
          </div>
          
          {/* Export Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportZip}
              className="relative"
            >
              {!canUseFeature('zipExport') && (
                <LockClosedIcon className="h-3 w-3 mr-1" />
              )}
              Export ZIP
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
            >
              <ClipboardDocumentIcon className="h-4 w-4 mr-2" />
              Copy All
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Project Files */}
        <div className="w-64 border-r border-border bg-muted/30 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <FolderIcon className="h-4 w-4 mr-2" />
              Project Files
            </h3>
            <div className="space-y-1">
              {projectFiles.map((file, index) => (
                <FileItem
                  key={index}
                  file={file}
                  onSelect={setSelectedFile}
                  selectedFile={selectedFile}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="border-b border-border bg-muted/30">
            <div className="flex">
              <button
                onClick={() => setActiveTab('generated')}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  activeTab === 'generated'
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <CodeBracketIcon className="h-4 w-4 mr-2 inline" />
                Generated
              </button>
              <button
                onClick={() => setActiveTab('project')}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  activeTab === 'project'
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <DocumentTextIcon className="h-4 w-4 mr-2 inline" />
                Project
              </button>
            </div>
          </div>

          {/* Editor Header */}
          <div className="border-b border-border p-2 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedFile?.name || 'No file selected'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                >
                  <ClipboardDocumentIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="relative"
                >
                  {!canUseFeature('download') && (
                    <LockClosedIcon className="h-3 w-3 absolute -top-1 -right-1 text-muted-foreground" />
                  )}
                  <ArrowDownTrayIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleOpenInNewTab}
                  className="relative"
                >
                  {!canUseFeature('openInNewTab') && (
                    <LockClosedIcon className="h-3 w-3 absolute -top-1 -right-1 text-muted-foreground" />
                  )}
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <textarea
              value={activeTab === 'generated' ? mockCode.generated : mockCode.project}
              readOnly
              className="w-full h-full p-4 bg-background text-foreground font-mono text-sm resize-none border-0 outline-none"
              style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
            />
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={upgradeFeature}
      />
    </div>
  )
}