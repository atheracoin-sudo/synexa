'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/global-header'
import { BottomTabBar } from '@/components/ui/bottom-tab-bar'
import { marketplaceManager, Template, MarketplaceCategory, TemplateType } from '@/lib/marketplace'
import { 
  Search,
  Filter,
  Star,
  TrendingUp,
  Sparkles,
  Crown,
  Eye,
  Download,
  ArrowRight,
  Zap,
  Code,
  Bot,
  Palette,
  Flame,
  Clock,
  Users
} from 'lucide-react'

export default function MarketplacePage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([])
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'free' | 'premium' | 'popular' | 'new'>('all')
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { key: 'all' as MarketplaceCategory, name: 'All', icon: '🚀', count: 0 },
    { key: 'apps' as MarketplaceCategory, name: 'Apps', icon: '💻', count: 0 },
    { key: 'agents' as MarketplaceCategory, name: 'Agents', icon: '🤖', count: 0 },
    { key: 'designs' as MarketplaceCategory, name: 'Designs', icon: '🎨', count: 0 }
  ]

  const filters = [
    { key: 'all', name: 'All Templates', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'free', name: 'Free', icon: <Zap className="w-4 h-4" /> },
    { key: 'premium', name: 'Premium', icon: <Crown className="w-4 h-4" /> },
    { key: 'popular', name: 'Popular', icon: <TrendingUp className="w-4 h-4" /> },
    { key: 'new', name: 'New', icon: <Flame className="w-4 h-4" /> }
  ]

  useEffect(() => {
    // Load templates
    const allTemplates = marketplaceManager.getAllTemplates()
    setTemplates(allTemplates)
    setFilteredTemplates(allTemplates)
    
    // Update category counts
    const stats = marketplaceManager.getStats()
    categories[0].count = stats.categories.all
    categories[1].count = stats.categories.apps
    categories[2].count = stats.categories.agents
    categories[3].count = stats.categories.designs
    
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Filter templates based on category, search, and filter
    let filtered = templates

    // Category filter
    if (selectedCategory !== 'all') {
      const type = selectedCategory.slice(0, -1) as TemplateType // Remove 's' from end
      filtered = filtered.filter(template => template.type === type)
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = marketplaceManager.searchTemplates(searchQuery)
      if (selectedCategory !== 'all') {
        const type = selectedCategory.slice(0, -1) as TemplateType
        filtered = filtered.filter(template => template.type === type)
      }
    }

    // Additional filters
    switch (selectedFilter) {
      case 'free':
        filtered = filtered.filter(t => !t.isPremium)
        break
      case 'premium':
        filtered = filtered.filter(t => t.isPremium)
        break
      case 'popular':
        filtered = filtered.filter(t => t.isPopular)
        break
      case 'new':
        filtered = filtered.filter(t => t.isNew)
        break
    }

    setFilteredTemplates(filtered)
  }, [templates, selectedCategory, searchQuery, selectedFilter])

  const handleTemplateClick = (template: Template) => {
    // Increment usage count
    marketplaceManager.incrementUsage(template.id)
    
    // Navigate based on template type
    switch (template.type) {
      case 'app':
        router.push(`/marketplace/apps/${template.id}`)
        break
      case 'agent':
        // Navigate to agent execution
        const agentTemplate = template as any
        router.push(`/agents/${agentTemplate.agentId}`)
        break
      case 'design':
        router.push(`/marketplace/designs/${template.id}`)
        break
    }
  }

  const getTypeIcon = (type: TemplateType) => {
    switch (type) {
      case 'app': return <Code className="w-4 h-4" />
      case 'agent': return <Bot className="w-4 h-4" />
      case 'design': return <Palette className="w-4 h-4" />
      default: return <Sparkles className="w-4 h-4" />
    }
  }

  const featuredTemplates = marketplaceManager.getFeaturedTemplates().slice(0, 6)
  const stats = marketplaceManager.getStats()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader title="Marketplace" showBack={true} backUrl="/" />
        <main className="container mx-auto px-4 py-8 pb-24">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
        <BottomTabBar />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader 
        title="Marketplace" 
        showBack={true}
        backUrl="/"
      />

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Dakikalar içinde üretmeye başla 🚀
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Hazır template'ler, AI agent'lar ve tasarımlarla projelerinizi hızla hayata geçirin.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.totalTemplates}</div>
            <div className="text-sm text-gray-400">Templates</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{marketplaceManager.formatUsageCount(stats.totalDownloads)}</div>
            <div className="text-sm text-gray-400">Downloads</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.newThisWeek.length}</div>
            <div className="text-sm text-gray-400">New This Week</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.popularThisWeek.length}</div>
            <div className="text-sm text-gray-400">Trending</div>
          </div>
        </div>

        {/* Featured Templates */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Featured Templates</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateClick(template)}
                className="group bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02]"
              >
                {/* Preview Image */}
                <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-2xl">
                      {marketplaceManager.getTypeIcon(template.type)}
                    </div>
                  </div>
                  
                  {/* Type Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-xs text-white">
                    {getTypeIcon(template.type)}
                    <span>{marketplaceManager.getTypeName(template.type)}</span>
                  </div>
                  
                  {/* Premium Badge */}
                  {template.isPremium && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-yellow-600/80 backdrop-blur-sm rounded-lg text-xs text-white">
                      <Crown className="w-3 h-3" />
                      <span>Premium</span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {template.shortDescription}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{marketplaceManager.formatUsageCount(template.usageCount)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span>{marketplaceManager.formatRating(template.rating)}</span>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-lg">
                        +{template.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-300">
                      {template.isPremium ? 'Premium' : 'Free'}
                    </div>
                    <div className="flex items-center gap-1 text-blue-400 group-hover:text-blue-300 transition-colors">
                      <span className="text-sm font-medium">Use Template</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates, agents, designs..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                <span className="text-xs opacity-75">
                  ({category.count})
                </span>
              </button>
            ))}
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedFilter === filter.key
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                }`}
              >
                {filter.icon}
                <span>{filter.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              {selectedCategory === 'all' ? 'All Templates' : 
               selectedCategory === 'apps' ? 'App Templates' :
               selectedCategory === 'agents' ? 'AI Agents' : 'Design Templates'}
              <span className="text-gray-400 text-base font-normal ml-2">
                ({filteredTemplates.length})
              </span>
            </h2>
          </div>

          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className="group bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02]"
                >
                  {/* Preview Image */}
                  <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-xl">
                        {marketplaceManager.getTypeIcon(template.type)}
                      </div>
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white">
                        {getTypeIcon(template.type)}
                        <span>{template.type.charAt(0).toUpperCase() + template.type.slice(1)}</span>
                      </div>
                      
                      {template.isPremium && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-600/80 backdrop-blur-sm rounded text-xs text-white">
                          <Crown className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    
                    {/* Popular/New indicators */}
                    {(template.isPopular || template.isNew) && (
                      <div className="absolute bottom-2 right-2">
                        {template.isPopular && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-red-600/80 backdrop-blur-sm rounded text-xs text-white mb-1">
                            <Flame className="w-3 h-3" />
                            <span>Popular</span>
                          </div>
                        )}
                        {template.isNew && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-600/80 backdrop-blur-sm rounded text-xs text-white">
                            <Sparkles className="w-3 h-3" />
                            <span>New</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">
                      {template.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {template.shortDescription}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{marketplaceManager.formatUsageCount(template.usageCount)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span>{marketplaceManager.formatRating(template.rating)}</span>
                      </div>
                    </div>
                    
                    {/* CTA */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium text-gray-400">
                        {template.isPremium ? 'Premium' : 'Free'}
                      </div>
                      <div className="flex items-center gap-1 text-blue-400 group-hover:text-blue-300 transition-colors">
                        <span className="text-sm font-medium">Use</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">No Templates Found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery 
                  ? `No templates match "${searchQuery}". Try different keywords.`
                  : 'No templates available for the selected filters.'
                }
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setSelectedFilter('all')
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}
