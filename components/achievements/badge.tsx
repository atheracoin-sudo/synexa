'use client'

import { 
  MessageCircle, 
  Brain, 
  Zap, 
  Code2, 
  Hammer, 
  Rocket, 
  Palette, 
  Image, 
  Crown, 
  Bot, 
  Users, 
  Building, 
  Handshake, 
  Star, 
  Flame, 
  Gem,
  Lock,
  Trophy
} from 'lucide-react'
import { Achievement, AchievementTier } from '@/lib/achievements'

interface BadgeProps {
  achievement: Achievement
  isUnlocked?: boolean
  progress?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showProgress?: boolean
  showTitle?: boolean
  showDescription?: boolean
  className?: string
  onClick?: () => void
}

export default function Badge({ 
  achievement, 
  isUnlocked = false,
  progress = 0,
  size = 'md',
  showProgress = true,
  showTitle = true,
  showDescription = false,
  className = '',
  onClick
}: BadgeProps) {
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'MessageCircle': MessageCircle,
      'Brain': Brain,
      'Zap': Zap,
      'Code2': Code2,
      'Hammer': Hammer,
      'Rocket': Rocket,
      'Palette': Palette,
      'Image': Image,
      'Crown': Crown,
      'Bot': Bot,
      'Users': Users,
      'Building': Building,
      'Handshake': Handshake,
      'Star': Star,
      'Flame': Flame,
      'Gem': Gem
    }
    return iconMap[iconName] || Trophy
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'w-12 h-12',
          icon: 'w-6 h-6',
          text: 'text-xs',
          progress: 'h-1'
        }
      case 'md':
        return {
          container: 'w-16 h-16',
          icon: 'w-8 h-8',
          text: 'text-sm',
          progress: 'h-1.5'
        }
      case 'lg':
        return {
          container: 'w-20 h-20',
          icon: 'w-10 h-10',
          text: 'text-base',
          progress: 'h-2'
        }
      case 'xl':
        return {
          container: 'w-24 h-24',
          icon: 'w-12 h-12',
          text: 'text-lg',
          progress: 'h-2'
        }
      default:
        return {
          container: 'w-16 h-16',
          icon: 'w-8 h-8',
          text: 'text-sm',
          progress: 'h-1.5'
        }
    }
  }

  const getTierGradient = (tier: AchievementTier) => {
    switch (tier) {
      case 'bronze':
        return isUnlocked 
          ? 'from-orange-500 to-amber-600' 
          : 'from-gray-600 to-gray-700'
      case 'silver':
        return isUnlocked 
          ? 'from-gray-300 to-gray-500' 
          : 'from-gray-600 to-gray-700'
      case 'gold':
        return isUnlocked 
          ? 'from-yellow-400 to-yellow-600' 
          : 'from-gray-600 to-gray-700'
      case 'platinum':
        return isUnlocked 
          ? 'from-purple-400 to-purple-600' 
          : 'from-gray-600 to-gray-700'
      default:
        return 'from-gray-600 to-gray-700'
    }
  }

  const getTierBorder = (tier: AchievementTier) => {
    if (!isUnlocked) return 'border-gray-700'
    
    switch (tier) {
      case 'bronze': return 'border-orange-500/30'
      case 'silver': return 'border-gray-400/30'
      case 'gold': return 'border-yellow-500/30'
      case 'platinum': return 'border-purple-500/30'
      default: return 'border-gray-700'
    }
  }

  const sizeClasses = getSizeClasses()
  const Icon = getIcon(achievement.icon)

  return (
    <div 
      className={`relative group ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Badge Container */}
      <div className={`
        ${sizeClasses.container} 
        bg-gradient-to-br ${getTierGradient(achievement.tier)}
        border-2 ${getTierBorder(achievement.tier)}
        rounded-2xl 
        flex items-center justify-center 
        transition-all duration-200
        ${isUnlocked ? 'shadow-lg' : 'opacity-50'}
        ${onClick ? 'hover:scale-105 hover:shadow-xl' : ''}
        ${!isUnlocked ? 'grayscale' : ''}
      `}>
        {/* Icon */}
        {isUnlocked ? (
          <Icon className={`${sizeClasses.icon} text-white drop-shadow-sm`} />
        ) : (
          <Lock className={`${sizeClasses.icon} text-gray-400`} />
        )}

        {/* Premium Badge */}
        {achievement.isPremium && isUnlocked && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
            <Crown className="w-3 h-3 text-white" />
          </div>
        )}

        {/* Unlock Animation Ring */}
        {isUnlocked && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        )}
      </div>

      {/* Progress Bar */}
      {!isUnlocked && showProgress && progress > 0 && (
        <div className={`mt-2 w-full bg-gray-700 rounded-full ${sizeClasses.progress} overflow-hidden`}>
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      )}

      {/* Title */}
      {showTitle && (
        <div className={`mt-2 text-center ${sizeClasses.text}`}>
          <h4 className={`font-medium ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
            {achievement.title}
          </h4>
          {showDescription && (
            <p className="text-xs text-gray-500 mt-1 leading-tight">
              {achievement.description}
            </p>
          )}
        </div>
      )}

      {/* Progress Text */}
      {!isUnlocked && showProgress && progress > 0 && (
        <div className="mt-1 text-center">
          <span className="text-xs text-gray-500">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  )
}

