'use client'

import { useState, useEffect } from 'react'
import { 
  Code2, 
  Play, 
  Download, 
  Copy,
  Settings,
  Sparkles,
  FileText,
  Terminal,
  Zap,
  Brain,
  Wand2,
  Rocket
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlobalHeader, BottomTabBar } from '@/components/ui'
import { CodeEmptyState } from '@/components/empty-states/CodeEmptyState'
import { CodeContextualHelp } from '@/components/help/ContextualHelp'
import { PromptEnhancer } from '@/components/prompt/PromptEnhancer'
import { FeatureLock } from '@/components/premium/FeatureLock'
import { UpgradeModal } from '@/components/premium/UpgradeModal'
import { Crown } from 'lucide-react'
import { AddToPortfolioButton } from '@/components/portfolio/AddToPortfolioButton'
import { useOnboarding } from '@/lib/hooks/useOnboarding'
import { usePremium } from '@/lib/hooks/usePremium'

const codeTemplates = [
  {
    id: 'react-component',
    title: 'React Component',
    description: 'Modern React functional component',
    language: 'tsx',
    icon: '⚛️',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
  },
  {
    id: 'api-endpoint',
    title: 'API Endpoint',
    description: 'RESTful API with Express.js',
    language: 'javascript',
    icon: '🚀',
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
  },
  {
    id: 'python-script',
    title: 'Python Script',
    description: 'Data processing with Python',
    language: 'python',
    icon: '🐍',
    gradient: 'bg-gradient-to-br from-yellow-500 to-orange-500',
  },
  {
    id: 'sql-query',
    title: 'SQL Query',
    description: 'Database operations',
    language: 'sql',
    icon: '🗄️',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
  },
]

const aiFeatures = [
  {
    id: 'code-generation',
    title: 'Code Generation',
    description: 'Generate code from natural language',
    icon: Brain,
    color: 'text-blue-500',
  },
  {
    id: 'code-review',
    title: 'Code Review',
    description: 'AI-powered code analysis',
    icon: FileText,
    color: 'text-green-500',
  },
  {
    id: 'debugging',
    title: 'Debug Assistant',
    description: 'Find and fix bugs automatically',
    icon: Zap,
    color: 'text-yellow-500',
  },
  {
    id: 'optimization',
    title: 'Code Optimization',
    description: 'Improve performance and readability',
    icon: Wand2,
    color: 'text-purple-500',
  },
]

export default function CodeStudioPage() {
  const [prompt, setPrompt] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState('')
  const [activeMode, setActiveMode] = useState<'help' | 'builder'>('help')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const { onboardingData } = useOnboarding()
  const { canPerformAction, incrementUsage } = usePremium()

  // Check for context from chat
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const fromChat = urlParams.get('from') === 'chat'
    const modeParam = urlParams.get('mode')
    
    if (fromChat) {
      const context = localStorage.getItem('code_studio_context')
      if (context) {
        try {
          const { userMessage } = JSON.parse(context)
          setPrompt(`Build an app: ${userMessage}`)
          setActiveMode('builder')
          
          // Clear the context
          localStorage.removeItem('code_studio_context')
        } catch (error) {
          console.error('Failed to parse chat context:', error)
        }
      }
    }
    
    if (modeParam === 'app-builder') {
      setActiveMode('builder')
    }
  }, [])

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'typescript', name: 'TypeScript', icon: '🔷' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'react', name: 'React', icon: '⚛️' },
    { id: 'nodejs', name: 'Node.js', icon: '🟢' },
    { id: 'sql', name: 'SQL', icon: '🗄️' },
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    // Check if user can perform this action
    if (!canPerformAction('codeProjects')) {
      setShowUpgradeModal(true)
      return
    }

    setIsGenerating(true)
    
    // Simulate code generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockCode = `// Generated ${selectedLanguage} code for: ${prompt}
function ${prompt.toLowerCase().replace(/\s+/g, '')}() {
  // AI-generated implementation
  console.log("Hello from Synexa AI Code Studio!");
  
  // TODO: Implement your logic here
  return "Generated code ready!";
}

