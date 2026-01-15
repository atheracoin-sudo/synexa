'use client'

import { useState } from 'react'
import { 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  BookOpen, 
  ArrowRight,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  Share2
} from 'lucide-react'
import { HelpArticle as HelpArticleType, helpManager } from '@/lib/help'

interface HelpArticleProps {
  article: HelpArticleType
  showRelated?: boolean
  className?: string
}

export default function HelpArticle({ 
  article, 
  showRelated = true, 
  className = "" 
}: HelpArticleProps) {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const relatedArticles = showRelated ? helpManager.getRelatedArticles(article.id) : []

  const handleFeedback = (isHelpful: boolean) => {
    setFeedback(isHelpful ? 'helpful' : 'not-helpful')
    helpManager.submitFeedback(article.id, isHelpful)
    
    if (!isHelpful) {
      setShowFeedbackForm(true)
    }
  }

  const submitDetailedFeedback = () => {
    if (feedbackText.trim()) {
      helpManager.submitFeedback(article.id, false, feedbackText)
      setShowFeedbackForm(false)
      setFeedbackText('')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20'
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20'
      case 'advanced': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Başlangıç'
      case 'intermediate': return 'Orta'
      case 'advanced': return 'İleri'
      default: return difficulty
    }
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <BookOpen className="w-4 h-4" />
            <span>Help Center</span>
            <ArrowRight className="w-3 h-3" />
            <span className="capitalize">{article.category.replace('-', ' ')}</span>
          </div>
          
          {article.isPremium && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
              Premium
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          {article.title}
        </h1>

        <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{article.estimatedReadTime} dakika okuma</span>
          </div>
          
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(article.difficulty)}`}>
            {getDifficultyLabel(article.difficulty)}
          </div>
          
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4" />
            <span>{article.helpfulCount} yararlı</span>
          </div>
          
          <span>Son güncelleme: {new Date(article.lastUpdated).toLocaleDateString('tr-TR')}</span>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          {article.deepLink && (
            <button
              onClick={() => window.location.href = article.deepLink!}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Özelliği Dene
            </button>
          )}
          
          <button
            onClick={() => navigator.share?.({ title: article.title, url: window.location.href })}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Paylaş
          </button>
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 mb-8">
        {/* Content */}
        <div className="prose prose-invert max-w-none mb-8">
          <p className="text-gray-300 leading-relaxed text-lg mb-6">
            {article.content}
          </p>
        </div>

        {/* Steps */}
        {article.steps && article.steps.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Adım Adım Rehber
            </h3>
            
            <div className="space-y-4">
              {article.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-900/50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feedback Section */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-bold text-white mb-4">
          Bu içerik yardımcı oldu mu?
        </h3>
        
        {feedback === null ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleFeedback(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              Evet, yararlı
            </button>
            
            <button
              onClick={() => handleFeedback(false)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <ThumbsDown className="w-4 h-4" />
              Hayır, yararlı değil
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`flex items-center gap-2 text-sm ${
              feedback === 'helpful' ? 'text-green-400' : 'text-red-400'
            }`}>
              {feedback === 'helpful' ? (
                <>
                  <ThumbsUp className="w-4 h-4" />
                  <span>Teşekkürler! Geri bildiriminiz kaydedildi.</span>
                </>
              ) : (
                <>
                  <ThumbsDown className="w-4 h-4" />
                  <span>Geri bildiriminiz kaydedildi.</span>
                </>
              )}
            </div>

            {showFeedbackForm && (
              <div className="space-y-3">
                <p className="text-gray-400 text-sm">
                  Bu makaleyi nasıl geliştirebiliriz?
                </p>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Önerilerinizi buraya yazabilirsiniz..."
                  className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={submitDetailedFeedback}
                    disabled={!feedbackText.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm rounded-lg transition-colors"
                  >
                    Gönder
                  </button>
                  <button
                    onClick={() => setShowFeedbackForm(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            İlgili Makaleler
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedArticles.map((relatedArticle) => (
              <button
                key={relatedArticle.id}
                onClick={() => window.location.href = `/help/article/${relatedArticle.id}`}
                className="p-4 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 hover:border-gray-600 rounded-xl transition-all text-left group"
              >
                <h4 className="font-medium text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {relatedArticle.title}
                </h4>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {relatedArticle.content}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{relatedArticle.estimatedReadTime} dk</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Still Need Help */}
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6 text-center">
        <h3 className="text-lg font-bold text-white mb-2">
          Hâlâ yardıma mı ihtiyacın var?
        </h3>
        <p className="text-gray-400 mb-4">
          Bu makale sorununuzu çözmediyse, bizimle iletişime geçebilirsiniz
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.href = '/chat'}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat'e Sor
          </button>
          
          <button
            onClick={() => window.location.href = '/contact'}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
          >
            Destek ile İletişime Geç
          </button>
        </div>
      </div>
    </div>
  )
}

// Compact article card for listings
export function HelpArticleCard({ 
  article, 
  onClick 
}: { 
  article: HelpArticleType
  onClick?: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 hover:border-gray-600 rounded-xl transition-all text-left group"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>
        
        {article.isPremium && (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full ml-2 flex-shrink-0">
            Premium
          </span>
        )}
      </div>
      
      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
        {article.content}
      </p>
      
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{article.estimatedReadTime} dk</span>
        </div>
        
        <span>•</span>
        
        <div className={`px-2 py-1 rounded-full ${getDifficultyColor(article.difficulty)}`}>
          {getDifficultyLabel(article.difficulty)}
        </div>
        
        <span>•</span>
        
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-3 h-3" />
          <span>{article.helpfulCount}</span>
        </div>
      </div>
    </button>
  )
}

// Helper functions (duplicated for use in card)
function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'beginner': return 'text-green-400 bg-green-500/20'
    case 'intermediate': return 'text-yellow-400 bg-yellow-500/20'
    case 'advanced': return 'text-red-400 bg-red-500/20'
    default: return 'text-gray-400 bg-gray-500/20'
  }
}

function getDifficultyLabel(difficulty: string) {
  switch (difficulty) {
    case 'beginner': return 'Başlangıç'
    case 'intermediate': return 'Orta'
    case 'advanced': return 'İleri'
    default: return difficulty
  }
}











