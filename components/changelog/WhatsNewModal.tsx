'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles, Crown, Users } from 'lucide-react'
import { changelogManager, WhatsNewItem } from '@/lib/changelog'

interface WhatsNewModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export default function WhatsNewModal({ isOpen, onClose, userId }: WhatsNewModalProps) {
  const [whatsNewItems, setWhatsNewItems] = useState<WhatsNewItem[]>([])
  const [latestVersion, setLatestVersion] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      const items = changelogManager.getWhatsNewItems()
      const version = changelogManager.getLatestVersion()
      setWhatsNewItems(items)
      setLatestVersion(version?.version || '')
    }
  }, [isOpen])

  const handleClose = () => {
    // Mark latest version as seen
    const version = changelogManager.getLatestVersion()
    if (version) {
      changelogManager.markVersionAsSeen(userId, version.id)
    }
    onClose()
  }

  const handleExplore = (item: WhatsNewItem) => {
    if (item.actionUrl) {
      window.location.href = item.actionUrl
    }
    handleClose()
  }

  const getItemIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'Target': '🎯',
      'Bell': '🔔',
      'Flame': '🔥',
      'CreditCard': '💳',
      'BarChart3': '📊',
      'Users': '👥',
      'Bot': '🤖',
      'Brain': '🧠',
      'MessageCircle': '💬',
      'History': '⏰',
      'Smartphone': '📱',
      'ArrowLeftRight': '↔️',
      'Code2': '💻',
      'Image': '🎨',
      'Sparkles': '✨'
    }
    return iconMap[iconName] || '✨'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Yenilikler burada ✨</h2>
                <p className="text-sm text-gray-400">{latestVersion} sürümü</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {whatsNewItems.map((item) => (
            <div
              key={item.id}
              className="group bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-all duration-200 cursor-pointer"
              onClick={() => handleExplore(item)}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{getItemIcon(item.icon)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    {item.isPremium && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                        <Crown className="w-3 h-3" />
                        <span>Premium</span>
                      </div>
                    )}
                    {item.isTeam && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                        <Users className="w-3 h-3" />
                        <span>Team</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 bg-gray-900/50">
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            >
              Daha sonra
            </button>
            <button
              onClick={() => window.location.href = '/changelog'}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all"
            >
              Tümünü gör
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            Yeni özellikler hakkında bildirim almak için ayarları kontrol et
          </p>
        </div>
      </div>
    </div>
  )
}





