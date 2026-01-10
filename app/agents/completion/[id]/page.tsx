'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/global-header'
import { BottomTabBar } from '@/components/ui/bottom-tab-bar'
import { agentsManager, AgentExecution, WorkflowAgent } from '@/lib/agents'
import { 
  CheckCircle,
  Download,
  ExternalLink,
  RefreshCw,
  Share2,
  Star,
  Clock,
  Target,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Code,
  Image as ImageIcon,
  Settings,
  Trophy,
  Gift,
  Crown
} from 'lucide-react'

export default function AgentCompletionPage() {
  const params = useParams()
  const router = useRouter()
  const executionId = params.id as string
  
  const [execution, setExecution] = useState<AgentExecution | null>(null)
  const [agent, setAgent] = useState<WorkflowAgent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    if (!executionId) return

    // Fetch execution data
    const executionData = agentsManager.getExecution(executionId)
    if (!executionData) {
      setIsLoading(false)
      return
    }

    setExecution(executionData)

    // Fetch agent data
    const agentData = agentsManager.getAgent(executionData.agentId)
    setAgent(agentData)
    setIsLoading(false)
  }, [executionId])

  const handleRerun = () => {
    if (!agent) return
    router.push(`/agents/${agent.id}`)
  }

  const handleContinueEditing = () => {
    // Navigate to appropriate tool based on agent's primary tool
    if (!agent) return
    
    const primaryTool = agent.tools[0]
    switch (primaryTool) {
      case 'chat':
        router.push('/chat')
        break
      case 'code':
        router.push('/studio')
        break
      case 'image':
        router.push('/image')
        break
      default:
        router.push('/')
    }
  }

  const getToolIcon = (tool: string) => {
    const icons: Record<string, React.ReactElement> = {
      chat: <MessageCircle className="w-5 h-5" />,
      code: <Code className="w-5 h-5" />,
      image: <ImageIcon className="w-5 h-5" />,
      tools: <Settings className="w-5 h-5" />
    }
    return icons[tool] || <Settings className="w-5 h-5" />
  }

  const mockOutputs = {
    'saas-mvp-builder': {
      title: 'SaaS MVP Successfully Built! 🚀',
      description: 'Your complete SaaS application is ready with authentication, dashboard, and payment integration.',
      deliverables: [
        { type: 'code', name: 'Complete Next.js Application', url: '/studio/project/saas-mvp', icon: <Code className="w-4 h-4" /> },
        { type: 'code', name: 'Authentication System', url: '/studio/project/saas-mvp/auth', icon: <Code className="w-4 h-4" /> },
        { type: 'code', name: 'Admin Dashboard', url: '/studio/project/saas-mvp/dashboard', icon: <Code className="w-4 h-4" /> },
        { type: 'code', name: 'Payment Integration', url: '/studio/project/saas-mvp/payments', icon: <Code className="w-4 h-4" /> },
        { type: 'chat', name: 'Deployment Guide', url: '/chat/deployment-guide', icon: <MessageCircle className="w-4 h-4" /> },
        { type: 'chat', name: 'Marketing Strategy', url: '/chat/marketing-plan', icon: <MessageCircle className="w-4 h-4" /> }
      ],
      stats: {
        filesGenerated: 24,
        linesOfCode: 3420,
        componentsCreated: 12,
        timeSpent: '14 minutes'
      }
    },
    'landing-page-builder': {
      title: 'Landing Page Created! 📄',
      description: 'Your high-converting landing page is ready with modern design and optimized for conversions.',
      deliverables: [
        { type: 'code', name: 'Landing Page HTML/CSS', url: '/studio/project/landing', icon: <Code className="w-4 h-4" /> },
        { type: 'image', name: 'Hero Section Design', url: '/image/hero-design', icon: <ImageIcon className="w-4 h-4" /> },
        { type: 'image', name: 'Visual Assets', url: '/image/landing-assets', icon: <ImageIcon className="w-4 h-4" /> },
        { type: 'chat', name: 'Copy & Messaging', url: '/chat/landing-copy', icon: <MessageCircle className="w-4 h-4" /> },
        { type: 'chat', name: 'SEO Optimization', url: '/chat/seo-guide', icon: <MessageCircle className="w-4 h-4" /> }
      ],
      stats: {
        sectionsCreated: 6,
        imagesGenerated: 8,
        conversionElements: 4,
        timeSpent: '8 minutes'
      }
    },
    'brand-kit-designer': {
      title: 'Brand Kit Completed! 🎨',
      description: 'Your complete brand identity is ready with logo, colors, typography, and usage guidelines.',
      deliverables: [
        { type: 'image', name: 'Logo Variations', url: '/image/brand-logos', icon: <ImageIcon className="w-4 h-4" /> },
        { type: 'image', name: 'Color Palette', url: '/image/brand-colors', icon: <ImageIcon className="w-4 h-4" /> },
        { type: 'image', name: 'Typography System', url: '/image/brand-fonts', icon: <ImageIcon className="w-4 h-4" /> },
        { type: 'image', name: 'Brand Guidelines', url: '/image/brand-guide', icon: <ImageIcon className="w-4 h-4" /> },
        { type: 'chat', name: 'Brand Strategy', url: '/chat/brand-strategy', icon: <MessageCircle className="w-4 h-4" /> }
      ],
      stats: {
        logoVariations: 6,
        colorSchemes: 3,
        fontPairings: 4,
        timeSpent: '12 minutes'
      }
    }
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

  if (!execution || !agent || execution.status !== 'completed') {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader title="Completion Not Available" showBack={true} backUrl="/agents" />
        <main className="container mx-auto px-4 py-8 pb-24">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-gray-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Agent Not Completed</h1>
            <p className="text-gray-400 mb-6">
              This agent execution is not completed yet or doesn't exist.
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

  const outputData = mockOutputs[agent.id as keyof typeof mockOutputs] || {
    title: 'Agent Task Completed! ✅',
    description: 'Your workflow has been completed successfully.',
    deliverables: [],
    stats: {}
  }

  const duration = execution.completedAt 
    ? Math.floor((new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000)
    : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader 
        title="Agent Completed"
        showBack={true}
        backUrl="/agents"
      />

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">{outputData.title}</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {outputData.description}
          </p>
        </div>

        {/* Agent Info */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-3xl">
              {agent.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {agent.name}
                {agent.isPremium && <Crown className="w-5 h-5 text-yellow-400" />}
              </h2>
              <p className="text-gray-400">{agent.description}</p>
            </div>
          </div>

          {/* Execution Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-600/10 border border-green-500/30 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{agent.steps.length}</div>
              <div className="text-sm text-green-400">Steps Completed</div>
            </div>
            <div className="text-center p-4 bg-blue-600/10 border border-blue-500/30 rounded-xl">
              <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{agentsManager.formatDuration(duration)}</div>
              <div className="text-sm text-blue-400">Total Time</div>
            </div>
            <div className="text-center p-4 bg-purple-600/10 border border-purple-500/30 rounded-xl">
              <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{agent.tools.length}</div>
              <div className="text-sm text-purple-400">Tools Used</div>
            </div>
            <div className="text-center p-4 bg-yellow-600/10 border border-yellow-500/30 rounded-xl">
              <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">100%</div>
              <div className="text-sm text-yellow-400">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Deliverables */}
        {outputData.deliverables.length > 0 && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Gift className="w-5 h-5 text-green-400" />
              Your Deliverables
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outputData.deliverables.map((deliverable, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-4 p-4 bg-gray-900/30 hover:bg-gray-900/50 border border-gray-700 hover:border-blue-500/50 rounded-xl cursor-pointer transition-all"
                  onClick={() => router.push(deliverable.url)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    {deliverable.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                      {deliverable.name}
                    </h3>
                    <p className="text-sm text-gray-400 capitalize">{deliverable.type} output</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Stats */}
        {Object.keys(outputData.stats).length > 0 && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Execution Summary
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(outputData.stats).map(([key, value]) => (
                <div key={key} className="text-center p-4 bg-gray-900/30 rounded-xl">
                  <div className="text-2xl font-bold text-white mb-1">{value}</div>
                  <div className="text-sm text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handleContinueEditing}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-primary text-white rounded-xl font-medium hover:scale-105 transition-transform"
          >
            <ArrowRight className="w-5 h-5" />
            Continue Editing
          </button>
          
          <button
            onClick={handleRerun}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Run Agent Again
          </button>
          
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Share Results
          </button>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-4">What's Next?</h3>
          <p className="text-blue-200 mb-6">
            Your agent has completed its workflow. You can now continue editing the outputs, 
            run the agent again with different parameters, or explore other agents.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => router.push('/agents')}
              className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 rounded-lg font-medium transition-colors"
            >
              Explore More Agents
            </button>
            <button
              onClick={() => router.push('/agents/history')}
              className="px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 rounded-lg font-medium transition-colors"
            >
              View History
            </button>
            <button
              onClick={() => router.push('/agents/create')}
              className="px-4 py-2 bg-pink-600/30 hover:bg-pink-600/50 text-pink-200 rounded-lg font-medium transition-colors"
            >
              Create Custom Agent
            </button>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowShareModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Share Your Results</h3>
              <p className="text-muted-foreground mb-6">
                Share your agent execution results with your team or community.
              </p>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  <span>Copy Share Link</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export as PDF</span>
                </button>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}






