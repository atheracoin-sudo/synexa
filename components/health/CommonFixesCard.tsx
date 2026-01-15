'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  CheckCircle,
  HelpCircle,
  Wrench,
  ExternalLink
} from 'lucide-react'

interface Fix {
  id: string
  question: string
  description: string
  checked: boolean
}

export function CommonFixesCard() {
  const [fixes, setFixes] = useState<Fix[]>([
    {
      id: '1',
      question: 'Environment variables Vercel\'de tanımlı mı?',
      description: 'OPENAI_API_KEY, DATABASE_URL gibi değişkenler Vercel dashboard\'da Settings > Environment Variables bölümünde tanımlı olmalı.',
      checked: false
    },
    {
      id: '2',
      question: 'Doğru domain / endpoint mi?',
      description: 'API çağrılarında production domain kullanıldığından emin olun. Localhost URL\'leri production\'da çalışmaz.',
      checked: false
    },
    {
      id: '3',
      question: 'CORS / auth hatası var mı?',
      description: 'Browser console\'da CORS hataları veya 401/403 authentication hataları kontrol edin.',
      checked: false
    },
    {
      id: '4',
      question: 'Serverless function timeout sınırı aşılıyor mu?',
      description: 'Vercel\'de serverless function\'lar varsayılan olarak 10 saniye timeout\'a sahiptir. Uzun işlemler için streaming kullanın.',
      checked: false
    }
  ])

  const handleToggle = (id: string) => {
    setFixes(prev => prev.map(fix => 
      fix.id === id ? { ...fix, checked: !fix.checked } : fix
    ))
  }

  const checkedCount = fixes.filter(fix => fix.checked).length

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <Wrench className="w-6 h-6 text-orange-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">Common Fixes</h2>
          <p className="text-sm text-muted-foreground">
            Yaygın sorunları kontrol edin ({checkedCount}/{fixes.length} tamamlandı)
          </p>
        </div>
        {checkedCount === fixes.length && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Tümü kontrol edildi
          </div>
        )}
      </div>

      <div className="space-y-4">
        {fixes.map((fix) => (
          <div key={fix.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-start gap-3">
              <button
                onClick={() => handleToggle(fix.id)}
                className={cn(
                  "flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-colors",
                  fix.checked
                    ? "bg-green-600 border-green-600 text-white"
                    : "border-muted-foreground hover:border-primary"
                )}
              >
                {fix.checked && <CheckCircle className="w-3 h-3" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className={cn(
                      "font-medium text-foreground mb-2",
                      fix.checked && "line-through text-muted-foreground"
                    )}>
                      {fix.question}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {fix.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Help Links */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="font-medium text-foreground mb-3">Yardımcı Kaynaklar</h4>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://vercel.com/docs/concepts/projects/environment-variables"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Vercel Environment Variables
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://vercel.com/docs/concepts/functions/serverless-functions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Serverless Functions Guide
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://vercel.com/docs/concepts/edge-network/headers"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            CORS Configuration
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}