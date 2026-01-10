'use client'

export interface AgentConfig {
  id: string
  name: string
  description: string
  category: 'build' | 'design' | 'learn' | 'growth'
  icon: string
  estimatedTime: string
  questions: Array<{
    id: string
    question: string
    type: 'text' | 'select' | 'multiselect'
    options?: string[]
    required: boolean
  }>
}

export interface AgentExecution {
  id: string
  agentId: string
  status: 'setup' | 'running' | 'completed' | 'error'
  answers: Record<string, string | string[]>
  output?: string
  startedAt: string
  completedAt?: string
}

// Predefined agents
export const AGENTS: AgentConfig[] = [
  {
    id: 'frontend-dev',
    name: 'Frontend Developer',
    description: 'Builds modern React applications with best practices',
    category: 'build',
    icon: '⚛️',
    estimatedTime: '15 min',
    questions: [
      {
        id: 'app_type',
        question: 'What type of application do you want to build?',
        type: 'select',
        options: ['Landing Page', 'Dashboard', 'E-commerce', 'Blog', 'Portfolio'],
        required: true
      },
      {
        id: 'features',
        question: 'Which features do you need?',
        type: 'multiselect',
        options: ['User Authentication', 'Database Integration', 'Payment Processing', 'Real-time Updates', 'File Upload'],
        required: false
      },
      {
        id: 'design_style',
        question: 'What design style do you prefer?',
        type: 'select',
        options: ['Modern & Minimal', 'Corporate', 'Creative & Bold', 'Classic'],
        required: true
      }
    ]
  },
  {
    id: 'ui-designer',
    name: 'UI Designer',
    description: 'Creates beautiful user interfaces and design systems',
    category: 'design',
    icon: '🎨',
    estimatedTime: '10 min',
    questions: [
      {
        id: 'design_type',
        question: 'What do you want to design?',
        type: 'select',
        options: ['Logo', 'Website Mockup', 'Mobile App UI', 'Brand Identity', 'Icon Set'],
        required: true
      },
      {
        id: 'brand_style',
        question: 'Describe your brand style',
        type: 'text',
        required: true
      },
      {
        id: 'color_preference',
        question: 'Preferred color scheme?',
        type: 'select',
        options: ['Blue & White', 'Dark & Modern', 'Colorful & Vibrant', 'Minimal & Neutral'],
        required: true
      }
    ]
  },
  {
    id: 'startup-mentor',
    name: 'Startup Mentor',
    description: 'Provides strategic guidance for startup growth',
    category: 'growth',
    icon: '🚀',
    estimatedTime: '20 min',
    questions: [
      {
        id: 'business_stage',
        question: 'What stage is your startup in?',
        type: 'select',
        options: ['Idea Stage', 'MVP Development', 'Early Traction', 'Scaling', 'Growth'],
        required: true
      },
      {
        id: 'industry',
        question: 'What industry are you in?',
        type: 'text',
        required: true
      },
      {
        id: 'main_challenge',
        question: 'What\'s your biggest challenge right now?',
        type: 'select',
        options: ['Finding Product-Market Fit', 'User Acquisition', 'Fundraising', 'Team Building', 'Scaling Operations'],
        required: true
      }
    ]
  }
]

// Agent execution simulation
export class AgentAPI {
  private static executions: Map<string, AgentExecution> = new Map()

  static async startExecution(
    agentId: string, 
    answers: Record<string, string | string[]>
  ): Promise<AgentExecution> {
    const agent = AGENTS.find(a => a.id === agentId)
    if (!agent) {
      throw new Error('Agent not found')
    }

    const execution: AgentExecution = {
      id: `exec_${Date.now()}`,
      agentId,
      status: 'running',
      answers,
      startedAt: new Date().toISOString()
    }

    this.executions.set(execution.id, execution)

    // Simulate agent work
    setTimeout(() => {
      this.completeExecution(execution.id, agent, answers)
    }, 3000 + Math.random() * 2000) // 3-5 seconds

    return execution
  }

  static async getExecution(id: string): Promise<AgentExecution | null> {
    return this.executions.get(id) || null
  }

  static async getUserExecutions(): Promise<AgentExecution[]> {
    return Array.from(this.executions.values())
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
  }

  private static completeExecution(
    executionId: string, 
    agent: AgentConfig, 
    answers: Record<string, string | string[]>
  ) {
    const execution = this.executions.get(executionId)
    if (!execution) return

    // Generate contextual output based on agent and answers
    const output = this.generateOutput(agent, answers)

    execution.status = 'completed'
    execution.output = output
    execution.completedAt = new Date().toISOString()

    this.executions.set(executionId, execution)
  }

  private static generateOutput(
    agent: AgentConfig, 
    answers: Record<string, string | string[]>
  ): string {
    switch (agent.id) {
      case 'frontend-dev':
        return this.generateFrontendDevOutput(answers)
      case 'ui-designer':
        return this.generateUIDesignerOutput(answers)
      case 'startup-mentor':
        return this.generateStartupMentorOutput(answers)
      default:
        return 'Agent execution completed successfully!'
    }
  }

