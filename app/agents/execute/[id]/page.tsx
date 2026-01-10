'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Copy,
  Download,
  Share2
} from 'lucide-react'
import { GlobalHeader } from '@/components/ui/GlobalHeader'
import { BottomTabBar } from '@/components/ui/BottomTabBar'
import { LoadingSpinner } from '@/components/ui/LoadingStates'
import { cn } from '@/lib/utils'
import { AGENTS, AgentAPI, AgentConfig, AgentExecution } from '@/lib/api/agents'
import { useApp } from '@/lib/context/AppContext'

export default function AgentExecutePage() {
  const router = useRouter()
  const params = useParams()
  const { actions } = useApp()
  
  const agentId = params.id as string
  const [agent, setAgent] = useState<AgentConfig | null>(null)
  const [execution, setExecution] = useState<AgentExecution | null>(null)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [isExecuting, setIsExecuting] = useState(false)

  useEffect(() => {
    const foundAgent = AGENTS.find(a => a.id === agentId)
    if (foundAgent) {
      setAgent(foundAgent)
    } else {
      router.push('/agents')
    }
  }, [agentId, router])

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleNext = () => {
    if (!agent) return
    
    const currentQuestion = agent.questions[currentStep]
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      alert('Please answer this question before continuing.')
      return
    }

    if (currentStep < agent.questions.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      startExecution()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const startExecution = async () => {
    if (!agent) return

    setIsExecuting(true)
    
    try {
      const newExecution = await AgentAPI.startExecution(agent.id, answers)
      setExecution(newExecution)
      
      // Track usage
      actions.incrementUsage('agents')
      
      // Poll for completion
      const pollInterval = setInterval(async () => {
        const updatedExecution = await AgentAPI.getExecution(newExecution.id)
        if (updatedExecution) {
          setExecution(updatedExecution)
          if (updatedExecution.status === 'completed' || updatedExecution.status === 'error') {
            clearInterval(pollInterval)
            setIsExecuting(false)
          }
        }
      }, 1000)
      
    } catch (error) {
      console.error('Failed to start agent execution:', error)
      setIsExecuting(false)
    }
  }

  const copyOutput = () => {
    if (execution?.output) {
      navigator.clipboard.writeText(execution.output)
    }
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show execution results
  if (execution && execution.status === 'completed') {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader 
          title={agent.name}
          showBack
          onBackPress={() => router.push('/agents')}
        />
        
        <div className="max-w-4xl mx-auto p-6 pb-24">
          {/* Success Header */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h2 className="text-xl font-semibold text-green-900">
                  Agent Completed Successfully!
                </h2>
                <p className="text-green-700 mt-1">
                  {agent.name} has finished processing your request.
                </p>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Agent Output</h3>
              <div className="flex gap-2">
                <button
                  onClick={copyOutput}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-foreground font-mono text-sm leading-relaxed">
                  {execution.output}
                </pre>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => router.push('/agents')}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
            >
              Run Another Agent
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors"
            >
              Run Again
            </button>
          </div>
        </div>

        <BottomTabBar />
      </div>
    )
  }

  // Show execution in progress
  if (execution && execution.status === 'running') {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader 
          title={agent.name}
          showBack
          onBackPress={() => router.push('/agents')}
        />
        
        <div className="max-w-2xl mx-auto p-6 pb-24">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center">
              <span className="text-2xl">{agent.icon}</span>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Agent is Working...
              </h2>
              <p className="text-muted-foreground">
                {agent.name} is processing your request. This usually takes {agent.estimatedTime}.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner />
              <span className="text-sm text-muted-foreground">Processing...</span>
            </div>

            {/* Progress Steps */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Progress</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Setup completed</span>
                </div>
                <div className="flex items-center gap-3">
                  <LoadingSpinner size="sm" />
                  <span className="text-sm">Analyzing your requirements...</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Generating output...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BottomTabBar />
      </div>
    )
  }

  // Show setup questions
  const currentQuestion = agent.questions[currentStep]
  const progress = ((currentStep + 1) / agent.questions.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader 
        title={agent.name}
        showBack
        onBackPress={() => router.push('/agents')}
      />
      
      <div className="max-w-2xl mx-auto p-6 pb-24">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {agent.questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {currentQuestion.question}
          </h2>

          {currentQuestion.type === 'text' && (
            <textarea
              value={answers[currentQuestion.id] as string || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
            />
          )}

          {currentQuestion.type === 'select' && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerChange(currentQuestion.id, option)}
                  className={cn(
                    'w-full p-4 text-left border rounded-xl transition-all',
                    answers[currentQuestion.id] === option
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-muted'
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'multiselect' && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option) => {
                const selectedOptions = (answers[currentQuestion.id] as string[]) || []
                const isSelected = selectedOptions.includes(option)
                
                return (
                  <button
                    key={option}
                    onClick={() => {
                      const current = selectedOptions
                      const updated = isSelected
                        ? current.filter(o => o !== option)
                        : [...current, option]
                      handleAnswerChange(currentQuestion.id, updated)
                    }}
                    className={cn(
                      'w-full p-4 text-left border rounded-xl transition-all',
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50 hover:bg-muted'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-5 h-5 border-2 rounded',
                        isSelected ? 'bg-primary border-primary' : 'border-border'
                      )}>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      {option}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              className="px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors"
            >
              Previous
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={currentQuestion.required && !answers[currentQuestion.id]}
            className={cn(
              'flex-1 px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2',
              currentQuestion.required && !answers[currentQuestion.id]
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
          >
            {currentStep === agent.questions.length - 1 ? (
              <>
                <Play className="w-4 h-4" />
                Start Agent
              </>
            ) : (
              'Next'
            )}
          </button>
        </div>
      </div>

      <BottomTabBar />
    </div>
  )
}





