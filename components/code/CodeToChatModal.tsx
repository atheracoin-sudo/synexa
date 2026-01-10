'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare, Code, AlertTriangle, FileText, Brain } from 'lucide-react'

interface CodeToChatModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (options: {
    includeSelectedCode: boolean
    includeErrors: boolean
    includeProjectSummary: boolean
    includePreviousContext: boolean
    prompt: string
  }) => void
  selectedCode?: string
  consoleErrors?: string[]
  projectSummary?: string
  hasPreviousContext?: boolean
}

export function CodeToChatModal({
  isOpen,
  onClose,
  onConfirm,
  selectedCode,
  consoleErrors = [],
  projectSummary,
  hasPreviousContext = false
}: CodeToChatModalProps) {
  const [includeSelectedCode, setIncludeSelectedCode] = useState(!!selectedCode)
  const [includeErrors, setIncludeErrors] = useState(consoleErrors.length > 0)
  const [includeProjectSummary, setIncludeProjectSummary] = useState(!!projectSummary)
  const [includePreviousContext, setIncludePreviousContext] = useState(hasPreviousContext)
  const [prompt, setPrompt] = useState('')

  const handleConfirm = () => {
    onConfirm({
      includeSelectedCode,
      includeErrors,
      includeProjectSummary,
      includePreviousContext,
      prompt: prompt.trim()
    })
    onClose()
  }

  const quickPrompts = [
    "Bu hatayı düzelt",
    "Kodu optimize et", 
    "Yeni feature ekle",
    "Code review yap",
    "Refactor önerisi ver"
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-blue-500" />
            Chat'e geri dön
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Code Studio'dan hangi bilgileri Chat'e aktarmak istediğini seç.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* Context Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">Aktarılacak İçerik</h3>
            
            {selectedCode && (
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox 
                  id="selected-code" 
                  checked={includeSelectedCode} 
                  onCheckedChange={(checked) => setIncludeSelectedCode(!!checked)} 
                />
                <div className="flex-1">
                  <Label htmlFor="selected-code" className="text-base font-medium flex items-center gap-2">
                    <Code className="h-4 w-4 text-green-500" />
                    Seçili kod
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedCode.length > 100 ? `${selectedCode.substring(0, 100)}...` : selectedCode}
                  </p>
                </div>
              </div>
            )}

            {consoleErrors.length > 0 && (
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox 
                  id="console-errors" 
                  checked={includeErrors} 
                  onCheckedChange={(checked) => setIncludeErrors(!!checked)} 
                />
                <div className="flex-1">
                  <Label htmlFor="console-errors" className="text-base font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Hata mesajları ({consoleErrors.length})
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Console'daki hata ve uyarı mesajları
                  </p>
                </div>
              </div>
            )}

            {projectSummary && (
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox 
                  id="project-summary" 
                  checked={includeProjectSummary} 
                  onCheckedChange={(checked) => setIncludeProjectSummary(!!checked)} 
                />
                <div className="flex-1">
                  <Label htmlFor="project-summary" className="text-base font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    Proje özeti
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Proje yapısı ve kullanılan teknolojiler
                  </p>
                </div>
              </div>
            )}

            {hasPreviousContext && (
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox 
                  id="previous-context" 
                  checked={includePreviousContext} 
                  onCheckedChange={(checked) => setIncludePreviousContext(!!checked)} 
                />
                <div className="flex-1">
                  <Label htmlFor="previous-context" className="text-base font-medium flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    Önceki chat context'i
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Bu projeyle ilgili önceki sohbet geçmişi
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Prompt Input */}
          <div className="space-y-3">
            <Label htmlFor="prompt" className="text-base font-semibold">
              AI'dan ne istiyorsun?
            </Label>
            <Textarea
              id="prompt"
              placeholder="Örn: Bu hatayı düzelt ve kodu optimize et"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[80px]"
            />
            
            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((quickPrompt) => (
                <Button
                  key={quickPrompt}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(quickPrompt)}
                  className="text-xs"
                >
                  {quickPrompt}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button 
            onClick={handleConfirm} 
            className="w-full bg-gradient-primary hover:opacity-90"
            disabled={!prompt.trim()}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat'te Aç
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            İptal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}





