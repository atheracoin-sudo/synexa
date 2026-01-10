'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Bell, Smartphone, Mail, Clock, Settings, Users, Sparkles, Activity, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/GlobalHeader'
import { useNotifications } from '@/lib/hooks/useNotifications'
import { NotificationSettings } from '@/lib/notifications'

export default function NotificationSettingsPage() {
  const router = useRouter()
  const { settings, updateSettings, loading } = useNotifications('user_1')
  const [localSettings, setLocalSettings] = useState<NotificationSettings | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings)
    }
  }, [settings])

  const handleToggle = (key: keyof NotificationSettings, value: boolean) => {
    if (!localSettings) return
    
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
    saveSettings(newSettings)
  }

  const handleCategoryToggle = (category: keyof NotificationSettings['categories'], value: boolean) => {
    if (!localSettings) return
    
    const newSettings = {
      ...localSettings,
      categories: {
        ...localSettings.categories,
        [category]: value
      }
    }
    setLocalSettings(newSettings)
    saveSettings(newSettings)
  }

  const handleQuietHoursToggle = (enabled: boolean) => {
    if (!localSettings) return
    
    const newSettings = {
      ...localSettings,
      quietHours: {
        ...localSettings.quietHours,
        enabled
      }
    }
    setLocalSettings(newSettings)
    saveSettings(newSettings)
  }

  const handleQuietHoursTime = (type: 'start' | 'end', time: string) => {
    if (!localSettings) return
    
    const newSettings = {
      ...localSettings,
      quietHours: {
        ...localSettings.quietHours,
        [type]: time
      }
    }
    setLocalSettings(newSettings)
    saveSettings(newSettings)
  }

  const saveSettings = async (newSettings: NotificationSettings) => {
    setSaving(true)
    try {
      updateSettings(newSettings)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !localSettings) {
    return (
      <div className="min-h-screen bg-gray-950">
        <GlobalHeader
          title="Bildirim Ayarları"
          showBackButton
          onBackPress={() => router.back()}
        />
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-800 rounded w-1/4"></div>
            <div className="h-12 bg-gray-800 rounded"></div>
            <div className="h-12 bg-gray-800 rounded"></div>
            <div className="h-12 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <GlobalHeader
        title="Bildirim Ayarları"
        showBackButton
        onBackPress={() => router.back()}
      />

      <div className="p-6 max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Bell size={48} className="text-blue-400 mx-auto" />
          <h1 className="text-2xl font-bold text-white">Bildirim Tercihlerin</h1>
          <p className="text-gray-400">
            Synexa'nın sana nasıl ulaşacağını kontrol et
          </p>
        </div>

        {/* Main Notification Types */}
        <div className="bg-gray-900 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Settings size={20} />
            Ana Bildirim Türleri
          </h2>

          {/* In-App Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Bell size={20} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Uygulama İçi</h3>
                <p className="text-gray-400 text-sm">Synexa kullanırken bildirimler</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.inApp}
                onChange={(e) => handleToggle('inApp', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Smartphone size={20} className="text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Push Bildirimleri</h3>
                <p className="text-gray-400 text-sm">Mobil cihazında bildirimler</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.push}
                onChange={(e) => handleToggle('push', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Mail size={20} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">E-posta</h3>
                <p className="text-gray-400 text-sm">Haftalık özet ve önemli güncellemeler</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.email}
                onChange={(e) => handleToggle('email', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>
        </div>

        {/* Notification Categories */}
        <div className="bg-gray-900 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white">Bildirim Kategorileri</h2>
          <p className="text-gray-400 text-sm -mt-2">
            Hangi tür bildirimleri almak istediğini seç
          </p>

          <div className="space-y-4">
            {/* System Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings size={18} className="text-blue-400" />
                <div>
                  <h3 className="text-white font-medium">Sistem</h3>
                  <p className="text-gray-400 text-sm">Güvenlik ve sistem güncellemeleri</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.categories.system}
                  onChange={(e) => handleCategoryToggle('system', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            {/* Activity Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity size={18} className="text-green-400" />
                <div>
                  <h3 className="text-white font-medium">Aktivite</h3>
                  <p className="text-gray-400 text-sm">Proje tamamlanması, başarılar</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.categories.activity}
                  onChange={(e) => handleCategoryToggle('activity', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            {/* Reminder Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-yellow-400" />
                <div>
                  <h3 className="text-white font-medium">Hatırlatmalar</h3>
                  <p className="text-gray-400 text-sm">Yarım kalan işler, geri dönüş</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.categories.reminder}
                  onChange={(e) => handleCategoryToggle('reminder', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </label>
            </div>

            {/* Growth Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-purple-400" />
                <div>
                  <h3 className="text-white font-medium">Büyüme</h3>
                  <p className="text-gray-400 text-sm">Referral ödülleri, Premium teklifleri</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.categories.growth}
                  onChange={(e) => handleCategoryToggle('growth', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>

            {/* Updates Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-cyan-400" />
                <div>
                  <h3 className="text-white font-medium">Güncellemeler</h3>
                  <p className="text-gray-400 text-sm">Yeni özellikler, ürün haberleri</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.categories.updates}
                  onChange={(e) => handleCategoryToggle('updates', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="bg-gray-900 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock size={20} />
                Sessiz Saatler
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Bu saatlerde bildirim almayacaksın
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.quietHours.enabled}
                onChange={(e) => handleQuietHoursToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          {localSettings.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Başlangıç
                </label>
                <input
                  type="time"
                  value={localSettings.quietHours.start}
                  onChange={(e) => handleQuietHoursTime('start', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bitiş
                </label>
                <input
                  type="time"
                  value={localSettings.quietHours.end}
                  onChange={(e) => handleQuietHoursTime('end', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Save Status */}
        {saving && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-400">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Ayarlar kaydediliyor...</span>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-gray-800/50 rounded-xl p-4">
          <p className="text-gray-400 text-sm text-center">
            💡 Ayarların otomatik olarak kaydedilir. İstediğin zaman değiştirebilirsin.
          </p>
        </div>
      </div>
    </div>
  )
}





