'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Lightbulb, Bot, RotateCcw, Info, Crown } from 'lucide-react'
import { tipsManager, TipsSettings } from '@/lib/tips'
import { usePremium } from '@/lib/hooks/usePremium'

export default function TipsSettingsPage() {
  const router = useRouter()
  const { isPremium } = usePremium()
  const [settings, setSettings] = useState<TipsSettings>(tipsManager.getTipsSettings('user_1'))
  const [statistics, setStatistics] = useState({ shown: 0, dismissed: 0, completed: 0 })

  useEffect(() => {
    const stats = tipsManager.getTipStatistics('user_1')
    setStatistics(stats)
  }, [])

  const handleSettingChange = (key: keyof TipsSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    tipsManager.saveTipsSettings('user_1', newSettings)
  }

  const handleResetTips = () => {
    if (confirm('Tüm ipuçları sıfırlanacak ve tekrar gösterilecek. Emin misin?')) {
      tipsManager.resetAllTips('user_1')
      setStatistics({ shown: 0, dismissed: 0, completed: 0 })
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Help & Tips</h1>
              <p className="text-gray-400">İpuçları ve AI coaching ayarları</p>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              İstatistikler
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{statistics.shown}</div>
                <div className="text-sm text-gray-400">Gösterilen</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{statistics.completed}</div>
                <div className="text-sm text-gray-400">Tamamlanan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">{statistics.dismissed}</div>
                <div className="text-sm text-gray-400">Kapatılan</div>
              </div>
            </div>
          </div>

          {/* Main Settings */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              İpucu Ayarları
            </h2>

            <div className="space-y-6">
              {/* Show In-App Tips */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">İpuçlarını Göster</h3>
                  <p className="text-sm text-gray-400">Sayfa içinde yardımcı ipuçları göster</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showInAppTips}
                    onChange={(e) => handleSettingChange('showInAppTips', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Tip Frequency */}
              <div>
                <h3 className="font-medium text-white mb-2">İpucu Sıklığı</h3>
                <p className="text-sm text-gray-400 mb-3">Ne sıklıkla ipucu görmek istiyorsun?</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'minimal', label: 'Minimal' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'frequent', label: 'Sık' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSettingChange('tipFrequency', option.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        settings.tipFrequency === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Coaching Settings */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-400" />
              AI Coaching
            </h2>

            <div className="space-y-6">
              {/* Enable AI Coaching */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">AI Coaching\'i Etkinleştir</h3>
                  <p className="text-sm text-gray-400">Akıllı öneriler ve yönlendirmeler al</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableAICoaching}
                    onChange={(e) => handleSettingChange('enableAICoaching', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {/* Coaching Style */}
              <div>
                <h3 className="font-medium text-white mb-2">Coaching Stili</h3>
                <p className="text-sm text-gray-400 mb-3">AI coach nasıl davransın?</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'gentle', label: 'Nazik', description: 'Yumuşak hatırlatmalar' },
                    { value: 'proactive', label: 'Proaktif', description: 'Aktif öneriler' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSettingChange('coachingStyle', option.value)}
                      className={`p-3 rounded-lg text-left transition-colors ${
                        settings.coachingStyle === option.value
                          ? 'bg-purple-600/20 border border-purple-500/30 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-400">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Premium Features */}
              {!isPremium && (
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <Crown className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Premium AI Coaching</h4>
                      <p className="text-sm text-gray-400">Kişisel coaching ve gelişmiş öneriler</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-6">Gelişmiş Ayarlar</h2>

            <div className="space-y-4">
              {/* Reset Tips */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">İpuçlarını Sıfırla</h3>
                  <p className="text-sm text-gray-400">Tüm ipuçları tekrar gösterilecek</p>
                </div>
                <button
                  onClick={handleResetTips}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Sıfırla
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-200">
              <strong>Not:</strong> İpuçları ve AI coaching özelliklerini istediğin zaman kapatabilirsin. 
              Ayarların otomatik olarak kaydedilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}





