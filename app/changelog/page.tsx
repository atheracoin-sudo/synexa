'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ExternalLink, Crown, Users, Sparkles, MessageCircle, Code2, Image, Bot, BarChart3, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useChangelog } from '@/lib/hooks/useChangelog'
import { ChangelogVersion, ChangelogItem } from '@/lib/changelog'

export default function ChangelogPage() {
  const router = useRouter()
  const { versions, getUpdateTypeColor, getUpdateTypeText, formatDate, markVersionAsSeen } = useChangelog()
  const [selectedVersion, setSelectedVersion] = useState<ChangelogVersion | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    if (versions.length > 0 && !selectedVersion) {
      setSelectedVersion(versions[0])
      // Mark the latest version as seen when user visits changelog
      markVersionAsSeen(versions[0].id)
    }
  }, [versions, selectedVersion, markVersionAsSeen])

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'Target': Target,
      'Bell': Sparkles,
      'Flame': Sparkles,
      'CreditCard': Sparkles,
      'BarChart3': BarChart3,
      'Users': Users,
      'Bot': Bot,
      'Brain': Sparkles,
      'MessageCircle': MessageCircle,
      'History': Sparkles,
      'Smartphone': Sparkles,
      'ArrowLeftRight': Sparkles,
      'Code2': Code2,
      'Image': Image,
      'Sparkles': Sparkles
    }
    return iconMap[iconName] || Sparkles
  }

  const categories = [
    { id: 'all', name: 'Tümü', icon: Sparkles },
    { id: 'chat', name: 'Chat', icon: MessageCircle },
    { id: 'code', name: 'Code Studio', icon: Code2 },
    { id: 'image', name: 'Image Studio', icon: Image },
    { id: 'agents', name: 'AI Agents', icon: Bot },
    { id: 'premium', name: 'Premium', icon: Crown },
    { id: 'team', name: 'Team', icon: Users },
    { id: 'general', name: 'Genel', icon: Sparkles }
  ]

  const filteredItems = selectedVersion?.items.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  ) || []

  const handleItemAction = (item: ChangelogItem) => {
    if (item.actionUrl) {
      router.push(item.actionUrl)
    }
  }

  if (versions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Changelog</h1>
                <p className="text-gray-400">Synexa'daki yenilikler ve güncellemeler</p>
              </div>
            </div>

            {/* Empty State */}
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Synexa sürekli gelişiyor 🚀</h2>
              <p className="text-gray-400 mb-6">Yeni özellikleri burada bulacaksın.</p>
              <button
                onClick={() => router.push('/chat')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all"
              >
                Chat'e Başla
              </button>
            </div>
          </div>
        </div>
      </div>
    )
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
              <h1 className="text-2xl font-bold">Changelog</h1>
              <p className="text-gray-400">Synexa'daki yenilikler ve güncellemeler</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Version List - Left Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 sticky top-8">
                <h3 className="font-medium text-white mb-4">Sürümler</h3>
                <div className="space-y-2">
                  {versions.map((version) => (
                    <button
                      key={version.id}
                      onClick={() => setSelectedVersion(version)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedVersion?.id === version.id
                          ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400'
                          : 'bg-gray-800/50 hover:bg-gray-800 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{version.version}</span>
                        {version.isHighlight && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mb-1">
                        {formatDate(version.date)}
                      </div>
                      <div className="text-sm text-gray-400 line-clamp-2">
                        {version.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Version Details - Right Content */}
            <div className="lg:col-span-3">
              {selectedVersion && (
                <div className="space-y-6">
                  {/* Version Header */}
                  <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">{selectedVersion.version}</h2>
                          <p className="text-gray-400">{formatDate(selectedVersion.date)}</p>
                        </div>
                      </div>
                      {selectedVersion.isHighlight && (
                        <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                          Önemli Güncelleme
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{selectedVersion.title}</h3>
                    {selectedVersion.description && (
                      <p className="text-gray-400">{selectedVersion.description}</p>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => {
                        const Icon = category.icon
                        const count = selectedVersion.items.filter(item => 
                          category.id === 'all' || item.category === category.id
                        ).length
                        
                        if (count === 0 && category.id !== 'all') return null
                        
                        return (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                              selectedCategory === category.id
                                ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400'
                                : 'bg-gray-800/50 hover:bg-gray-800 text-gray-400'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{category.name}</span>
                            <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded">
                              {count}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Change Items */}
                  <div className="space-y-4">
                    {filteredItems.map((item) => {
                      const Icon = getIcon(item.icon || 'Sparkles')
                      return (
                        <div
                          key={item.id}
                          className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUpdateTypeColor(item.type)}`}>
                                  {getUpdateTypeText(item.type)}
                                </div>
                                {item.isPremium && (
                                  <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                                    <Crown className="w-3 h-3" />
                                    <span>Premium</span>
                                  </div>
                                )}
                                {item.isTeam && (
                                  <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                                    <Users className="w-3 h-3" />
                                    <span>Team</span>
                                  </div>
                                )}
                              </div>
                              <h4 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                {item.title}
                              </h4>
                              <p className="text-gray-400 leading-relaxed mb-4">
                                {item.description}
                              </p>
                              {item.actionUrl && (
                                <button
                                  onClick={() => handleItemAction(item)}
                                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                                >
                                  <span>Keşfet</span>
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <p className="text-gray-400 mb-4">
                Geri bildirimlerinizle geliştiriyoruz
              </p>
              <button
                onClick={() => router.push('/profile')}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
              >
                Feedback Gönder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}






