'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/global-header'
import { BottomTabBar } from '@/components/ui/bottom-tab-bar'
import { PremiumTemplateModal } from '@/components/marketplace/PremiumTemplateModal'
import { marketplaceManager, DesignTemplate } from '@/lib/marketplace'
import { 
  Star,
  Crown,
  Eye,
  Users,
  Download,
  Palette,
  Image as ImageIcon,
  Layers,
  CheckCircle,
  ArrowRight,
  Heart,
  Share2,
  Zap,
  Maximize,
  FileImage,
  Paintbrush,
  Target,
  Copy
} from 'lucide-react'

export default function DesignTemplateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.id as string
  
  const [template, setTemplate] = useState<DesignTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [selectedVariation, setSelectedVariation] = useState(0)
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  useEffect(() => {
    if (!templateId) return

    // Fetch template data
    const templateData = marketplaceManager.getTemplate(templateId) as DesignTemplate
    setTemplate(templateData)
    setIsLoading(false)
  }, [templateId])

  const handleUseTemplate = () => {
    if (!template) return

    // Check if user can use this template
    const canUse = marketplaceManager.canUseTemplate('user_1', template.id)
    if (!canUse.canUse) {
      if (template.isPremium) {
        setShowPremiumModal(true)
        return
      }
      alert(canUse.reason)
      return
    }

    // Increment usage count
    marketplaceManager.incrementUsage(template.id)
    
    // Navigate to Image Studio with template
    router.push(`/design?template=${template.id}`)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: template?.title,
        text: template?.description,
        url: window.location.href
      })
    }
  }

  const handleCopyColors = (color: string) => {
    navigator.clipboard.writeText(color)
    // Show toast notification
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader title="Loading..." showBack={true} backUrl="/marketplace" />
        <main className="container mx-auto px-4 py-8 pb-24">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
        <BottomTabBar />
      </div>
    )
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader title="Template Not Found" showBack={true} backUrl="/marketplace" />
        <main className="container mx-auto px-4 py-8 pb-24">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Palette className="w-12 h-12 text-gray-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Template Not Found</h1>
            <p className="text-gray-400 mb-6">
              The design template you're looking for doesn't exist or is no longer available.
            </p>
            <button
              onClick={() => router.push('/marketplace')}
              className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:scale-105 transition-transform"
            >
              Browse Templates
            </button>
          </div>
        </main>
        <BottomTabBar />
      </div>
    )
  }

  const getAspectRatio = (dimensions: string) => {
    const [width, height] = dimensions.split('x').map(Number)
    return height / width
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader 
        title={template.title} 
        showBack={true}
        backUrl="/marketplace"
      />

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Template Header */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Preview */}
            <div className="lg:w-1/2">
              <div 
                className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl relative overflow-hidden mb-4"
                style={{ aspectRatio: getAspectRatio(template.dimensions) }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl">
                    <Palette className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                {/* Dimensions overlay */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-sm text-white">
                  <Maximize className="w-4 h-4" />
                  <span>{template.dimensions}</span>
                </div>
                
                {/* Premium badge */}
                {template.isPremium && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-yellow-600/90 backdrop-blur-sm rounded-lg text-sm text-white">
                    <Crown className="w-4 h-4" />
                    <span>Premium</span>
                  </div>
                )}
              </div>
              
              {/* Variations */}
              {template.variations > 1 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-white mb-2">Variations ({template.variations})</h3>
                  <div className="flex gap-2 overflow-x-auto">
                    {Array.from({ length: Math.min(template.variations, 6) }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedVariation(i)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 transition-colors ${
                          selectedVariation === i
                            ? 'border-blue-500 bg-blue-600/20'
                            : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                        }`}
                      >
                        <div className="w-full h-full rounded-lg bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
                          <span className="text-xs text-white font-medium">{i + 1}</span>
                        </div>
                      </button>
                    ))}
                    {template.variations > 6 && (
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-gray-600 bg-gray-700/50 flex items-center justify-center">
                        <span className="text-xs text-gray-400">+{template.variations - 6}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-lg transition-colors ${
                    isLiked ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {/* Download preview */}}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Preview
                </button>
              </div>
            </div>

            {/* Template Info */}
            <div className="lg:w-1/2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{template.title}</h1>
                  <p className="text-gray-300 text-lg">{template.description}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-800/30 rounded-xl">
                  <Eye className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{marketplaceManager.formatUsageCount(template.usageCount)}</div>
                  <div className="text-sm text-gray-400">Uses</div>
                </div>
                <div className="text-center p-4 bg-gray-800/30 rounded-xl">
                  <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{marketplaceManager.formatRating(template.rating)}</div>
                  <div className="text-sm text-gray-400">Rating</div>
                </div>
                <div className="text-center p-4 bg-gray-800/30 rounded-xl">
                  <Layers className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{template.variations}</div>
                  <div className="text-sm text-gray-400">Variations</div>
                </div>
                <div className="text-center p-4 bg-gray-800/30 rounded-xl">
                  <FileImage className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{template.format}</div>
                  <div className="text-sm text-gray-400">Format</div>
                </div>
              </div>

              {/* Design Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Maximize className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-gray-300">Dimensions</span>
                  </div>
                  <div className="text-white font-semibold">{template.dimensions}</div>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Paintbrush className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-gray-300">Style</span>
                  </div>
                  <div className="text-white font-semibold">{template.style}</div>
                </div>
              </div>

              {/* Use Template Button */}
              <button
                onClick={handleUseTemplate}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-primary text-white rounded-xl font-medium hover:scale-105 transition-transform mb-4"
              >
                <Zap className="w-5 h-5" />
                Use in Image Studio
              </button>

              {/* Pricing */}
              <div className="text-center p-4 bg-gray-800/30 rounded-xl">
                <div className="text-2xl font-bold text-white mb-1">
                  {template.isPremium ? '$19/month' : 'Free'}
                </div>
                <div className="text-sm text-gray-400">
                  {template.isPremium ? 'Premium Plan Required' : 'No cost to use'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            Color Palette
          </h2>
          <div className="flex flex-wrap gap-4">
            {template.colors.map((color, index) => (
              <div key={index} className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl border border-gray-600 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => handleCopyColors(color)}
                />
                <div>
                  <div className="text-white font-mono text-sm">{color}</div>
                  <button
                    onClick={() => handleCopyColors(color)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Use Case & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Use Case
            </h2>
            <p className="text-gray-300">{template.useCase}</p>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-400" />
              What's Included
            </h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>{template.variations} design variations</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>High-resolution {template.format} files</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Editable text and colors</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Commercial usage rights</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {template.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 text-purple-400 rounded-lg text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Similar Templates */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Similar Templates
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketplaceManager.getTemplatesByType('design')
              .filter(t => t.id !== template.id && t.category === template.category)
              .slice(0, 3)
              .map((similarTemplate) => (
                <div
                  key={similarTemplate.id}
                  onClick={() => router.push(`/marketplace/designs/${similarTemplate.id}`)}
                  className="group flex items-center gap-4 p-4 bg-gray-900/30 hover:bg-gray-900/50 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-lg">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white group-hover:text-purple-400 transition-colors truncate">
                      {similarTemplate.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{marketplaceManager.formatUsageCount(similarTemplate.usageCount)}</span>
                      <span>•</span>
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span>{marketplaceManager.formatRating(similarTemplate.rating)}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* Premium Modal */}
      <PremiumTemplateModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        template={template}
      />

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}
