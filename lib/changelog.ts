export type UpdateType = 'new' | 'improved' | 'fixed'

export type FeatureCategory = 'chat' | 'code' | 'image' | 'agents' | 'premium' | 'team' | 'general'

export interface ChangelogItem {
  id: string
  type: UpdateType
  title: string
  description: string
  category: FeatureCategory
  isPremium?: boolean
  isTeam?: boolean
  icon?: string
  actionUrl?: string
}

export interface ChangelogVersion {
  id: string
  version: string
  date: string
  title: string
  description?: string
  items: ChangelogItem[]
  isHighlight?: boolean // For major releases
}

export interface WhatsNewItem {
  id: string
  title: string
  description: string
  icon: string
  actionUrl?: string
  isPremium?: boolean
  isTeam?: boolean
}

export class ChangelogManager {
  private static instance: ChangelogManager

  static getInstance(): ChangelogManager {
    if (!ChangelogManager.instance) {
      ChangelogManager.instance = new ChangelogManager()
    }
    return ChangelogManager.instance
  }

  // Get all changelog versions
  getChangelogVersions(): ChangelogVersion[] {
    // Mock changelog data
    const versions: ChangelogVersion[] = [
      {
        id: 'v1_4_0',
        version: 'v1.4.0',
        date: '2024-01-09',
        title: 'Goals & Streaks + Notifications',
        description: 'Hedef belirleme ve bildirim sistemi eklendi',
        isHighlight: true,
        items: [
          {
            id: 'goals_system',
            type: 'new',
            title: 'Goals & Streaks Sistemi',
            description: 'Hedef belirle, ilerlemeyi takip et ve streak kazan',
            category: 'general',
            icon: 'Target',
            actionUrl: '/goals'
          },
          {
            id: 'notifications',
            type: 'new',
            title: 'Akıllı Bildirimler',
            description: 'Önemli güncellemeler ve hatırlatmalar için bildirim sistemi',
            category: 'general',
            icon: 'Bell',
            actionUrl: '/notifications'
          },
          {
            id: 'streak_reminders',
            type: 'new',
            title: 'Streak Hatırlatmaları',
            description: 'Günlük aktivite streak\'ini korumak için akıllı hatırlatmalar',
            category: 'general',
            icon: 'Flame'
          }
        ]
      },
      {
        id: 'v1_3_0',
        version: 'v1.3.0',
        date: '2024-01-08',
        title: 'Billing & Analytics',
        description: 'Ödeme sistemi ve kullanım analitikleri',
        items: [
          {
            id: 'billing_system',
            type: 'new',
            title: 'Billing & Subscription',
            description: 'Premium abonelik ve ödeme yönetimi',
            category: 'premium',
            icon: 'CreditCard',
            actionUrl: '/billing',
            isPremium: true
          },
          {
            id: 'usage_analytics',
            type: 'new',
            title: 'Usage Analytics',
            description: 'Detaylı kullanım istatistikleri ve aktivite takibi',
            category: 'general',
            icon: 'BarChart3',
            actionUrl: '/analytics'
          },
          {
            id: 'referral_system',
            type: 'new',
            title: 'Referral System',
            description: 'Arkadaşlarını davet et, ödüller kazan',
            category: 'general',
            icon: 'Users',
            actionUrl: '/invite'
          }
        ]
      },
      {
        id: 'v1_2_0',
        version: 'v1.2.0',
        date: '2024-01-07',
        title: 'AI Agents & Memory',
        description: 'Uzman AI asistanları ve kişiselleştirme',
        items: [
          {
            id: 'ai_agents',
            type: 'new',
            title: 'AI Agents',
            description: 'Frontend, Backend, UI/UX Designer gibi uzman AI asistanları',
            category: 'agents',
            icon: 'Bot',
            actionUrl: '/agents',
            isPremium: true
          },
          {
            id: 'chat_memory',
            type: 'new',
            title: 'Chat Memory',
            description: 'AI tercihlerini hatırlıyor ve kişiselleştirilmiş yanıtlar veriyor',
            category: 'chat',
            icon: 'Brain'
          },
          {
            id: 'conversation_management',
            type: 'improved',
            title: 'Conversation Management',
            description: 'Chat\'leri organize et, pin\'le, arşivle',
            category: 'chat',
            icon: 'MessageCircle'
          }
        ]
      },
      {
        id: 'v1_1_0',
        version: 'v1.1.0',
        date: '2024-01-06',
        title: 'Code Studio Enhancements',
        description: 'Kod geliştirme deneyimi iyileştirmeleri',
        items: [
          {
            id: 'version_history',
            type: 'new',
            title: 'Version History',
            description: 'Kod projelerinde versiyon geçmişi ve geri alma',
            category: 'code',
            icon: 'History',
            isPremium: true
          },
          {
            id: 'multi_device_preview',
            type: 'new',
            title: 'Multi-Device Preview',
            description: 'Mobil, tablet ve desktop önizlemesi',
            category: 'code',
            icon: 'Smartphone',
            isPremium: true
          },
          {
            id: 'code_chat_integration',
            type: 'improved',
            title: 'Code ↔ Chat Integration',
            description: 'Chat\'ten Code Studio\'ya ve Code\'dan Chat\'e geçiş',
            category: 'code',
            icon: 'ArrowLeftRight'
          }
        ]
      },
      {
        id: 'v1_0_0',
        version: 'v1.0.0',
        date: '2024-01-05',
        title: 'Synexa Launch! 🚀',
        description: 'AI Studio platformu yayında',
        isHighlight: true,
        items: [
          {
            id: 'chat_studio',
            type: 'new',
            title: 'Chat Studio',
            description: 'AI ile sohbet et, sorular sor, yardım al',
            category: 'chat',
            icon: 'MessageCircle'
          },
          {
            id: 'code_studio',
            type: 'new',
            title: 'Code Studio',
            description: 'AI ile uygulama oluştur ve kod geliştir',
            category: 'code',
            icon: 'Code2'
          },
          {
            id: 'image_studio',
            type: 'new',
            title: 'Image Studio',
            description: 'AI ile görsel tasarım oluştur',
            category: 'image',
            icon: 'Image'
          }
        ]
      }
    ]

    // Save to localStorage for persistence
    localStorage.setItem('synexa_changelog_versions', JSON.stringify(versions))
    return versions
  }

