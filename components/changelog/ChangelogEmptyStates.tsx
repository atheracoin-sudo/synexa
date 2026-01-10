'use client'

import { Sparkles, MessageCircle, Code2, Image, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ChangelogEmptyStateProps {
  type?: 'no_versions' | 'no_updates' | 'first_visit' | 'coming_soon'
  className?: string
}

export default function ChangelogEmptyState({ 
  type = 'no_versions',
  className = '' 
}: ChangelogEmptyStateProps) {
  const router = useRouter()

  if (type === 'no_versions') {
    return (
      <div className={`text-center py-16 ${className}`}>
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Synexa sürekli gelişiyor 🚀
        </h2>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Yeni özellikleri burada bulacaksın. Şimdilik Synexa'yı keşfetmeye başla!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push('/chat')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all font-medium"
          >
            Chat'e Başla
          </button>
          <button
            onClick={() => router.push('/studio/code')}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors font-medium"
          >
            Uygulama Oluştur
          </button>
        </div>
      </div>
    )
  }

  if (type === 'no_updates') {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          Henüz güncelleme yok
        </h3>
        <p className="text-gray-400 mb-4">
          Bu kategoride henüz bir güncelleme bulunmuyor.
        </p>
        <button
          onClick={() => router.push('/chat')}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          Synexa'yı kullanmaya başla →
        </button>
      </div>
    )
  }

  if (type === 'first_visit') {
    return (
      <div className={`text-center py-16 ${className}`}>
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-white animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Synexa'ya hoş geldin! ✨
        </h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
          AI destekli üretim platformunda yenilikler sürekli ekleniyor. 
          Güncellemeleri burada takip edebilirsin.
        </p>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-5 h-5 text-blue-400" />
            </div>
            <h4 className="font-medium text-white mb-1">Chat Studio</h4>
            <p className="text-xs text-gray-400">AI ile sohbet et</p>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Code2 className="w-5 h-5 text-purple-400" />
            </div>
            <h4 className="font-medium text-white mb-1">Code Studio</h4>
            <p className="text-xs text-gray-400">Uygulama oluştur</p>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Image className="w-5 h-5 text-pink-400" />
            </div>
            <h4 className="font-medium text-white mb-1">Image Studio</h4>
            <p className="text-xs text-gray-400">Tasarım yap</p>
          </div>
        </div>

        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all font-medium"
        >
          <span>Başlamaya Hazırım</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  if (type === 'coming_soon') {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Büyük güncellemeler geliyor! 🔥
        </h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Yeni özellikler üzerinde çalışıyoruz. Güncellemeler için takipte kal!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push('/profile')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
          >
            Bildirim Ayarları
          </button>
          <button
            onClick={() => router.push('/invite')}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all text-sm"
          >
            Arkadaşlarını Davet Et
          </button>
        </div>
      </div>
    )
  }

  return null
}

// Specialized empty states for different contexts
export function ChangelogNoVersionsState() {
  return <ChangelogEmptyState type="no_versions" />
}

export function ChangelogNoUpdatesState() {
  return <ChangelogEmptyState type="no_updates" />
}

export function ChangelogFirstVisitState() {
  return <ChangelogEmptyState type="first_visit" />
}

export function ChangelogComingSoonState() {
  return <ChangelogEmptyState type="coming_soon" />
}






