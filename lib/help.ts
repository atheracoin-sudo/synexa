export type HelpCategory = 'getting-started' | 'chat' | 'code-studio' | 'image-studio' | 'ai-agents' | 'billing' | 'troubleshooting'

export type HelpArticleType = 'article' | 'quick-tip' | 'feature-guide' | 'troubleshooting'

export interface HelpArticle {
  id: string
  title: string
  category: HelpCategory
  type: HelpArticleType
  content: string
  steps?: string[]
  tags: string[]
  searchKeywords: string[]
  isPremium?: boolean
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedReadTime: number // minutes
  lastUpdated: string
  helpfulCount: number
  notHelpfulCount: number
  relatedArticles?: string[]
  deepLink?: string // Link to specific feature
}

export interface QuickAnswer {
  id: string
  question: string
  answer: string
  category: HelpCategory
  tags: string[]
  relatedArticle?: string
}

export interface HelpCategoryInfo {
  id: HelpCategory
  title: string
  description: string
  icon: string
  articleCount: number
  color: string
}

export interface SearchResult {
  type: 'article' | 'quick-answer' | 'feature'
  item: HelpArticle | QuickAnswer | FeatureLink
  relevanceScore: number
  matchedKeywords: string[]
}

export interface FeatureLink {
  id: string
  title: string
  description: string
  url: string
  category: HelpCategory
  icon: string
}

export interface HelpFeedback {
  articleId: string
  isHelpful: boolean
  feedback?: string
  timestamp: string
}

export class HelpManager {
  private static instance: HelpManager

  static getInstance(): HelpManager {
    if (!HelpManager.instance) {
      HelpManager.instance = new HelpManager()
    }
    return HelpManager.instance
  }

  // Get all help categories
  getCategories(): HelpCategoryInfo[] {
    return [
      {
        id: 'getting-started',
        title: 'Getting Started',
        description: 'Synexa\'ya başlangıç rehberi',
        icon: '🚀',
        articleCount: 8,
        color: 'blue'
      },
      {
        id: 'chat',
        title: 'Chat',
        description: 'AI sohbet özelliklerini keşfet',
        icon: '💬',
        articleCount: 12,
        color: 'green'
      },
      {
        id: 'code-studio',
        title: 'Code Studio',
        description: 'Uygulama geliştirme rehberleri',
        icon: '💻',
        articleCount: 15,
        color: 'purple'
      },
      {
        id: 'image-studio',
        title: 'Image Studio',
        description: 'Görsel tasarım ve düzenleme',
        icon: '🎨',
        articleCount: 10,
        color: 'pink'
      },
      {
        id: 'ai-agents',
        title: 'AI Agents',
        description: 'Uzman AI asistanları kullanımı',
        icon: '🤖',
        articleCount: 6,
        color: 'indigo'
      },
      {
        id: 'billing',
        title: 'Billing & Plans',
        description: 'Ödeme ve abonelik yönetimi',
        icon: '💳',
        articleCount: 7,
        color: 'yellow'
      },
      {
        id: 'troubleshooting',
        title: 'Troubleshooting',
        description: 'Sorun giderme ve çözümler',
        icon: '🔧',
        articleCount: 9,
        color: 'red'
      }
    ]
  }

