'use client'

import { useState } from 'react'
import { 
  Star,
  Crown,
  Eye,
  Users,
  ArrowRight,
  Fire,
  Sparkles,
  Code,
  Bot,
  Palette,
  Clock,
  Download,
  Heart,
  Share2
} from 'lucide-react'
import { Template, marketplaceManager } from '@/lib/marketplace'

interface TemplateCardProps {
  template: Template
  onClick: (template: Template) => void
  variant?: 'default' | 'compact' | 'featured'
  showActions?: boolean
}

export function TemplateCard({ 
  template, 
  onClick, 
  variant = 'default',
  showActions = false 
}: TemplateCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'app': return <Code className="w-4 h-4" />
      case 'agent': return <Bot className="w-4 h-4" />
      case 'design': return <Palette className="w-4 h-4" />
      default: return <Sparkles className="w-4 h-4" />
    }
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: template.title,
        text: template.shortDescription,
        url: window.location.href
      })
    }
  }

  if (variant === 'compact') {
    return (
      <div
        onClick={() => onClick(template)}
        className="group flex items-center gap-4 p-4 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 hover:border-blue-500/50 rounded-xl cursor-pointer transition-all"
      >
        {/* Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
          {marketplaceManager.getTypeIcon(template.type)}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
              {template.title}
            </h3>
            {template.isPremium && <Crown className="w-4 h-4 text-yellow-400 flex-shrink-0" />}
            {template.isNew && <Fire className="w-4 h-4 text-green-400 flex-shrink-0" />}
          </div>
          <p className="text-gray-400 text-sm truncate">{template.shortDescription}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{marketplaceManager.formatUsageCount(template.usageCount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span>{marketplaceManager.formatRating(template.rating)}</span>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
      </div>
    )
  }

  if (variant === 'featured') {
    return (
      <div
        onClick={() => onClick(template)}
        className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 hover:border-blue-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] shadow-lg"
      >
        {/* Preview Image */}
        <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center text-3xl shadow-2xl">
              {marketplaceManager.getTypeIcon(template.type)}
            </div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-1 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-sm text-white">
              {getTypeIcon(template.type)}
              <span>{marketplaceManager.getTypeName(template.type)}</span>
            </div>
            
            {template.isPremium && (
              <div className="flex items-center gap-1 px-3 py-1 bg-yellow-600/90 backdrop-blur-sm rounded-lg text-sm text-white">
                <Crown className="w-4 h-4" />
                <span>Premium</span>
              </div>
            )}
          </div>
          
          {/* Status indicators */}
          {(template.isPopular || template.isNew) && (
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              {template.isPopular && (
                <div className="flex items-center gap-1 px-3 py-1 bg-red-600/90 backdrop-blur-sm rounded-lg text-sm text-white">
                  <Fire className="w-4 h-4" />
                  <span>Popular</span>
                </div>
              )}
              {template.isNew && (
                <div className="flex items-center gap-1 px-3 py-1 bg-green-600/90 backdrop-blur-sm rounded-lg text-sm text-white">
                  <Sparkles className="w-4 h-4" />
                  <span>New</span>
                </div>
              )}
            </div>
          )}
          
          {/* Shine effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
            {template.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {template.description}
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-800/30 rounded-xl">
              <div className="text-lg font-bold text-white">{marketplaceManager.formatUsageCount(template.usageCount)}</div>
              <div className="text-xs text-gray-400">Uses</div>
            </div>
            <div className="text-center p-3 bg-gray-800/30 rounded-xl">
              <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                {marketplaceManager.formatRating(template.rating)}
              </div>
              <div className="text-xs text-gray-400">Rating</div>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {template.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg text-xs"
              >
                #{tag}
              </span>
            ))}
            {template.tags.length > 4 && (
              <span className="px-3 py-1 bg-gray-700/50 text-gray-400 rounded-lg text-xs">
                +{template.tags.length - 4} more
              </span>
            )}
          </div>
          
          {/* CTA */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-300">
              {template.isPremium ? 'Premium' : 'Free'}
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium group-hover:scale-105 transition-transform">
              <span>Use Template</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div
      onClick={() => onClick(template)}
      className="group bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02]"
    >
      {/* Preview Image */}
      <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-2xl">
            {marketplaceManager.getTypeIcon(template.type)}
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
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
        
        {/* Status indicators */}
        {(template.isPopular || template.isNew) && (
          <div className="absolute bottom-3 right-3 flex flex-col gap-1">
            {template.isPopular && (
              <div className="flex items-center gap-1 px-2 py-1 bg-red-600/80 backdrop-blur-sm rounded text-xs text-white">
                <Fire className="w-3 h-3" />
                <span>Hot</span>
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
        
        {/* Actions */}
        {showActions && (
          <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleLike}
              className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'text-red-400 fill-current' : 'text-white'}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors"
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
          {template.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {template.shortDescription}
        </p>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{marketplaceManager.formatUsageCount(template.usageCount)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400" />
            <span>{marketplaceManager.formatRating(template.rating)}</span>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {template.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded">
              +{template.tags.length - 2}
            </span>
          )}
        </div>
        
        {/* CTA */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-400">
            {template.isPremium ? 'Premium' : 'Free'}
          </div>
          <div className="flex items-center gap-1 text-blue-400 group-hover:text-blue-300 transition-colors">
            <span className="text-sm font-medium">Use</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  )
}





