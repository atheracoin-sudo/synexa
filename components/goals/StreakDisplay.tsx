'use client'

import { useState, useEffect } from 'react'
import { Flame, Calendar, MessageCircle, Code2, Image, Crown, Info } from 'lucide-react'
import { Streak, goalManager } from '@/lib/goals'

interface StreakDisplayProps {
  streak: Streak
  isPremium?: boolean
  className?: string
}

export function StreakDisplay({ streak, isPremium = false, className }: StreakDisplayProps) {
  const [showGracePeriodInfo, setShowGracePeriodInfo] = useState(false)
  
  const streakEmoji = goalManager.getStreakEmoji(streak.currentStreak)
  const streakMessage = goalManager.getStreakMessage(streak.currentStreak)
  
  const getStreakIcon = () => {
    switch (streak.type) {
      case 'chat': return <MessageCircle size={16} />
      case 'code': return <Code2 size={16} />
      case 'image': return <Image size={16} />
      default: return <Flame size={16} />
    }
  }

  const getStreakTypeText = () => {
    switch (streak.type) {
      case 'chat': return 'Chat'
      case 'code': return 'Kod'
      case 'image': return 'Tasarım'
      default: return 'Genel'
    }
  }

  const getStreakColor = () => {
    if (!streak.isActive) return 'text-gray-400 bg-gray-500/20'
    if (streak.currentStreak >= 30) return 'text-orange-400 bg-orange-500/20'
    if (streak.currentStreak >= 14) return 'text-yellow-400 bg-yellow-500/20'
    if (streak.currentStreak >= 7) return 'text-blue-400 bg-blue-500/20'
    return 'text-green-400 bg-green-500/20'
  }

  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStreakColor()}`}>
            {getStreakIcon()}
          </div>
          <div>
            <h4 className="font-medium text-white text-sm">
              {getStreakTypeText()} Streak
            </h4>
            <p className="text-gray-400 text-xs">
              En uzun: {streak.longestStreak} gün
            </p>
          </div>
        </div>

        {/* Grace Period Indicator */}
        {isPremium && streak.gracePeriodUsed && (
          <div className="relative">
            <button
              onClick={() => setShowGracePeriodInfo(!showGracePeriodInfo)}
              className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded-full"
            >
              <Crown size={12} />
              Grace
              <Info size={10} />
            </button>
            
            {showGracePeriodInfo && (
              <div className="absolute top-8 right-0 w-48 bg-gray-800 border border-gray-700 rounded-lg p-3 text-xs text-gray-300 z-10">
                Premium grace period kullanıldı. Streak korundu!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Streak Count */}
      <div className="text-center py-4">
        <div className="text-3xl mb-2">
          {streakEmoji}
        </div>
        <div className="text-2xl font-bold text-white mb-1">
          {streak.currentStreak}
        </div>
        <p className="text-gray-400 text-sm">
          {streak.currentStreak === 1 ? 'gün' : 'gün üst üste'}
        </p>
      </div>

      {/* Streak Message */}
      <div className="text-center">
        <p className={`text-sm font-medium ${
          streak.isActive ? 'text-green-400' : 'text-gray-400'
        }`}>
          {streak.isActive ? streakMessage : 'Streak bozuldu 💔'}
        </p>
        
        {!streak.isActive && (
          <p className="text-xs text-gray-500 mt-1">
            Bugün başlayarak yeni streak başlat!
          </p>
        )}
      </div>

      {/* Progress to next milestone */}
      {streak.isActive && (
        <div className="mt-4 pt-3 border-t border-gray-800">
          {streak.currentStreak < 7 && (
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-2">
                Bir sonraki milestone: 7 gün 🌟
              </p>
              <div className="h-1 bg-gray-800 rounded-full">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${(streak.currentStreak / 7) * 100}%` }}
                />
              </div>
            </div>
          )}
          
          {streak.currentStreak >= 7 && streak.currentStreak < 14 && (
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-2">
                Bir sonraki milestone: 14 gün ⚡
              </p>
              <div className="h-1 bg-gray-800 rounded-full">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${((streak.currentStreak - 7) / 7) * 100}%` }}
                />
              </div>
            </div>
          )}
          
          {streak.currentStreak >= 14 && streak.currentStreak < 30 && (
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-2">
                Bir sonraki milestone: 30 gün 🔥
              </p>
              <div className="h-1 bg-gray-800 rounded-full">
                <div 
                  className="h-full bg-yellow-500 rounded-full transition-all"
                  style={{ width: `${((streak.currentStreak - 14) / 16) * 100}%` }}
                />
              </div>
            </div>
          )}
          
          {streak.currentStreak >= 30 && (
            <div className="text-center">
              <p className="text-xs text-orange-400">
                🔥 Efsane seviyedesin! 🔥
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Main Streak Card (for Home/Dashboard)
interface MainStreakCardProps {
  userId: string
  isPremium?: boolean
  onStreakClick?: () => void
  className?: string
}

export function MainStreakCard({ 
  userId, 
  isPremium = false, 
  onStreakClick, 
  className 
}: MainStreakCardProps) {
  const [mainStreak, setMainStreak] = useState<Streak | null>(null)
  
  useEffect(() => {
    const streak = goalManager.getMainStreak(userId)
    setMainStreak(streak)
  }, [userId])

  if (!mainStreak) {
    return (
      <div className={`bg-gray-900 border border-gray-800 rounded-xl p-6 text-center ${className}`}>
        <Flame size={48} className="text-gray-600 mx-auto mb-4" />
        <h3 className="text-white font-medium mb-2">
          Streak'ini başlat! 🚀
        </h3>
        <p className="text-gray-400 text-sm">
          Her gün aktif olarak streak kazan
        </p>
      </div>
    )
  }

  const streakEmoji = goalManager.getStreakEmoji(mainStreak.currentStreak)
  const streakMessage = goalManager.getStreakMessage(mainStreak.currentStreak)

  return (
    <div 
      className={`bg-gray-900 border border-gray-800 rounded-xl p-6 transition-all hover:border-gray-700 ${onStreakClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onStreakClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <Flame size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">
              Streak 🔥
            </h3>
            <p className="text-gray-400 text-sm">
              Günlük aktivite
            </p>
          </div>
        </div>

        {isPremium && (
          <div className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded-full">
            <Crown size={12} />
            Premium
          </div>
        )}
      </div>

      {/* Streak Display */}
      <div className="text-center py-4">
        <div className="text-4xl mb-2">
          {streakEmoji}
        </div>
        <div className="text-3xl font-bold text-white mb-2">
          {mainStreak.currentStreak}
        </div>
        <p className="text-gray-300 font-medium">
          {mainStreak.currentStreak === 1 ? 'gün aktif' : 'gün üst üste aktif'}
        </p>
      </div>

      {/* Streak Status */}
      <div className="text-center">
        <p className={`text-sm font-medium ${
          mainStreak.isActive ? 'text-green-400' : 'text-gray-400'
        }`}>
          {mainStreak.isActive ? 'Harika gidiyorsun! 💪' : 'Bugün aktif ol! 🚀'}
        </p>
        
        <div className="mt-3 text-xs text-gray-500">
          En uzun streak: {mainStreak.longestStreak} gün
        </div>
      </div>

      {/* Premium Grace Period Info */}
      {isPremium && !mainStreak.gracePeriodUsed && !mainStreak.isActive && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-400 text-xs">
            <Crown size={12} />
            <span>Grace period mevcut - streak korunabilir</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Compact Streak Display (for headers/sidebars)
interface CompactStreakProps {
  userId: string
  className?: string
}

export function CompactStreak({ userId, className }: CompactStreakProps) {
  const [mainStreak, setMainStreak] = useState<Streak | null>(null)
  
  useEffect(() => {
    const streak = goalManager.getMainStreak(userId)
    setMainStreak(streak)
  }, [userId])

  if (!mainStreak || mainStreak.currentStreak === 0) return null

  const streakEmoji = goalManager.getStreakEmoji(mainStreak.currentStreak)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-lg">{streakEmoji}</span>
      <span className="text-sm font-medium text-white">
        {mainStreak.currentStreak}
      </span>
      <span className="text-xs text-gray-400">
        gün
      </span>
    </div>
  )
}

// All Streaks List
interface AllStreaksListProps {
  userId: string
  isPremium?: boolean
  className?: string
}

export function AllStreaksList({ userId, isPremium = false, className }: AllStreaksListProps) {
  const [streaks, setStreaks] = useState<Streak[]>([])
  
  useEffect(() => {
    const userStreaks = goalManager.getUserStreaks(userId)
    setStreaks(userStreaks)
  }, [userId])

  return (
    <div className={`space-y-4 ${className}`}>
      {streaks.map((streak) => (
        <StreakDisplay
          key={streak.id}
          streak={streak}
          isPremium={isPremium}
        />
      ))}
    </div>
  )
}