  // Get all help articles
  getArticles(): HelpArticle[] {
    return [
      // Getting Started
      {
        id: 'getting-started-basics',
        title: 'Synexa\'ya Nasıl Başlarım?',
        category: 'getting-started',
        type: 'article',
        content: 'Synexa\'da ilk adımlarınızı atmak için temel rehber.',
        steps: [
          'Hesap oluşturun veya giriş yapın',
          'Onboarding sürecini tamamlayın',
          'İlk projenizi oluşturun',
          'AI özelliklerini keşfedin'
        ],
        tags: ['başlangıç', 'temel', 'onboarding'],
        searchKeywords: ['başla', 'nasıl', 'ilk', 'yeni', 'kayıt', 'giriş'],
        difficulty: 'beginner',
        estimatedReadTime: 3,
        lastUpdated: '2026-01-09',
        helpfulCount: 45,
        notHelpfulCount: 2,
        relatedArticles: ['onboarding-guide', 'first-project']
      },
      {
        id: 'onboarding-guide',
        title: 'Onboarding Sürecini Anlama',
        category: 'getting-started',
        type: 'article',
        content: 'Kişiselleştirilmiş deneyim için onboarding adımları.',
        steps: [
          'Rolünüzü seçin (Developer, Designer, vb.)',
          'Deneyim seviyenizi belirtin',
          'Hedeflerinizi seçin',
          'Kullanacağınız araçları belirleyin'
        ],
        tags: ['onboarding', 'kişiselleştirme', 'rol'],
        searchKeywords: ['onboarding', 'rol', 'hedef', 'araç', 'kişisel'],
        difficulty: 'beginner',
        estimatedReadTime: 2,
        lastUpdated: '2026-01-09',
        helpfulCount: 38,
        notHelpfulCount: 1
      },

      // Chat
      {
        id: 'chat-basics',
        title: 'AI Chat Nasıl Kullanılır?',
        category: 'chat',
        type: 'article',
        content: 'Synexa AI ile etkili sohbet etme rehberi.',
        steps: [
          'Chat sayfasına gidin',
          'Sorunuzu net bir şekilde yazın',
          'AI\'dan gelen yanıtı inceleyin',
          'Gerekirse follow-up sorular sorun'
        ],
        tags: ['chat', 'sohbet', 'ai', 'soru'],
        searchKeywords: ['chat', 'sohbet', 'sor', 'ai', 'yanıt', 'cevap'],
        difficulty: 'beginner',
        estimatedReadTime: 2,
        lastUpdated: '2026-01-09',
        helpfulCount: 52,
        notHelpfulCount: 3
      },
      {
        id: 'chat-memory',
        title: 'AI Memory Nasıl Çalışır?',
        category: 'chat',
        type: 'article',
        content: 'AI\'ın sizi hatırlaması ve kişisel yanıtlar vermesi.',
        steps: [
          'Tercihlerinizi AI ile paylaşın',
          'Memory önerisini kabul edin',
          'Profile → AI Preferences\'tan yönetin',
          'İstediğiniz zaman silebilirsiniz'
        ],
        tags: ['memory', 'hafıza', 'kişisel', 'tercih'],
        searchKeywords: ['memory', 'hafıza', 'hatırla', 'tercih', 'kişisel'],
        difficulty: 'intermediate',
        estimatedReadTime: 3,
        lastUpdated: '2026-01-09',
        helpfulCount: 29,
        notHelpfulCount: 4
      },

      // Code Studio
      {
        id: 'code-studio-basics',
        title: 'Code Studio\'ya Giriş',
        category: 'code-studio',
        type: 'article',
        content: 'AI ile uygulama geliştirmeye başlangıç.',
        steps: [
          'Code Studio\'ya gidin',
          'App Builder modunu seçin',
          'Proje açıklamanızı yazın',
          'AI\'ın oluşturduğu kodu inceleyin'
        ],
        tags: ['code', 'uygulama', 'geliştirme', 'ai'],
        searchKeywords: ['code', 'kod', 'uygulama', 'app', 'geliştir', 'build'],
        difficulty: 'beginner',
        estimatedReadTime: 4,
        lastUpdated: '2026-01-09',
        helpfulCount: 67,
        notHelpfulCount: 5,
        deepLink: '/code'
      },
      {
        id: 'app-builder-guide',
        title: 'App Builder Nasıl Kullanılır?',
        category: 'code-studio',
        type: 'feature-guide',
        content: 'Sıfırdan uygulama oluşturma rehberi.',
        steps: [
          'Proje tipini seçin (Web, Mobile, vb.)',
          'Detaylı açıklama yazın',
          'AI\'ın planını onaylayın',
          'Kod üretimini başlatın',
          'Preview\'da test edin'
        ],
        tags: ['app-builder', 'proje', 'web', 'mobile'],
        searchKeywords: ['app', 'builder', 'oluştur', 'proje', 'web', 'mobile'],
        difficulty: 'intermediate',
        estimatedReadTime: 6,
        lastUpdated: '2026-01-09',
        helpfulCount: 41,
        notHelpfulCount: 7
      },

      // Image Studio
      {
        id: 'image-studio-basics',
        title: 'Image Studio\'ya Giriş',
        category: 'image-studio',
        type: 'article',
        content: 'AI ile görsel tasarım oluşturma.',
        steps: [
          'Image Studio\'ya gidin',
          'Template seçin veya boş canvas başlayın',
          'AI Generate özelliğini kullanın',
          'Tasarımınızı düzenleyin'
        ],
        tags: ['image', 'tasarım', 'görsel', 'ai'],
        searchKeywords: ['image', 'görsel', 'tasarım', 'design', 'oluştur'],
        difficulty: 'beginner',
        estimatedReadTime: 3,
        lastUpdated: '2026-01-09',
        helpfulCount: 33,
        notHelpfulCount: 2,
        deepLink: '/design'
      },
      {
        id: 'image-export',
        title: 'Görsel Export Nasıl Yapılır?',
        category: 'image-studio',
        type: 'quick-tip',
        content: 'Tasarımlarınızı farklı formatlarda kaydetme.',
        steps: [
          'Tasarımınızı tamamlayın',
          'Export butonuna tıklayın',
          'Format seçin (PNG, JPG, PDF)',
          'Kalite ayarını belirleyin (HD Premium\'da)',
          'Download\'a tıklayın'
        ],
        tags: ['export', 'kaydet', 'download', 'format'],
        searchKeywords: ['export', 'kaydet', 'indir', 'download', 'png', 'jpg', 'hd'],
        difficulty: 'beginner',
        estimatedReadTime: 1,
        lastUpdated: '2026-01-09',
        helpfulCount: 78,
        notHelpfulCount: 1
      },

      // AI Agents
      {
        id: 'ai-agents-intro',
        title: 'AI Agents Nedir?',
        category: 'ai-agents',
        type: 'article',
        content: 'Uzman AI asistanları ve kullanım alanları.',
        steps: [
          'Create Studio\'dan AI Agents\'ı seçin',
          'İhtiyacınıza uygun agent\'ı bulun',
          'Agent ile çalışmaya başlayın',
          'Özel agent oluşturun (Premium)'
        ],
        tags: ['agents', 'ai', 'uzman', 'asistan'],
        searchKeywords: ['agent', 'uzman', 'asistan', 'ai', 'özel'],
        difficulty: 'intermediate',
        estimatedReadTime: 4,
        lastUpdated: '2026-01-09',
        helpfulCount: 25,
        notHelpfulCount: 3,
        isPremium: true
      },

      // Billing
      {
        id: 'premium-upgrade',
        title: 'Premium\'a Nasıl Geçerim?',
        category: 'billing',
        type: 'article',
        content: 'Premium plan\'a yükseltme ve avantajları.',
        steps: [
          'Profile → Premium Plans\'a gidin',
          'Plan karşılaştırmasını inceleyin',
          'Upgrade butonuna tıklayın',
          'Ödeme bilgilerini girin',
          'Aktivasyonu bekleyin'
        ],
        tags: ['premium', 'upgrade', 'ödeme', 'plan'],
        searchKeywords: ['premium', 'upgrade', 'geç', 'ödeme', 'plan', 'fiyat'],
        difficulty: 'beginner',
        estimatedReadTime: 2,
        lastUpdated: '2026-01-09',
        helpfulCount: 89,
        notHelpfulCount: 4
      },

      // Troubleshooting
      {
        id: 'login-issues',
        title: 'Giriş Yapamıyorum',
        category: 'troubleshooting',
        type: 'troubleshooting',
        content: 'Giriş sorunları ve çözümleri.',
        steps: [
          'Email adresinizi kontrol edin',
          'Şifrenizi sıfırlamayı deneyin',
          'Tarayıcı cache\'ini temizleyin',
          'Farklı tarayıcı deneyin',
          'Destek ile iletişime geçin'
        ],
        tags: ['giriş', 'login', 'şifre', 'sorun'],
        searchKeywords: ['giriş', 'login', 'şifre', 'sorun', 'yapamıyorum', 'hata'],
        difficulty: 'beginner',
        estimatedReadTime: 2,
        lastUpdated: '2026-01-09',
        helpfulCount: 34,
        notHelpfulCount: 8
      },
      {
        id: 'slow-performance',
        title: 'Synexa Yavaş Çalışıyor',
        category: 'troubleshooting',
        type: 'troubleshooting',
        content: 'Performans sorunları ve optimizasyon.',
        steps: [
          'İnternet bağlantınızı kontrol edin',
          'Tarayıcı sekmelerini azaltın',
          'Cache\'i temizleyin',
          'Tarayıcıyı güncelleyin',
          'Sistem kaynaklarını kontrol edin'
        ],
        tags: ['performans', 'yavaş', 'optimizasyon'],
        searchKeywords: ['yavaş', 'performans', 'donuyor', 'hızlı', 'optimize'],
        difficulty: 'intermediate',
        estimatedReadTime: 3,
        lastUpdated: '2026-01-09',
        helpfulCount: 42,
        notHelpfulCount: 12
      }
    ]
  }

