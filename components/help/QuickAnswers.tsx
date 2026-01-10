'use client'

import { useState } from 'react'
import { Zap, ChevronRight, ExternalLink, Copy, Check } from 'lucide-react'
import { QuickAnswer, helpManager } from '@/lib/help'

interface QuickAnswersProps {
  answers?: QuickAnswer[]
  title?: string
  className?: string
}

export default function QuickAnswers({ 
  answers, 
  title = "Hızlı Yanıtlar",
  className = "" 
}: QuickAnswersProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const quickAnswers = answers || helpManager.getQuickAnswers()

  const handleCopy = async (answer: QuickAnswer) => {
    try {
      await navigator.clipboard.writeText(answer.answer)
      setCopiedId(answer.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleAnswerClick = (answer: QuickAnswer) => {
    if (answer.relatedArticle) {
      window.location.href = `/help/article/${answer.relatedArticle}`
    }
  }

  if (quickAnswers.length === 0) return null

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        {title}
      </h3>
      
      <div className="space-y-3">
        {quickAnswers.map((answer) => (
          <QuickAnswerCard
            key={answer.id}
            answer={answer}
            onCopy={() => handleCopy(answer)}
            onViewMore={() => handleAnswerClick(answer)}
            isCopied={copiedId === answer.id}
          />
        ))}
      </div>
    </div>
  )
}

// Individual quick answer card
export function QuickAnswerCard({ 
  answer, 
  onCopy, 
  onViewMore,
  isCopied = false,
  className = "" 
}: {
  answer: QuickAnswer
  onCopy?: () => void
  onViewMore?: () => void
  isCopied?: boolean
  className?: string
}) {
  return (
    <div className={`p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-gray-600 transition-all ${className}`}>
      {/* Question */}
      <h4 className="font-medium text-white mb-2 flex items-start gap-2">
        <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
        {answer.question}
      </h4>
      
      {/* Answer */}
      <p className="text-gray-300 mb-3 leading-relaxed">
        {answer.answer}
      </p>
      
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Tags */}
          <div className="flex gap-1">
            {answer.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Copy Button */}
          {onCopy && (
            <button
              onClick={onCopy}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors"
              title="Yanıtı kopyala"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3" />
                  Kopyalandı
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Kopyala
                </>
              )}
            </button>
          )}
          
          {/* View More Button */}
          {answer.relatedArticle && onViewMore && (
            <button
              onClick={onViewMore}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
            >
              Detay
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Compact quick answer for search results
export function CompactQuickAnswer({ 
  answer, 
  onClick,
  className = "" 
}: {
  answer: QuickAnswer
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-3 bg-yellow-500/10 border border-yellow-500/20 hover:border-yellow-500/40 rounded-lg transition-all text-left group ${className}`}
    >
      <div className="flex items-start gap-2">
        <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white text-sm mb-1 group-hover:text-yellow-400 transition-colors">
            {answer.question}
          </h4>
          <p className="text-gray-300 text-xs line-clamp-2">
            {answer.answer}
          </p>
        </div>
        
        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-yellow-400 transition-colors flex-shrink-0" />
      </div>
    </button>
  )
}

// Quick answer modal for detailed view
export function QuickAnswerModal({ 
  answer, 
  isOpen, 
  onClose 
}: {
  answer: QuickAnswer | null
  isOpen: boolean
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !answer) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer.answer)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleViewArticle = () => {
    if (answer.relatedArticle) {
      window.location.href = `/help/article/${answer.relatedArticle}`
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white mb-1">
                Hızlı Yanıt
              </h3>
              <p className="text-gray-400 text-sm">
                {answer.question}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-300 leading-relaxed">
              {answer.answer}
            </p>
          </div>

          {/* Tags */}
          {answer.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {answer.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Kopyalandı
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Kopyala
                </>
              )}
            </button>
            
            {answer.relatedArticle && (
              <button
                onClick={handleViewArticle}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Detaylı Makale
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Quick answers widget for empty states
export function QuickAnswersWidget({ 
  category,
  limit = 3,
  className = "" 
}: {
  category?: string
  limit?: number
  className?: string
}) {
  const allAnswers = helpManager.getQuickAnswers()
  const filteredAnswers = category 
    ? allAnswers.filter(answer => answer.category === category)
    : allAnswers
  
  const answers = filteredAnswers.slice(0, limit)

  if (answers.length === 0) return null

  return (
    <div className={`${className}`}>
      <h4 className="font-medium text-white mb-3 flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-400" />
        Hızlı Çözümler
      </h4>
      
      <div className="space-y-2">
        {answers.map((answer) => (
          <CompactQuickAnswer
            key={answer.id}
            answer={answer}
            onClick={() => {
              if (answer.relatedArticle) {
                window.location.href = `/help/article/${answer.relatedArticle}`
              }
            }}
          />
        ))}
      </div>
    </div>
  )
}








