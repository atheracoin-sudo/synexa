'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/GlobalHeader'
import { BottomTabBar } from '@/components/ui/BottomTabBar'
import { AgentStartModal } from '@/components/agents/AgentStartModal'
import { PremiumAgentModal } from '@/components/agents/PremiumAgentModal'
import { agentsManager, WorkflowAgent } from '@/lib/agents'
import { 
  Clock,
  Target,
  Crown,
  Sparkles,
  CheckCircle,
  Play,
  Users,
  TrendingUp,
  ArrowRight,
  Star,
  MessageCircle,
  Code,
  Image as ImageIcon,
  Settings
} from 'lucide-react'

export default function AgentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const agentId = params.id as string
  
  const [agent, setAgent] = useState<WorkflowAgent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showStartModal, setShowStartModal] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  useEffect(() => {
    if (!agentId) return

    // Fetch agent data
    const agentData = agentsManager.getAgent(agentId)
    setAgent(agentData)
    setIsLoading(false)
  }, [agentId])

  const handleStartAgent = (setupAnswers: Record<string, any>) => {
    if (!agent) return

    // Check if user can use this agent
    const canUse = agentsManager.canUseAgent('user_1', agent.id)
    if (!canUse.canUse) {
      if (agent.isPremium) {
        setShowPremiumModal(true)
        setShowStartModal(false)
        return
      }
      alert(canUse.reason)
      return
    }

    // Start execution
    const executionId = agentsManager.startExecution(agent.id, 'user_1', setupAnswers)
    
    // Navigate to execution screen
    router.push(`/agents/execution/${executionId}`)
    setShowStartModal(false)
  }

  const handleStartClick = () => {
    if (!agent) return

    // Check if user can use this agent
    const canUse = agentsManager.canUseAgent('user_1', agent.id)
    if (!canUse.canUse && agent.isPremium) {
      setShowPremiumModal(true)
      return
    }

    setShowStartModal(true)
  }

  const getToolIcon = (tool: string) => {
    const icons = {
      chat: <MessageCircle className="w-4 h-4" />,
      code: <Code className="w-4 h-4" />,
      image: <ImageIcon className="w-4 h-4" />,
      tools: <Settings className="w-4 h-4" />
    }
    return icons[tool] || <Settings className="w-4 h-4" />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader title="Loading..." showBack={true} backUrl="/agents" />
        <main className="container mx-auto px-4 py-8 pb-24">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
        <BottomTabBar />
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader title="Agent Not Found" showBack={true} backUrl="/agents" />
        <main className="container mx-auto px-4 py-8 pb-24">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-gray-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Agent Not Found</h1>
            <p className="text-gray-400 mb-6">
              The agent you're looking for doesn't exist or is no longer available.
            </p>
            <button
              onClick={() => router.push('/agents')}
              className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:scale-105 transition-transform"
            >
              Browse Agents
            </button>
          </div>
        </main>
        <BottomTabBar />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader 
        title={agent.name} 
        showBack={true}
        backUrl="/agents"
      />

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Agent Header */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Agent Info */}
            <div className="lg:w-2/3">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-3xl">
                  {agent.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{agent.name}</h1>
                    {agent.isPremium && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-yellow-600/20 border border-yellow-500/30 rounded-lg text-sm text-yellow-400">
                        <Crown className="w-4 h-4" />
                        <span>Premium</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-gray-700/50 rounded-lg text-sm text-gray-400 mb-4 w-fit">
                    <span>{agentsManager.getCategoryIcon(agent.category)}</span>
                    <span>{agentsManager.getCategoryName(agent.category)}</span>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {agent.description}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-800/30 rounded-xl">
                  <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{agentsManager.getEstimatedTimeText(agent.estimatedTime)}</div>
                  <div className="text-sm text-gray-400">Duration</div>
                </div>
                <div className="text-center p-4 bg-gray-800/30 rounded-xl">
                  <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{agent.successRate}%</div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-gray-800/30 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{agent.steps.length}</div>
                  <div className="text-sm text-gray-400">Steps</div>
                </div>
                <div className="text-center p-4 bg-gray-800/30 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{agent.popularity}%</div>
                  <div className="text-sm text-gray-400">Popularity</div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Panel */}
            <div className="lg:w-1/3">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Ready to Start?</h3>
                
                <button
                  onClick={handleStartClick}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-primary text-white rounded-xl font-medium hover:scale-105 transition-transform mb-4"
                >
                  <Play className="w-5 h-5" />
                  Start This Agent
                </button>

                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Automated workflow execution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Step-by-step progress tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Pause and resume anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Complete deliverables</span>
                  </div>
                </div>

                {/* Tools Used */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-white mb-3">Tools Used</h4>
                  <div className="flex items-center gap-2">
                    {agent.tools.map((tool) => (
                      <div
                        key={tool}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg text-sm text-gray-300"
                        title={agentsManager.getToolName(tool)}
                      >
                        {getToolIcon(tool)}
                        <span>{agentsManager.getToolName(tool)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Workflow Steps
          </h2>
          
          <div className="space-y-4">
            {agent.steps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-start gap-4 p-4 bg-gray-900/30 rounded-xl"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-white">{step.title}</h3>
                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded-lg text-xs text-gray-400">
                      {getToolIcon(step.tool)}
                      <span>{agentsManager.getToolName(step.tool)}</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{step.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>~{agentsManager.formatDuration(step.estimatedTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Agents */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Similar Agents
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agentsManager.getAgentsByCategory(agent.category)
              .filter(a => a.id !== agent.id)
              .slice(0, 4)
              .map((similarAgent) => (
                <div
                  key={similarAgent.id}
                  onClick={() => router.push(`/agents/${similarAgent.id}`)}
                  className="group flex items-center gap-4 p-4 bg-gray-900/30 hover:bg-gray-900/50 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-lg">
                    {similarAgent.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors truncate">
                      {similarAgent.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{agentsManager.getEstimatedTimeText(similarAgent.estimatedTime)}</span>
                      <span>•</span>
                      <span>{similarAgent.successRate}% success</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* Start Modal */}
      <AgentStartModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        agent={agent}
        onStart={handleStartAgent}
      />

      {/* Premium Modal */}
      <PremiumAgentModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        agent={agent}
      />

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}
