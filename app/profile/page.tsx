'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  Crown,
  Settings,
  Bell,
  Shield,
  FileText,
  MessageCircle,
  ChevronRight,
  Star,
  Zap,
  Check,
  Sparkles,
  Brain,
  CreditCard,
  BarChart3,
  Users,
  Target,
  Lightbulb,
  Trophy,
  Code2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlobalHeader, BottomTabBar } from '@/components/ui'
import { UsageSummaryCard } from '@/components/usage/UsageSummaryCard'
import { FeedbackModal } from '@/components/beta/FeedbackModal'
import { UsageSummary } from '@/components/premium/UsageSummary'
import { PremiumBadge } from '@/components/premium/PremiumBadge'
import { usePremium } from '@/lib/hooks/usePremium'
import { achievementsManager } from '@/lib/achievements'
import { ProfileBadge, BadgeCollection } from '@/components/achievements/Badge'
import { onboardingManager } from '@/lib/onboarding'

const settingsItems = [
  {
    id: 'portfolio',
    title: 'Public Portfolio',
    description: 'Manage your public profile and projects',
    icon: User,
    href: '/profile/portfolio',
  },
  {
    id: 'goals',
    title: 'Goals & Streaks',
    description: 'Set goals and track your progress',
    icon: Target,
    href: '/goals',
  },
  {
    id: 'invite-friends',
    title: 'Invite Friends',
    description: 'Share Synexa and earn rewards',
    icon: Users,
    href: '/invite',
  },
  {
    id: 'analytics',
    title: 'Usage Analytics',
    description: 'View your activity and productivity stats',
    icon: BarChart3,
    href: '/analytics',
  },
  {
    id: 'developer',
    title: 'Developer Settings',
    description: 'API keys, webhooks, and integrations',
    icon: Code2,
    href: '/developers/dashboard',
  },
  {
    id: 'organization',
    title: 'Organization',
    description: 'Manage team, security, and admin settings',
    icon: Shield,
    href: '/admin/org-1',
  },
  {
    id: 'ai-preferences',
    title: 'AI Preferences',
    description: 'Manage AI memory and personalization',
    icon: Brain,
    href: '/profile/ai-preferences',
  },
  {
    id: 'billing',
    title: 'Billing & Subscription',
    description: 'Manage your subscription and invoices',
    icon: CreditCard,
    href: '/billing',
  },
  {
    id: 'pricing',
    title: 'Premium Plans',
    description: 'View pricing and upgrade options',
    icon: Crown,
    href: '/pricing',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Push notifications and alerts',
    icon: Bell,
    href: '/notifications',
  },
  {
    id: 'changelog',
    title: 'What\'s New',
    description: 'Latest updates and features',
    icon: Sparkles,
    href: '/changelog',
  },
  {
    id: 'tips-settings',
    title: 'Help & Tips',
    description: 'In-app tips and AI coaching settings',
    icon: Lightbulb,
    href: '/profile/tips',
  },
  {
    id: 'achievements',
    title: 'Achievements',
    description: 'View your badges and progress',
    icon: Trophy,
    href: '/achievements',
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    description: 'Data and privacy settings',
    icon: Shield,
    href: '/profile/privacy',
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    description: 'Legal terms and conditions',
    icon: FileText,
    href: '/profile/terms',
  },
  {
    id: 'contact',
    title: 'Contact Support',
    description: 'Get help and support',
    icon: MessageCircle,
    href: '/profile/contact',
  },
]

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '10 AI images per month',
      'Basic art styles',
      'Standard resolution',
      'Community support',
    ],
    current: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$9.99',
    period: 'per month',
    features: [
      'Unlimited AI images',
      'All art styles & effects',
      'High resolution exports',
      'Priority generation',
      'Advanced editing tools',
      'Premium support',
    ],
    current: false,
    popular: true,
  },
]

