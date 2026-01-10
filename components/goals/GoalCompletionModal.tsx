'use client'

import { useState, useEffect } from 'react'
import { Trophy, Target, Sparkles, Crown, ArrowRight } from 'lucide-react'
import { Goal } from '@/lib/goals'

interface GoalCompletionModalProps {
  isOpen: boolean
  onClose: () => void
  goal: Goal | null
  onCreateNewGoal?: () => void
  onContinue?: () => void
  isPremium?: boolean
}

export function GoalCompletionModal({ 
  isOpen, 
  onClose, 
  goal, 
  onCreateNewGoal, 
  onContinue, 
  isPremium = false 
}: GoalCompletionModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'celebrate' | 'stable'>('enter')

  useEffect(() => {
    if (isOpen && goal) {
      setShowConfetti(true)
      setAnimationPhase('enter')
      
      // Animation sequence
      const enterTimer = setTimeout(() => setAnimationPhase('celebrate'), 300)
      const stableTimer = setTimeout(() => setAnimationPhase('stable'), 2000)
      const confettiTimer = setTimeout(() => setShowConfetti(false), 4000)
      
      return () => {
        clearTimeout(enterTimer)
        clearTimeout(stableTimer)
        clearTimeout(confettiTimer)
      }
    }
  }, [isOpen, goal])

  if (!isOpen || !goal) return null

  const getPeriodText = () => {
    switch (goal.period) {
      case 'daily': return 'günlük'
      case 'weekly': return 'haftalık'
      case 'monthly': return 'aylık'
      default: return goal.period
    }
  }

  const getCelebrationMessage = () => {
    const messages = [
      'Harika bir başarı! 🎉',
      'Muhteşem ilerleme! ✨',
      'Bu hedefi başardın! 🌟',
      'Tebrikler! 🎊',
      'Süpersin! 💪'
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={`bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden transition-all duration-500 ${
          animationPhase === 'enter' ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}>
          
          {/* Confetti Animation */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Animated confetti particles */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute text-2xl animate-bounce`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`
                  }}
                >
                  {['🎉', '✨', '🌟', '🎊', '💫', '⭐'][Math.floor(Math.random() * 6)]}
                </div>
              ))}
            </div>
          )}

          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/5 to-purple-500/10" />
          
          {/* Content */}
          <div className="relative p-8 text-center">
            {/* Trophy Icon */}
            <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center transition-all duration-700 ${
              animationPhase === 'celebrate' ? 'animate-pulse scale-110' : ''
            }`}>
              <Trophy size={40} className="text-white" />
            </div>

            {/* Main Message */}
            <h2 className="text-2xl font-bold text-white mb-2">
              Tebrikler! 🎉
            </h2>
            
            <p className="text-gray-300 mb-6">
              {getCelebrationMessage()}
            </p>

            {/* Goal Details */}
            <div className="bg-gray-800/50 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Target size={24} className="text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {goal.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {goal.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {goal.target}
                  </div>
                  <div className="text-gray-500">
                    Hedef
                  </div>
                </div>
                <div className="text-gray-600">
                  /
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {getPeriodText()}
                  </div>
                  <div className="text-gray-500">
                    Periyot
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/30 rounded-xl p-4">
                <div className="text-lg font-bold text-white">
                  100%
                </div>
                <div className="text-xs text-gray-400">
                  Tamamlandı
                </div>
              </div>
              <div className="bg-gray-800/30 rounded-xl p-4">
                <div className="text-lg font-bold text-white">
                  {Math.ceil((new Date().getTime() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-xs text-gray-400">
                  Gün sürdü
                </div>
              </div>
            </div>

            {/* Premium Tease */}
            {!isPremium && (
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-yellow-400 mb-2">
                  <Crown size={16} />
                  <span className="font-medium text-sm">Premium ile daha fazla</span>
                </div>
                <p className="text-gray-300 text-xs">
                  Sınırsız hedef oluştur ve gelişmiş istatistikler gör
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {onCreateNewGoal && (
                <button
                  onClick={() => {
                    onCreateNewGoal()
                    onClose()
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Target size={18} />
                  Yeni Hedef Belirle
                </button>
              )}
              
              <button
                onClick={() => {
                  onContinue?.()
                  onClose()
                }}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Devam Et
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Motivational Quote */}
            <div className="mt-6 pt-4 border-t border-gray-800">
              <p className="text-gray-400 text-sm italic">
                "Büyük başarılar küçük adımlarla gelir" ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Mini Completion Celebration (for inline use)
interface MiniCompletionCelebrationProps {
  goal: Goal
  onDismiss: () => void
  className?: string
}

export function MiniCompletionCelebration({ 
  goal, 
  onDismiss, 
  className 
}: MiniCompletionCelebrationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onDismiss, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  if (!isVisible) return null

  return (
    <div className={`bg-green-500/10 border border-green-500/20 rounded-xl p-4 transition-all duration-300 ${
      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
    } ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
          <Trophy size={20} className="text-green-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-green-400 text-sm">
            Hedef tamamlandı! 🎉
          </h4>
          <p className="text-gray-300 text-xs">
            {goal.title} başarıyla tamamlandı
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-300 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// Streak Milestone Celebration
interface StreakMilestoneCelebrationProps {
  streakCount: number
  onDismiss: () => void
  className?: string
}

export function StreakMilestoneCelebration({ 
  streakCount, 
  onDismiss, 
  className 
}: StreakMilestoneCelebrationProps) {
  const [isVisible, setIsVisible] = useState(true)

  const getMilestoneMessage = () => {
    if (streakCount >= 30) return { emoji: '🔥', message: 'Efsane streak!' }
    if (streakCount >= 14) return { emoji: '⚡', message: '2 hafta üst üste!' }
    if (streakCount >= 7) return { emoji: '🌟', message: '1 hafta streak!' }
    return { emoji: '✨', message: `${streakCount} gün streak!` }
  }

  const milestone = getMilestoneMessage()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onDismiss, 300)
    }, 4000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  if (!isVisible) return null

  return (
    <div className={`bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 transition-all duration-300 ${
      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
    } ${className}`}>
      <div className="flex items-center gap-3">
        <div className="text-2xl animate-bounce">
          {milestone.emoji}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-orange-400 text-sm">
            {milestone.message}
          </h4>
          <p className="text-gray-300 text-xs">
            Harika gidiyorsun! Devam et 💪
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-300 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  )
}








