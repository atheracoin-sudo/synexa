'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Sparkles,
  ArrowRight,
  Clock,
  Star,
  Code2,
  BarChart3,
  TrendingUp,
  Target,
  Plus,
  Bot,
  Zap,
  Store
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlobalHeader } from '@/components/ui/GlobalHeader'
import { BottomTabBar } from '@/components/ui/BottomTabBar'
import { analyticsManager } from '@/lib/analytics'
import { MainStreakCard } from '@/components/goals/StreakDisplay'
import { CompactGoalCard } from '@/components/goals/GoalProgressCard'
import { GoalCreationModal } from '@/components/goals/GoalCreationModal'
import { goalManager, Goal } from '@/lib/goals'
import { usePremium } from '@/lib/hooks/usePremium'
import { usePageTips } from '@/lib/hooks/useTips'
import InlineTip, { CompactTip } from '@/components/tips/InlineTip'
import AICoachingPanel from '@/components/tips/AICoachingPanel'
import { achievementsManager } from '@/lib/achievements'
import { AchievementToast } from '@/components/achievements/AchievementUnlockModal'
import { CompactBadge } from '@/components/achievements/Badge'
import { onboardingManager } from '@/lib/onboarding'
import FirstTaskSuggestion, { PersonalizedEmptyState, PersonalizedChatPrompts } from '@/components/onboarding/FirstTaskSuggestion'
import AdvancedOnboardingModal, { OnboardingCompletionModal, useAdvancedOnboarding } from '@/components/onboarding/AdvancedOnboardingModal'
import { agentsManager } from '@/lib/agents'
import { UsageSummaryCard } from '@/components/usage/UsageSummaryCard'
import { SoftLimitWarning } from '@/components/usage/SoftLimitWarning'
import { BetaWelcomeModal, useBetaWelcome } from '@/components/beta/BetaWelcomeModal'
// import { marketplaceManager } from '@/lib/marketplace'

// Mock data for recent creations
const recentCreations = [
  {
    id: 1,
    type: 'image',
    title: 'Sunset Landscape',
    createdAt: '2 hours ago',
    thumbnail: '/api/placeholder/300/200',
  },
  {
    id: 2,
    type: 'video',
    title: 'AI Animation',
    createdAt: '1 day ago',
    thumbnail: '/api/placeholder/300/200',
  },
  {
    id: 3,
    type: 'image',
    title: 'Portrait Art',
    createdAt: '2 days ago',
    thumbnail: '/api/placeholder/300/200',
  },
  {
    id: 4,
    type: 'video',
    title: 'Motion Graphics',
    createdAt: '3 days ago',
    thumbnail: '/api/placeholder/300/200',
  },
]

