'use client'

import { useParams } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/GlobalHeader'
import { BottomTabBar } from '@/components/ui/BottomTabBar'
import { HelpArticleCard } from '@/components/help/HelpArticle'
import SmartSearch from '@/components/help/SmartSearch'
import { helpManager, HelpCategory } from '@/lib/help'
import { AlertCircle, BookOpen, Filter } from 'lucide-react'
import { useState } from 'react'

export default function HelpCategoryPage() {
  const params = useParams()
  const categoryId = params.id as HelpCategory
  
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'difficulty'>('popular')
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  
  const categories = helpManager.getCategories()
  const category = categories.find(c => c.id === categoryId)
  const allArticles = helpManager.getArticlesByCategory(categoryId)

  // Filter and sort articles
  let filteredArticles = allArticles
  
  // Apply difficulty filter
  if (difficultyFilter !== 'all') {
    filteredArticles = filteredArticles.filter(article => article.difficulty === difficultyFilter)
  }
  
  // Apply sorting
  switch (sortBy) {
    case 'popular':
      filteredArticles.sort((a, b) => b.helpfulCount - a.helpfulCount)
      break
    case 'recent':
      filteredArticles.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      break
    case 'difficulty':
      const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 }
      filteredArticles.sort((a, b) => difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder])
      break
  }

  if (!category) {
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
              Kategori Bulunamadı
            </h1>
            <p className="text-gray-400 mb-8">
              Aradığınız kategori mevcut değil.
            </p>
            
            <button
              onClick={() => window.location.href = '/help'}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Help Center'a Dön
            </button>
          </div>
        </main>

        <BottomTabBar />
      </div>
    )
  }

  const getCategoryColorClasses = (color: string) => {
    const colorMap = {
      blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/20',
      green: 'from-green-500/10 to-green-600/10 border-green-500/20',
      purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/20',
      pink: 'from-pink-500/10 to-pink-600/10 border-pink-500/20',
      indigo: 'from-indigo-500/10 to-indigo-600/10 border-indigo-500/20',
      yellow: 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/20',
      red: 'from-red-500/10 to-red-600/10 border-red-500/20'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader 
        title={category.title}
        showBack={true}
        backUrl="/help"
      />

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Category Header */}
        <div className={`p-8 rounded-2xl border bg-gradient-to-br mb-8 ${getCategoryColorClasses(category.color)}`}>
          <div className="flex items-start gap-4">
            <div className="text-4xl">{category.icon}</div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">
                {category.title}
              </h1>
              <p className="text-gray-300 mb-4">
                {category.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <BookOpen className="w-4 h-4" />
                <span>{category.articleCount} makale</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SmartSearch 
            placeholder={`${category.title} içinde ara...`}
            context={categoryId}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Sort By */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Sırala:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="popular">Popülerlik</option>
              <option value="recent">En Yeni</option>
              <option value="difficulty">Zorluk</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Seviye:</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as any)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tümü</option>
              <option value="beginner">Başlangıç</option>
              <option value="intermediate">Orta</option>
              <option value="advanced">İleri</option>
            </select>
          </div>
        </div>

        {/* Articles */}
        {filteredArticles.length > 0 ? (
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <HelpArticleCard
                key={article.id}
                article={article}
                onClick={() => window.location.href = `/help/article/${article.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-4">
              Bu filtrelere uygun makale bulunamadı
            </h3>
            <p className="text-gray-400 mb-6">
              Farklı filtreler deneyebilir veya arama yapabilirsiniz
            </p>
            
            <button
              onClick={() => {
                setSortBy('popular')
                setDifficultyFilter('all')
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}

        {/* Context Help */}
        <div className="mt-12 p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-2">
            Bu ekran için yardım
          </h3>
          <p className="text-gray-400 mb-4">
            {category.title} ile ilgili sık sorulan sorular ve çözümler burada yer alıyor.
          </p>
          
          <div className="flex gap-3">
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
      </main>

      <BottomTabBar />
    </div>
  )
}