  private static generateFrontendDevOutput(answers: Record<string, any>): string {
    const appType = answers.app_type
    const features = Array.isArray(answers.features) ? answers.features : []
    const designStyle = answers.design_style

    return `# ${appType} Development Plan

## Project Overview
I'll help you build a modern ${appType.toLowerCase()} with ${designStyle.toLowerCase()} design.

## Technical Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Build Tool**: Vite

## Features Implementation
${features.length > 0 ? features.map((f: string) => `- ✅ ${f}`).join('\n') : '- ✅ Core functionality'}

## File Structure
\`\`\`
src/
├── components/
│   ├── ui/
│   └── features/
├── pages/
├── hooks/
├── utils/
└── styles/
\`\`\`

## Next Steps
1. Set up project structure
2. Implement core components
3. Add styling and interactions
4. Test and optimize

## Code Preview
\`\`\`tsx
// App.tsx
import React from 'react'
import { Header } from './components/Header'
import { MainContent } from './components/MainContent'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MainContent />
    </div>
  )
}

export default App
\`\`\`

Ready to start building! 🚀`
  }

  private static generateUIDesignerOutput(answers: Record<string, any>): string {
    const designType = answers.design_type
    const brandStyle = answers.brand_style
    const colorScheme = answers.color_preference

    return `# ${designType} Design Concept

## Brand Analysis
**Style**: ${brandStyle}
**Color Scheme**: ${colorScheme}

## Design Direction
Based on your requirements, I recommend a modern approach that balances aesthetics with functionality.

## Color Palette
${this.getColorPalette(colorScheme)}

## Typography
- **Primary**: Inter (Clean, modern)
- **Secondary**: Poppins (Friendly, approachable)

## Design Elements
- Rounded corners (8px radius)
- Subtle shadows for depth
- Consistent spacing (8px grid)
- High contrast for accessibility

## Mockup Concepts
1. **Primary Layout**: Clean header with navigation
2. **Content Areas**: Card-based design system
3. **Interactive Elements**: Hover states and micro-animations

## Deliverables
- ✅ Design system guidelines
- ✅ Component library
- ✅ Responsive layouts
- ✅ Asset exports (PNG, SVG)

## Next Steps
1. Create detailed mockups
2. Build component library
3. Export production assets
4. Handoff to development

Your design is ready for implementation! 🎨`
  }

  private static generateStartupMentorOutput(answers: Record<string, any>): string {
    const stage = answers.business_stage
    const industry = answers.industry
    const challenge = answers.main_challenge

    return `# Startup Strategy Report

## Current Situation
**Stage**: ${stage}
**Industry**: ${industry}
**Main Challenge**: ${challenge}

## Strategic Recommendations

### Immediate Actions (Next 30 Days)
${this.getImmediateActions(stage, challenge)}

### Medium-term Goals (3-6 Months)
${this.getMediumTermGoals(stage, challenge)}

### Key Metrics to Track
${this.getKeyMetrics(stage)}

## Industry Insights
The ${industry} sector is experiencing significant growth. Key trends to watch:
- Digital transformation acceleration
- Customer experience focus
- Sustainable business practices

## Recommended Resources
- **Books**: "Lean Startup" by Eric Ries
- **Tools**: Google Analytics, Mixpanel, Notion
- **Communities**: Indie Hackers, Product Hunt

## Action Plan Template
\`\`\`
Week 1: [Specific actions based on your challenge]
Week 2: [Follow-up and iteration]
Week 3: [Measurement and optimization]
Week 4: [Planning next phase]
\`\`\`

## Next Steps
1. Implement immediate actions
2. Set up tracking systems
3. Schedule weekly reviews
4. Connect with relevant communities

Let's build something amazing! 🚀`
  }

  private static getColorPalette(scheme: string): string {
    const palettes = {
      'Blue & White': '- Primary: #3B82F6\n- Secondary: #EFF6FF\n- Accent: #1E40AF',
      'Dark & Modern': '- Primary: #111827\n- Secondary: #374151\n- Accent: #F59E0B',
      'Colorful & Vibrant': '- Primary: #EC4899\n- Secondary: #8B5CF6\n- Accent: #10B981',
      'Minimal & Neutral': '- Primary: #6B7280\n- Secondary: #F9FAFB\n- Accent: #374151'
    }
    return palettes[scheme as keyof typeof palettes] || palettes['Minimal & Neutral']
  }

  private static getImmediateActions(stage: string, challenge: string): string {
    const actions = {
      'Idea Stage': '- Validate your idea with 10 potential customers\n- Create a simple landing page\n- Build an MVP prototype',
      'MVP Development': '- Focus on core features only\n- Get early user feedback\n- Iterate based on user input',
      'Early Traction': '- Optimize conversion funnel\n- Implement user feedback\n- Scale marketing efforts',
      'Scaling': '- Hire key team members\n- Implement systems and processes\n- Expand to new markets',
      'Growth': '- Optimize unit economics\n- Explore new revenue streams\n- Consider strategic partnerships'
    }
    return actions[stage as keyof typeof actions] || actions['Idea Stage']
  }

  private static getMediumTermGoals(stage: string, challenge: string): string {
    return `- Achieve product-market fit
- Build sustainable revenue model  
- Establish strong team culture
- Create scalable systems`
  }

  private static getKeyMetrics(stage: string): string {
    const metrics = {
      'Idea Stage': '- Customer interviews completed\n- Landing page conversion rate\n- Email signups',
      'MVP Development': '- User activation rate\n- Feature usage analytics\n- Customer feedback score',
      'Early Traction': '- Monthly recurring revenue\n- Customer acquisition cost\n- Churn rate',
      'Scaling': '- Revenue growth rate\n- Team productivity metrics\n- Market share',
      'Growth': '- Lifetime value\n- Market expansion rate\n- Profitability margins'
    }
    return metrics[stage as keyof typeof metrics] || metrics['Idea Stage']
  }
}








