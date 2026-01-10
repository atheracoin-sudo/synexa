'use client'

// Advanced AI Agents (Workflow-Based) Data Management
export type AgentCategory = 'build' | 'design' | 'learn' | 'growth' | 'ops'
export type AgentTool = 'chat' | 'code' | 'image' | 'tools'
export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'paused'
export type ExecutionStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed'

export interface AgentStep {
  id: string
  title: string
  description: string
  tool: AgentTool
  status: StepStatus
  estimatedTime: number // in seconds
  output?: any
  error?: string
}

export interface WorkflowAgent {
  id: string
  name: string
  description: string
  category: AgentCategory
  estimatedTime: number // in minutes
  tools: AgentTool[]
  isPremium: boolean
  icon: string
  steps: AgentStep[]
  setupQuestions: AgentSetupQuestion[]
  tags: string[]
  popularity: number
  successRate: number
}

export interface AgentSetupQuestion {
  id: string
  question: string
  type: 'text' | 'select' | 'multiselect' | 'boolean'
  options?: string[]
  defaultValue?: any
  required: boolean
  placeholder?: string
}

export interface AgentExecution {
  id: string
  agentId: string
  userId: string
  status: ExecutionStatus
  currentStepIndex: number
  setupAnswers: Record<string, any>
  startedAt: string
  completedAt?: string
  outputs: Record<string, any>
  error?: string
}

export interface AgentHistory {
  id: string
  agentId: string
  userId: string
  executedAt: string
  status: ExecutionStatus
  outputs: Record<string, any>
  duration: number // in seconds
}

