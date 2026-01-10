'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Clock, BookOpen, Zap, ExternalLink } from 'lucide-react'
import { helpManager, SearchResult, HelpCategory } from '@/lib/help'

interface SmartSearchProps {
  placeholder?: string
  context?: HelpCategory
  onResultSelect?: (result: SearchResult) => void
  className?: string
}

export default function SmartSearch({ 
  placeholder = "Chat, Code Studio, Image Studio hakkında ara…",
  context,
  onResultSelect,
  className = ""
}: SmartSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Perform search
  useEffect(() => {
    if (query.trim().length > 1) {
      const searchResults = helpManager.search(query, context)
      setResults(searchResults)
      setIsOpen(true)
      setSelectedIndex(-1)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query, context])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleResultClick(results[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false)
    setQuery('')
    onResultSelect?.(result)

    // Navigate based on result type
    if (result.type === 'feature') {
      const feature = result.item as any
      window.location.href = feature.url
    } else if (result.type === 'article') {
      const article = result.item as any
      if (article.deepLink) {
        window.location.href = article.deepLink
      } else {
        window.location.href = `/help/article/${article.id}`
      }
    } else if (result.type === 'quick-answer') {
      const answer = result.item as any
      if (answer.relatedArticle) {
        window.location.href = `/help/article/${answer.relatedArticle}`
      }
    }
  }

  const getResultIcon = (result: SearchResult) => {
    switch (result.type) {
      case 'article':
        return <BookOpen className="w-4 h-4" />
      case 'quick-answer':
        return <Zap className="w-4 h-4" />
      case 'feature':
        return <ExternalLink className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  const getResultTypeLabel = (result: SearchResult) => {
    switch (result.type) {
      case 'article':
        return 'Makale'
      case 'quick-answer':
        return 'Hızlı Yanıt'
      case 'feature':
        return 'Özellik'
      default:
        return ''
    }
  }

  const getCategoryColor = (category: HelpCategory) => {
    const colors = {
      'getting-started': 'text-blue-400',
      'chat': 'text-green-400',
      'code-studio': 'text-purple-400',
      'image-studio': 'text-pink-400',
      'ai-agents': 'text-indigo-400',
      'billing': 'text-yellow-400',
      'troubleshooting': 'text-red-400'
    }
    return colors[category] || 'text-gray-400'
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        
        {/* Search indicator */}
        {query.length > 0 && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          {results.map((result, index) => {
            const item = result.item as any
            const isSelected = index === selectedIndex

            return (
              <button
                key={`${result.type}-${item.id}`}
                onClick={() => handleResultClick(result)}
                className={`w-full p-4 text-left hover:bg-gray-700/50 transition-colors border-b border-gray-700 last:border-b-0 ${
                  isSelected ? 'bg-gray-700/50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Result Icon */}
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-gray-300 flex-shrink-0">
                    {getResultIcon(result)}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h4 className="font-medium text-white mb-1 truncate">
                      {result.type === 'quick-answer' ? item.question : item.title}
                    </h4>

                    {/* Description/Answer */}
                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                      {result.type === 'quick-answer' ? item.answer : 
                       result.type === 'feature' ? item.description : item.content}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className={`font-medium ${getCategoryColor(item.category)}`}>
                        {getResultTypeLabel(result)}
                      </span>
                      
                      {result.type === 'article' && (
                        <>
                          <span className="text-gray-500">•</span>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{item.estimatedReadTime} dk</span>
                          </div>
                        </>
                      )}

                      {/* Relevance Score (for debugging) */}
                      <span className="text-gray-600 ml-auto">
                        {Math.round(result.relevanceScore)}%
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length > 1 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 p-6 text-center">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <h4 className="font-medium text-white mb-2">
            Bununla ilgili bir içerik bulamadık
          </h4>
          <p className="text-gray-400 text-sm mb-4">
            "{query}" için sonuç bulunamadı
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => window.location.href = '/chat'}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
            >
              Chat'e Sor
            </button>
            <button
              onClick={() => window.location.href = '/contact'}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
            >
              Destek İste
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Compact search for headers
export function CompactSearch({ 
  context, 
  className = "" 
}: { 
  context?: HelpCategory
  className?: string 
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (isExpanded) {
    return (
      <div className={`w-80 ${className}`}>
        <SmartSearch 
          placeholder="Yardım ara..."
          context={context}
          onResultSelect={() => setIsExpanded(false)}
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsExpanded(true)}
      className={`flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors ${className}`}
    >
      <Search className="w-4 h-4 text-gray-400" />
      <span className="text-gray-400 text-sm">Yardım ara...</span>
    </button>
  )
}

// Search suggestions for empty state
export function SearchSuggestions({ 
  context,
  onSuggestionClick 
}: { 
  context?: HelpCategory
  onSuggestionClick?: (query: string) => void 
}) {
  const suggestions = [
    'export nasıl yapılır',
    'premium avantajları',
    'yeni chat başlatma',
    'kod önizlemesi',
    'ai memory',
    'giriş sorunu'
  ]

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-400 mb-3">
        Popüler aramalar:
      </h4>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick?.(suggestion)}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg border border-gray-700 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}








