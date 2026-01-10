'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/global-header'
import { BottomTabBar } from '@/components/ui/bottom-tab-bar'
import { agentsManager, AgentCategory, AgentTool, AgentSetupQuestion, AgentStep } from '@/lib/agents'
import { 
  Plus,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Crown,
  Save,
  Eye,
  Trash2,
  GripVertical,
  MessageCircle,
  Code,
  Image as ImageIcon,
  Settings,
  Zap,
  Target,
  Clock,
  AlertCircle
} from 'lucide-react'

export default function CreateAgentPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isCreating, setIsCreating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Agent form data
  const [agentData, setAgentData] = useState({
    name: '',
    description: '',
    category: 'build' as AgentCategory,
    icon: '🤖',
    estimatedTime: 10,
    isPremium: false,
    tags: [] as string[],
    tools: ['chat'] as AgentTool[],
    setupQuestions: [] as AgentSetupQuestion[],
    steps: [] as AgentStep[]
  })

  const [newTag, setNewTag] = useState('')
  const [newQuestion, setNewQuestion] = useState<Partial<AgentSetupQuestion>>({
    question: '',
    type: 'text',
    required: true
  })
  const [newStep, setNewStep] = useState<Partial<AgentStep>>({
    title: '',
    description: '',
    tool: 'chat',
    estimatedTime: 120
  })

  const categories: Array<{ key: AgentCategory; name: string; icon: string }> = [
    { key: 'build', name: 'Build', icon: '🏗️' },
    { key: 'design', name: 'Design', icon: '🎨' },
    { key: 'learn', name: 'Learn', icon: '📚' },
    { key: 'growth', name: 'Growth', icon: '📈' },
    { key: 'ops', name: 'DevOps', icon: '⚙️' }
  ]

  const tools: Array<{ key: AgentTool; name: string; icon: JSX.Element }> = [
    { key: 'chat', name: 'Chat', icon: <MessageCircle className="w-4 h-4" /> },
    { key: 'code', name: 'Code Studio', icon: <Code className="w-4 h-4" /> },
    { key: 'image', name: 'Image Studio', icon: <ImageIcon className="w-4 h-4" /> },
    { key: 'tools', name: 'Tools', icon: <Settings className="w-4 h-4" /> }
  ]

  const icons = ['🤖', '🚀', '🎨', '📚', '⚙️', '🔧', '💡', '🎯', '⭐', '🔥', '💎', '🌟']

  const steps = [
    { title: 'Basic Info', description: 'Name, description, and category' },
    { title: 'Configuration', description: 'Tools, settings, and preferences' },
    { title: 'Setup Questions', description: 'Questions to ask users before starting' },
    { title: 'Workflow Steps', description: 'Define the agent\'s workflow' },
    { title: 'Review & Create', description: 'Review and create your agent' }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !agentData.tags.includes(newTag.trim())) {
      setAgentData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setAgentData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleAddQuestion = () => {
    if (newQuestion.question?.trim()) {
      const question: AgentSetupQuestion = {
        id: `q_${Date.now()}`,
        question: newQuestion.question,
        type: newQuestion.type || 'text',
        required: newQuestion.required || false,
        options: newQuestion.options,
        placeholder: newQuestion.placeholder
      }
      
      setAgentData(prev => ({
        ...prev,
        setupQuestions: [...prev.setupQuestions, question]
      }))
      
      setNewQuestion({
        question: '',
        type: 'text',
        required: true
      })
    }
  }

  const handleRemoveQuestion = (index: number) => {
    setAgentData(prev => ({
      ...prev,
      setupQuestions: prev.setupQuestions.filter((_, i) => i !== index)
    }))
  }

  const handleAddStep = () => {
    if (newStep.title?.trim() && newStep.description?.trim()) {
      const step: AgentStep = {
        id: `step_${Date.now()}`,
        title: newStep.title,
        description: newStep.description,
        tool: newStep.tool || 'chat',
        status: 'pending',
        estimatedTime: newStep.estimatedTime || 120
      }
      
      setAgentData(prev => ({
        ...prev,
        steps: [...prev.steps, step]
      }))
      
      setNewStep({
        title: '',
        description: '',
        tool: 'chat',
        estimatedTime: 120
      })
    }
  }

  const handleRemoveStep = (index: number) => {
    setAgentData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }))
  }

  const handleCreate = async () => {
    setIsCreating(true)
    
    // Simulate creation process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In a real app, you'd save the agent to the backend
    console.log('Creating agent:', agentData)
    
    setIsCreating(false)
    router.push('/agents')
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return agentData.name.trim() && agentData.description.trim()
      case 1:
        return agentData.tools.length > 0
      case 2:
        return true // Setup questions are optional
      case 3:
        return agentData.steps.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  const totalEstimatedTime = agentData.steps.reduce((acc, step) => acc + step.estimatedTime, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader 
        title="Create Custom Agent" 
        showBack={true}
        backUrl="/agents"
      />

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Create Your Agent</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Step {currentStep + 1} of {steps.length}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  index === currentStep 
                    ? 'bg-blue-600 text-white'
                    : index < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {index < currentStep ? '✓' : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 transition-colors ${
                    index < currentStep ? 'bg-green-600' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">{steps[currentStep].title}</h2>
            <p className="text-gray-400">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
          {/* Step 0: Basic Info */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Agent Name *</label>
                <input
                  type="text"
                  value={agentData.name}
                  onChange={(e) => setAgentData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., SaaS MVP Builder"
                  className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Description *</label>
                <textarea
                  value={agentData.description}
                  onChange={(e) => setAgentData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what your agent does and what it helps users achieve..."
                  rows={3}
                  className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Category</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.key}
                      onClick={() => setAgentData(prev => ({ ...prev, category: category.key }))}
                      className={`flex items-center gap-2 p-3 rounded-xl font-medium transition-colors ${
                        agentData.category === category.key
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Icon</label>
                <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                  {icons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setAgentData(prev => ({ ...prev, icon }))}
                      className={`w-12 h-12 rounded-xl text-2xl transition-colors ${
                        agentData.icon === icon
                          ? 'bg-blue-600'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Configuration */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Tools Used *</label>
                <p className="text-sm text-gray-400 mb-4">Select which tools your agent will use</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {tools.map((tool) => (
                    <button
                      key={tool.key}
                      onClick={() => {
                        const isSelected = agentData.tools.includes(tool.key)
                        if (isSelected) {
                          setAgentData(prev => ({
                            ...prev,
                            tools: prev.tools.filter(t => t !== tool.key)
                          }))
                        } else {
                          setAgentData(prev => ({
                            ...prev,
                            tools: [...prev.tools, tool.key]
                          }))
                        }
                      }}
                      className={`flex items-center gap-2 p-3 rounded-xl font-medium transition-colors ${
                        agentData.tools.includes(tool.key)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {tool.icon}
                      <span>{tool.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Estimated Time (minutes)</label>
                <input
                  type="number"
                  value={agentData.estimatedTime}
                  onChange={(e) => setAgentData(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 10 }))}
                  min="1"
                  max="120"
                  className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Tags</label>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    className="flex-1 p-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {agentData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="premium"
                  checked={agentData.isPremium}
                  onChange={(e) => setAgentData(prev => ({ ...prev, isPremium: e.target.checked }))}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="premium" className="flex items-center gap-2 text-white">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  Make this a Premium agent
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Setup Questions */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Setup Questions</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Define questions to ask users before starting the agent (optional)
                </p>
              </div>

              {/* Add New Question */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                <h4 className="font-medium text-white mb-3">Add Question</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newQuestion.question || ''}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="What's your question?"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <div className="flex items-center gap-4">
                    <select
                      value={newQuestion.type || 'text'}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, type: e.target.value as any }))}
                      className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="text">Text Input</option>
                      <option value="select">Single Choice</option>
                      <option value="multiselect">Multiple Choice</option>
                      <option value="boolean">Yes/No</option>
                    </select>
                    
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={newQuestion.required || false}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, required: e.target.checked }))}
                        className="w-4 h-4 text-blue-600"
                      />
                      Required
                    </label>
                    
                    <button
                      onClick={handleAddQuestion}
                      disabled={!newQuestion.question?.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Questions List */}
              {agentData.setupQuestions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-white">Questions ({agentData.setupQuestions.length})</h4>
                  {agentData.setupQuestions.map((question, index) => (
                    <div key={question.id} className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-xl">
                      <div className="flex-1">
                        <div className="font-medium text-white">{question.question}</div>
                        <div className="text-sm text-gray-400">
                          {question.type} • {question.required ? 'Required' : 'Optional'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveQuestion(index)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Workflow Steps */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Workflow Steps</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Define the steps your agent will execute
                </p>
              </div>

              {/* Add New Step */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                <h4 className="font-medium text-white mb-3">Add Step</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newStep.title || ''}
                    onChange={(e) => setNewStep(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Step title..."
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <textarea
                    value={newStep.description || ''}
                    onChange={(e) => setNewStep(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Step description..."
                    rows={2}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <div className="flex items-center gap-4">
                    <select
                      value={newStep.tool || 'chat'}
                      onChange={(e) => setNewStep(prev => ({ ...prev, tool: e.target.value as AgentTool }))}
                      className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {agentData.tools.map((tool) => (
                        <option key={tool} value={tool}>
                          {agentsManager.getToolName(tool)}
                        </option>
                      ))}
                    </select>
                    
                    <input
                      type="number"
                      value={newStep.estimatedTime || 120}
                      onChange={(e) => setNewStep(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 120 }))}
                      placeholder="Time (seconds)"
                      min="30"
                      max="3600"
                      className="w-32 p-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <button
                      onClick={handleAddStep}
                      disabled={!newStep.title?.trim() || !newStep.description?.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
                    >
                      Add Step
                    </button>
                  </div>
                </div>
              </div>

              {/* Steps List */}
              {agentData.steps.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-white">Steps ({agentData.steps.length})</h4>
                  {agentData.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3 p-4 bg-gray-900/30 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{step.title}</div>
                        <div className="text-sm text-gray-400 mb-1">{step.description}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{agentsManager.getToolName(step.tool)}</span>
                          <span>•</span>
                          <span>{agentsManager.formatDuration(step.estimatedTime)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveStep(index)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="text-center p-3 bg-blue-600/10 border border-blue-500/30 rounded-xl">
                    <div className="text-blue-400 font-medium">
                      Total estimated time: {agentsManager.formatDuration(totalEstimatedTime)}
                    </div>
                  </div>
                </div>
              )}

              {agentData.steps.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Add at least one step to define your agent's workflow</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review & Create */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Review Your Agent</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Review your agent configuration before creating
                </p>
              </div>

              {/* Agent Preview */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-3xl">
                    {agentData.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold text-white">{agentData.name}</h4>
                      {agentData.isPremium && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-600/20 border border-yellow-500/30 rounded-lg text-xs text-yellow-400">
                          <Crown className="w-3 h-3" />
                          <span>Premium</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 mb-4">{agentData.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-800/30 rounded-xl">
                        <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <div className="text-sm font-bold text-white">{agentsManager.getEstimatedTimeText(agentData.estimatedTime)}</div>
                        <div className="text-xs text-gray-400">Duration</div>
                      </div>
                      <div className="text-center p-3 bg-gray-800/30 rounded-xl">
                        <Target className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <div className="text-sm font-bold text-white">{agentData.steps.length}</div>
                        <div className="text-xs text-gray-400">Steps</div>
                      </div>
                      <div className="text-center p-3 bg-gray-800/30 rounded-xl">
                        <Settings className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                        <div className="text-sm font-bold text-white">{agentData.tools.length}</div>
                        <div className="text-xs text-gray-400">Tools</div>
                      </div>
                      <div className="text-center p-3 bg-gray-800/30 rounded-xl">
                        <Sparkles className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                        <div className="text-sm font-bold text-white">{agentData.setupQuestions.length}</div>
                        <div className="text-xs text-gray-400">Questions</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {agentData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Creation Warning */}
              <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-yellow-400 font-medium text-sm mb-1">Ready to Create</p>
                    <p className="text-yellow-300/80 text-sm">
                      Your custom agent will be created and available in your agent library. 
                      You can edit or delete it later from your agent history.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div>
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-primary hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCreate}
                disabled={!canProceed() || isCreating}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Create Agent
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}








