export type UserRole = 'developer' | 'designer' | 'founder' | 'student' | 'chat_user'

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'

export type UserGoal = string

export interface RoleDefinition {
  id: UserRole
  title: string
  description: string
  icon: string
  defaultExperience: ExperienceLevel
  goals: UserGoal[]
  recommendedTools: string[]
  chatPrompts: string[]
  emptyStateMessages: {
    chat: string
    code: string
    image: string
  }
  firstTaskSuggestion: {
    title: string
    description: string
    action: string
    actionUrl: string
  }
}

export interface OnboardingData {
  userId: string
  role: UserRole
  experienceLevel: ExperienceLevel
  selectedGoals: UserGoal[]
  selectedTools: string[]
  isCompleted: boolean
  completedAt?: string
  lastUpdated: string
}

export interface OnboardingStep {
  id: string
  title: string
  description?: string
  component: string
  isOptional?: boolean
}

export class OnboardingManager {
  private static instance: OnboardingManager

  static getInstance(): OnboardingManager {
    if (!OnboardingManager.instance) {
      OnboardingManager.instance = new OnboardingManager()
    }
    return OnboardingManager.instance
  }

  // Get all role definitions
  getRoleDefinitions(): RoleDefinition[] {
    return [
      {
        id: 'developer',
        title: 'Developer',
        description: 'Kod yazıyor, uygulama geliştiriyorum',
        icon: '👨‍💻',
        defaultExperience: 'intermediate',
        goals: [
          'Bir web app oluşturmak',
          'Kod öğrenmek',
          'Mevcut projeyi geliştirmek',
          'API entegrasyonu yapmak',
          'Debugging ve optimizasyon'
        ],
        recommendedTools: ['chat', 'code', 'agents'],
        chatPrompts: [
          'React ile bir todo app nasıl oluştururum?',
          'Bu kod parçasını optimize edebilir misin?',
          'API entegrasyonu için en iyi pratikler neler?',
          'TypeScript ile type safety nasıl sağlarım?'
        ],
        emptyStateMessages: {
          chat: 'Kod sorularını sor, algoritma öğren veya debugging yap',
          code: 'İlk uygulamanı oluşturmaya başla',
          image: 'App için icon ve görsel tasarla'
        },
        firstTaskSuggestion: {
          title: 'İlk uygulamanı oluşturalım 🚀',
          description: 'Code Studio ile hızlıca bir web uygulaması oluştur',
          action: 'Uygulama Oluştur',
          actionUrl: '/code'
        }
      },
      {
        id: 'designer',
        title: 'Designer',
        description: 'Tasarım yapıyor, görsel içerik üretiyorum',
        icon: '🎨',
        defaultExperience: 'intermediate',
        goals: [
          'Sosyal medya tasarımı',
          'Brand kit oluşturmak',
          'Hızlı görsel üretmek',
          'Logo ve kimlik tasarımı',
          'Web tasarım mockup\'ları'
        ],
        recommendedTools: ['chat', 'image', 'agents'],
        chatPrompts: [
          'Modern bir logo tasarımı için ipuçları ver',
          'Bu renk paleti nasıl? Uyumlu mu?',
          'Sosyal medya için hangi boyutları kullanmalıyım?',
          'Brand identity için hangi fontlar önerilir?'
        ],
        emptyStateMessages: {
          chat: 'Tasarım fikirleri al, renk önerileri iste',
          code: 'Tasarımlarını web\'e dönüştür',
          image: 'İlk tasarımını oluşturmaya başla'
        },
        firstTaskSuggestion: {
          title: 'İlk tasarımını oluşturalım 🎨',
          description: 'Image Studio ile profesyonel görsel tasarla',
          action: 'Tasarım Oluştur',
          actionUrl: '/design'
        }
      },
      {
        id: 'founder',
        title: 'Founder / PM',
        description: 'Ürün yönetiyor, strateji geliştiriyorum',
        icon: '🚀',
        defaultExperience: 'intermediate',
        goals: [
          'MVP oluşturmak',
          'İş planı hazırlamak',
          'Pazarlama stratejisi',
          'Kullanıcı araştırması',
          'Pitch deck hazırlamak'
        ],
        recommendedTools: ['chat', 'code', 'image', 'agents'],
        chatPrompts: [
          'Startup için MVP nasıl planlarım?',
          'Bu iş fikri için pazar analizi yap',
          'Kullanıcı persona\'ları nasıl oluştururum?',
          'Pitch deck için hangi slaytlar gerekli?'
        ],
        emptyStateMessages: {
          chat: 'İş stratejisi geliştir, pazar analizi yap',
          code: 'MVP\'ni hızlıca oluştur',
          image: 'Pitch deck ve pazarlama görselleri tasarla'
        },
        firstTaskSuggestion: {
          title: 'MVP\'ni planlamaya başlayalım 📋',
          description: 'İş fikrinden ürüne giden yolu çizelim',
          action: 'Planlama Başlat',
          actionUrl: '/chat'
        }
      },
      {
        id: 'student',
        title: 'Student / Learner',
        description: 'Öğreniyorum, yeni beceriler kazanıyorum',
        icon: '📚',
        defaultExperience: 'beginner',
        goals: [
          'Programlama öğrenmek',
          'Tasarım becerisi kazanmak',
          'AI\'ı anlamak',
          'Proje portföyü oluşturmak',
          'Kariyer planlaması'
        ],
        recommendedTools: ['chat', 'code', 'image'],
        chatPrompts: [
          'Programlamaya nereden başlamalıyım?',
          'Web tasarımı öğrenmek için roadmap ver',
          'Bu konuyu basit şekilde açıkla',
          'Pratik yapabileceğim projeler öner'
        ],
        emptyStateMessages: {
          chat: 'Soru sor, öğren, yeni konuları keşfet',
          code: 'Kodlamayı öğrenmek için pratik yap',
          image: 'Tasarım becerilerini geliştir'
        },
        firstTaskSuggestion: {
          title: 'Öğrenme yolculuğuna başlayalım 📖',
          description: 'İlk sorununu sor ve öğrenmeye başla',
          action: 'Soru Sor',
          actionUrl: '/chat'
        }
      },
      {
        id: 'chat_user',
        title: 'Just Chat',
        description: 'AI ile sohbet etmek, genel sorular sormak',
        icon: '🤖',
        defaultExperience: 'beginner',
        goals: [
          'Genel sorular sormak',
          'Günlük yardım almak',
          'Yaratıcı fikirler üretmek',
          'Araştırma yapmak',
          'Eğlenceli sohbet'
        ],
        recommendedTools: ['chat'],
        chatPrompts: [
          'Bugün nasıl daha verimli olabilirim?',
          'Bu konuda ne düşünüyorsun?',
          'Yaratıcı bir fikir öner',
          'Bu sorunu nasıl çözebilirim?'
        ],
        emptyStateMessages: {
          chat: 'Merhaba! Bugün sana nasıl yardımcı olabilirim?',
          code: 'Kod yazmayı öğrenmek ister misin?',
          image: 'Görsel tasarım yapmayı dene'
        },
        firstTaskSuggestion: {
          title: 'İlk sohbetini başlatalım 💬',
          description: 'AI ile tanış ve ilk sorununu sor',
          action: 'Sohbet Başlat',
          actionUrl: '/chat'
        }
      }
    ]
  }

