'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { 
  Settings, 
  Plus, 
  Save, 
  Download, 
  Menu,
  Sun,
  Moon,
  Monitor,
  Keyboard,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, IconButton } from '@/components/ui'
import { useTheme } from '@/components/providers/ThemeProvider'

const modeConfig = {
  '/chat': {
    title: 'AI Chat',
    description: 'Sohbet modunda AI asistanınızla konuşun',
    actions: [
      { icon: Plus, label: 'Yeni Sohbet', action: 'new-chat', variant: 'secondary' as const }
    ]
  },
  '/code': {
    title: 'Code Studio',
    description: 'AI ile kod yazın ve düzenleyin',
    actions: [
      { icon: Plus, label: 'Yeni Dosya', action: 'new-file', variant: 'secondary' as const },
      { icon: Save, label: 'Kaydet', action: 'save', variant: 'ghost' as const }
    ]
  },
  '/design': {
    title: 'Design Studio',
    description: 'AI ile tasarım oluşturun',
    actions: [
      { icon: Plus, label: 'Yeni Tasarım', action: 'new-design', variant: 'secondary' as const },
      { icon: Download, label: 'Export', action: 'export', variant: 'ghost' as const }
    ]
  }
}

interface TopbarProps {
  onMenuClick?: () => void
}

// Dropdown position type
interface DropdownPosition {
  top: number
  right: number
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname()
  const config = modeConfig[pathname as keyof typeof modeConfig] || modeConfig['/chat']
  const { theme, setTheme } = useTheme()
  const [showSettings, setShowSettings] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 0, right: 0 })
  const [mounted, setMounted] = useState(false)
  
  const settingsButtonRef = useRef<HTMLButtonElement>(null)

  // Mount check for portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate dropdown position when opening
  useEffect(() => {
    if (showSettings && settingsButtonRef.current) {
      const rect = settingsButtonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 8, // 8px offset
        right: window.innerWidth - rect.right,
      })
    }
  }, [showSettings])

  // Close dropdown on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSettings(false)
        setShowShortcuts(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleAction = (action: string) => {
    window.dispatchEvent(new CustomEvent(`studio-action:${action}`))
  }

  const themeOptions = [
    { value: 'light' as const, icon: Sun, label: 'Açık' },
    { value: 'dark' as const, icon: Moon, label: 'Koyu' },
    { value: 'system' as const, icon: Monitor, label: 'Sistem' },
  ]

  const shortcuts = [
    { keys: ['Ctrl', 'Enter'], description: 'AI generate / Send' },
    { keys: ['Ctrl', 'S'], description: 'Kaydet' },
    { keys: ['Ctrl', 'N'], description: 'Yeni' },
    { keys: ['Escape'], description: 'İptal / Kapat' },
  ]

  // Settings Dropdown Portal Content
  const settingsDropdown = showSettings && mounted ? createPortal(
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[9998]" 
        onClick={() => setShowSettings(false)}
      />
      {/* Dropdown */}
      <div 
        className="fixed w-56 bg-card border border-border rounded-xl shadow-xl z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        style={{
          top: dropdownPosition.top,
          right: dropdownPosition.right,
        }}
      >
        {/* Theme section */}
        <div className="p-3 border-b border-border">
          <div className="text-xs font-medium text-muted-foreground mb-2">Tema</div>
          <div className="flex gap-1">
            {themeOptions.map((option) => {
              const Icon = option.icon
              const isActive = theme === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setTheme(option.value)
                  }}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-colors',
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{option.label}</span>
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Shortcuts link */}
        <button
          onClick={() => {
            setShowSettings(false)
            setShowShortcuts(true)
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
        >
          <Keyboard className="h-4 w-4 text-muted-foreground" />
          <span>Klavye Kısayolları</span>
        </button>
      </div>
    </>,
    document.body
  ) : null

  // Shortcuts Modal Portal Content
  const shortcutsModal = showShortcuts && mounted ? createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
        onClick={() => setShowShortcuts(false)}
      />
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-xl animate-in zoom-in-95 fade-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Klavye Kısayolları</h2>
          <IconButton
            aria-label="Kapat"
            variant="ghost"
            size="sm"
            onClick={() => setShowShortcuts(false)}
          >
            <X className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="p-4 space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, i) => (
                  <span key={i}>
                    <kbd className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded border border-border">
                      {key}
                    </kbd>
                    {i < shortcut.keys.length - 1 && (
                      <span className="text-muted-foreground mx-1">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  ) : null

  return (
    <>
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm relative z-40">
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          {/* Left: Menu button (mobile) + Title */}
          <div className="flex items-center gap-3">
            <IconButton
              aria-label="Menü"
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </IconButton>
            
            <div>
              <h1 className="text-base font-semibold text-foreground">{config.title}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{config.description}</p>
            </div>
          </div>
          
          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Mode-specific actions */}
            {config.actions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.action}
                  variant={action.variant}
                  size="sm"
                  onClick={() => handleAction(action.action)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{action.label}</span>
                </Button>
              )
            })}
            
            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-border mx-1" />
            
            {/* Settings button */}
            <IconButton
              ref={settingsButtonRef}
              aria-label="Ayarlar"
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-5 w-5" />
            </IconButton>
          </div>
        </div>
      </header>

      {/* Portaled dropdowns */}
      {settingsDropdown}
      {shortcutsModal}
    </>
  )
}
