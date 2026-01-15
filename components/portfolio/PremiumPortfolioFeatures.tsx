'use client'

import { Crown, Zap, Star, Users, Shield, Sparkles } from 'lucide-react'

interface PremiumPortfolioBadgeProps {
  className?: string
}

export function PremiumPortfolioBadge({ className = '' }: PremiumPortfolioBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg text-xs ${className}`}>
      <Crown className="w-3 h-3 text-yellow-400" />
      <span className="text-yellow-400 font-medium">Premium</span>
    </div>
  )
}

interface PortfolioWatermarkProps {
  isPremium: boolean
  className?: string
}

export function PortfolioWatermark({ isPremium, className = '' }: PortfolioWatermarkProps) {
  if (isPremium) return null

  return (
    <div className={`flex items-center justify-center gap-2 py-2 text-xs text-gray-500 ${className}`}>
      <Sparkles className="w-3 h-3" />
      <span>Created with Synexa AI</span>
    </div>
  )
}

interface PremiumUpgradePromptProps {
  feature: string
  onUpgrade: () => void
  className?: string
}

export function PremiumUpgradePrompt({ feature, onUpgrade, className = '' }: PremiumUpgradePromptProps) {
  return (
    <div className={`bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-500/30 rounded-xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
          <Crown className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-white mb-1">Premium Feature</h3>
          <p className="text-sm text-gray-300 mb-3">
            {feature} is available with Premium. Upgrade to unlock unlimited portfolio features.
          </p>
          <button
            onClick={onUpgrade}
            className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg text-sm font-medium hover:scale-105 transition-transform"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  )
}

interface PremiumFeatureListProps {
  className?: string
}

export function PremiumFeatureList({ className = '' }: PremiumFeatureListProps) {
  const features = [
    {
      icon: <Zap className="w-4 h-4" />,
      title: 'Unlimited Projects',
      description: 'Create and share unlimited portfolio projects'
    },
    {
      icon: <Shield className="w-4 h-4" />,
      title: 'No Watermarks',
      description: 'Clean, professional portfolio without branding'
    },
    {
      icon: <Star className="w-4 h-4" />,
      title: 'Custom Profile',
      description: 'Personalize your profile with custom headers'
    },
    {
      icon: <Users className="w-4 h-4" />,
      title: 'Priority Support',
      description: 'Get help faster with premium support'
    }
  ]

  return (
    <div className={`space-y-3 ${className}`}>
      {features.map((feature, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="w-8 h-8 bg-yellow-600/20 border border-yellow-500/30 rounded-lg flex items-center justify-center text-yellow-400">
            {feature.icon}
          </div>
          <div>
            <h4 className="font-medium text-white">{feature.title}</h4>
            <p className="text-sm text-gray-400">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

interface PortfolioLimitIndicatorProps {
  current: number
  max: number
  isPremium: boolean
  className?: string
}

export function PortfolioLimitIndicator({ current, max, isPremium, className = '' }: PortfolioLimitIndicatorProps) {
  if (isPremium) return null

  const percentage = (current / max) * 100
  const isNearLimit = percentage >= 80

  return (
    <div className={`bg-gray-800/50 border border-gray-700 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">Portfolio Projects</span>
        <span className="text-xs text-gray-400">{current}/{max}</span>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
        <div 
          className={`h-2 rounded-full transition-all ${
            isNearLimit ? 'bg-yellow-500' : 'bg-blue-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      {isNearLimit && (
        <div className="flex items-center gap-2 text-xs text-yellow-400">
          <Crown className="w-3 h-3" />
          <span>Upgrade to Premium for unlimited projects</span>
        </div>
      )}
    </div>
  )
}

interface TeamPortfolioFeatureProps {
  className?: string
}

export function TeamPortfolioFeature({ className = '' }: TeamPortfolioFeatureProps) {
  return (
    <div className={`bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-white mb-1">Team Portfolio</h3>
          <p className="text-sm text-gray-300 mb-3">
            Showcase your team's work with shared portfolios and collaborative features.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              <span>Shared workspace portfolio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              <span>Team member showcase</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              <span>Collaborative projects</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}