// Specialized badge variants
export function ProfileBadge({ achievement, className = '' }: { 
  achievement: Achievement
  className?: string 
}) {
  return (
    <Badge
      achievement={achievement}
      isUnlocked={true}
      size="sm"
      showTitle={false}
      showProgress={false}
      className={className}
    />
  )
}

export function AchievementGridBadge({ 
  achievement, 
  isUnlocked, 
  progress, 
  onClick 
}: { 
  achievement: Achievement
  isUnlocked: boolean
  progress: number
  onClick?: () => void
}) {
  return (
    <Badge
      achievement={achievement}
      isUnlocked={isUnlocked}
      progress={progress}
      size="lg"
      showTitle={true}
      showDescription={true}
      showProgress={true}
      onClick={onClick}
      className="transition-transform hover:scale-105"
    />
  )
}

export function CompactBadge({ 
  achievement, 
  isUnlocked, 
  className = '' 
}: { 
  achievement: Achievement
  isUnlocked: boolean
  className?: string
}) {
  const Icon = achievement.icon === 'MessageCircle' ? MessageCircle :
              achievement.icon === 'Code2' ? Code2 :
              achievement.icon === 'Palette' ? Palette :
              achievement.icon === 'Bot' ? Bot : Trophy

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full border border-gray-700 ${className}`}>
      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${
        isUnlocked 
          ? achievement.tier === 'gold' ? 'from-yellow-400 to-yellow-600' :
            achievement.tier === 'silver' ? 'from-gray-300 to-gray-500' :
            achievement.tier === 'platinum' ? 'from-purple-400 to-purple-600' :
            'from-orange-500 to-amber-600'
          : 'from-gray-600 to-gray-700'
      } flex items-center justify-center ${!isUnlocked ? 'opacity-50 grayscale' : ''}`}>
        {isUnlocked ? (
          <Icon className="w-3 h-3 text-white" />
        ) : (
          <Lock className="w-3 h-3 text-gray-400" />
        )}
      </div>
      <span className={`text-sm font-medium ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
        {achievement.title}
      </span>
      {achievement.isPremium && (
        <Crown className="w-3 h-3 text-yellow-400" />
      )}
    </div>
  )
}

// Badge collection component
export function BadgeCollection({ 
  achievements, 
  unlockedIds, 
  className = '' 
}: { 
  achievements: Achievement[]
  unlockedIds: string[]
  className?: string
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {achievements.slice(0, 5).map((achievement) => (
        <CompactBadge
          key={achievement.id}
          achievement={achievement}
          isUnlocked={unlockedIds.includes(achievement.id)}
        />
      ))}
      {achievements.length > 5 && (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800/30 rounded-full text-xs text-gray-400">
          +{achievements.length - 5} more
        </div>
      )}
    </div>
  )
}











