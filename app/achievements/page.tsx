'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Trophy, 
  Filter, 
  Search, 
  Star, 
  Crown,
  MessageCircle,
  Code2,
  Palette,
  Bot,
  Users,
  Sparkles,
  Target,
  Share2
} from 'lucide-react'
import { achievementsManager, Achievement, AchievementCategory } from '@/lib/achievements'
import { AchievementGridBadge } from '@/components/achievements/badge'
import AchievementUnlockModal from '@/components/achievements/achievement-unlock-modal'

const categoryIcons = {
  'all': Trophy,
  'chat': MessageCircle,
  'code': Code2,
  'image': Palette,
  'agents': Bot,
  'team': Users,
  'general': Star
}

const categoryNames = {
  'all': 'Tümü',
  'chat': 'Chat',
  'code': 'Code Studio',
  'image': 'Image Studio',
  'agents': 'AI Agents',
  'team': 'Team',
  'general': 'Genel'
}

export default function AchievementsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<'all' | AchievementCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [userProgress, setUserProgress] = useState(achievementsManager.getUserProgress('user_1'))
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    const allAchievements = achievementsManager.getAllAchievements()
    setAchievements(allAchievements)
  }, [])

  const filteredAchievements = achievements.filter(achievement => {
    // Category filter
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) {
      return false
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return achievement.title.toLowerCase().includes(query) ||
             achievement.description.toLowerCase().includes(query)
    }
    
    return true
  })

  const stats = achievementsManager.getAchievementStats('user_1')

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement)
    setShowUnlockModal(true)
  }

  const handleShare = (achievement: Achievement) => {
    if (achievement.shareText) {
      // Simple share implementation
      if (navigator.share) {
        navigator.share({
          title: `Synexa Achievement: ${achievement.title}`,
          text: achievement.shareText,
          url: window.location.origin
        })
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${achievement.shareText} ${window.location.origin}`)
        // You could show a toast here
      }
    }
  }

  const isUnlocked = (achievementId: string) => {
    return userProgress.achievements[achievementId]?.isUnlocked || false
  }

  const getProgress = (achievementId: string) => {
    return achievementsManager.getAchievementProgress('user_1', achievementId)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Başarılar
              </h1>
              <p className="text-gray-400">İlerlemenizi takip edin ve başarılarınızı kutlayın</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.unlocked}</div>
              <div className="text-sm text-gray-400">Kazanılan</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{stats.bronze}</div>
              <div className="text-sm text-gray-400">Bronz</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 text-center">
              <div className="text-2xl font-bold text-gray-300">{stats.silver}</div>
              <div className="text-sm text-gray-400">Gümüş</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.gold}</div>
              <div className="text-sm text-gray-400">Altın</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{stats.platinum}</div>
              <div className="text-sm text-gray-400">Platin</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryNames).map(([key, name]) => {
                const Icon = categoryIcons[key as keyof typeof categoryIcons]
                const isActive = selectedCategory === key
                
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key as 'all' | AchievementCategory)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {name}
                  </button>
                )
              })}
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Başarı ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Achievements Grid */}
          {filteredAchievements.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredAchievements.map((achievement) => (
                <AchievementGridBadge
                  key={achievement.id}
                  achievement={achievement}
                  isUnlocked={isUnlocked(achievement.id)}
                  progress={getProgress(achievement.id)}
                  onClick={() => handleAchievementClick(achievement)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Başarı bulunamadı</h3>
              <p className="text-gray-400 mb-4">
                Arama kriterlerinizi değiştirmeyi deneyin
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}

          {/* Achievement Detail Modal */}
          <AchievementUnlockModal
            achievement={selectedAchievement}
            isOpen={showUnlockModal}
            onClose={() => {
              setShowUnlockModal(false)
              setSelectedAchievement(null)
            }}
            onShare={handleShare}
          />

          {/* Empty State for No Achievements */}
          {achievements.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">İlk başarın seni bekliyor! 🚀</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Synexa ile chat yapmaya, uygulama oluşturmaya veya tasarım yapmaya başla
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => router.push('/chat')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat Başlat
                </button>
                <button
                  onClick={() => router.push('/code')}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Code2 className="w-4 h-4" />
                  Uygulama Oluştur
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}