class AgentsManager {
  private agents: Map<string, WorkflowAgent> = new Map()
  private executions: Map<string, AgentExecution> = new Map()
  private history: AgentHistory[] = []

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    // Mock workflow agents
    const mockAgents: WorkflowAgent[] = [
      // BUILD CATEGORY
      {
        id: 'saas-mvp-builder',
        name: 'SaaS MVP Builder',
        description: 'Build a complete SaaS MVP with authentication, dashboard, and payments',
        category: 'build',
        estimatedTime: 15,
        tools: ['chat', 'code'],
        isPremium: true,
        icon: '🚀',
        tags: ['SaaS', 'MVP', 'Full-stack', 'Authentication'],
        popularity: 95,
        successRate: 88,
        setupQuestions: [
          {
            id: 'app_name',
            question: 'What\'s your SaaS app name?',
            type: 'text',
            required: true,
            placeholder: 'e.g., TaskMaster Pro'
          },
          {
            id: 'target_users',
            question: 'Who are your target users?',
            type: 'select',
            options: ['Small businesses', 'Freelancers', 'Enterprise teams', 'Developers', 'Creators'],
            required: true
          },
          {
            id: 'core_features',
            question: 'Select core features (max 3)',
            type: 'multiselect',
            options: ['User management', 'Dashboard', 'Analytics', 'Payments', 'API', 'File upload', 'Notifications'],
            required: true
          }
        ],
        steps: [
          {
            id: 'requirements',
            title: 'Requirements Analysis',
            description: 'Analyzing your SaaS requirements and target market',
            tool: 'chat',
            status: 'pending',
            estimatedTime: 120
          },
          {
            id: 'architecture',
            title: 'System Architecture',
            description: 'Designing the technical architecture and database schema',
            tool: 'chat',
            status: 'pending',
            estimatedTime: 180
          },
          {
            id: 'auth_system',
            title: 'Authentication System',
            description: 'Building user registration, login, and session management',
            tool: 'code',
            status: 'pending',
            estimatedTime: 300
          },
          {
            id: 'dashboard',
            title: 'Admin Dashboard',
            description: 'Creating the main dashboard with navigation and layout',
            tool: 'code',
            status: 'pending',
            estimatedTime: 240
          },
          {
            id: 'core_features',
            title: 'Core Features',
            description: 'Implementing the selected core features',
            tool: 'code',
            status: 'pending',
            estimatedTime: 360
          },
          {
            id: 'testing',
            title: 'Testing & Deployment',
            description: 'Setting up tests and deployment configuration',
            tool: 'code',
            status: 'pending',
            estimatedTime: 180
          }
        ]
      },
      {
        id: 'landing-page-builder',
        name: 'Landing Page Builder',
        description: 'Create a high-converting landing page with modern design',
        category: 'build',
        estimatedTime: 8,
        tools: ['chat', 'code', 'image'],
        isPremium: false,
        icon: '📄',
        tags: ['Landing Page', 'Marketing', 'Conversion', 'Responsive'],
        popularity: 87,
        successRate: 92,
        setupQuestions: [
          {
            id: 'business_name',
            question: 'What\'s your business/product name?',
            type: 'text',
            required: true,
            placeholder: 'e.g., Acme Solutions'
          },
          {
            id: 'industry',
            question: 'What industry are you in?',
            type: 'select',
            options: ['Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Consulting', 'Other'],
            required: true
          },
          {
            id: 'goal',
            question: 'Primary goal of your landing page?',
            type: 'select',
            options: ['Lead generation', 'Product sales', 'App downloads', 'Newsletter signup', 'Demo requests'],
            required: true
          }
        ],
        steps: [
          {
            id: 'strategy',
            title: 'Strategy & Messaging',
            description: 'Defining value proposition and key messages',
            tool: 'chat',
            status: 'pending',
            estimatedTime: 120
          },
          {
            id: 'wireframe',
            title: 'Page Structure',
            description: 'Creating wireframe and content structure',
            tool: 'chat',
            status: 'pending',
            estimatedTime: 90
          },
          {
            id: 'design',
            title: 'Visual Design',
            description: 'Designing hero section, layout, and visual elements',
            tool: 'image',
            status: 'pending',
            estimatedTime: 180
          },
          {
            id: 'development',
            title: 'Code Implementation',
            description: 'Building responsive HTML/CSS/JS landing page',
            tool: 'code',
            status: 'pending',
            estimatedTime: 240
          },
          {
            id: 'optimization',
            title: 'Conversion Optimization',
            description: 'Adding analytics, forms, and conversion tracking',
            tool: 'code',
            status: 'pending',
            estimatedTime: 120
          }
        ]
      },
      // DESIGN CATEGORY
      {
        id: 'brand-kit-designer',
        name: 'Brand Kit Designer',
        description: 'Create a complete brand identity with logo, colors, and guidelines',
        category: 'design',
        estimatedTime: 12,
        tools: ['chat', 'image'],
        isPremium: true,
        icon: '🎨',
        tags: ['Branding', 'Logo', 'Identity', 'Guidelines'],
        popularity: 78,
        successRate: 85,
        setupQuestions: [
          {
            id: 'brand_name',
            question: 'What\'s your brand name?',
            type: 'text',
            required: true,
            placeholder: 'e.g., Stellar Designs'
          },
          {
            id: 'brand_personality',
            question: 'How would you describe your brand personality?',
            type: 'multiselect',
            options: ['Professional', 'Creative', 'Friendly', 'Bold', 'Minimalist', 'Playful', 'Trustworthy', 'Innovative'],
            required: true
          },
          {
            id: 'target_audience',
            question: 'Who is your target audience?',
            type: 'text',
            required: true,
            placeholder: 'e.g., Young professionals aged 25-35'
          }
        ],
        steps: [
          {
            id: 'research',
            title: 'Brand Research',
            description: 'Analyzing brand positioning and competitive landscape',
            tool: 'chat',
            status: 'pending',
            estimatedTime: 180
          },
          {
            id: 'logo_concepts',
            title: 'Logo Concepts',
            description: 'Creating multiple logo concepts and variations',
            tool: 'image',
            status: 'pending',
            estimatedTime: 300
          },
          {
            id: 'color_palette',
            title: 'Color Palette',
            description: 'Developing primary and secondary color schemes',
            tool: 'image',
            status: 'pending',
            estimatedTime: 120
          },
          {
            id: 'typography',
            title: 'Typography System',
            description: 'Selecting and pairing fonts for different use cases',
            tool: 'image',
            status: 'pending',
            estimatedTime: 90
          },
          {
            id: 'guidelines',
            title: 'Brand Guidelines',
            description: 'Creating comprehensive brand usage guidelines',
            tool: 'chat',
            status: 'pending',
            estimatedTime: 150
          }
        ]
      },
      // LEARN CATEGORY
      {
        id: 'code-mentor',
        name: 'Code Learning Path',
        description: 'Personalized coding curriculum with hands-on projects',
        category: 'learn',
        estimatedTime: 20,
        tools: ['chat', 'code'],
        isPremium: false,
        icon: '📚',
        tags: ['Learning', 'Coding', 'Tutorial', 'Practice'],
        popularity: 82,
        successRate: 90,
        setupQuestions: [
          {
            id: 'experience_level',
            question: 'What\'s your current coding experience?',
            type: 'select',
            options: ['Complete beginner', 'Some basics', 'Intermediate', 'Advanced'],
            required: true
          },
          {
            id: 'language',
            question: 'Which language do you want to learn?',
            type: 'select',
            options: ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Go'],
            required: true
          },
          {
            id: 'goal',
            question: 'What\'s your learning goal?',
            type: 'select',
            options: ['Build web apps', 'Data analysis', 'Mobile apps', 'APIs', 'Career change'],
            required: true
          }
        ],
        steps: [
          {
            id: 'assessment',
            title: 'Skill Assessment',
            description: 'Evaluating current knowledge and identifying gaps',
            tool: 'chat',
            status: 'pending',
            estimatedTime: 300
          },
          {
            id: 'curriculum',
            title: 'Learning Path',
            description: 'Creating personalized curriculum and milestones',
            tool: 'chat',
            status: 'pending',
            estimatedTime: 180
          },
          {
            id: 'fundamentals',
            title: 'Core Concepts',
            description: 'Teaching fundamental concepts with examples',
            tool: 'code',
            status: 'pending',
            estimatedTime: 600
          },
          {
            id: 'practice_project',
            title: 'Practice Project',
            description: 'Building a real project to apply learned concepts',
            tool: 'code',
            status: 'pending',
            estimatedTime: 480
          },
          {
            id: 'review',
            title: 'Code Review & Next Steps',
            description: 'Reviewing project and planning advanced topics',
            tool: 'chat',
            status: 'pending',
            estimatedTime: 240
          }
        ]
      },
      // GROWTH CATEGORY
      {
        id: 'launch-checklist',
        name: 'Product Launch Checklist',
        description: 'Complete pre-launch checklist and marketing strategy',
        category: 'growth',
        estimatedTime: 10,
        tools: ['chat'],
        isPremium: false,
        icon: '🎯',
        tags: ['Launch', 'Marketing', 'Strategy', 'Checklist'],
        popularity: 73,
        successRate: 94,
        setupQuestions: [
          {
            id: 'product_type',
            question: 'What type of product are you launching?',
            type: 'select',
            options: ['Web app', 'Mobile app', 'SaaS', 'E-commerce', 'Course', 'Physical product'],
            required: true
          },
          {
            id: 'launch_timeline',
            question: 'When do you plan to launch?',
            type: 'select',
            options: ['This week', 'This month', 'Next month', 'In 2-3 months', 'Not sure yet'],
            required: true
          },
          {
            id: 'budget',
            question: 'What\'s your marketing budget?',
            type: 'select',
            options: ['$0-500', '$500-2000', '$2000-5000', '$5000+', 'Not decided'],
            required: false
          }
        ],
        steps: [
          {
            id: 'pre_launch_audit',
            title: 'Pre-Launch Audit',
            description: 'Reviewing product readiness and identifying gaps',
            tool: 'chat',
            status: 'pending',
            estimatedTime: 180
          },
          {
            id: 'marketing_strategy',
            title: 'Marketing Strategy',
            description: 'Developing launch marketing plan and channels',
            tool: 'chat',
            status: 'pending',
            estimatedTime: 240
          },
          {
            id: 'content_plan',
            title: 'Content & Messaging',
            description: 'Creating launch content and key messages',
            tool: 'chat',
            status: 'pending',
            estimatedTime: 180
          },
          {
            id: 'checklist',
            title: 'Launch Checklist',
            description: 'Generating comprehensive launch checklist',
            tool: 'chat',
            status: 'pending',
            estimatedTime: 120
          }
        ]
      },
      // OPS CATEGORY
      {
        id: 'app-debugger',
        name: 'App Debugger & Optimizer',
        description: 'Analyze, debug, and optimize your existing application',
        category: 'ops',
        estimatedTime: 12,
        tools: ['chat', 'code'],
        isPremium: true,
        icon: '🔧',
        tags: ['Debugging', 'Optimization', 'Performance', 'Refactoring'],
        popularity: 69,
        successRate: 81,
        setupQuestions: [
          {
            id: 'app_type',
            question: 'What type of application needs debugging?',
            type: 'select',
            options: ['Web app', 'Mobile app', 'API', 'Desktop app', 'Script'],
            required: true
          },
          {
            id: 'issues',
            question: 'What issues are you experiencing?',
            type: 'multiselect',
            options: ['Performance problems', 'Bugs/errors', 'Security concerns', 'Code quality', 'Scalability'],
            required: true
          },
          {
            id: 'tech_stack',
            question: 'What\'s your tech stack?',
            type: 'text',
            required: true,
            placeholder: 'e.g., React, Node.js, MongoDB'
          }
        ],
        steps: [
          {
            id: 'analysis',
            title: 'Code Analysis',
            description: 'Analyzing codebase for issues and bottlenecks',
            tool: 'chat',
            status: 'pending',
            estimatedTime: 240
          },
          {
            id: 'debugging',
            title: 'Bug Identification',
            description: 'Identifying and categorizing bugs and errors',
            tool: 'code',
            status: 'pending',
            estimatedTime: 300
          },
          {
            id: 'fixes',
            title: 'Bug Fixes',
            description: 'Implementing fixes for identified issues',
            tool: 'code',
            status: 'pending',
            estimatedTime: 360
          },
          {
            id: 'optimization',
            title: 'Performance Optimization',
            description: 'Optimizing code for better performance',
            tool: 'code',
            status: 'pending',
            estimatedTime: 240
          },
          {
            id: 'recommendations',
            title: 'Recommendations',
            description: 'Providing long-term improvement recommendations',
            tool: 'chat',
            status: 'pending',
            estimatedTime: 120
          }
        ]
      }
    ]

