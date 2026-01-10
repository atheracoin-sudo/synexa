'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  MessageCircle, 
  Code2, 
  Image, 
  Bot, 
  TrendingUp, 
  Calendar,
  Clock,
  Users,
  Crown,
  ArrowLeft,
  Sparkles,
  Target,
  Zap,
  Award,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { analyticsManager, UsageData, ActivityData, ProjectData } from '@/lib/analytics'
import { usePremium } from '@/lib/hooks/usePremium'
import { useAgents } from '@/lib/hooks/useAgents'
import { cn } from '@/lib/utils'

type TabType = 'overview' | 'chat' | 'code' | 'image' | 'agents'
type TimeRange = 'daily' | 'weekly' | 'monthly'

export default function AnalyticsPage() {
  const router = useRouter()
  const { isPremium } = usePremium()
  const { agents } = useAgents()
  
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [timeRange, setTimeRange] = useState<TimeRange>('daily')
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [projectData, setProjectData] = useState<ProjectData[]>([])

  useEffect(() => {
    // Load analytics data
    setUsageData(analyticsManager.getCurrentUsage())
    setActivityData(analyticsManager.getActivityTimeline(timeRange))
    setProjectData(analyticsManager.getProjectBreakdown())
  }, [timeRange])

  if (!usageData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const mostProductiveDay = analyticsManager.getMostProductiveDay()
  const mostUsedAgent = analyticsManager.getMostUsedAgent()
  const weeklyGrowth = analyticsManager.getWeeklyGrowth()
  const totalActivity = usageData.chatMessages + usageData.codeProjects + usageData.imageDesigns

  // Check if user has any activity
  const hasActivity = totalActivity > 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Geri
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Usage Analytics</h1>
                <p className="text-muted-foreground">Bu ay yaptığın işlerin özeti</p>
              </div>
            </div>
            {isPremium && (
              <Badge variant="premium" className="text-sm px-3 py-1">
                👑 Premium
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {!hasActivity ? (
          // Empty State
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Henüz başlamadın
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Synexa ile ilk işini yaptığında burada güzel istatistikler göreceksin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.push('/chat')} className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat'e başla
              </Button>
              <Button variant="secondary" onClick={() => router.push('/studio/code')} className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                İlk uygulamanı oluştur
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Chat Usage */}
              <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-blue-600/5 border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 cursor-pointer" onClick={() => setActiveTab('chat')}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-blue-500" />
                  </div>
                  {weeklyGrowth.chatGrowth > 0 && (
                    <Badge variant="success" className="text-xs">
                      +{weeklyGrowth.chatGrowth}%
                    </Badge>
                  )}
                </div>
                <div className="mb-2">
                  <div className="text-2xl font-bold text-foreground">{usageData.chatMessages}</div>
                  <div className="text-sm text-muted-foreground">Bu ay mesaj</div>
                </div>
                {!isPremium && (
                  <>
                    <div className="w-full bg-muted rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((usageData.chatMessages / 50) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Premium ile sınırsız
                    </div>
                  </>
                )}
              </Card>

              {/* Code Projects */}
              <Card className="p-6 bg-gradient-to-br from-green-500/5 to-green-600/5 border-green-500/20 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-200 cursor-pointer" onClick={() => setActiveTab('code')}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <Code2 className="h-6 w-6 text-green-500" />
                  </div>
                  {weeklyGrowth.codeGrowth > 0 && (
                    <Badge variant="success" className="text-xs">
                      +{weeklyGrowth.codeGrowth}%
                    </Badge>
                  )}
                </div>
                <div className="mb-2">
                  <div className="text-2xl font-bold text-foreground">{usageData.codeProjects}</div>
                  <div className="text-sm text-muted-foreground">Uygulama oluşturdun</div>
                </div>
                <div className="text-xs text-green-600">
                  +{Math.floor(usageData.codeProjects * 0.4)} bu hafta
                </div>
              </Card>

              {/* Image Designs */}
              <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-purple-600/5 border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200 cursor-pointer" onClick={() => setActiveTab('image')}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                    <Image className="h-6 w-6 text-purple-500" />
                  </div>
                  {weeklyGrowth.imageGrowth > 0 && (
                    <Badge variant="success" className="text-xs">
                      +{weeklyGrowth.imageGrowth}%
                    </Badge>
                  )}
                </div>
                <div className="mb-2">
                  <div className="text-2xl font-bold text-foreground">{usageData.imageDesigns}</div>
                  <div className="text-sm text-muted-foreground">Tasarım</div>
                </div>
                <div className="text-xs text-purple-600">
                  {Math.floor(usageData.imageDesigns * 0.6)} export
                </div>
              </Card>

              {/* Active Agents */}
              <Card className="p-6 bg-gradient-to-br from-orange-500/5 to-orange-600/5 border-orange-500/20 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200 cursor-pointer" onClick={() => setActiveTab('agents')}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                    <Bot className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-2xl font-bold text-foreground">{usageData.activeAgents}</div>
                  <div className="text-sm text-muted-foreground">Agent aktif</div>
                </div>
                <div className="text-xs text-orange-600">
                  En çok: {mostUsedAgent.agentId}
                </div>
              </Card>
            </div>

            {/* Activity Timeline */}
            <Card className="p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">Aktivite Geçmişi</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={timeRange === 'daily' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setTimeRange('daily')}
                  >
                    Günlük
                  </Button>
                  <Button
                    variant={timeRange === 'weekly' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setTimeRange('weekly')}
                  >
                    Haftalık
                  </Button>
                </div>
              </div>

              {/* Simple Activity Heatmap */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {activityData.slice(-21).map((day, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className={cn(
                        "w-8 h-8 rounded-lg mb-1 transition-all duration-200",
                        day.totalActivity === 0 && "bg-muted/30",
                        day.totalActivity > 0 && day.totalActivity <= 2 && "bg-primary/20",
                        day.totalActivity > 2 && day.totalActivity <= 5 && "bg-primary/40",
                        day.totalActivity > 5 && "bg-primary/60"
                      )}
                      title={`${new Date(day.date).toLocaleDateString('tr-TR')}: ${day.totalActivity} aktivite`}
                    />
                    <div className="text-xs text-muted-foreground">
                      {new Date(day.date).toLocaleDateString('tr-TR', { weekday: 'short' })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>En üretken günün: {mostProductiveDay.day} 🚀</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{usageData.totalActiveDays} gün aktif</span>
                </div>
              </div>
            </Card>

            {/* Premium Tease for Free Users */}
            {!isPremium && (
              <Card className="p-6 mb-8 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">
                        Bu ay üretimin harikaydı 👏
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Premium ile sınırları kaldırabilirsin.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="secondary"
                      onClick={() => router.push('/invite')} 
                      className="flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share Synexa
                    </Button>
                    <Button onClick={() => router.push('/pricing')} className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Premium'a Geç
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Share Synexa for Premium Users */}
            {isPremium && totalActivity > 30 && (
              <Card className="p-6 mb-8 bg-gradient-to-r from-green-500/5 via-teal-500/5 to-blue-500/5 border-green-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <Share2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">
                        Synexa'yı arkadaşlarınla paylaş 🚀
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Bu kadar üretken olduğuna göre, arkadaşların da faydalanabilir.
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => router.push('/invite')} className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Invite & Earn
                  </Button>
                </div>
              </Card>
            )}

            {/* Detailed Breakdown Tabs */}
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6 border-b border-border/50 pb-4">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors",
                    activeTab === 'overview' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Genel Bakış
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors",
                    activeTab === 'chat' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors",
                    activeTab === 'code' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Code
                </button>
                <button
                  onClick={() => setActiveTab('image')}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors",
                    activeTab === 'image' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Image
                </button>
                <button
                  onClick={() => setActiveTab('agents')}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors",
                    activeTab === 'agents' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Agents
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-4">Bu Ay Özet</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Toplam aktivite</span>
                          <span className="font-semibold text-foreground">{totalActivity}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Aktif günler</span>
                          <span className="font-semibold text-foreground">{usageData.totalActiveDays}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">En üretken gün</span>
                          <span className="font-semibold text-foreground">{mostProductiveDay.day}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-4">Haftalık Büyüme</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Chat mesajları</span>
                          <Badge variant={weeklyGrowth.chatGrowth > 0 ? "success" : "secondary"}>
                            {weeklyGrowth.chatGrowth > 0 ? '+' : ''}{weeklyGrowth.chatGrowth}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Kod projeleri</span>
                          <Badge variant={weeklyGrowth.codeGrowth > 0 ? "success" : "secondary"}>
                            {weeklyGrowth.codeGrowth > 0 ? '+' : ''}{weeklyGrowth.codeGrowth}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Tasarımlar</span>
                          <Badge variant={weeklyGrowth.imageGrowth > 0 ? "success" : "secondary"}>
                            {weeklyGrowth.imageGrowth > 0 ? '+' : ''}{weeklyGrowth.imageGrowth}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'chat' && (
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Chat Aktivitesi</h3>
                  <div className="space-y-4">
                    {projectData.filter(p => p.type === 'chat').map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <MessageCircle className="h-5 w-5 text-blue-500" />
                          <div>
                            <div className="font-medium text-foreground">{project.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(project.createdAt).toLocaleDateString('tr-TR')}
                            </div>
                          </div>
                        </div>
                        <Badge variant={project.status === 'active' ? 'success' : 'secondary'}>
                          {project.status === 'active' ? 'Aktif' : 'Arşiv'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'code' && (
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Kod Projeleri</h3>
                  <div className="space-y-4">
                    {projectData.filter(p => p.type === 'code').map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Code2 className="h-5 w-5 text-green-500" />
                          <div>
                            <div className="font-medium text-foreground">{project.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Oluşturuldu: {new Date(project.createdAt).toLocaleDateString('tr-TR')}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Son güncelleme: {new Date(project.updatedAt).toLocaleDateString('tr-TR')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={project.status === 'active' ? 'success' : 'secondary'}>
                            {project.status === 'active' ? 'Aktif' : 'Arşiv'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'image' && (
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Tasarım Projeleri</h3>
                  <div className="space-y-4">
                    {projectData.filter(p => p.type === 'image').map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Image className="h-5 w-5 text-purple-500" />
                          <div>
                            <div className="font-medium text-foreground">{project.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(project.createdAt).toLocaleDateString('tr-TR')}
                            </div>
                          </div>
                        </div>
                        <Badge variant={project.status === 'active' ? 'success' : 'secondary'}>
                          {project.status === 'active' ? 'Aktif' : 'Arşiv'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'agents' && (
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Agent Kullanımı</h3>
                  <div className="space-y-4">
                    {agents.slice(0, 5).map((agent) => {
                      const usage = projectData.filter(p => p.agentId === agent.id).length
                      return (
                        <div key={agent.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                              <Bot className="h-5 w-5 text-orange-500" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{agent.name}</div>
                              <div className="text-sm text-muted-foreground">{agent.description}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-foreground">{usage}</div>
                            <div className="text-xs text-muted-foreground">kullanım</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </Card>

            {/* Data Privacy Notice */}
            <div className="text-center mt-8 text-sm text-muted-foreground">
              <p>Bu veriler yalnızca sana (ve workspace'ine) aittir.</p>
              <button className="text-primary hover:underline mt-1">
                Data & Privacy
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