// Example usage:
${prompt.toLowerCase().replace(/\s+/g, '')}();`

    setGeneratedCode(mockCode)
    
    // Increment usage
    incrementUsage('codeProjects')
    
    setIsGenerating(false)
  }

  const handleEnhancedPrompt = (enhanced: string) => {
    setPrompt(enhanced)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <GlobalHeader 
        title="Code Studio" 
        variant="blur"
        rightActions={
          <button className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        }
      />

      {/* Main Content */}
      <main className="px-4 pb-24 pt-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-premium">
            <Code2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            AI Code Studio
          </h1>
          <p className="text-muted-foreground">
            Generate, review, and optimize code with AI assistance
          </p>
        </div>

        {/* Mode Switch */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="p-1 bg-muted rounded-2xl">
              <div className="flex">
                <button
                  onClick={() => setActiveMode('help')}
                  className={cn(
                    "px-6 py-3 rounded-xl font-medium transition-all duration-200",
                    activeMode === 'help'
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Code Help
                  </div>
                </button>
                <button
                  onClick={() => setActiveMode('builder')}
                  className={cn(
                    "px-6 py-3 rounded-xl font-medium transition-all duration-200",
                    activeMode === 'builder'
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    App Builder
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Content */}
        {activeMode === 'help' ? (
          <>
            {/* Show empty state if no prompt */}
            {!prompt.trim() && !generatedCode && (
              <div className="mb-8">
                <CodeEmptyState 
                  onCreateFromPrompt={() => {}}
                />
              </div>
            )}

            {/* AI Features */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                AI Features
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {aiFeatures.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={feature.id}
                      className="p-4 rounded-xl bg-card border border-border/50 shadow-card hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={cn('h-5 w-5', feature.color)} />
                        <h3 className="font-medium text-foreground text-sm">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Show empty state if no prompt for app builder */}
            {!prompt.trim() && !generatedCode && (
              <div className="mb-8">
                <CodeEmptyState 
                  onCreateFromPrompt={() => {}}
                />
              </div>
            )}

            {/* App Builder Mode */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Build Your App
              </h2>
              
              {/* App Prompt */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 border border-purple-500/20 shadow-premium mb-6">
                <div className="mb-4">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    What do you want to build?
                  </label>
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., To-do app with login, dark theme, and real-time sync"
                      className={cn(
                        "w-full h-32 px-4 py-3 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm",
                        "placeholder:text-muted-foreground resize-none",
                        "focus:outline-none focus:border-primary/50 focus:shadow-premium",
                        "transition-all duration-200"
                      )}
                      disabled={isGenerating}
                    />
                    <div className="absolute bottom-3 right-3">
                      <Rocket className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className={cn(
                    "w-full py-4 rounded-2xl font-semibold transition-all duration-200",
                    "flex items-center justify-center gap-2",
                    prompt.trim() && !isGenerating
                      ? "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white shadow-premium hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating App...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Project
                    </>
                  )}
                </button>
              </div>

              {/* Preview Area Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Code Panel */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Project Files
                  </h3>
                  <div className="bg-slate-900 rounded-xl p-4 text-slate-300 text-sm font-mono">
                    <div className="text-slate-500 mb-2">// Your generated code will appear here</div>
                    <div className="text-blue-400">import</div> <span className="text-green-400">React</span> <div className="text-blue-400">from</div> <span className="text-orange-400">'react'</span>
                    <br /><br />
                    <div className="text-blue-400">function</div> <span className="text-yellow-400">App</span>() {'{'}
                    <br />
                    <span className="ml-4 text-blue-400">return</span> <span className="text-pink-400">&lt;div&gt;</span>Hello World<span className="text-pink-400">&lt;/div&gt;</span>
                    <br />
                    {'}'}
                  </div>
                </div>

                {/* Preview Panel */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Live Preview
                  </h3>
                  <div className="relative">
                    {/* Phone Frame */}
                    <div className="mx-auto w-64 h-96 bg-slate-900 rounded-3xl p-2 shadow-premium">
                      <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                        <div className="text-center text-slate-600">
                          <div className="w-16 h-16 bg-slate-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                            📱
                          </div>
                          <p className="text-sm">Your app preview</p>
                          <p className="text-xs text-slate-400">will appear here</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Version History - Premium Feature */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Version History
          </h2>
          
          <FeatureLock
            featureId="versionHistory"
          >
            {/* Mock version history content */}
            <div className="space-y-3">
              <div className="p-4 bg-card rounded-xl border border-border/50 shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">v1.2.0 - Initial Project</span>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                <p className="text-sm text-muted-foreground">Created basic to-do app structure</p>
              </div>
              
              <div className="p-4 bg-card rounded-xl border border-border/50 shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">v1.1.0 - Added Authentication</span>
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                </div>
                <p className="text-sm text-muted-foreground">Implemented user login and registration</p>
              </div>
              
              <div className="p-4 bg-card rounded-xl border border-border/50 shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">v1.0.0 - Project Created</span>
                  <span className="text-xs text-muted-foreground">3 days ago</span>
                </div>
                <p className="text-sm text-muted-foreground">Initial project setup</p>
              </div>
            </div>
          </FeatureLock>
        </div>

        {/* Code Generation */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Generate Code
          </h2>
          
          {/* Prompt Input */}
          <div className="mb-4">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Describe what you want to build
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Create a user authentication function with JWT tokens"
                className={cn(
                  "w-full h-24 px-4 py-3 rounded-2xl border border-border/50 bg-background",
                  "placeholder:text-muted-foreground resize-none",
                  "focus:outline-none focus:border-primary/50 focus:shadow-premium",
                  "transition-all duration-200"
                )}
                disabled={isGenerating}
              />
              <div className="absolute bottom-3 right-3">
                <Brain className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Prompt Enhancer */}
            <PromptEnhancer
              originalPrompt={prompt}
              onEnhancedPrompt={handleEnhancedPrompt}
              context="code"
              className="mt-3"
            />
          </div>

          {/* Language Selection */}
          <div className="mb-4">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Programming Language
            </label>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLanguage(lang.id)}
                  className={cn(
                    "p-3 rounded-xl border transition-all duration-200",
                    selectedLanguage === lang.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 bg-background hover:bg-muted/50 text-muted-foreground"
                  )}
                  disabled={isGenerating}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{lang.icon}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={cn(
              "w-full py-4 rounded-2xl font-semibold transition-all duration-200",
              "flex items-center justify-center gap-2",
              prompt.trim() && !isGenerating
                ? "bg-gradient-primary text-white shadow-premium hover:scale-[1.02] active:scale-[0.98]"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Code...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Code
              </>
            )}
          </button>
        </div>

        {/* Generated Code */}
        {generatedCode && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Generated Code
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyCode}
                  className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-card bg-slate-900">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-slate-400 ml-2">
                    {selectedLanguage}.{selectedLanguage === 'python' ? 'py' : 'js'}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-white transition-colors">
                  <Play className="h-4 w-4" />
                </button>
              </div>
              
              <pre className="p-4 text-sm text-slate-300 overflow-x-auto">
                <code>{generatedCode}</code>
              </pre>
            </div>

            {/* Add to Portfolio */}
            <div className="mt-6 flex items-center justify-center">
              <AddToPortfolioButton
                projectData={{
                  title: `${selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} Code Project`,
                  description: prompt,
                  type: 'code',
                  tools: ['chat', 'code-studio'],
                  agents: ['Code Assistant']
                }}
                variant="button"
                size="lg"
              />
            </div>
          </div>
        )}

        {/* Code Templates */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Quick Templates
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {codeTemplates.map((template) => (
              <button
                key={template.id}
                className="group p-4 rounded-xl bg-card border border-border/50 shadow-card hover:shadow-lg transition-all duration-200 hover:scale-[1.02] text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-premium",
                    template.gradient
                  )}>
                    {template.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">
                      {template.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                  
                  <div className="px-3 py-1 bg-muted rounded-lg">
                    <span className="text-xs font-medium text-muted-foreground">
                      {template.language}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />

      {/* Contextual Help */}
      <CodeContextualHelp />
      
      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger="usage-limit"
        feature="Code Projects"
      />
    </div>
  )
}
