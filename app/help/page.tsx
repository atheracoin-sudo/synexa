'use client'

import { useState } from 'react'
import { GlobalHeader } from '@/components/ui/global-header'
import { BottomTabBar } from '@/components/ui/bottom-tab-bar'
import SmartSearch, { SearchSuggestions } from '@/components/help/SmartSearch'
import SupportEscalation from '@/components/help/SupportEscalation'
import { helpManager, HelpCategory, SearchResult } from '@/lib/help'
import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  ExternalLink,
  Star,
  Users
} from 'lucide-react'

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const categories = helpManager.getCategories()
  const popularArticles = helpManager.getPopularArticles()
  const recentArticles = helpManager.getRecentArticles()

  const handleSearchSuggestion = (query: string) => {
    setSearchQuery(query)
  }

  const handleResultSelect = (result: SearchResult) => {
    // Navigation is handled in SmartSearch component
    console.log('Selected result:', result)
  }

  const getCategoryIcon = (categoryId: HelpCategory) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.icon || '📄'
  }

  const getCategoryColorClasses = (color: string) => {
    const colorMap = {
      blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/20 hover:border-blue-500/40',
      green: 'from-green-500/10 to-green-600/10 border-green-500/20 hover:border-green-500/40',
      purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/20 hover:border-purple-500/40',
      pink: 'from-pink-500/10 to-pink-600/10 border-pink-500/20 hover:border-pink-500/40',
      indigo: 'from-indigo-500/10 to-indigo-600/10 border-indigo-500/20 hover:border-indigo-500/40',
      yellow: 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/20 hover:border-yellow-500/40',
      red: 'from-red-500/10 to-red-600/10 border-red-500/20 hover:border-red-500/40'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader 
        title="Help Center" 
        showBack={true}
        backUrl="/"
      />

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Sana nasıl yardımcı olabiliriz?
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Synexa'yı daha etkili kullanmak için rehberler, ipuçları ve çözümler
          </p>

          {/* Smart Search */}
          <div className="max-w-2xl mx-auto">
            <SmartSearch 
              onResultSelect={handleResultSelect}
              className="mb-6"
            />
            
            {/* Search Suggestions */}
            {!searchQuery && (
              <SearchSuggestions onSuggestionClick={handleSearchSuggestion} />
            )}
          </div>
        </div>

        {/* Category Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Kategoriler
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => window.location.href = `/help/category/${category.id}`}
                className={`group p-6 rounded-2xl border bg-gradient-to-br transition-all duration-300 hover:scale-[1.02] text-left ${getCategoryColorClasses(category.color)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{category.icon}</div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <BookOpen className="w-3 h-3" />
                  <span>{category.articleCount} makale</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Popular & Recent Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Popular Articles */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              Popüler Makaleler
            </h2>
            
            <div className="space-y-4">
              {popularArticles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => window.location.href = `/help/article/${article.id}`}
                  className="w-full p-4 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 hover:border-gray-600 rounded-xl transition-all text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl">{getCategoryIcon(article.category)}</div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white mb-1 group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                        {article.content}
                      </p>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.estimatedReadTime} dk</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          <span>{article.helpfulCount} yararlı</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Articles */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Clock className="w-5 h-5 text-green-400" />
              Son Eklenenler
            </h2>
            
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => window.location.href = `/help/article/${article.id}`}
                  className="w-full p-4 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 hover:border-gray-600 rounded-xl transition-all text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl">{getCategoryIcon(article.category)}</div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white mb-1 group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                        {article.content}
                      </p>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>Güncellendi: {new Date(article.lastUpdated).toLocaleDateString('tr-TR')}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.estimatedReadTime} dk</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Support Escalation */}
        <SupportEscalation />

        {/* Trust Section */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
            <Users className="w-4 h-4" />
            <span>Bu rehberler Synexa ekibi tarafından hazırlanmıştır</span>
          </div>
          <button
            onClick={() => window.location.href = '/feedback'}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors flex items-center gap-1 mx-auto"
          >
            Feedback gönder
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}
