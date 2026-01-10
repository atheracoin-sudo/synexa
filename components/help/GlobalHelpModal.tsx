'use client'

import { useState } from 'react'
import { X, MessageSquare, Code2, Image, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface GlobalHelpModalProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

const helpItems = [
  {
    id: 'chat',
    title: 'Chat nasıl kullanılır?',
    description: 'AI ile sohbet et, sorular sor, kod yazdır',
    icon: MessageSquare,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    steps: [
      'Mesaj kutusuna sorununu yaz',
      'AI sana cevap verecek',
      'Devam eden sohbet yapabilirsin'
    ]
  },
  {
    id: 'code',
    title: 'App nasıl oluşturulur?',
    description: 'Kod yaz, uygulama oluştur, canlı önizle',
    icon: Code2,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    steps: [
      'Code Studio\'ya git',
      'Ne yapmak istediğini anlat',
      'AI senin için kod yazacak'
    ]
  },
  {
    id: 'design',
    title: 'Tasarım nasıl yapılır?',
    description: 'Görsel oluştur, düzenle, indir',
    icon: Image,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    steps: [
      'Design Studio\'ya git',
      'Hangi görseli istediğini söyle',
      'AI senin için oluşturacak'
    ]
  }
]

export function GlobalHelpModal({ isOpen, onClose, className }: GlobalHelpModalProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  if (!isOpen) return null

  const selectedHelpItem = helpItems.find(item => item.id === selectedItem)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className={cn('w-full max-w-md bg-background', className)}>
        {!selectedItem ? (
          // Main help menu
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Nasıl yardımcı olabiliriz?
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Kapat"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Help Items */}
            <div className="space-y-3">
              {helpItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors text-left"
                  >
                    <div className={cn('p-2 rounded-lg', item.bgColor)}>
                      <Icon className={cn('h-4 w-4', item.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </button>
                )
              })}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                Daha fazla yardım için{' '}
                <button 
                  onClick={() => window.open('mailto:support@synexa.ai')}
                  className="text-primary hover:underline"
                >
                  destek@synexa.ai
                </button>
              </p>
            </div>
          </div>
        ) : (
          // Detailed help view
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Geri"
              >
                <X className="h-5 w-5 text-muted-foreground rotate-45" />
              </button>
              <div className="flex items-center gap-2">
                <div className={cn('p-2 rounded-lg', selectedHelpItem?.bgColor)}>
                  {selectedHelpItem && (
                    <selectedHelpItem.icon className={cn('h-4 w-4', selectedHelpItem.color)} />
                  )}
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  {selectedHelpItem?.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-secondary rounded-lg transition-colors ml-auto"
                aria-label="Kapat"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Steps */}
            <div className="space-y-3 mb-6">
              {selectedHelpItem?.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <Button 
              onClick={() => {
                onClose()
                // Navigate to the relevant section
                if (selectedItem === 'chat') window.location.href = '/chat'
                else if (selectedItem === 'code') window.location.href = '/code'
                else if (selectedItem === 'design') window.location.href = '/design'
              }}
              className="w-full"
            >
              Hemen Dene
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}





