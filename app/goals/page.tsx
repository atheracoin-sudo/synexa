'use client'

// Force dynamic rendering since this page depends on localStorage
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Target, Plus, Filter, ArrowLeft, Trophy, Flame, Crown } from 'lucide-react'
import { GlobalHeader } from '@/components/ui/global-header'
import { GoalProgressList } from '@/components/goals/GoalProgressCard'
import { AllStreaksList } from '@/components/goals/StreakDisplay'
import { GoalCreationModal } from '@/components/goals/GoalCreationModal'
import { GoalCompletionModal } from '@/components/goals/GoalCompletionModal'
import { goalManager, Goal } from '@/lib/goals'
import { usePremium } from '@/lib/hooks/usePremium'
import NewFeatureBadge from '@/components/changelog/NewFeatureBadge'

type FilterType = 'all' | 'active' | 'completed'

export default function GoalsPage() {
  const router = useRouter()
  const { isPremium } = usePremium()
  
  const [goals, setGoals] = useState<Goal[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [completedGoal, setCompletedGoal] = useState<Goal | null>(null)
  const [loading, setLoading] = useState(true)

  const userId = 'user_1'

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = () => {
    setLoading(true)
    try {
      const userGoals = goalManager.getUserGoals(userId)
      setGoals(userGoals)
    } catch (error) {
      console.error('Failed to load goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoalCreated = (newGoal: Goal) => {
    setGoals(prev => [...prev, newGoal])
  }

  const handleGoalDelete = (goalId: string) => {
    goalManager.deleteGoal(userId, goalId)
    setGoals(prev => prev.filter(g => g.id !== goalId))
  }

  const handleGoalComplete = (goal: Goal) => {
    if (goalManager.shouldShowCompletion(userId, goal.id)) {
      setCompletedGoal(goal)
      setShowCompletionModal(true)
      goalManager.markCompletionShown(userId, goal.id)
    }
  }

  const getFilteredGoals = () => {
    switch (activeFilter) {
      case 'active':
        return goals.filter(g => g.status === 'active')
      case 'completed':
        return goals.filter(g => g.status === 'completed')
      default:
        return goals
    }
  }

  const filteredGoals = getFilteredGoals()
  const activeGoals = goals.filter(g => g.status === 'active')
  const completedGoals = goals.filter(g => g.status === 'completed')
  const canCreateGoal = goalManager.canCreateGoal(userId, isPremium)

  const getFilterText = (filter: FilterType) => {
    switch (filter) {
      case 'active': return `Aktif (${activeGoals.length})`
      case 'completed': return `Tamamlanan (${completedGoals.length})`
      default: return `Tümü (${goals.length})`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <GlobalHeader
          title="Hedefler"
          showBackButton
          onBackPress={() => router.back()}
        />
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-800 rounded w-1/4"></div>
            <div className="h-32 bg-gray-800 rounded"></div>
            <div className="h-32 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <GlobalHeader
        title="Hedefler"
        showBackButton
        onBackPress={() => router.back()}
      />

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Hedeflerin</h1>
          <p className="text-gray-400">
            Küçük adımlarla büyük başarılara ulaş
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target size={24} className="text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {activeGoals.length}
            </div>
            <div className="text-gray-400 text-sm">Aktif Hedef</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Trophy size={24} className="text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {completedGoals.length}
            </div>
            <div className="text-gray-400 text-sm">Tamamlanan</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Flame size={24} className="text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {goalManager.getMainStreak(userId)?.currentStreak || 0}
            </div>
            <div className="text-gray-400 text-sm">Günlük Streak</div>
          </div>
        </div>

        {/* Create Goal Button */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Hedeflerim
          </h2>
          
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!canCreateGoal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors"
          >
            <Plus size={18} />
            Yeni Hedef
          </button>
        </div>

        {/* Goal Limit Warning */}
        {!canCreateGoal && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <Target size={16} />
              <span className="font-medium">Hedef Limiti</span>
            </div>
            <p className="text-gray-300 text-sm">
              {isPremium 
                ? 'Maksimum 10 aktif hedefin olabilir.'
                : 'Free plan ile maksimum 2 aktif hedefin olabilir.'
              }
            </p>
            {!isPremium && (
              <button 
                onClick={() => router.push('/pricing')}
                className="mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                <Crown size={14} />
                Premium'a Geç →
              </button>
            )}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-gray-900 p-1 rounded-xl border border-gray-800">
          {(['all', 'active', 'completed'] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeFilter === filter
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {getFilterText(filter)}
            </button>
          ))}
        </div>

        {/* Goals List */}
        <div>
          {filteredGoals.length === 0 ? (
            <div className="text-center py-12">
              <Target size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">
                {activeFilter === 'active' && 'Aktif hedefin yok'}
                {activeFilter === 'completed' && 'Henüz tamamlanan hedefin yok'}
                {activeFilter === 'all' && 'Henüz bir hedefin yok'}
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                {activeFilter === 'active' && 'Yeni bir hedef oluşturarak başla'}
                {activeFilter === 'completed' && 'İlk hedefini tamamla ve burada gör'}
                {activeFilter === 'all' && 'İlk hedefini oluşturarak başla'}
              </p>
              
              {activeFilter !== 'completed' && canCreateGoal && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus size={18} />
                  İlk Hedefini Oluştur
                </button>
              )}
            </div>
          ) : (
            <GoalProgressList
              goals={filteredGoals}
              onDelete={handleGoalDelete}
              onComplete={handleGoalComplete}
            />
          )}
        </div>

        {/* Streaks Section */}
        {goals.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Streak'lerin 🔥
              </h2>
              {isPremium && (
                <div className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded-full">
                  <Crown size={12} />
                  Premium
                </div>
              )}
            </div>
            
            <AllStreaksList
              userId={userId}
              isPremium={isPremium}
            />
          </div>
        )}

        {/* Premium Features Tease */}
        {!isPremium && goals.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Crown size={24} className="text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Premium ile daha fazlası
                </h3>
                <p className="text-gray-400 text-sm">
                  Gelişmiş hedef özellikleri ve sınırsız hedef
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <span className="text-green-400">✓</span>
                Sınırsız aktif hedef
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <span className="text-green-400">✓</span>
                Agent bazlı hedefler
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <span className="text-green-400">✓</span>
                Streak grace period
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <span className="text-green-400">✓</span>
                Gelişmiş istatistikler
              </div>
            </div>
            
            <button 
              onClick={() => router.push('/pricing')}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Premium'a Geç
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <GoalCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onGoalCreated={handleGoalCreated}
        userId={userId}
        isPremium={isPremium}
      />

      <GoalCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        goal={completedGoal}
        onCreateNewGoal={() => setShowCreateModal(true)}
        onContinue={() => router.push('/chat')}
        isPremium={isPremium}
      />
    </div>
  )
}