  // Get onboarding steps
  getOnboardingSteps(): OnboardingStep[] {
    return [
      {
        id: 'role_selection',
        title: 'Synexa\'yı nasıl kullanacaksın?',
        description: 'Sana uygun deneyimi hazırlayabilmemiz için rolünü seç',
        component: 'RoleSelection'
      },
      {
        id: 'experience_level',
        title: 'Deneyim seviyen?',
        description: 'Önerilerimizi seviyene göre ayarlayalım',
        component: 'ExperienceLevel'
      },
      {
        id: 'goal_selection',
        title: 'Ne yapmak istiyorsun?',
        description: 'Hedeflerini bilmek bize yardımcı olur',
        component: 'GoalSelection'
      },
      {
        id: 'tool_preference',
        title: 'Hangi araçları kullanacaksın?',
        description: 'İhtiyacın olan araçları seç',
        component: 'ToolPreference',
        isOptional: true
      }
    ]
  }

  // Get user onboarding data
  getUserOnboardingData(userId: string): OnboardingData | null {
    try {
      const stored = localStorage.getItem(`synexa_onboarding_${userId}`)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error)
    }
    return null
  }

  // Save user onboarding data
  saveUserOnboardingData(data: OnboardingData): void {
    try {
      localStorage.setItem(`synexa_onboarding_${data.userId}`, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving onboarding data:', error)
    }
  }

  // Check if user needs onboarding
  needsOnboarding(userId: string): boolean {
    const data = this.getUserOnboardingData(userId)
    return !data || !data.isCompleted
  }

  // Get role definition by ID
  getRoleDefinition(roleId: UserRole): RoleDefinition | null {
    return this.getRoleDefinitions().find(role => role.id === roleId) || null
  }

  // Get personalized experience based on onboarding data
  getPersonalizedExperience(userId: string): {
    role: RoleDefinition | null
    chatPrompts: string[]
    emptyStateMessages: any
    firstTaskSuggestion: any
    recommendedTools: string[]
  } {
    const onboardingData = this.getUserOnboardingData(userId)
    
    if (!onboardingData) {
      // Default experience for users who haven't completed onboarding
      return {
        role: null,
        chatPrompts: [
          'Merhaba! Bugün sana nasıl yardımcı olabilirim?',
          'Hangi konuda yardıma ihtiyacın var?',
          'Bir proje üzerinde çalışıyor musun?'
        ],
        emptyStateMessages: {
          chat: 'Merhaba! Bugün sana nasıl yardımcı olabilirim?',
          code: 'İlk uygulamanı oluşturmaya başla',
          image: 'İlk tasarımını oluşturmaya başla'
        },
        firstTaskSuggestion: {
          title: 'Synexa\'yı keşfetmeye başlayalım 🚀',
          description: 'AI ile sohbet et, kod yaz veya tasarım oluştur',
          action: 'Başla',
          actionUrl: '/chat'
        },
        recommendedTools: ['chat', 'code', 'image']
      }
    }

    const roleDefinition = this.getRoleDefinition(onboardingData.role)
    
    if (!roleDefinition) {
      return this.getPersonalizedExperience('default')
    }

    return {
      role: roleDefinition,
      chatPrompts: roleDefinition.chatPrompts,
      emptyStateMessages: roleDefinition.emptyStateMessages,
      firstTaskSuggestion: roleDefinition.firstTaskSuggestion,
      recommendedTools: roleDefinition.recommendedTools
    }
  }

  // Complete onboarding
  completeOnboarding(userId: string, data: Partial<OnboardingData>): void {
    const onboardingData: OnboardingData = {
      userId,
      role: data.role || 'chat_user',
      experienceLevel: data.experienceLevel || 'beginner',
      selectedGoals: data.selectedGoals || [],
      selectedTools: data.selectedTools || ['chat'],
      isCompleted: true,
      completedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }

    this.saveUserOnboardingData(onboardingData)
  }

  // Reset onboarding
  resetOnboarding(userId: string): void {
    try {
      localStorage.removeItem(`synexa_onboarding_${userId}`)
    } catch (error) {
      console.error('Error resetting onboarding:', error)
    }
  }

  // Update onboarding data
  updateOnboardingData(userId: string, updates: Partial<OnboardingData>): void {
    const existing = this.getUserOnboardingData(userId)
    if (existing) {
      const updated = {
        ...existing,
        ...updates,
        lastUpdated: new Date().toISOString()
      }
      this.saveUserOnboardingData(updated)
    }
  }

  // Get experience level options
  getExperienceLevels(): { value: ExperienceLevel; label: string; description: string }[] {
    return [
      {
        value: 'beginner',
        label: 'Beginner',
        description: 'Yeni başlıyorum, rehberlik istiyorum'
      },
      {
        value: 'intermediate',
        label: 'Intermediate',
        description: 'Temel bilgim var, daha fazla öğrenmek istiyorum'
      },
      {
        value: 'advanced',
        label: 'Advanced',
        description: 'Deneyimliyim, ileri seviye özellikler istiyorum'
      }
    ]
  }

  // Get available tools
  getAvailableTools(): { id: string; name: string; description: string; icon: string }[] {
    return [
      {
        id: 'chat',
        name: 'Chat',
        description: 'AI ile sohbet et, sorular sor',
        icon: '💬'
      },
      {
        id: 'code',
        name: 'Code Studio',
        description: 'Uygulama oluştur, kod yaz',
        icon: '💻'
      },
      {
        id: 'image',
        name: 'Image Studio',
        description: 'Görsel tasarım oluştur',
        icon: '🎨'
      },
      {
        id: 'agents',
        name: 'AI Agents',
        description: 'Uzman AI asistanları kullan',
        icon: '🤖'
      }
    ]
  }

  // Get role-specific goals
  getRoleGoals(roleId: UserRole): UserGoal[] {
    const role = this.getRoleDefinition(roleId)
    return role ? role.goals : []
  }

  // Get role-specific recommended tools
  getRoleRecommendedTools(roleId: UserRole): string[] {
    const role = this.getRoleDefinition(roleId)
    return role ? role.recommendedTools : ['chat']
  }

  // Get smart defaults for experience level based on role
  getSmartDefaultExperience(roleId: UserRole): ExperienceLevel {
    const role = this.getRoleDefinition(roleId)
    return role ? role.defaultExperience : 'beginner'
  }
}

// Export singleton instance
export const onboardingManager = OnboardingManager.getInstance()






