'use client'

import { Target, Plus, Flame, Trophy, Star, Zap, Crown } from 'lucide-react'

interface GoalEmptyStateProps {
  type: 'no_goals' | 'no_active_goals' | 'no_completed_goals' | 'first_time' | 'limit_reached'
  onCreateGoal?: () => void
  onUpgrade?: () => void
  isPremium?: boolean
  className?: string
}

export function GoalEmptyState({ 
  type, 
  onCreateGoal, 
  onUpgrade, 
  isPremium = false, 
  className 
}: GoalEmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'no_goals':
        return {
          icon: <Target size={64} className="text-gray-600 mx-auto mb-6" />,
          title: 'Henüz bir hedefin yok',
          description: 'Küçük hedeflerle büyük başarılara ulaş. İlk hedefini oluşturarak başla!',
          actionText: 'İlk Hedefini Oluştur',
          actionIcon: <Plus size={18} />,
          showAction: true,
          motivational: '🎯 Her büyük yolculuk tek bir adımla başlar'
        }

      case 'no_active_goals':
        return {
          icon: <Target size={64} className="text-blue-400 mx-auto mb-6" />,
          title: 'Aktif hedefin yok',
          description: 'Yeni bir hedef belirleyerek motivasyonunu artır ve ilerlemeyi takip et.',
          actionText: 'Yeni Hedef Oluştur',
          actionIcon: <Plus size={18} />,
          showAction: true,
          motivational: '💪 Bugün yeni bir hedefe başlamak için mükemmel bir gün!'
        }

      case 'no_completed_goals':
        return {
          icon: <Trophy size={64} className="text-yellow-500 mx-auto mb-6" />,
          title: 'Henüz tamamlanan hedefin yok',
          description: 'İlk hedefini tamamla ve burada başarını kutla! Her küçük adım önemli.',
          actionText: null,
          actionIcon: null,
          showAction: false,
          motivational: '🌟 İlk başarın seni bekliyor'
        }

      case 'first_time':
        return {
          icon: (
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target size={40} className="text-white" />
            </div>
          ),
          title: 'Synexa\'ya hoş geldin! 🎉',
          description: 'Hedefler belirleyerek üretkenliğini artır ve ilerlemeyi takip et. Küçük adımlarla büyük başarılara ulaş.',
          actionText: 'İlk Hedefimi Oluştur',
          actionIcon: <Star size={18} />,
          showAction: true,
          motivational: '✨ Başarı yolculuğun burada başlıyor'
        }

      case 'limit_reached':
        return {
          icon: <Crown size={64} className="text-yellow-500 mx-auto mb-6" />,
          title: isPremium ? 'Maksimum hedef sayısına ulaştın' : 'Hedef limitine ulaştın',
          description: isPremium 
            ? 'Şu anda 10 aktif hedefin var. Yeni hedef oluşturmak için mevcut hedeflerden birini tamamla.'
            : 'Free plan ile maksimum 2 aktif hedefin olabilir. Premium ile sınırsız hedef oluştur.',
          actionText: isPremium ? null : 'Premium\'a Geç',
          actionIcon: isPremium ? null : <Crown size={18} />,
          showAction: !isPremium,
          motivational: isPremium ? '🎯 Mevcut hedeflerine odaklan' : '🚀 Premium ile sınırları aş'
        }

      default:
        return {
          icon: <Target size={64} className="text-gray-600 mx-auto mb-6" />,
          title: 'Hedef bulunamadı',
          description: 'Yeni bir hedef oluşturmaya ne dersin?',
          actionText: 'Hedef Oluştur',
          actionIcon: <Plus size={18} />,
          showAction: true,
          motivational: '💫 Her gün yeni bir fırsat'
        }
    }
  }

  const content = getEmptyStateContent()

  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      {content.icon}
      
      <h3 className="text-xl font-semibold text-white mb-3">
        {content.title}
      </h3>
      
      <p className="text-gray-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
        {content.description}
      </p>

      {content.showAction && content.actionText && (
        <button
          onClick={type === 'limit_reached' && !isPremium ? onUpgrade : onCreateGoal}
          className={`inline-flex items-center gap-2 px-6 py-3 font-medium rounded-xl transition-colors ${
            type === 'limit_reached' && !isPremium
              ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {content.actionIcon}
          {content.actionText}
        </button>
      )}

      {content.motivational && (
        <div className="mt-8 p-4 bg-gray-800/50 rounded-xl max-w-sm mx-auto">
          <p className="text-gray-300 text-sm italic">
            {content.motivational}
          </p>
        </div>
      )}
    </div>
  )
}

// Streak Empty State
interface StreakEmptyStateProps {
  onStartStreak?: () => void
  className?: string
}

export function StreakEmptyState({ onStartStreak, className }: StreakEmptyStateProps) {
  return (
    <div className={`text-center py-8 px-6 ${className}`}>
      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Flame size={32} className="text-white" />
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-3">
        Streak'ini başlat! 🔥
      </h3>
      
      <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
        Her gün aktif olarak streak kazan ve motivasyonunu artır. Küçük adımlar büyük alışkanlıklar yaratır.
      </p>

      {onStartStreak && (
        <button
          onClick={onStartStreak}
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
        >
          <Flame size={18} />
          Bugün Başla
        </button>
      )}

      <div className="mt-6 p-4 bg-gray-800/50 rounded-xl max-w-sm mx-auto">
        <p className="text-gray-300 text-xs italic">
          🌟 Süreklilik başarının anahtarıdır
        </p>
      </div>
    </div>
  )
}

// Goal Completion Celebration Empty State
export function GoalCompletionEmptyState({ className }: { className?: string }) {
  return (
    <div className={`text-center py-8 px-6 ${className}`}>
      <div className="relative">
        <Trophy size={64} className="text-yellow-500 mx-auto mb-6" />
        <div className="absolute -top-2 -right-2">
          <Star size={24} className="text-yellow-400 animate-pulse" />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-3">
        İlk başarını kutlamaya hazır! 🎉
      </h3>
      
      <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
        Hedeflerini tamamladığında burada kutlama yapacağız. İlk hedefini oluştur ve başarı yolculuğuna başla!
      </p>

      <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
        <div className="text-center">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-xs text-gray-500">Hedef</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">💪</div>
          <div className="text-xs text-gray-500">Çalış</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🎉</div>
          <div className="text-xs text-gray-500">Kutla</div>
        </div>
      </div>
    </div>
  )
}

// Motivational Quote Component
interface MotivationalQuoteProps {
  className?: string
}

export function MotivationalQuote({ className }: MotivationalQuoteProps) {
  const quotes = [
    { text: "Büyük başarılar küçük adımlarla gelir", emoji: "✨" },
    { text: "Her gün biraz daha ilerle", emoji: "🚀" },
    { text: "Süreklilik başarının anahtarıdır", emoji: "🔑" },
    { text: "Hedefler hayalleri gerçeğe dönüştürür", emoji: "🎯" },
    { text: "İlerleme mükemmellikten daha önemlidir", emoji: "📈" },
    { text: "Küçük adımlar büyük değişimler yaratır", emoji: "🌟" },
    { text: "Bugün dünden daha iyi ol", emoji: "💪" },
    { text: "Başarı bir yolculuktur, varış noktası değil", emoji: "🛤️" }
  ]

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

  return (
    <div className={`p-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/10 rounded-xl ${className}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{randomQuote.emoji}</span>
        <p className="text-gray-300 text-sm italic flex-1">
          "{randomQuote.text}"
        </p>
      </div>
    </div>
  )
}

// Loading State for Goals
export function GoalLoadingState({ className }: { className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-800 rounded-xl"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-800 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-gray-800 rounded-full"></div>
            <div className="flex justify-between">
              <div className="h-3 bg-gray-800 rounded w-20"></div>
              <div className="h-3 bg-gray-800 rounded w-12"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}