  // Get quick answers
  getQuickAnswers(): QuickAnswer[] {
    return [
      {
        id: 'export-steps',
        question: '2 adımda export nasıl yapılır?',
        answer: '1. Export butonuna tıklayın 2. Format seçip Download\'a basın',
        category: 'image-studio',
        tags: ['export', 'hızlı'],
        relatedArticle: 'image-export'
      },
      {
        id: 'new-chat',
        question: 'Yeni sohbet nasıl başlatırım?',
        answer: 'Chat sayfasında "New Chat" butonuna tıklayın veya + ikonunu kullanın',
        category: 'chat',
        tags: ['chat', 'yeni', 'başlat']
      },
      {
        id: 'premium-benefits',
        question: 'Premium\'ın avantajları neler?',
        answer: 'Sınırsız chat, HD export, AI Agents, öncelikli destek ve daha fazlası',
        category: 'billing',
        tags: ['premium', 'avantaj', 'özellik']
      },
      {
        id: 'code-preview',
        question: 'Kod önizlemesi nerede?',
        answer: 'Code Studio\'da sağ panelde phone preview\'ı görebilirsiniz',
        category: 'code-studio',
        tags: ['kod', 'önizleme', 'preview']
      }
    ]
  }

  // Get feature links
  getFeatureLinks(): FeatureLink[] {
    return [
      {
        id: 'chat-page',
        title: 'Chat Sayfası',
        description: 'AI ile sohbet etmeye başla',
        url: '/chat',
        category: 'chat',
        icon: '💬'
      },
      {
        id: 'code-studio',
        title: 'Code Studio',
        description: 'Uygulama geliştirmeye başla',
        url: '/code',
        category: 'code-studio',
        icon: '💻'
      },
      {
        id: 'image-studio',
        title: 'Image Studio',
        description: 'Görsel tasarım oluştur',
        url: '/design',
        category: 'image-studio',
        icon: '🎨'
      },
      {
        id: 'premium-plans',
        title: 'Premium Plans',
        description: 'Fiyatlandırma ve planlar',
        url: '/pricing',
        category: 'billing',
        icon: '💳'
      }
    ]
  }

