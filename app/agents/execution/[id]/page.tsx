'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/global-header'
import { BottomTabBar } from '@/components/ui/bottom-tab-bar'
import { agentsManager, AgentExecution, WorkflowAgent, StepStatus, simulateAgentExecution } from '@/lib/agents'
import { 
  Play,
  Pause,
  Square,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader,
  Edit3,
  ArrowRight,
  MessageCircle,
  Code,
  Image as ImageIcon,
  Settings,
  Sparkles,
  Target,
  Crown
} from 'lucide-react'

export default function AgentExecutionPage() {
  const params = useParams()
  const router = useRouter()
  const executionId = params.id as string
  
  const [execution, setExecution] = useState<AgentExecution | null>(null)
  const [agent, setAgent] = useState<WorkflowAgent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentOutput, setCurrentOutput] = useState<any>(null)
  const [selectedTool, setSelectedTool] = useState<string>('chat')

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

    // Start simulation if execution is running
    if (executionData.status === 'running') {
      startSimulation(executionId)
    }
  }, [executionId])

  const startSimulation = async (execId: string) => {
    await simulateAgentExecution(execId, (stepIndex, status, output) => {
      // Update local state
      const updatedExecution = agentsManager.getExecution(execId)
      if (updatedExecution) {
        setExecution({ ...updatedExecution })
        if (output) {
          setCurrentOutput(output)
        }
      }
    })
  }

  const handlePause = () => {
    if (!execution) return
    agentsManager.pauseExecution(execution.id)
    setExecution(prev => prev ? { ...prev, status: 'paused' } : null)
  }

  const handleResume = () => {
    if (!execution) return
    agentsManager.resumeExecution(execution.id)
    setExecution(prev => prev ? { ...prev, status: 'running' } : null)
    startSimulation(execution.id)
  }

  const handleStop = () => {
    if (!execution) return
    agentsManager.stopExecution(execution.id)
    setExecution(prev => prev ? { ...prev, status: 'failed', error: 'Stopped by user' } : null)
  }

  const handleComplete = () => {
    if (!execution || !agent) return
    router.push(`/agents/completion/${execution.id}`)
  }

  const getStepIcon = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'running':
        return <Loader className="w-5 h-5 text-blue-400 animate-spin" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      case 'paused':
        return <Pause className="w-5 h-5 text-yellow-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getToolIcon = (tool: string) => {
    const icons: Record<string, React.ReactElement> = {
      chat: <MessageCircle className="w-4 h-4" />,
      code: <Code className="w-4 h-4" />,
      image: <ImageIcon className="w-4 h-4" />,
      tools: <Settings className="w-4 h-4" />
    }
    return icons[tool] || <Settings className="w-4 h-4" />
  }

  const getStatusColor = (status: StepStatus) => {
    switch (status) {
      case 'completed': return 'border-green-500 bg-green-600/10'
      case 'running': return 'border-blue-500 bg-blue-600/10'
      case 'failed': return 'border-red-500 bg-red-600/10'
      case 'paused': return 'border-yellow-500 bg-yellow-600/10'
      default: return 'border-gray-600 bg-gray-800/30'
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

  if (!execution || !agent) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader title="Execution Not Found" showBack={true} backUrl="/agents" />
        <main className="container mx-auto px-4 py-8 pb-24">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Execution Not Found</h1>
            <p className="text-gray-400 mb-6">
              The agent execution you're looking for doesn't exist or has been removed.
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

  const currentStep = agent.steps[execution.currentStepIndex]
  const completedSteps = agent.steps.filter(step => step.status === 'completed').length
  const progress = (completedSteps / agent.steps.length) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader 
        title={`${agent.name} - Execution`}
        showBack={true}
        backUrl="/agents"
      />

      <main className="container mx-auto px-4 py-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Agent Timeline - Left Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sticky top-8">
              {/* Agent Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                  {agent.icon}
                </div>
                <div>
                  <h2 className="font-bold text-white flex items-center gap-2">
                    {agent.name}
                    {agent.isPremium && <Crown className="w-4 h-4 text-yellow-400" />}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {execution.status === 'running' ? 'Running...' : 
                     execution.status === 'completed' ? 'Completed' :
                     execution.status === 'paused' ? 'Paused' : 'Failed'}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Progress</span>
                  <span className="text-sm text-gray-400">{completedSteps}/{agent.steps.length} steps</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 mb-6">
                {execution.status === 'running' && (
                  <>
                    <button
                      onClick={handlePause}
                      className="flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Pause className="w-4 h-4" />
                      Pause
                    </button>
                    <button
                      onClick={handleStop}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Square className="w-4 h-4" />
                      Stop
                    </button>
                  </>
                )}
                
                {execution.status === 'paused' && (
                  <button
                    onClick={handleResume}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Resume
                  </button>
                )}

                {execution.status === 'completed' && (
                  <button
                    onClick={handleComplete}
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-primary text-white rounded-lg text-sm font-medium hover:scale-105 transition-transform"
                  >
                    <Target className="w-4 h-4" />
                    View Results
                  </button>
                )}
              </div>

              {/* Steps Timeline */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white mb-3">Workflow Steps</h3>
                {agent.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-3 border rounded-xl transition-all ${getStatusColor(step.status)} ${
                      index === execution.currentStepIndex ? 'ring-2 ring-blue-500/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getStepIcon(step.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white text-sm">{step.title}</h4>
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-700/50 rounded text-xs text-gray-400">
                            {getToolIcon(step.tool)}
                            <span>{agentsManager.getToolName(step.tool)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{step.description}</p>
                        
                        {step.status === 'running' && (
                          <div className="text-xs text-blue-400">
                            Working on this step...
                          </div>
                        )}
                        
                        {step.status === 'completed' && step.output && (
                          <div className="text-xs text-green-400">
                            ✓ Completed
                          </div>
                        )}
                        
                        {step.status === 'failed' && step.error && (
                          <div className="text-xs text-red-400">
                            ✗ {step.error}
                          </div>
                        )}
                      </div>
                      
                      {step.status === 'pending' && (
                        <button className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
                          <Edit3 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
              {/* Tool Tabs */}
              <div className="flex items-center border-b border-gray-700 bg-gray-900/30">
                {agent.tools.map((tool) => (
                  <button
                    key={tool}
                    onClick={() => setSelectedTool(tool)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                      selectedTool === tool
                        ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-600/10'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {getToolIcon(tool)}
                    <span>{agentsManager.getToolName(tool)}</span>
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div className="p-6 min-h-[600px]">
                {currentStep && currentStep.tool === selectedTool ? (
                  <div className="space-y-6">
                    {/* Current Step Header */}
                    <div className="flex items-center gap-3 p-4 bg-blue-600/10 border border-blue-500/30 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {execution.currentStepIndex + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{currentStep.title}</h3>
                        <p className="text-sm text-blue-300">{currentStep.description}</p>
                      </div>
                      {currentStep.status === 'running' && (
                        <div className="ml-auto">
                          <Loader className="w-5 h-5 text-blue-400 animate-spin" />
                        </div>
                      )}
                    </div>

                    {/* Tool-specific Content */}
                    {selectedTool === 'chat' && (
                      <div className="space-y-4">
                        <div className="bg-gray-900/30 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm text-gray-400 mb-1">AI Agent</div>
                              <div className="text-white">
                                {currentStep.status === 'running' ? (
                                  <div className="flex items-center gap-2">
                                    <Loader className="w-4 h-4 animate-spin" />
                                    <span>Analyzing your requirements and generating insights...</span>
                                  </div>
                                ) : currentStep.output ? (
                                  <div className="prose prose-invert max-w-none">
                                    <p>{currentStep.output}</p>
                                  </div>
                                ) : (
                                  <div className="text-gray-400">Waiting to start...</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedTool === 'code' && (
                      <div className="space-y-4">
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm">
                          <div className="flex items-center gap-2 mb-3 text-gray-400">
                            <Code className="w-4 h-4" />
                            <span>Code Generation</span>
                          </div>
                          {currentStep.status === 'running' ? (
                            <div className="flex items-center gap-2 text-blue-400">
                              <Loader className="w-4 h-4 animate-spin" />
                              <span>Generating code files...</span>
                            </div>
                          ) : currentStep.output ? (
                            <div className="text-green-400">
                              <div>✓ Generated files:</div>
                              <div className="mt-2 text-gray-300">
                                • components/Dashboard.tsx<br/>
                                • pages/api/auth.ts<br/>
                                • styles/globals.css<br/>
                                • utils/database.ts
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-400">Ready to generate code...</div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedTool === 'image' && (
                      <div className="space-y-4">
                        <div className="bg-gray-900/30 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3 text-gray-400">
                            <ImageIcon className="w-4 h-4" />
                            <span>Design Generation</span>
                          </div>
                          {currentStep.status === 'running' ? (
                            <div className="flex items-center gap-2 text-purple-400">
                              <Loader className="w-4 h-4 animate-spin" />
                              <span>Creating design assets...</span>
                            </div>
                          ) : currentStep.output ? (
                            <div className="text-purple-400">
                              <div>✓ Generated designs:</div>
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                <div className="bg-gray-800 rounded-lg p-4 text-center">
                                  <div className="w-full h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded mb-2"></div>
                                  <div className="text-xs text-gray-400">Logo Design</div>
                                </div>
                                <div className="bg-gray-800 rounded-lg p-4 text-center">
                                  <div className="w-full h-24 bg-gradient-to-br from-green-600 to-teal-600 rounded mb-2"></div>
                                  <div className="text-xs text-gray-400">Color Palette</div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-400">Ready to create designs...</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        {getToolIcon(selectedTool)}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {agentsManager.getToolName(selectedTool as any)} Output
                      </h3>
                      <p className="text-gray-400">
                        This tool will be used in upcoming steps. Switch to active tools to see current progress.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}






