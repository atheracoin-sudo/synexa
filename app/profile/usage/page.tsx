'use client'

import { useState } from 'react'
import { GlobalHeader, BottomTabBar } from '@/components/ui'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  MessageSquare, 
  Code2, 
  Image, 
  Bot, 
  Calendar,
  Crown,
  ArrowLeft,
  BarChart3,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUsage, useUserPlan } from '@/lib/context/AppContext'
import { getUserPlanLimits } from '@/lib/config'
import { UsageSummaryCard } from '@/components/usage/UsageSummaryCard'
import Link from 'next/link'

// Mock recent activities data
const recentActivities = [
  {
    id: '1',
    type: 'chat',
    title: 'AI Chat mesajı',
    description: 'React component sorusu',
    timestamp: '2 saat önce',
    icon: MessageSquare,
    color: 'text-blue-500'
  },
  {
    id: '2',
    type: 'apps',
    title: 'App oluşturuldu',
    description: 'Todo List uygulaması',
    timestamp: '5 saat önce',
    icon: Code2,
    color: 'text-green-500'
  },
  {
    id: '3',
    type: 'images',
    title: 'Görsel oluşturuldu',
    description: 'Logo tasarımı',
    timestamp: '1 gün önce',
    icon: Image,
    color: 'text-purple-500'
  },
  {
    id: '4',
    type: 'agents',
    title: 'AI Agent çalıştırıldı',
    description: 'Frontend Developer',
    timestamp: '2 gün önce',
    icon: Bot,
    color: 'text-orange-500'
  },
  {
    id: '5',
    type: 'chat',
    title: 'AI Chat mesajı',
    description: 'API entegrasyonu',
    timestamp: '3 gün önce',
    icon: MessageSquare,
    color: 'text-blue-500'
  }
]

export default function UsageDetailPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview')
  const usage = useUsage()
  const plan = useUserPlan()
  const limits = getUserPlanLimits(plan)
  const isPremium = plan !== 'free'

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader title="Usage" />
      
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/profile"
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Kullanım Detayları
            </h1>
            <p className="text-muted-foreground">
              Bu ayki kullanımın ve geçmiş aktiviteler
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 mb-6 p-1 bg-secondary rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-all',
              activeTab === 'overview'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <BarChart3 className="h-4 w-4 mr-2 inline" />
            Özet
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-all',
              activeTab === 'history'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Clock className="h-4 w-4 mr-2 inline" />
            Geçmiş
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Usage Summary */}
            <UsageSummaryCard />

            {/* Plan Info */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">
                  Plan Bilgileri
                </h3>
                {isPremium && (
                  <Badge variant="premium" className="flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Premium
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Mevcut Plan</p>
                  <p className="font-medium text-foreground capitalize">
                    {plan === 'free' ? 'Free Plan' : 'Premium Plan'}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Yenileme Tarihi</p>
                  <p className="font-medium text-foreground">
                    {isPremium ? '15 Şubat 2024' : 'Her ay 1\'inde'}
                  </p>
                </div>
              </div>

              {!isPremium && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <Link href="/pricing">
                    <Button className="w-full md:w-auto">
                      <Crown className="h-4 w-4 mr-2" />
                      Premium'a Geç
                    </Button>
                  </Link>
                </div>
              )}
            </Card>

            {/* Usage Breakdown */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Detaylı Kullanım
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Chat Messages */}
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Chat Mesajları</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {usage.chatMessages}
                    {!isPremium && (
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        / {limits.chatMessages}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isPremium ? 'Sınırsız' : `${limits.chatMessages - usage.chatMessages} kaldı`}
                  </p>
                </div>

                {/* Code Generations */}
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Code2 className="h-5 w-5 text-green-500" />
                    <span className="font-medium">App Oluşturma</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {usage.codeGenerations}
                    {!isPremium && (
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        / {limits.codeGenerations}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isPremium ? 'Sınırsız' : `${limits.codeGenerations - usage.codeGenerations} kaldı`}
                  </p>
                </div>

                {/* Image Generations */}
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Image className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">Görsel Oluşturma</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {usage.imageGenerations}
                    {!isPremium && (
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        / {limits.imageGenerations}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isPremium ? 'Sınırsız' : `${limits.imageGenerations - usage.imageGenerations} kaldı`}
                  </p>
                </div>

                {/* AI Agents */}
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Bot className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">AI Agents</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {usage.agents}
                    {!isPremium && (
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        / {limits.agents}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isPremium ? 'Sınırsız' : `${limits.agents - usage.agents} kaldı`}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Recent Activities */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Son Aktiviteler
              </h3>

              <div className="space-y-3">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div 
                      key={activity.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="p-2 bg-secondary rounded-lg">
                        <Icon className={cn('h-4 w-4', activity.color)} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.description}
                        </p>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {activity.timestamp}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Load More */}
              <div className="mt-4 pt-4 border-t border-border/50 text-center">
                <Button variant="outline" size="sm">
                  Daha Fazla Yükle
                </Button>
              </div>
            </Card>

            {/* Monthly Summary */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Aylık Özet
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {usage.chatMessages}
                  </div>
                  <p className="text-xs text-muted-foreground">Chat</p>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {usage.codeGenerations}
                  </div>
                  <p className="text-xs text-muted-foreground">Apps</p>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {usage.imageGenerations}
                  </div>
                  <p className="text-xs text-muted-foreground">Images</p>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {usage.agents}
                  </div>
                  <p className="text-xs text-muted-foreground">Agents</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      <BottomTabBar />
    </div>
  )
}






