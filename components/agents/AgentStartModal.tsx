'use client'

import { useState, useEffect } from 'react'
import { X, ArrowRight, ArrowLeft, Sparkles, Clock, Target, Crown } from 'lucide-react'
import { WorkflowAgent, AgentSetupQuestion, agentsManager } from '@/lib/agents'

interface AgentStartModalProps {
  isOpen: boolean
  onClose: () => void
  agent: WorkflowAgent | null
  onStart: (setupAnswers: Record<string, any>) => void
}

export function AgentStartModal({ isOpen, onClose, agent, onStart }: AgentStartModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    if (isOpen && agent) {
      // Reset state when modal opens
      setCurrentStep(0)
      setAnswers({})
      setIsStarting(false)
      
      // Set default values
      const defaultAnswers: Record<string, any> = {}
      agent.setupQuestions.forEach(question => {
        if (question.defaultValue !== undefined) {
          defaultAnswers[question.id] = question.defaultValue
        }
      })
      setAnswers(defaultAnswers)
    }
  }, [isOpen, agent])

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleNext = () => {
    if (!agent) return
    
    if (currentStep < agent.setupQuestions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleStart()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStart = async () => {
    if (!agent) return
    
    setIsStarting(true)
    
    // Simulate setup delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onStart(answers)
    setIsStarting(false)
  }

  const canProceed = () => {
    if (!agent) return false
    
    const currentQuestion = agent.setupQuestions[currentStep]
    if (!currentQuestion) return false
    
    const answer = answers[currentQuestion.id]
    
    if (currentQuestion.required) {
      if (currentQuestion.type === 'multiselect') {
        return Array.isArray(answer) && answer.length > 0
      }
      return answer !== undefined && answer !== null && answer !== ''
    }
    
    return true
  }

  const renderQuestion = (question: AgentSetupQuestion) => {
    const answer = answers[question.id]

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={answer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )

      case 'select':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label
                key={option}
                className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                  answer === option
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answer === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-white">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'multiselect':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => {
              const isSelected = Array.isArray(answer) && answer.includes(option)
              return (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-blue-600/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const currentAnswers = Array.isArray(answer) ? answer : []
                      if (e.target.checked) {
                        handleAnswerChange(question.id, [...currentAnswers, option])
                      } else {
                        handleAnswerChange(question.id, currentAnswers.filter(a => a !== option))
                      }
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-white">{option}</span>
                </label>
              )
            })}
          </div>
        )

      case 'boolean':
        return (
          <div className="flex items-center gap-4">
            <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
              answer === true ? 'border-blue-500 bg-blue-600/10' : 'border-gray-700 hover:border-gray-600'
            }`}>
              <input
                type="radio"
                name={question.id}
                checked={answer === true}
                onChange={() => handleAnswerChange(question.id, true)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-white">Yes</span>
            </label>
            <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
              answer === false ? 'border-blue-500 bg-blue-600/10' : 'border-gray-700 hover:border-gray-600'
            }`}>
              <input
                type="radio"
                name={question.id}
                checked={answer === false}
                onChange={() => handleAnswerChange(question.id, false)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-white">No</span>
            </label>
          </div>
        )

      default:
        return null
    }
  }

  if (!isOpen || !agent) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                {agent.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  {agent.name}
                  {agent.isPremium && <Crown className="w-4 h-4 text-yellow-400" />}
                </h2>
                <p className="text-muted-foreground text-sm">Setup your workflow agent</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Progress Indicator */}
          {agent.setupQuestions.length > 1 && (
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-foreground">
                  Step {currentStep + 1} of {agent.setupQuestions.length}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / agent.setupQuestions.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Agent Info */}
            <div className="bg-muted/50 border border-border rounded-xl p-4 mb-6">
              <p className="text-muted-foreground text-sm mb-3">{agent.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>~{agentsManager.getEstimatedTimeText(agent.estimatedTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  <span>{agent.successRate}% success rate</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{agent.steps.length} steps</span>
                </div>
              </div>
            </div>

            {/* Current Question */}
            {agent.setupQuestions.length > 0 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {agent.setupQuestions[currentStep].question}
                    {agent.setupQuestions[currentStep].required && (
                      <span className="text-red-400 ml-1">*</span>
                    )}
                  </h3>
                  {agent.setupQuestions[currentStep].type === 'multiselect' && (
                    <p className="text-sm text-muted-foreground mb-4">
                      Select all that apply
                    </p>
                  )}
                </div>
                
                {renderQuestion(agent.setupQuestions[currentStep])}
              </div>
            )}

            {/* Smart Suggestions */}
            {currentStep === 0 && (
              <div className="mt-6 p-4 bg-blue-600/10 border border-blue-500/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-medium text-sm mb-1">Smart Suggestion</p>
                    <p className="text-blue-300/80 text-sm">
                      Based on your profile, we've pre-filled some answers. You can modify them as needed.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border">
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleNext}
                disabled={!canProceed() || isStarting}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-primary hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
              >
                {isStarting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Starting...
                  </>
                ) : currentStep < agent.setupQuestions.length - 1 ? (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Start Agent
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}






