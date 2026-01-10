'use client'

import { useState, useEffect } from 'react'
import { Target, MessageCircle, Code2, Image, Bot, Calendar, Zap, Download, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Goal, goalManager } from '@/lib/goals'
import { SimpleDropdown } from '@/components/ui/simple-dropdown'

interface GoalProgressCardProps {
  goal: Goal
  onEdit?: (goal: Goal) => void
  onDelete?: (goalId: string) => void
  onComplete?: (goal: Goal) => void
  className?: string
}

export function GoalProgressCard({ 
  goal, 
  onEdit, 
  onDelete, 
  onComplete, 
  className 
}: GoalProgressCardProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  
  const progressPercentage = goalManager.getGoalProgressPercentage(goal)
  const progressText = goalManager.getGoalProgressText(goal)
  const isCompleted = goal.status === 'completed'
  const isNearCompletion = progressPercentage >= 80 && !isCompleted

  // Show confetti when goal is completed
  useEffect(() => {
    if (isCompleted && onComplete) {
      setShowConfetti(true)
      onComplete(goal)
      
      // Hide confetti after animation
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isCompleted, goal, onComplete])

  const getIcon = (iconName: string) => {
    const iconProps = { size: 20 }
    switch (iconName) {
      case 'MessageCircle': return <MessageCircle {...iconProps} />
      case 'Code2': return <Code2 {...iconProps} />
      case 'Image': return <Image {...iconProps} />
      case 'Bot': return <Bot {...iconProps} />
      case 'Calendar': return <Calendar {...iconProps} />
      case 'Zap': return <Zap {...iconProps} />
      case 'Download': return <Download {...iconProps} />
      default: return <Target {...iconProps} />
    }
  }

  const getProgressColor = () => {
    if (isCompleted) return 'bg-green-500'
    if (isNearCompletion) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const getProgressBgColor = () => {
    if (isCompleted) return 'bg-green-500/20'
    if (isNearCompletion) return 'bg-yellow-500/20'
    return 'bg-blue-500/20'
  }

  const getPeriodText = () => {
    switch (goal.period) {
      case 'daily': return 'Günlük'
      case 'weekly': return 'Haftalık'
      case 'monthly': return 'Aylık'
      default: return goal.period
    }
  }

  return (
    <div className={`relative bg-gray-900 border border-gray-800 rounded-2xl p-6 transition-all hover:border-gray-700 ${className}`}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute top-4 left-4 text-2xl animate-bounce">🎉</div>
          <div className="absolute top-6 right-6 text-xl animate-bounce delay-100">✨</div>
          <div className="absolute bottom-4 left-6 text-lg animate-bounce delay-200">🌟</div>
          <div className="absolute bottom-6 right-4 text-xl animate-bounce delay-300">🎊</div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${goalManager.getGoalColorClass(goal.color)}`}>
            {getIcon(goal.icon)}
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

        {/* Actions Menu */}
        {(onEdit || onDelete) && (
          <SimpleDropdown
            trigger={
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <MoreHorizontal size={16} className="text-gray-400" />
              </button>
            }
          >
            {onEdit && (
              <button
                onClick={() => onEdit(goal)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <Edit size={14} />
                Düzenle
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(goal.id)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
              >
                <Trash2 size={14} />
                Sil
              </button>
            )}
          </SimpleDropdown>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-3">
        {/* Progress Bar */}
        <div className="relative">
          <div className={`h-2 rounded-full ${getProgressBgColor()}`}>
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          
          {/* Progress Indicator */}
          {progressPercentage > 0 && (
            <div 
              className="absolute top-0 h-2 w-1 bg-white rounded-full transition-all duration-500"
              style={{ left: `${Math.min(progressPercentage, 100)}%`, transform: 'translateX(-50%)' }}
            />
          )}
        </div>

        {/* Progress Text */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm font-medium">
            {progressText}
          </span>
          <span className={`text-sm font-medium ${
            isCompleted ? 'text-green-400' : 
            isNearCompletion ? 'text-yellow-400' : 
            'text-blue-400'
          }`}>
            {progressPercentage}%
          </span>
        </div>

        {/* Status & Period */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isCompleted ? 'bg-green-500/20 text-green-400' :
              'bg-gray-700 text-gray-300'
            }`}>
              {getPeriodText()}
            </span>
            
            {isCompleted && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                ✅ Tamamlandı
              </span>
            )}
          </div>

          {/* Motivational Message */}
          {!isCompleted && (
            <span className="text-xs text-gray-500">
              {isNearCompletion ? 'Neredeyse bitti! 🔥' : 'İlerliyorsun 💪'}
            </span>
          )}
        </div>
      </div>

      {/* Completion Celebration */}
      {isCompleted && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
            <span>🎉</span>
            <span>Tebrikler! Bu hedefi başardın.</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Goal Progress List Component
interface GoalProgressListProps {
  goals: Goal[]
  onEdit?: (goal: Goal) => void
  onDelete?: (goalId: string) => void
  onComplete?: (goal: Goal) => void
  className?: string
}

export function GoalProgressList({ 
  goals, 
  onEdit, 
  onDelete, 
  onComplete, 
  className 
}: GoalProgressListProps) {
  if (goals.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Target size={48} className="text-gray-600 mx-auto mb-4" />
        <h3 className="text-white font-medium mb-2">
          Henüz bir hedefin yok
        </h3>
        <p className="text-gray-400 text-sm">
          İlk hedefini oluşturarak başla
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {goals.map((goal) => (
        <GoalProgressCard
          key={goal.id}
          goal={goal}
          onEdit={onEdit}
          onDelete={onDelete}
          onComplete={onComplete}
        />
      ))}
    </div>
  )
}

// Compact Goal Progress Card for Home/Dashboard
interface CompactGoalCardProps {
  goal: Goal
  onClick?: () => void
  className?: string
}

export function CompactGoalCard({ goal, onClick, className }: CompactGoalCardProps) {
  const progressPercentage = goalManager.getGoalProgressPercentage(goal)
  const isCompleted = goal.status === 'completed'

  const getIcon = (iconName: string) => {
    const iconProps = { size: 16 }
    switch (iconName) {
      case 'MessageCircle': return <MessageCircle {...iconProps} />
      case 'Code2': return <Code2 {...iconProps} />
      case 'Image': return <Image {...iconProps} />
      case 'Bot': return <Bot {...iconProps} />
      default: return <Target {...iconProps} />
    }
  }

  return (
    <div 
      className={`bg-gray-900 border border-gray-800 rounded-xl p-4 transition-all hover:border-gray-700 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${goalManager.getGoalColorClass(goal.color)}`}>
          {getIcon(goal.icon)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white text-sm truncate">
            {goal.title}
          </h4>
          <p className="text-gray-400 text-xs">
            {goalManager.getGoalProgressText(goal)}
          </p>
        </div>
        {isCompleted && (
          <span className="text-green-400 text-lg">✅</span>
        )}
      </div>

      {/* Mini Progress Bar */}
      <div className="relative">
        <div className="h-1.5 bg-gray-800 rounded-full">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              isCompleted ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">
            {progressPercentage}%
          </span>
          {!isCompleted && progressPercentage >= 80 && (
            <span className="text-xs text-yellow-400">🔥</span>
          )}
        </div>
      </div>
    </div>
  )
}