export default function ProfilePage() {
  const router = useRouter()
  const [showPlans, setShowPlans] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  
  // Achievements data
  const userProgress = achievementsManager.getUserProgress('user_1')
  const unlockedAchievements = achievementsManager.getUnlockedAchievements('user_1')
  const stats = achievementsManager.getAchievementStats('user_1')
  const selectedBadgeId = userProgress.selectedBadge
  const selectedBadge = selectedBadgeId ? achievementsManager.getAllAchievements().find(a => a.id === selectedBadgeId) : null
  
  // Onboarding data
  const onboardingData = onboardingManager.getUserOnboardingData('user_1')
  const personalizedExperience = onboardingManager.getPersonalizedExperience('user_1')

  const handleResetOnboarding = () => {
    if (confirm('Onboarding\'i sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      onboardingManager.resetOnboarding('user_1')
      window.location.reload()
    }
  }
  const { isPremium, userPlan } = usePremium()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <GlobalHeader 
        title="Profile" 
        variant="blur"
      />

      {/* Main Content */}
      <main className="px-4 pb-24 pt-6">
        {/* Profile Card */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 shadow-premium">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
            
            <div className="relative z-10">
              {/* Premium Avatar and Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                  <User className="h-10 w-10 text-white relative z-10" />
                  {/* Premium shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-pulse" />
                  
                  {/* Selected Badge */}
                  {selectedBadge && (
                    <div className="absolute -bottom-1 -right-1">
                      <ProfileBadge achievement={selectedBadge} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-1">
                    Alex Johnson
                  </h2>
                  <p className="text-white/80 text-sm mb-2">
                    alex@company.com
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                      <span className="text-white text-xs font-medium">
                        {isPremium ? 'Premium Plan' : 'Free Plan'}
                      </span>
                    </div>
                    <PremiumBadge variant="crown" size="sm" />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {userPlan.usage.chatMessages + userPlan.usage.codeProjects + userPlan.usage.imageExports}
                  </div>
                  <div className="text-white/70 text-xs">Bu Ay</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {isPremium ? '∞' : userPlan.usage.chatMessages}
                  </div>
                  <div className="text-white/70 text-xs">Chat</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {isPremium ? '∞' : userPlan.usage.codeProjects}
                  </div>
                  <div className="text-white/70 text-xs">Kod</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Summary */}
        <UsageSummaryCard className="mb-8" />

        {/* Personalized Experience Summary */}
        {onboardingData && personalizedExperience.role && (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-xl">{personalizedExperience.role.icon}</span>
                Kişisel Deneyim
              </h3>
              <button
                onClick={handleResetOnboarding}
                className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
              >
                Sıfırla
              </button>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-300">
                  <strong className="text-white">Rol:</strong> {personalizedExperience.role.title}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-300">
                  <strong className="text-white">Seviye:</strong> {onboardingData.experienceLevel}
                </span>
              </div>
              {onboardingData.selectedGoals.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">
                    <strong className="text-white">Hedefler:</strong> {onboardingData.selectedGoals.length} hedef
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-300">
                  <strong className="text-white">Araçlar:</strong> {onboardingData.selectedTools.length} araç aktif
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Kişisel deneyimin {new Date(onboardingData.completedAt || '').toLocaleDateString('tr-TR')} tarihinde oluşturuldu
            </p>
          </div>
        )}

        {/* Achievements Summary */}
        {unlockedAchievements.length > 0 && (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Başarılar
              </h3>
              <div className="text-sm text-gray-400">
                {stats.unlocked}/{stats.total} kazanıldı
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-orange-400">{stats.bronze}</div>
                <div className="text-xs text-gray-400">Bronz</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-300">{stats.silver}</div>
                <div className="text-xs text-gray-400">Gümüş</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400">{stats.gold}</div>
                <div className="text-xs text-gray-400">Altın</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">{stats.platinum}</div>
                <div className="text-xs text-gray-400">Platin</div>
              </div>
            </div>

            <BadgeCollection 
              achievements={unlockedAchievements} 
              unlockedIds={unlockedAchievements.map(a => a.id)}
              className="mb-4"
            />

            <button
              onClick={() => router.push('/achievements')}
              className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              Tümünü Görüntüle
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Settings List */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Settings
          </h3>
          
          {settingsItems.map((item) => {
            const Icon = item.icon
            
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-foreground text-sm">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground text-xs">
                    {item.description}
                  </p>
                </div>
                
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            )
          })}
        </div>

        {/* App Info */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Synexa AI Studio</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Version 1.0.0 • Made with ❤️
          </p>
        </div>
      </main>

      {/* Plans Modal */}
      {showPlans && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Choose Your Plan
              </h2>
              <p className="text-muted-foreground text-sm">
                Unlock the full potential of AI creativity
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "relative p-4 rounded-xl border transition-all duration-200",
                    plan.current
                      ? "border-primary bg-primary/5"
                      : plan.popular
                      ? "border-amber-500 bg-amber-500/5"
                      : "border-border bg-card"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-2 left-4 px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{plan.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                        <span className="text-sm text-muted-foreground">/{plan.period}</span>
                      </div>
                    </div>
                    
                    {plan.current && (
                      <div className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
                        Current
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {!plan.current && (
                    <button className={cn(
                      "w-full py-3 rounded-xl font-medium transition-colors",
                      plan.popular
                        ? "bg-amber-500 text-white hover:bg-amber-600"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    )}>
                      {plan.id === 'premium' ? 'Upgrade Now' : 'Downgrade'}
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setShowPlans(false)}
              className="w-full py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Bottom Tab Bar */}
      <BottomTabBar />

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  )
}