  // Get specific version
  getVersion(versionId: string): ChangelogVersion | null {
    const versions = this.getChangelogVersions()
    return versions.find(v => v.id === versionId) || null
  }

  // Get latest version
  getLatestVersion(): ChangelogVersion | null {
    const versions = this.getChangelogVersions()
    return versions.length > 0 ? versions[0] : null
  }

  // Get What's New items (for modal)
  getWhatsNewItems(): WhatsNewItem[] {
    const latestVersion = this.getLatestVersion()
    if (!latestVersion) return []

    return latestVersion.items.slice(0, 3).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      icon: item.icon || 'Sparkles',
      actionUrl: item.actionUrl,
      isPremium: item.isPremium,
      isTeam: item.isTeam
    }))
  }

  // Check if user has seen latest version
  hasSeenLatestVersion(userId: string): boolean {
    const latestVersion = this.getLatestVersion()
    if (!latestVersion) return true

    const seenVersions = this.getSeenVersions(userId)
    return seenVersions.includes(latestVersion.id)
  }

  // Mark version as seen
  markVersionAsSeen(userId: string, versionId: string): void {
    const seenVersions = this.getSeenVersions(userId)
    if (!seenVersions.includes(versionId)) {
      seenVersions.push(versionId)
      localStorage.setItem(`synexa_seen_versions_${userId}`, JSON.stringify(seenVersions))
    }
  }

  // Get seen versions
  private getSeenVersions(userId: string): string[] {
    try {
      const stored = localStorage.getItem(`synexa_seen_versions_${userId}`)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  // Get new features (for badging)
  getNewFeatures(): { [key: string]: { title: string; daysLeft: number } } {
    const newFeatures: { [key: string]: { title: string; daysLeft: number } } = {}
    
    // Features that are "new" for 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const versions = this.getChangelogVersions()
    
    versions.forEach(version => {
      const versionDate = new Date(version.date)
      if (versionDate > sevenDaysAgo) {
        version.items.forEach(item => {
          if (item.type === 'new') {
            const daysSinceRelease = Math.floor(
              (new Date().getTime() - versionDate.getTime()) / (1000 * 60 * 60 * 24)
            )
            const daysLeft = Math.max(0, 7 - daysSinceRelease)
            
            if (daysLeft > 0) {
              newFeatures[item.id] = {
                title: item.title,
                daysLeft
              }
            }
          }
        })
      }
    })
    
    return newFeatures
  }

  // Get update type color
  getUpdateTypeColor(type: UpdateType): string {
    switch (type) {
      case 'new': return 'text-green-400 bg-green-500/20'
      case 'improved': return 'text-blue-400 bg-blue-500/20'
      case 'fixed': return 'text-orange-400 bg-orange-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  // Get update type text
  getUpdateTypeText(type: UpdateType): string {
    switch (type) {
      case 'new': return 'Yeni'
      case 'improved': return 'İyileştirildi'
      case 'fixed': return 'Düzeltildi'
      default: return type
    }
  }

  // Get category icon
  getCategoryIcon(category: FeatureCategory): string {
    switch (category) {
      case 'chat': return 'MessageCircle'
      case 'code': return 'Code2'
      case 'image': return 'Image'
      case 'agents': return 'Bot'
      case 'premium': return 'Crown'
      case 'team': return 'Users'
      default: return 'Sparkles'
    }
  }

  // Format date
  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Get version summary for notifications
  getVersionSummary(versionId: string): string {
    const version = this.getVersion(versionId)
    if (!version) return ''

    const newFeatures = version.items.filter(item => item.type === 'new').length
    const improvements = version.items.filter(item => item.type === 'improved').length
    
    if (newFeatures > 0 && improvements > 0) {
      return `${newFeatures} yeni özellik ve ${improvements} iyileştirme`
    } else if (newFeatures > 0) {
      return `${newFeatures} yeni özellik`
    } else if (improvements > 0) {
      return `${improvements} iyileştirme`
    }
    
    return `${version.items.length} güncelleme`
  }

  // Should show What's New modal
  shouldShowWhatsNew(userId: string): boolean {
    const latestVersion = this.getLatestVersion()
    if (!latestVersion || !latestVersion.isHighlight) return false
    
    return !this.hasSeenLatestVersion(userId)
  }

  // Get unread versions count
  getUnreadVersionsCount(userId: string): number {
    const versions = this.getChangelogVersions()
    const seenVersions = this.getSeenVersions(userId)
    
    return versions.filter(v => !seenVersions.includes(v.id)).length
  }
}

// Export singleton instance
export const changelogManager = ChangelogManager.getInstance()





