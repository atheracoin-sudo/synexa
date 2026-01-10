'use client'

import { useState, useEffect } from 'react'
import { X, Share2, ArrowRight, Sparkles } from 'lucide-react'
import { Achievement } from '@/lib/achievements'
import Badge from './Badge'

interface AchievementUnlockModalProps {
  achievement: Achievement | null
  isOpen: boolean
  onClose: () => void
  onShare?: (achievement: Achievement) => void
  onContinue?: () => void
}

export default function AchievementUnlockModal({
  achievement,
  isOpen,
  onClose,
  onShare,
  onContinue
}: AchievementUnlockModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen && achievement) {
      setShowConfetti(true)
      // Auto-close after 5 seconds if user doesn't interact
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen, achievement, onClose])

  const handleShare = () => {
    if (achievement && onShare) {
      onShare(achievement)
    }
  }

  const handleContinue = () => {
    if (onContinue) {
      onContinue()
    }
    onClose()
  }

  if (!isOpen || !achievement) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-300 relative">
        {/* Confetti Effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-4 left-6 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute top-6 right-8 w-1 h-1 bg-pink-400 rounded-full animate-bounce delay-100"></div>
            <div className="absolute top-8 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200"></div>
            <div className="absolute top-5 right-1/4 w-1 h-1 bg-green-400 rounded-full animate-bounce delay-300"></div>
            <div className="absolute top-10 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150"></div>
            <div className="absolute top-3 left-3/4 w-1 h-1 bg-orange-400 rounded-full animate-bounce delay-250"></div>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-center relative">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Tebrikler! 🎉
            </h2>
            <p className="text-blue-100 text-sm">
              Yeni bir başarı kazandın!
            </p>
          </div>
        </div>

        {/* Achievement Display */}
        <div className="p-6 text-center">
          <div className="mb-6">
            <Badge
              achievement={achievement}
              isUnlocked={true}
              size="xl"
              showTitle={false}
              showProgress={false}
              className="mx-auto"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-2">
              {achievement.title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {achievement.description}
            </p>
          </div>

          {/* Tier Badge */}
          <div className="mb-6">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              achievement.tier === 'bronze' ? 'bg-orange-500/20 text-orange-400' :
              achievement.tier === 'silver' ? 'bg-gray-500/20 text-gray-300' :
              achievement.tier === 'gold' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-purple-500/20 text-purple-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                achievement.tier === 'bronze' ? 'bg-orange-400' :
                achievement.tier === 'silver' ? 'bg-gray-300' :
                achievement.tier === 'gold' ? 'bg-yellow-400' :
                'bg-purple-400'
              }`} />
              {achievement.tier === 'bronze' ? 'Bronz' :
               achievement.tier === 'silver' ? 'Gümüş' :
               achievement.tier === 'gold' ? 'Altın' : 'Platin'} Başarı
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {achievement.shareText && onShare && (
              <button
                onClick={handleShare}
                className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Paylaş
              </button>
            )}
            <button
              onClick={handleContinue}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              Devam Et
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
          aria-label="Kapat"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )
}

// Toast-style achievement notification (less intrusive)
export function AchievementToast({
  achievement,
  isVisible,
  onClose,
  onView
}: {
  achievement: Achievement | null
  isVisible: boolean
  onClose: () => void
  onView?: () => void
}) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 4000)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible || !achievement) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-2xl max-w-sm">
        <div className="flex items-start gap-3">
          <Badge
            achievement={achievement}
            isUnlocked={true}
            size="sm"
            showTitle={false}
            showProgress={false}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-white text-sm">Yeni Başarı!</h4>
              <Sparkles className="w-3 h-3 text-yellow-400" />
            </div>
            <p className="text-xs text-gray-300 mb-2">
              <strong>{achievement.title}</strong> kazandın
            </p>
            {onView && (
              <button
                onClick={onView}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Görüntüle →
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-md flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Kapat"
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Multiple achievements unlock modal (for bulk unlocks)
export function MultipleAchievementsModal({
  achievements,
  isOpen,
  onClose,
  onViewAll
}: {
  achievements: Achievement[]
  isOpen: boolean
  onClose: () => void
  onViewAll?: () => void
}) {
  if (!isOpen || achievements.length === 0) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Harika İlerleme! 🎉
          </h2>
          <p className="text-blue-100 text-sm">
            {achievements.length} yeni başarı kazandın!
          </p>
        </div>

        {/* Achievements List */}
        <div className="p-6">
          <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <Badge
                  achievement={achievement}
                  isUnlocked={true}
                  size="sm"
                  showTitle={false}
                  showProgress={false}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm">{achievement.title}</h4>
                  <p className="text-xs text-gray-400">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors"
            >
              Kapat
            </button>
            {onViewAll && (
              <button
                onClick={() => {
                  onViewAll()
                  onClose()
                }}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
                Tümünü Gör
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
          aria-label="Kapat"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )
}






