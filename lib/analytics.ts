import { Agent } from './types'

export interface UsageData {
  chatMessages: number
  codeProjects: number
  imageDesigns: number
  activeAgents: number
  totalActiveDays: number
  lastActiveDate: string
}

export interface ActivityData {
  date: string
  chatMessages: number
  codeProjects: number
  imageDesigns: number
  totalActivity: number
}

export interface ProjectData {
  id: string
  name: string
  type: 'chat' | 'code' | 'image'
  createdAt: string
  updatedAt: string
  status: 'active' | 'archived'
  agentId?: string
}

export interface TeamAnalytics {
  workspaceId: string
  totalMembers: number
  totalProjects: number
  topContributor: {
    userId: string
    name: string
    contribution: number
  }
  memberActivity: {
    userId: string
    name: string
    chatMessages: number
    codeProjects: number
    imageDesigns: number
    totalActivity: number
  }[]
}

export class AnalyticsManager {
  private static instance: AnalyticsManager

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager()
    }
    return AnalyticsManager.instance
  }

  // Get current month usage data
  getCurrentUsage(): UsageData {
    const stored = localStorage.getItem('synexa_usage_data')
    if (stored) {
      return JSON.parse(stored)
    }

    // Default/mock data
    return {
      chatMessages: 47,
      codeProjects: 5,
      imageDesigns: 9,
      activeAgents: 3,
      totalActiveDays: 12,
      lastActiveDate: new Date().toISOString()
    }
  }

  // Get activity timeline data (last 30 days)
  getActivityTimeline(period: 'daily' | 'weekly' | 'monthly' = 'daily'): ActivityData[] {
    const stored = localStorage.getItem('synexa_activity_timeline')
    if (stored) {
      return JSON.parse(stored)
    }

    // Generate mock data for last 30 days
    const data: ActivityData[] = []
    const now = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      const chatMessages = Math.floor(Math.random() * 8)
      const codeProjects = Math.random() > 0.8 ? 1 : 0
      const imageDesigns = Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0
      
      data.push({
        date: date.toISOString().split('T')[0],
        chatMessages,
        codeProjects,
        imageDesigns,
        totalActivity: chatMessages + codeProjects + imageDesigns
      })
    }

    return data
  }

  // Get detailed project breakdown
  getProjectBreakdown(type?: 'chat' | 'code' | 'image'): ProjectData[] {
    const stored = localStorage.getItem('synexa_project_data')
    let projects: ProjectData[] = []
    
    if (stored) {
      projects = JSON.parse(stored)
    } else {
      // Generate mock project data
      projects = [
        {
          id: '1',
          name: 'Todo App React',
          type: 'code',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-16T14:30:00Z',
          status: 'active',
          agentId: 'frontend-dev'
        },
        {
          id: '2',
          name: 'Landing Page Design',
          type: 'image',
          createdAt: '2024-01-14T09:15:00Z',
          updatedAt: '2024-01-14T11:45:00Z',
          status: 'active'
        },
        {
          id: '3',
          name: 'AI Chat Conversation',
          type: 'chat',
          createdAt: '2024-01-13T16:20:00Z',
          updatedAt: '2024-01-13T17:10:00Z',
          status: 'active',
          agentId: 'general'
        },
        {
          id: '4',
          name: 'E-commerce Backend',
          type: 'code',
          createdAt: '2024-01-12T08:30:00Z',
          updatedAt: '2024-01-12T18:45:00Z',
          status: 'archived',
          agentId: 'backend-dev'
        },
        {
          id: '5',
          name: 'Brand Logo Design',
          type: 'image',
          createdAt: '2024-01-11T13:00:00Z',
          updatedAt: '2024-01-11T15:30:00Z',
          status: 'active'
        }
      ]
    }

    if (type) {
      return projects.filter(p => p.type === type)
    }
    return projects
  }

  // Get most productive day
  getMostProductiveDay(): { day: string, activity: number } {
    const timeline = this.getActivityTimeline()
    const dayActivity: { [key: string]: number } = {}
    
    timeline.forEach(data => {
      const day = new Date(data.date).toLocaleDateString('tr-TR', { weekday: 'long' })
      dayActivity[day] = (dayActivity[day] || 0) + data.totalActivity
    })

    const mostProductiveDay = Object.entries(dayActivity).reduce((a, b) => 
      dayActivity[a[0]] > dayActivity[b[0]] ? a : b
    )

    return {
      day: mostProductiveDay[0],
      activity: mostProductiveDay[1]
    }
  }

  // Get most used agent
  getMostUsedAgent(): { agentId: string, usage: number } {
    const projects = this.getProjectBreakdown()
    const agentUsage: { [key: string]: number } = {}
    
    projects.forEach(project => {
      if (project.agentId) {
        agentUsage[project.agentId] = (agentUsage[project.agentId] || 0) + 1
      }
    })

    const mostUsedAgent = Object.entries(agentUsage).reduce((a, b) => 
      agentUsage[a[0]] > agentUsage[b[0]] ? a : b, ['general', 0]
    )

    return {
      agentId: mostUsedAgent[0],
      usage: mostUsedAgent[1]
    }
  }

  // Get weekly growth
  getWeeklyGrowth(): { chatGrowth: number, codeGrowth: number, imageGrowth: number } {
    const timeline = this.getActivityTimeline()
    const thisWeek = timeline.slice(-7)
    const lastWeek = timeline.slice(-14, -7)
    
    const thisWeekTotal = thisWeek.reduce((sum, day) => ({
      chat: sum.chat + day.chatMessages,
      code: sum.code + day.codeProjects,
      image: sum.image + day.imageDesigns
    }), { chat: 0, code: 0, image: 0 })
    
    const lastWeekTotal = lastWeek.reduce((sum, day) => ({
      chat: sum.chat + day.chatMessages,
      code: sum.code + day.codeProjects,
      image: sum.image + day.imageDesigns
    }), { chat: 0, code: 0, image: 0 })

    return {
      chatGrowth: lastWeekTotal.chat > 0 ? Math.round(((thisWeekTotal.chat - lastWeekTotal.chat) / lastWeekTotal.chat) * 100) : 0,
      codeGrowth: lastWeekTotal.code > 0 ? Math.round(((thisWeekTotal.code - lastWeekTotal.code) / lastWeekTotal.code) * 100) : 0,
      imageGrowth: lastWeekTotal.image > 0 ? Math.round(((thisWeekTotal.image - lastWeekTotal.image) / lastWeekTotal.image) * 100) : 0
    }
  }

  // Update usage data
  updateUsage(type: 'chat' | 'code' | 'image', increment: number = 1) {
    const current = this.getCurrentUsage()
    
    switch (type) {
      case 'chat':
        current.chatMessages += increment
        break
      case 'code':
        current.codeProjects += increment
        break
      case 'image':
        current.imageDesigns += increment
        break
    }
    
    current.lastActiveDate = new Date().toISOString()
    localStorage.setItem('synexa_usage_data', JSON.stringify(current))
  }

  // Get team analytics (for team plans)
  getTeamAnalytics(workspaceId: string): TeamAnalytics {
    // Mock team data
    return {
      workspaceId,
      totalMembers: 5,
      totalProjects: 23,
      topContributor: {
        userId: 'user-1',
        name: 'Alice Johnson',
        contribution: 45
      },
      memberActivity: [
        {
          userId: 'user-1',
          name: 'Alice Johnson',
          chatMessages: 89,
          codeProjects: 12,
          imageDesigns: 7,
          totalActivity: 108
        },
        {
          userId: 'user-2',
          name: 'Bob Smith',
          chatMessages: 67,
          codeProjects: 8,
          imageDesigns: 5,
          totalActivity: 80
        },
        {
          userId: 'user-3',
          name: 'Carol Davis',
          chatMessages: 45,
          codeProjects: 6,
          imageDesigns: 9,
          totalActivity: 60
        }
      ]
    }
  }
}

// Export singleton instance
export const analyticsManager = AnalyticsManager.getInstance()