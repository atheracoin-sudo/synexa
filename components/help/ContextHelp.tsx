'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { HelpCircle, X, ExternalLink, MessageCircle, ChevronRight } from 'lucide-react'
import { helpManager, HelpCategory, HelpArticle } from '@/lib/help'

interface ContextHelpProps {
  context?: HelpCategory
  className?: string
}

export default function ContextHelp({ context, className = "" }: ContextHelpProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<HelpArticle[]>([])
  const pathname = usePathname()

  // Determine context from pathname if not provided
  const getContextFromPath = (): HelpCategory | undefined => {
    if (context) return context
    
    if (pathname.includes('/chat')) return 'chat'
    if (pathname.includes('/code')) return 'code-studio'
    if (pathname.includes('/design')) return 'image-studio'
    if (pathname.includes('/pricing') || pathname.includes('/billing')) return 'billing'
    if (pathname === '/') return 'getting-started'
    
    return undefined
  }

  const currentContext = getContextFromPath()

  // Load context suggestions
  useEffect(() => {
    if (currentContext) {
      const contextSuggestions = helpManager.getContextSuggestions(currentContext)
      setSuggestions(contextSuggestions)
    }
  }, [currentContext])

  if (!currentContext || suggestions.length === 0) {
    return null
  }

  const getContextTitle = (ctx: HelpCategory) => {
    const titles = {
      'getting-started': 'Başlangıç',
      'chat': 'Chat',
      'code-studio': 'Code Studio',
      'image-studio': 'Image Studio',
      'ai-agents': 'AI Agents',
      'billing': 'Billing',
      'troubleshooting': 'Sorun Giderme'
    }
    return titles[ctx] || 'Yardım'
  }

  return (
    <div className={`fixed bottom-20 right-4 z-40 ${className}`}>
      {/* Help Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
          title="Bu ekran için yardım"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      )}

      {/* Help Panel */}
      {isOpen && (
        <div className="w-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                <h3 className="font-medium text-white">
                  {getContextTitle(currentContext)} Yardımı
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-gray-400 text-sm mb-4">
              Bu ekranla ilgili popüler yardım konuları:
            </p>

            {/* Suggestions */}
            <div className="space-y-2 mb-4">
              {suggestions.slice(0, 3).map((article) => (
                <button
                  key={article.id}
                  onClick={() => {
                    window.location.href = `/help/article/${article.id}`
                    setIsOpen(false)
                  }}
                  className="w-full p-3 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 hover:border-gray-600 rounded-lg transition-all text-left group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm mb-1 group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-gray-400 text-xs line-clamp-2">
                        {article.content}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2" />
                  </div>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  window.location.href = `/help/category/${currentContext}`
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Tüm {getContextTitle(currentContext)} Yardımları
              </button>
              
              <button
                onClick={() => {
                  window.location.href = '/chat'
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat'e Sor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Inline help component for specific sections
export function InlineHelp({ 
  title, 
  description, 
  articles,
  className = "" 
}: {
  title: string
  description: string
  articles: string[] // Article IDs
  className?: string
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const helpArticles = articles.map(id => helpManager.getArticleById(id)).filter(Boolean) as HelpArticle[]

  return (
    <div className={`bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        
        <div className="flex-1">
          <h4 className="font-medium text-white mb-1">{title}</h4>
          <p className="text-gray-300 text-sm mb-3">{description}</p>
          
          {helpArticles.length > 0 && (
            <div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                {isExpanded ? 'Gizle' : 'Yardım Makalelerini Gör'}
              </button>
              
              {isExpanded && (
                <div className="mt-3 space-y-2">
                  {helpArticles.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => window.location.href = `/help/article/${article.id}`}
                      className="block w-full p-2 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 hover:border-gray-600 rounded-lg transition-all text-left"
                    >
                      <div className="text-white text-sm font-medium mb-1">
                        {article.title}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {article.estimatedReadTime} dk okuma
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Quick help tooltip
export function HelpTooltip({ 
  content, 
  articleId,
  children 
}: {
  content: string
  articleId?: string
  children: React.ReactNode
}) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl max-w-xs">
            <p className="text-gray-300 text-sm mb-2">{content}</p>
            
            {articleId && (
              <button
                onClick={() => window.location.href = `/help/article/${articleId}`}
                className="text-blue-400 hover:text-blue-300 text-xs transition-colors"
              >
                Daha fazla bilgi →
              </button>
            )}
          </div>
          
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-2 bg-gray-900 border-r border-b border-gray-700 rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  )
}

// Help trigger for error states
export function ErrorHelp({ 
  error, 
  context 
}: {
  error: string
  context?: HelpCategory
}) {
  const getErrorSuggestions = (errorType: string) => {
    const suggestions = {
      'login': ['login-issues'],
      'slow': ['slow-performance'],
      'export': ['image-export'],
      'premium': ['premium-upgrade']
    }
    
    return suggestions[errorType as keyof typeof suggestions] || []
  }

  const errorType = error.toLowerCase()
  const suggestionIds = getErrorSuggestions(errorType)
  
  if (suggestionIds.length === 0) return null

  return (
    <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
      <div className="flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
        
        <div>
          <h4 className="font-medium text-white mb-2">
            Bu sorunu çözmeye yardımcı olabilir:
          </h4>
          
          <div className="space-y-2">
            {suggestionIds.map((articleId) => {
              const article = helpManager.getArticleById(articleId)
              if (!article) return null
              
              return (
                <button
                  key={articleId}
                  onClick={() => window.location.href = `/help/article/${articleId}`}
                  className="block text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
                >
                  → {article.title}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}