// Get personalized features based on onboarding
const getPersonalizedFeatures = (onboardingData: any) => {
  const baseFeatures = [
    {
      id: 'chat',
      title: 'Chat',
      description: 'AI conversations',
      href: '/chat',
      icon: MessageSquare,
      gradient: 'bg-gradient-primary',
      iconColor: 'text-white',
    },
    {
      id: 'code',
      title: 'Code',
      description: 'Build apps',
      href: '/code',
      icon: Code2,
      gradient: 'bg-gradient-to-br from-green-500 to-teal-600',
      iconColor: 'text-white',
    },
    {
      id: 'image',
      title: 'Design',
      description: 'Create visuals',
      href: '/design',
      icon: ImageIcon,
      gradient: 'bg-gradient-to-br from-blue-500 to-purple-600',
      iconColor: 'text-white',
    },
    {
      id: 'agents',
      title: 'AI Agents',
      description: 'Automated workflow agents',
      href: '/agents',
      icon: Bot,
      gradient: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      iconColor: 'text-white',
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Templates, agents & designs',
      href: '/marketplace',
      icon: Store,
      gradient: 'bg-gradient-to-br from-orange-500 to-red-600',
      iconColor: 'text-white',
    },
  ]

  if (!onboardingData) return baseFeatures

  // Reorder based on user's primary purpose
  const primaryPurpose = onboardingData.purpose
  return baseFeatures.sort((a, b) => {
    if (a.id === primaryPurpose) return -1
    if (b.id === primaryPurpose) return 1
    return 0
  })
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [usageData, setUsageData] = useState<any>(null)
  const [goals, setGoals] = useState<Goal[]>([])
  const [showCreateGoalModal, setShowCreateGoalModal] = useState(false)
  const { isPremium } = usePremium()
  const usage = useUsage() // Get usage from context
  const userPlan = useUserPlan() // Get user plan from context
  const limits = getUserPlanLimits(userPlan) // Get limits for current plan
  const showSoftWarning = shouldShowUpgradePrompt(usage, userPlan) // Determine if soft warning should show
  const { showWelcome, closeWelcome } = useBetaWelcome() // Beta welcome modal
  
  // Tips integration
  const { inlineTips, dismissTip, completeTipAction } = usePageTips('home')
  
  // Achievements integration
  const [showAchievementToast, setShowAchievementToast] = useState(false)
  const [newAchievement, setNewAchievement] = useState(null)
  const recentAchievements = achievementsManager.getUnlockedAchievements('user_1').slice(0, 3)
  
  // Advanced onboarding integration
  const {
    needsOnboarding,
    isOnboardingOpen,
    showCompletion,
    completionData,
    handleOnboardingComplete,
    handleOnboardingSkip,
    handleCompletionClose
  } = useAdvancedOnboarding('user_1')
  
  // Personalized experience
  const personalizedExperience = onboardingManager.getPersonalizedExperience('user_1')
  const hasCompletedOnboarding = !needsOnboarding
  
  const userId = 'user_1'

  useEffect(() => {
    setMounted(true)
    
    // Set greeting based on time
    const updateGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) setCurrentTime('Good morning')
      else if (hour < 17) setCurrentTime('Good afternoon')
      else setCurrentTime('Good evening')
    }
    
    updateGreeting()
    const interval = setInterval(updateGreeting, 60000) // Update every minute
    
    // Load usage data
    setUsageData(analyticsManager.getCurrentUsage())
    
    // Load goals
    const loadGoals = () => {
      try {
        const userGoals = goalManager.getActiveGoals(userId)
        setGoals(userGoals)
      } catch (error) {
        console.error('Failed to load goals:', error)
      }
    }
    
    loadGoals()
    
    return () => clearInterval(interval)
  }, [])

  const handleGoalCreated = (newGoal: Goal) => {
    setGoals(prev => [...prev, newGoal])
  }

  // Show loading while checking onboarding status
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Get personalized features based on user's onboarding data
  const onboardingData = onboardingManager.getUserOnboardingData('user_1')
  const personalizedFeatures = getPersonalizedFeatures(onboardingData)

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader 
        title="Synexa" 
        variant="blur"
      />

      {/* Main Content */}
      <main className="px-4 pb-24 pt-6">
        {/* Welcome Card */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 shadow-premium">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
            
            <div className="relative z-10 flex items-center gap-4">
              {/* Premium Avatar */}
              <div className="relative w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                <span className="text-2xl font-bold text-white relative z-10">U</span>
                {/* Premium effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-pulse" />
              </div>
              
              {/* Greeting */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">
                  {currentTime}, User
                </h2>
                <p className="text-white/80 text-sm">
                  What will you create today?
                </p>
              </div>
              
              {/* Sparkles decoration */}
              <Sparkles className="h-6 w-6 text-white/60" />
            </div>
          </div>
        </div>

        {/* Tips */}
        {inlineTips.map((tip) => (
          <CompactTip
            key={tip.id}
            tip={tip}
            onDismiss={() => dismissTip(tip.id)}
            onAction={() => completeTipAction(tip.id)}
          />
        ))}

        {/* Soft Limit Warning */}
        <SoftLimitWarning className="mb-6" />

        {/* Usage Summary Card */}
        <div className="mb-8">
          <UsageSummaryCard />
        </div>

        {/* Main Features */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            AI Studios
          </h3>
          
          <div className="grid gap-4">
            {personalizedFeatures.map((feature) => {
              const Icon = feature.icon
              
              return feature.disabled ? (
                <div
                  key={feature.id}
                  className="group block opacity-60 cursor-not-allowed"
                >
                  <div className={cn(
                    'relative overflow-hidden rounded-2xl p-6 shadow-card',
                    feature.gradient
                  )}>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Icon className={cn('h-6 w-6', feature.iconColor)} />
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-white/80 text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="px-3 py-1 bg-white/20 rounded-full">
                        <span className="text-xs text-white font-medium">Soon</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={feature.id}
                  href={feature.href}
                  className="group block"
                >
                  <div className={cn(
                    'relative overflow-hidden rounded-2xl p-6 shadow-card',
                    'transition-all duration-200 group-hover:scale-[1.02] group-active:scale-[0.98]',
                    feature.gradient
                  )}>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Icon className={cn('h-6 w-6', feature.iconColor)} />
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-white/80 text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      
                      <ArrowRight className="h-5 w-5 text-white/60 group-hover:text-white/80 transition-colors" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Your Activity Card */}
        {usageData && (usageData.chatMessages > 0 || usageData.codeProjects > 0 || usageData.imageDesigns > 0) && (
          <div className="mb-8">
            <Link href="/analytics" className="group block">
              <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 group-hover:scale-[1.02]">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -translate-y-12 translate-x-12" />
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-1">
                        Your Activity
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        Bu ay {usageData.chatMessages + usageData.codeProjects + usageData.imageDesigns} iş yaptın
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span>Aktif</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {usageData.totalActiveDays} gün
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>
                
                {/* Mini stats */}
                <div className="relative z-10 mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{usageData.chatMessages}</div>
                    <div className="text-xs text-muted-foreground">Chat</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{usageData.codeProjects}</div>
                    <div className="text-xs text-muted-foreground">Code</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{usageData.imageDesigns}</div>
                    <div className="text-xs text-muted-foreground">Image</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Goals & Streak Section */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Goals Card */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Hedeflerin 🎯
              </h3>
              {goals.length > 0 && (
                <Link 
                  href="/goals"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Tümünü Gör →
                </Link>
              )}
            </div>
            
            {goals.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
                <Target size={48} className="text-gray-600 mx-auto mb-4" />
                <h4 className="text-white font-medium mb-2">
                  Henüz bir hedefin yok
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  Küçük hedeflerle büyük başarılara ulaş
                </p>
                <button
                  onClick={() => setShowCreateGoalModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors mx-auto"
                >
                  <Plus size={16} />
                  İlk Hedefini Oluştur
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {goals.slice(0, 2).map((goal) => (
                  <CompactGoalCard
                    key={goal.id}
                    goal={goal}
                    onClick={() => window.location.href = '/goals'}
                  />
                ))}
                {goals.length > 2 && (
                  <Link
                    href="/goals"
                    className="block text-center py-3 text-sm text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    +{goals.length - 2} hedef daha
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Streak Card */}
          <MainStreakCard
            userId={userId}
            isPremium={isPremium}
            onStreakClick={() => window.location.href = '/goals'}
          />
        </div>

        {/* First Task Suggestion */}
        {hasCompletedOnboarding && (
          <FirstTaskSuggestion 
            userId="user_1" 
            className="mb-8"
          />
        )}

        {/* Recent Achievements */}
        {recentAchievements.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Son Başarılar
                </h3>
                <Link 
                  href="/achievements" 
                  className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  Tümünü gör →
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentAchievements.map((achievement) => (
                  <CompactBadge
                    key={achievement.id}
                    achievement={achievement}
                    isUnlocked={true}
                  />
                ))}
              </div>
              <p className="text-xs text-yellow-200 mt-3">
                Harika ilerleme! Yeni başarılar kazanmaya devam et 🎉
              </p>
            </div>
          </div>
        )}

        {/* Start with an Agent */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Start with an Agent</h3>
                <p className="text-purple-200 text-sm">Let AI handle complex workflows</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {agentsManager.getFeaturedAgents().slice(0, 3).map((agent) => (
                <Link
                  key={agent.id}
                  href={`/agents/${agent.id}`}
                  className="group flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-lg">
                    {agent.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm truncate">{agent.name}</div>
                    <div className="text-xs text-purple-200/80">~{agentsManager.getEstimatedTimeText(agent.estimatedTime)}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-300 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
            
            <Link
              href="/agents"
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              <Bot className="w-4 h-4" />
              Browse All Agents
            </Link>
          </div>

        </div>

        {/* Recent Creations */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Recent Creations
            </h3>
            <Link 
              href="/library" 
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View all
            </Link>
          </div>
          
          {recentCreations.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {recentCreations.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl bg-card shadow-card transition-all duration-200 hover:scale-[1.02]"
                >
                  {/* Premium thumbnail with gradient overlay */}
                  <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
                    {/* Premium background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]" />
                    
                    {/* Content */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      {item.type === 'image' ? (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-premium">
                          <ImageIcon className="h-6 w-6 text-white" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center shadow-premium">
                          <Video className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Subtle shine effect */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-3">
                    <h4 className="font-medium text-foreground text-sm mb-1 truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {item.createdAt}
                    </div>
                  </div>
                  
                  {/* Type indicator */}
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    {item.type === 'image' ? (
                      <ImageIcon className="h-3 w-3 text-foreground" />
                    ) : (
                      <Video className="h-3 w-3 text-foreground" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium text-foreground mb-2">No creations yet</h4>
              <p className="text-sm text-muted-foreground">
                Start creating with our AI studios
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />


      {/* Goal Creation Modal */}
      <GoalCreationModal
        isOpen={showCreateGoalModal}
        onClose={() => setShowCreateGoalModal(false)}
        onGoalCreated={handleGoalCreated}
        userId={userId}
        isPremium={isPremium}
      />
      
      {/* Beta Welcome Modal */}
      <BetaWelcomeModal 
        isOpen={showWelcome}
        onClose={closeWelcome}
      />

      {/* AI Coaching Panel */}
      <AICoachingPanel context="home" userId="user_1" />

      {/* Achievement Toast */}
      <AchievementToast
        achievement={newAchievement}
        isVisible={showAchievementToast}
        onClose={() => {
          setShowAchievementToast(false)
          setNewAchievement(null)
        }}
        onView={() => {
          setShowAchievementToast(false)
          setNewAchievement(null)
          window.location.href = '/achievements'
        }}
      />

      {/* Advanced Onboarding Modal */}
      <AdvancedOnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
        userId="user_1"
      />

      {/* Onboarding Completion Modal */}
      <OnboardingCompletionModal
        isOpen={showCompletion}
        onClose={handleCompletionClose}
        userData={completionData}
      />
    </div>
  )
}