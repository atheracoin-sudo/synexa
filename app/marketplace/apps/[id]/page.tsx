'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/GlobalHeader'
import { BottomTabBar } from '@/components/ui/BottomTabBar'
import { PremiumTemplateModal } from '@/components/marketplace/PremiumTemplateModal'
import { marketplaceManager, AppTemplate } from '@/lib/marketplace'
import { 
  Star,
  Crown,
  Eye,
  Users,
  Download,
  ExternalLink,
  Code,
  Smartphone,
  Monitor,
  Palette,
  CheckCircle,
  ArrowRight,
  Play,
  Heart,
  Share2,
  Zap,
  Clock,
  Target
} from 'lucide-react'

export default function AppTemplateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.id as string
  
  const [template, setTemplate] = useState<AppTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  useEffect(() => {
    if (!templateId) return

    // Fetch template data
    const templateData = marketplaceManager.getTemplate(templateId) as AppTemplate
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
    
    // Navigate to Code Studio with template
    router.push(`/code?template=${template.id}`)
  }

  const handlePreview = () => {
    if (template?.demoUrl) {
      window.open(template.demoUrl, '_blank')
    } else {
      setShowPreview(true)
    }
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

  const getTechStackIcon = (tech: string) => {
    const icons: Record<string, JSX.Element> = {
      'React': <Code className="w-4 h-4" />,
      'Next.js': <Code className="w-4 h-4" />,
      'Vue': <Code className="w-4 h-4" />,
      'Angular': <Code className="w-4 h-4" />,
      'TypeScript': <Code className="w-4 h-4" />,
      'Node.js': <Code className="w-4 h-4" />,
      'HTML/CSS': <Code className="w-4 h-4" />
    }
    return icons[tech] || <Code className="w-4 h-4" />
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
              <Code className="w-12 h-12 text-gray-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Template Not Found</h1>
            <p className="text-gray-400 mb-6">
              The template you're looking for doesn't exist or is no longer available.
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
              <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl relative overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl">
                    <Code className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                     onClick={handlePreview}>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
                
                {/* Premium badge */}
                {template.isPremium && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-yellow-600/90 backdrop-blur-sm rounded-lg text-sm text-white">
                    <Crown className="w-4 h-4" />
                    <span>Premium</span>
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePreview}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Preview
                </button>
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
                  <Code className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{template.components}</div>
                  <div className="text-sm text-gray-400">Components</div>
                </div>
                <div className="text-center p-4 bg-gray-800/30 rounded-xl">
                  <Monitor className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{template.pages}</div>
                  <div className="text-sm text-gray-400">Pages</div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                <div className="flex flex-wrap gap-2">
                  {template.responsive && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-600/20 border border-green-500/30 text-green-400 rounded-lg text-sm">
                      <Smartphone className="w-3 h-3" />
                      <span>Responsive</span>
                    </div>
                  )}
                  {template.darkMode && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-purple-600/20 border border-purple-500/30 text-purple-400 rounded-lg text-sm">
                      <Palette className="w-3 h-3" />
                      <span>Dark Mode</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm">
                    <Target className="w-3 h-3" />
                    <span>Production Ready</span>
                  </div>
                </div>
              </div>

              {/* Use Template Button */}
              <button
                onClick={handleUseTemplate}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-primary text-white rounded-xl font-medium hover:scale-105 transition-transform mb-4"
              >
                <Zap className="w-5 h-5" />
                Use in Code Studio
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

        {/* Tech Stack */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-400" />
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-3">
            {template.techStack.map((tech) => (
              <div
                key={tech}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300"
              >
                {getTechStackIcon(tech)}
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features List */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            What's Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {template.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {template.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm"
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
            {marketplaceManager.getTemplatesByType('app')
              .filter(t => t.id !== template.id && t.category === template.category)
              .slice(0, 3)
              .map((similarTemplate) => (
                <div
                  key={similarTemplate.id}
                  onClick={() => router.push(`/marketplace/apps/${similarTemplate.id}`)}
                  className="group flex items-center gap-4 p-4 bg-gray-900/30 hover:bg-gray-900/50 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-lg">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors truncate">
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
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
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
