'use client'

import { useParams } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/global-header'
import { BottomTabBar } from '@/components/ui/bottom-tab-bar'
import HelpArticle from '@/components/help/HelpArticle'
import { helpManager } from '@/lib/help'
import { AlertCircle } from 'lucide-react'

export default function HelpArticlePage() {
  const params = useParams()
  const articleId = params.id as string
  
  const article = helpManager.getArticleById(articleId)

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader 
          title="Help Center" 
          showBack={true}
          backUrl="/help"
        />

        <main className="container mx-auto px-4 py-8 pb-24">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4">
              Makale Bulunamadı
            </h1>
            <p className="text-gray-400 mb-8">
              Aradığınız yardım makalesi mevcut değil veya kaldırılmış olabilir.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/help'}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Help Center'a Dön
              </button>
              
              <button
                onClick={() => window.location.href = '/chat'}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors"
              >
                Chat'e Sor
              </button>
            </div>
          </div>
        </main>

        <BottomTabBar />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader 
        title={article.title}
        showBack={true}
        backUrl="/help"
      />

      <main className="container mx-auto px-4 py-8 pb-24">
        <HelpArticle article={article} />
      </main>

      <BottomTabBar />
    </div>
  )
}








