'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatMode } from '@/app/(app)/chat/page'
import { cn } from '@/lib/utils'
import { 
  PaperAirplaneIcon,
  DocumentTextIcon,
  CubeIcon,
  EyeIcon,
  DevicePhoneMobileIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'
import { BuildAppModal } from './BuildAppModal'

interface ChatComposerProps {
  mode: ChatMode
  value: string
  onChange: (value: string) => void
  onSend: (message: string) => void
  onQuickAction: (prompt: string) => void
  isLoading?: boolean
}

const placeholders = {
  chat: 'Ne yapmak istiyorsun? Hedefini yaz…',
  build: 'Bir ekran tanımla: "Login sayfası" gibi…',
  review: 'Neyi iyileştirelim? UI, akış, performans, erişilebilirlik…'
}

const quickActions = [
  {
    id: 'create-plan',
    label: 'Create Plan',
    icon: DocumentTextIcon,
    prompt: 'Bu proje için detaylı bir plan oluştur. Adımları, teknolojileri ve zaman çizelgesini belirt.'
  },
  {
    id: 'generate-ui-spec',
    label: 'Generate UI Spec',
    icon: CubeIcon,
    prompt: 'Bu uygulama için UI spesifikasyonu oluştur. Bileşenleri, layout\'u ve etkileşimleri detaylandır.'
  },
  {
    id: 'add-to-studio',
    label: 'Add to Studio',
    icon: CubeIcon,
    prompt: 'Bu fikri Studio\'ya ekle ve kodlamaya başlayalım.'
  },
  {
    id: 'create-mobile-preview',
    label: 'Create Mobile Preview',
    icon: DevicePhoneMobileIcon,
    prompt: 'Bu tasarım için mobil önizleme oluştur ve responsive özelliklerini göster.'
  }
]

export function ChatComposer({ mode, value, onChange, onSend, onQuickAction, isLoading = false }: ChatComposerProps) {
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [showBuildAppModal, setShowBuildAppModal] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  const handleSend = () => {
    if (value.trim() && !isLoading) {
      onSend(value)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickActionClick = (prompt: string) => {
    onQuickAction(prompt)
    setShowQuickActions(false)
  }

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Quick Actions */}
        {showQuickActions && (
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">Quick Actions</h4>
              <button
                onClick={() => setShowQuickActions(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickActionClick(action.prompt)}
                  className="flex items-center gap-2 p-3 text-left bg-background hover:bg-muted rounded-md transition-colors"
                >
                  <action.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Composer */}
        <div className="flex gap-3 items-end">
          {/* Quick Actions Button */}
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className={cn(
              'p-3 rounded-xl transition-colors flex-shrink-0',
              showQuickActions
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            )}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>

          {/* Build App Button */}
          <button
            onClick={() => setShowBuildAppModal(true)}
            className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-2 font-medium text-sm shadow-lg hover:shadow-xl flex-shrink-0"
          >
            <RocketLaunchIcon className="w-4 h-4" />
            Build App
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isLoading ? 'Synexa düşünüyor...' : placeholders[mode]}
              disabled={isLoading}
              className={cn(
                "w-full px-4 py-3 pr-12 bg-muted border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[52px] max-h-32 text-foreground placeholder:text-muted-foreground",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              rows={1}
            />
            
            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!value.trim() || isLoading}
              className={cn(
                'absolute right-2 bottom-2 p-2 rounded-xl transition-colors',
                value.trim() && !isLoading
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted-foreground/20 text-muted-foreground cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <PaperAirplaneIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mode-specific hint */}
        <div className="mt-2 text-center text-xs text-muted-foreground">
          {mode === 'chat' && 'Genel sohbet ve yardım için'}
          {mode === 'build' && 'Uygulama ve bileşen oluşturma için'}
          {mode === 'review' && 'Mevcut çalışmaları gözden geçirme için'}
        </div>
      </div>

      {/* Build App Modal */}
      <BuildAppModal
        isOpen={showBuildAppModal}
        onClose={() => setShowBuildAppModal(false)}
      />
    </div>
  )
}