  // Smart search functionality
  search(query: string, context?: HelpCategory): SearchResult[] {
    if (!query.trim()) return []

    const articles = this.getArticles()
    const quickAnswers = this.getQuickAnswers()
    const featureLinks = this.getFeatureLinks()
    const results: SearchResult[] = []

    const queryLower = query.toLowerCase()
    const queryWords = queryLower.split(' ').filter(word => word.length > 1)

    // Search articles
    articles.forEach(article => {
      let score = 0
      const matchedKeywords: string[] = []

      // Title match (highest priority)
      if (article.title.toLowerCase().includes(queryLower)) {
        score += 100
        matchedKeywords.push('title')
      }

      // Search keywords match
      article.searchKeywords.forEach(keyword => {
        if (keyword.includes(queryLower) || queryWords.some(word => keyword.includes(word))) {
          score += 50
          matchedKeywords.push(keyword)
        }
      })

      // Content match
      if (article.content.toLowerCase().includes(queryLower)) {
        score += 30
        matchedKeywords.push('content')
      }

      // Tags match
      article.tags.forEach(tag => {
        if (tag.includes(queryLower) || queryWords.some(word => tag.includes(word))) {
          score += 20
          matchedKeywords.push(tag)
        }
      })

      // Context boost
      if (context && article.category === context) {
        score += 25
      }

      if (score > 0) {
        results.push({
          type: 'article',
          item: article,
          relevanceScore: score,
          matchedKeywords
        })
      }
    })

    // Search quick answers
    quickAnswers.forEach(answer => {
      let score = 0
      const matchedKeywords: string[] = []

      if (answer.question.toLowerCase().includes(queryLower) || 
          answer.answer.toLowerCase().includes(queryLower)) {
        score += 80
        matchedKeywords.push('quick-answer')
      }

      answer.tags.forEach(tag => {
        if (tag.includes(queryLower) || queryWords.some(word => tag.includes(word))) {
          score += 40
          matchedKeywords.push(tag)
        }
      })

      if (context && answer.category === context) {
        score += 25
      }

      if (score > 0) {
        results.push({
          type: 'quick-answer',
          item: answer,
          relevanceScore: score,
          matchedKeywords
        })
      }
    })

    // Search feature links
    featureLinks.forEach(feature => {
      let score = 0
      const matchedKeywords: string[] = []

      if (feature.title.toLowerCase().includes(queryLower) || 
          feature.description.toLowerCase().includes(queryLower)) {
        score += 60
        matchedKeywords.push('feature')
      }

      if (context && feature.category === context) {
        score += 25
      }

      if (score > 0) {
        results.push({
          type: 'feature',
          item: feature,
          relevanceScore: score,
          matchedKeywords
        })
      }
    })

    // Sort by relevance score
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 10)
  }

  // Get articles by category
  getArticlesByCategory(category: HelpCategory): HelpArticle[] {
    return this.getArticles().filter(article => article.category === category)
  }

  // Get article by ID
  getArticleById(id: string): HelpArticle | null {
    return this.getArticles().find(article => article.id === id) || null
  }

  // Get related articles
  getRelatedArticles(articleId: string): HelpArticle[] {
    const article = this.getArticleById(articleId)
    if (!article || !article.relatedArticles) return []

    return article.relatedArticles
      .map(id => this.getArticleById(id))
      .filter(Boolean) as HelpArticle[]
  }

  // Submit feedback
  submitFeedback(articleId: string, isHelpful: boolean, feedback?: string): void {
    try {
      const feedbackData: HelpFeedback = {
        articleId,
        isHelpful,
        feedback,
        timestamp: new Date().toISOString()
      }

      const existingFeedback = JSON.parse(localStorage.getItem('synexa_help_feedback') || '[]')
      existingFeedback.push(feedbackData)
      localStorage.setItem('synexa_help_feedback', JSON.stringify(existingFeedback))

      // Update article counts (in real app, this would be sent to backend)
      console.log('Help feedback submitted:', feedbackData)
    } catch (error) {
      console.error('Error submitting help feedback:', error)
    }
  }

  // Get context-aware suggestions
  getContextSuggestions(context: HelpCategory): HelpArticle[] {
    return this.getArticlesByCategory(context)
      .sort((a, b) => b.helpfulCount - a.helpfulCount)
      .slice(0, 3)
  }

  // Get popular articles
  getPopularArticles(): HelpArticle[] {
    return this.getArticles()
      .sort((a, b) => b.helpfulCount - a.helpfulCount)
      .slice(0, 5)
  }

  // Get recent articles
  getRecentArticles(): HelpArticle[] {
    return this.getArticles()
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 5)
  }
}

// Export singleton instance
export const helpManager = HelpManager.getInstance()





