'use client'

import { useState, useEffect } from 'react'
import { X, Code2, Check, MessageSquare, Brain, Smartphone, Monitor, Layout, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Message } from '@/lib/types'
import { useMemory } from '@/lib/hooks/useMemory'

interface CodeStudioContextModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (context: CodeStudioContext) => void
  targetMessage: Message | null
  recentMessages: Message[]
}

export interface CodeStudioContext {
  targetMessage: Message
  includeRecentMessages: boolean
  recentMessages: Message[]
  includeMemory: boolean
  appType: 'web' | 'mobile' | 'landing' | 'dashboard'
}

const APP_TYPES = [
  {
    id: 'web' as const,
    title: 'Web App',
    description: 'React/Next.js web application',
    icon: Monitor,
  },
  {
    id: 'mobile' as const,
    title: 'Mobile App',
    description: 'React Native mobile app',
    icon: Smartphone,
  },
  {
    id: 'landing' as const,
    title: 'Landing Page',
    description: 'Marketing/product landing page',
    icon: Layout,
  },
  {
    id: 'dashboard' as const,
    title: 'Dashboard',
    description: 'Admin/analytics dashboard',
    icon: BarChart3,
  },
]

export function CodeStudioContextModal({
  isOpen,
  onClose,
  onConfirm,
  targetMessage,
  recentMessages
}: CodeStudioContextModalProps) {
  const [includeRecentMessages, setIncludeRecentMessages] = useState(true)
  const [includeMemory, setIncludeMemory] = useState(true)
  const [selectedAppType, setSelectedAppType] = useState<'web' | 'mobile' | 'landing' | 'dashboard'>('web')
  const { activeMemory } = useMemory()

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleConfirm = () => {
    if (!targetMessage) return

    const context: CodeStudioContext = {
      targetMessage,
      includeRecentMessages,
      recentMessages: includeRecentMessages ? recentMessages.slice(-5) : [],
      includeMemory,
      appType: selectedAppType,
    }

    onConfirm(context)
    onClose()
  }

  if (!isOpen || !targetMessage) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={cn(
          "bg-card border border-border/50 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto",
          "animate-in fade-in slide-in-from-bottom-4 duration-300"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Code Studio'ya aktar
                </h3>
                <p className="text-sm text-muted-foreground">
                  Bu yanıtla bir uygulama oluştur
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Context Selection */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">
                Kullanılacak içerik
              </h4>
              <div className="space-y-3">
                {/* Target Message */}
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
                  <div className="w-5 h-5 rounded border-2 border-primary bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Bu mesaj</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {targetMessage.content.slice(0, 100)}...
                    </p>
                  </div>
                </div>

                {/* Recent Messages */}
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
                  <button
                    onClick={() => setIncludeRecentMessages(!includeRecentMessages)}
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                      includeRecentMessages 
                        ? "border-primary bg-primary" 
                        : "border-muted-foreground"
                    )}
                  >
                    {includeRecentMessages && <Check className="h-3 w-3 text-white" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">
                        Önceki mesajlar (son {Math.min(recentMessages.length, 5)})
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Konuşma bağlamı için önceki mesajları dahil et
                    </p>
                  </div>
                </div>

                {/* Memory */}
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
                  <button
                    onClick={() => setIncludeMemory(!includeMemory)}
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                      includeMemory 
                        ? "border-primary bg-primary" 
                        : "border-muted-foreground"
                    )}
                  >
                    {includeMemory && <Check className="h-3 w-3 text-white" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">
                        Kişisel tercihler ({activeMemory.length})
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tech stack, dil tercihleri ve diğer ayarlar
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* App Type Selection */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">
                Uygulama tipi
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {APP_TYPES.map((appType) => {
                  const Icon = appType.icon
                  const isSelected = selectedAppType === appType.id
                  
                  return (
                    <button
                      key={appType.id}
                      onClick={() => setSelectedAppType(appType.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border/50 hover:border-border"
                      )}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className={cn(
                          "font-medium text-sm",
                          isSelected ? "text-primary" : "text-foreground"
                        )}>
                          {appType.title}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {appType.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 p-6 pt-0">
            <button
              onClick={onClose}
              className={cn(
                "px-4 py-2.5 bg-muted text-muted-foreground font-medium rounded-xl",
                "hover:bg-muted/80 transition-colors"
              )}
            >
              İptal
            </button>
            <button
              onClick={handleConfirm}
              className={cn(
                "flex-1 px-4 py-2.5 bg-gradient-primary text-white font-medium rounded-xl",
                "hover:scale-[1.02] transition-all duration-200 shadow-lg",
                "flex items-center justify-center gap-2"
              )}
            >
              <Code2 className="h-4 w-4" />
              <span>Code Studio'da Aç</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}








