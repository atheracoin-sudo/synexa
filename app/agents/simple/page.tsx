'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Play, 
  Clock, 
  Star,
  ChevronRight,
  Zap
} from 'lucide-react'
import { GlobalHeader } from '@/components/ui/global-header'
import { BottomTabBar } from '@/components/ui/bottom-tab-bar'
import { cn } from '@/lib/utils'
import { AGENTS } from '@/lib/api/agents'

export default function SimpleAgentsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', name: 'All', icon: '🤖' },
    { id: 'build', name: 'Build', icon: '🏗️' },
    { id: 'design', name: 'Design', icon: '🎨' },
    { id: 'growth', name: 'Growth', icon: '📈' }
  ]

  const filteredAgents = selectedCategory === 'all' 
    ? AGENTS 
    : AGENTS.filter(agent => agent.category === selectedCategory)

  const handleAgentClick = (agentId: string) => {
    router.push(`/agents/execute/${agentId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader title="AI Agents" />
      
      <div className="max-w-4xl mx-auto p-6 pb-24">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            AI Agents
          </h1>
          <p className="text-muted-foreground">
            Specialized AI assistants for different tasks
          </p>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors',
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              <span>{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => handleAgentClick(agent.id)}
              className="bg-card border border-border rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] group"
            >
              {/* Agent Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-2xl">
                  {agent.icon}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {agent.estimatedTime}
                </div>
              </div>

              {/* Agent Info */}
              <div className="mb-4">
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {agent.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {agent.description}
                </p>
              </div>

              {/* Agent Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>4.8</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>{agent.questions.length} steps</span>
                  </div>
                </div>
                
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Popular Agents */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Popular This Week
          </h2>
          
          <div className="space-y-4">
            {AGENTS.slice(0, 3).map((agent, index) => (
              <div
                key={agent.id}
                onClick={() => handleAgentClick(agent.id)}
                className="bg-card border border-border rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-lg">
                    {agent.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {agent.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-muted-foreground">
                      #{index + 1}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAgentClick(agent.id)
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      Run
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start */}
        <div className="mt-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">
                New to AI Agents?
              </h3>
              <p className="text-muted-foreground mb-4">
                Start with our Frontend Developer agent - it's perfect for beginners and creates complete applications.
              </p>
              <button
                onClick={() => handleAgentClick('frontend-dev')}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Play className="w-4 h-4" />
                Try Frontend Developer
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomTabBar />
    </div>
  )
}