    // Initialize agents
    mockAgents.forEach(agent => {
      this.agents.set(agent.id, agent)
    })

    // Mock execution history
    const mockHistory: AgentHistory[] = [
      {
        id: 'hist_1',
        agentId: 'landing-page-builder',
        userId: 'user_1',
        executedAt: '2024-01-08T10:30:00Z',
        status: 'completed',
        outputs: {
          landing_page_url: 'https://example.com/landing',
          conversion_rate: '12.5%'
        },
        duration: 480
      },
      {
        id: 'hist_2',
        agentId: 'code-mentor',
        userId: 'user_1',
        executedAt: '2024-01-05T14:15:00Z',
        status: 'completed',
        outputs: {
          completed_lessons: 8,
          project_url: 'https://github.com/user/learning-project'
        },
        duration: 1200
      }
    ]

    this.history = mockHistory
  }

  // Agent Management
  getAllAgents(): WorkflowAgent[] {
    return Array.from(this.agents.values())
  }

  getAgentsByCategory(category: AgentCategory): WorkflowAgent[] {
    return Array.from(this.agents.values())
      .filter(agent => agent.category === category)
      .sort((a, b) => b.popularity - a.popularity)
  }

  getAgent(agentId: string): WorkflowAgent | null {
    return this.agents.get(agentId) || null
  }

  getFeaturedAgents(): WorkflowAgent[] {
    return Array.from(this.agents.values())
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 6)
  }

  getPopularAgents(): WorkflowAgent[] {
    return Array.from(this.agents.values())
      .filter(agent => !agent.isPremium)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 4)
  }

  getPremiumAgents(): WorkflowAgent[] {
    return Array.from(this.agents.values())
      .filter(agent => agent.isPremium)
      .sort((a, b) => b.popularity - a.popularity)
  }

  searchAgents(query: string): WorkflowAgent[] {
    const lowercaseQuery = query.toLowerCase()
    return Array.from(this.agents.values())
      .filter(agent => 
        agent.name.toLowerCase().includes(lowercaseQuery) ||
        agent.description.toLowerCase().includes(lowercaseQuery) ||
        agent.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
      .sort((a, b) => b.popularity - a.popularity)
  }

  // Execution Management
  startExecution(agentId: string, userId: string, setupAnswers: Record<string, any>): string {
    const agent = this.getAgent(agentId)
    if (!agent) throw new Error('Agent not found')

    const executionId = `exec_${Date.now()}`
    const execution: AgentExecution = {
      id: executionId,
      agentId,
      userId,
      status: 'running',
      currentStepIndex: 0,
      setupAnswers,
      startedAt: new Date().toISOString(),
      outputs: {}
    }

    this.executions.set(executionId, execution)
    return executionId
  }

  getExecution(executionId: string): AgentExecution | null {
    return this.executions.get(executionId) || null
  }

  updateExecutionStep(executionId: string, stepIndex: number, status: StepStatus, output?: any, error?: string): boolean {
    const execution = this.executions.get(executionId)
    if (!execution) return false

    const agent = this.getAgent(execution.agentId)
    if (!agent || stepIndex >= agent.steps.length) return false

    // Update step status
    agent.steps[stepIndex].status = status
    if (output) agent.steps[stepIndex].output = output
    if (error) agent.steps[stepIndex].error = error

    // Update execution
    execution.currentStepIndex = stepIndex
    if (status === 'completed' && stepIndex === agent.steps.length - 1) {
      execution.status = 'completed'
      execution.completedAt = new Date().toISOString()
      this.addToHistory(execution)
    } else if (status === 'failed') {
      execution.status = 'failed'
      execution.error = error
    }

    this.executions.set(executionId, execution)
    return true
  }

  pauseExecution(executionId: string): boolean {
    const execution = this.executions.get(executionId)
    if (!execution || execution.status !== 'running') return false

    execution.status = 'paused'
    this.executions.set(executionId, execution)
    return true
  }

  resumeExecution(executionId: string): boolean {
    const execution = this.executions.get(executionId)
    if (!execution || execution.status !== 'paused') return false

    execution.status = 'running'
    this.executions.set(executionId, execution)
    return true
  }

  stopExecution(executionId: string): boolean {
    const execution = this.executions.get(executionId)
    if (!execution) return false

    execution.status = 'failed'
    execution.error = 'Stopped by user'
    execution.completedAt = new Date().toISOString()
    this.executions.set(executionId, execution)
    return true
  }

  // History Management
  private addToHistory(execution: AgentExecution): void {
    const duration = execution.completedAt 
      ? Math.floor((new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000)
      : 0

    const historyItem: AgentHistory = {
      id: `hist_${Date.now()}`,
      agentId: execution.agentId,
      userId: execution.userId,
      executedAt: execution.startedAt,
      status: execution.status,
      outputs: execution.outputs,
      duration
    }

    this.history.unshift(historyItem)
  }

  getUserHistory(userId: string): AgentHistory[] {
    return this.history
      .filter(item => item.userId === userId)
      .sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime())
  }

  // Premium Checks
  canUseAgent(userId: string, agentId: string): { canUse: boolean; reason?: string } {
    const agent = this.getAgent(agentId)
    if (!agent) return { canUse: false, reason: 'Agent not found' }

    // Mock premium check
    const isPremiumUser = false // This would come from user context
    
    if (agent.isPremium && !isPremiumUser) {
      return { 
        canUse: false, 
        reason: 'This agent requires Premium. Upgrade to access advanced workflow agents.' 
      }
    }

    return { canUse: true }
  }

  // Utility Functions
  getCategoryIcon(category: AgentCategory): string {
    const icons = {
      build: '🏗️',
      design: '🎨',
      learn: '📚',
      growth: '📈',
      ops: '⚙️'
    }
    return icons[category] || '🤖'
  }

  getCategoryName(category: AgentCategory): string {
    const names = {
      build: 'Build',
      design: 'Design',
      learn: 'Learn',
      growth: 'Growth',
      ops: 'DevOps'
    }
    return names[category] || 'Other'
  }

  getToolIcon(tool: AgentTool): string {
    const icons = {
      chat: '💬',
      code: '💻',
      image: '🎨',
      tools: '🔧'
    }
    return icons[tool] || '🔧'
  }

  getToolName(tool: AgentTool): string {
    const names = {
      chat: 'Chat',
      code: 'Code Studio',
      image: 'Image Studio',
      tools: 'Tools'
    }
    return names[tool] || 'Tool'
  }

  formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  getEstimatedTimeText(minutes: number): string {
    if (minutes < 60) return `~${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) return `~${hours}h`
    return `~${hours}h ${remainingMinutes}m`
  }
}

// Singleton instance
export const agentsManager = new AgentsManager()

// Mock execution simulator for demo purposes
export const simulateAgentExecution = async (
  executionId: string,
  onStepUpdate: (stepIndex: number, status: StepStatus, output?: any) => void
) => {
  const execution = agentsManager.getExecution(executionId)
  if (!execution) return

  const agent = agentsManager.getAgent(execution.agentId)
  if (!agent) return

  for (let i = 0; i < agent.steps.length; i++) {
    const step = agent.steps[i]
    
    // Start step
    onStepUpdate(i, 'running')
    agentsManager.updateExecutionStep(executionId, i, 'running')
    
    // Simulate work
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))
    
    // Complete step with mock output
    const mockOutput = {
      chat: `Generated analysis and recommendations for ${step.title}`,
      code: `Generated code files for ${step.title}`,
      image: `Created design assets for ${step.title}`,
      tools: `Configured tools for ${step.title}`
    }
    
    onStepUpdate(i, 'completed', mockOutput[step.tool])
    agentsManager.updateExecutionStep(executionId, i, 'completed', mockOutput[step.tool])
  }
}