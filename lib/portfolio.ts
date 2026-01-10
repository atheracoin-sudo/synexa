'use client'

// Portfolio and Public Profile Data Management
export type ProjectType = 'code' | 'image' | 'chat'
export type ProjectVisibility = 'public' | 'unlisted' | 'private'
export type UserRole = 'developer' | 'designer' | 'founder' | 'student' | 'chat'

export interface PortfolioProject {
  id: string
  title: string
  description: string
  type: ProjectType
  visibility: ProjectVisibility
  coverImage: string
  createdAt: string
  updatedAt: string
  tools: string[] // ['chat', 'code-studio', 'image-studio']
  agents?: string[] // AI agents used
  liveUrl?: string
  sourceUrl?: string
  tags: string[]
  stats: {
    views: number
    likes: number
    duplicates: number
  }
}

export interface PublicProfile {
  id: string
  username: string
  displayName: string
  bio: string
  avatar: string
  role: UserRole
  isPremium: boolean
  isTeam: boolean
  isPublic: boolean
  createdAt: string
  stats: {
    totalProjects: number
    totalViews: number
    followers: number
    following: number
  }
  social?: {
    linkedin?: string
    twitter?: string
    github?: string
    website?: string
  }
}

export interface ShareData {
  url: string
  title: string
  description: string
  image: string
  type: 'profile' | 'project'
}

class PortfolioManager {
  private profiles: Map<string, PublicProfile> = new Map()
  private projects: Map<string, PortfolioProject> = new Map()
  private userProjects: Map<string, string[]> = new Map()

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    // Mock public profiles
    const mockProfiles: PublicProfile[] = [
      {
        id: 'user_1',
        username: 'john_dev',
        displayName: 'John Developer',
        bio: 'Full-stack developer building the future with AI. React, Node.js, and creative problem solving.',
        avatar: '👨‍💻',
        role: 'developer',
        isPremium: true,
        isTeam: false,
        isPublic: true,
        createdAt: '2024-01-15',
        stats: {
          totalProjects: 8,
          totalViews: 1247,
          followers: 23,
          following: 15
        },
        social: {
          linkedin: 'https://linkedin.com/in/johndev',
          github: 'https://github.com/johndev',
          website: 'https://johndev.io'
        }
      },
      {
        id: 'user_2',
        username: 'sarah_design',
        displayName: 'Sarah Designer',
        bio: 'UI/UX Designer crafting beautiful digital experiences. Passionate about user-centered design.',
        avatar: '🎨',
        role: 'designer',
        isPremium: false,
        isTeam: false,
        isPublic: true,
        createdAt: '2024-02-01',
        stats: {
          totalProjects: 5,
          totalViews: 892,
          followers: 18,
          following: 12
        },
        social: {
          linkedin: 'https://linkedin.com/in/sarahdesign'
        }
      }
    ]

    // Mock portfolio projects
    const mockProjects: PortfolioProject[] = [
      {
        id: 'project_1',
        title: 'E-commerce Dashboard',
        description: 'Modern admin dashboard for e-commerce management with real-time analytics and inventory tracking.',
        type: 'code',
        visibility: 'public',
        coverImage: '/api/placeholder/400/300',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-22',
        tools: ['chat', 'code-studio'],
        agents: ['Frontend Developer', 'Backend Developer'],
        liveUrl: 'https://demo.ecommerce-dashboard.com',
        tags: ['React', 'Dashboard', 'E-commerce', 'Analytics'],
        stats: {
          views: 234,
          likes: 18,
          duplicates: 5
        }
      },
      {
        id: 'project_2',
        title: 'Task Management App',
        description: 'Collaborative task management application with team features and project tracking.',
        type: 'code',
        visibility: 'public',
        coverImage: '/api/placeholder/400/300',
        createdAt: '2024-01-25',
        updatedAt: '2024-01-26',
        tools: ['chat', 'code-studio'],
        agents: ['Product Manager', 'Frontend Developer'],
        liveUrl: 'https://taskapp-demo.com',
        tags: ['React', 'Productivity', 'Team', 'Management'],
        stats: {
          views: 189,
          likes: 12,
          duplicates: 3
        }
      },
      {
        id: 'project_3',
        title: 'Brand Identity Design',
        description: 'Complete brand identity package including logo, color palette, and marketing materials.',
        type: 'image',
        visibility: 'public',
        coverImage: '/api/placeholder/400/300',
        createdAt: '2024-02-05',
        updatedAt: '2024-02-06',
        tools: ['image-studio'],
        agents: ['Brand Designer'],
        tags: ['Branding', 'Logo', 'Identity', 'Marketing'],
        stats: {
          views: 156,
          likes: 24,
          duplicates: 8
        }
      },
      {
        id: 'project_4',
        title: 'Mobile App Mockups',
        description: 'High-fidelity mobile app mockups for a fitness tracking application.',
        type: 'image',
        visibility: 'public',
        coverImage: '/api/placeholder/400/300',
        createdAt: '2024-02-10',
        updatedAt: '2024-02-11',
        tools: ['image-studio', 'chat'],
        agents: ['UI/UX Designer'],
        tags: ['Mobile', 'UI/UX', 'Fitness', 'App Design'],
        stats: {
          views: 203,
          likes: 19,
          duplicates: 6
        }
      },
      {
        id: 'project_5',
        title: 'AI Chat Integration',
        description: 'Smart chatbot integration for customer support with natural language processing.',
        type: 'code',
        visibility: 'unlisted',
        coverImage: '/api/placeholder/400/300',
        createdAt: '2024-01-30',
        updatedAt: '2024-02-01',
        tools: ['chat', 'code-studio'],
        agents: ['AI Specialist', 'Backend Developer'],
        tags: ['AI', 'Chatbot', 'NLP', 'Customer Support'],
        stats: {
          views: 67,
          likes: 8,
          duplicates: 2
        }
      }
    ]

    // Initialize data
    mockProfiles.forEach(profile => {
      this.profiles.set(profile.id, profile)
    })

    mockProjects.forEach(project => {
      this.projects.set(project.id, project)
    })

    // Map projects to users
    this.userProjects.set('user_1', ['project_1', 'project_2', 'project_5'])
    this.userProjects.set('user_2', ['project_3', 'project_4'])
  }

  // Public Profile Methods
  getPublicProfile(username: string): PublicProfile | null {
    for (const profile of Array.from(this.profiles.values())) {
      if (profile.username === username && profile.isPublic) {
        return profile
      }
    }
    return null
  }

  getProfileById(userId: string): PublicProfile | null {
    return this.profiles.get(userId) || null
  }

  updateProfile(userId: string, updates: Partial<PublicProfile>): boolean {
    const profile = this.profiles.get(userId)
    if (!profile) return false

    const updatedProfile = { ...profile, ...updates }
    this.profiles.set(userId, updatedProfile)
    return true
  }

  toggleProfileVisibility(userId: string): boolean {
    const profile = this.profiles.get(userId)
    if (!profile) return false

    profile.isPublic = !profile.isPublic
    this.profiles.set(userId, profile)
    return true
  }

  // Portfolio Project Methods
  getUserProjects(userId: string, includePrivate: boolean = false): PortfolioProject[] {
    const projectIds = this.userProjects.get(userId) || []
    const projects = projectIds
      .map(id => this.projects.get(id))
      .filter((project): project is PortfolioProject => project !== undefined)

    if (!includePrivate) {
      return projects.filter(project => project.visibility !== 'private')
    }

    return projects
  }

  getPublicProjects(userId: string): PortfolioProject[] {
    return this.getUserProjects(userId, false).filter(project => 
      project.visibility === 'public'
    )
  }

  getProject(projectId: string): PortfolioProject | null {
    return this.projects.get(projectId) || null
  }

  addToPortfolio(userId: string, projectData: Omit<PortfolioProject, 'id' | 'createdAt' | 'updatedAt' | 'stats'>): string {
    const projectId = `project_${Date.now()}`
    const now = new Date().toISOString()

    const project: PortfolioProject = {
      ...projectData,
      id: projectId,
      createdAt: now,
      updatedAt: now,
      stats: {
        views: 0,
        likes: 0,
        duplicates: 0
      }
    }

    this.projects.set(projectId, project)

    // Add to user's projects
    const userProjectIds = this.userProjects.get(userId) || []
    userProjectIds.push(projectId)
    this.userProjects.set(userId, userProjectIds)

    return projectId
  }

  updateProject(projectId: string, updates: Partial<PortfolioProject>): boolean {
    const project = this.projects.get(projectId)
    if (!project) return false

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    this.projects.set(projectId, updatedProject)
    return true
  }

  deleteProject(userId: string, projectId: string): boolean {
    const userProjectIds = this.userProjects.get(userId) || []
    const projectIndex = userProjectIds.indexOf(projectId)
    
    if (projectIndex === -1) return false

    // Remove from user's projects
    userProjectIds.splice(projectIndex, 1)
    this.userProjects.set(userId, userProjectIds)

    // Remove project
    this.projects.delete(projectId)
    return true
  }

  // Stats and Analytics
  incrementProjectViews(projectId: string): void {
    const project = this.projects.get(projectId)
    if (project) {
      project.stats.views++
      this.projects.set(projectId, project)
    }
  }

  toggleProjectLike(projectId: string, increment: boolean): void {
    const project = this.projects.get(projectId)
    if (project) {
      project.stats.likes += increment ? 1 : -1
      project.stats.likes = Math.max(0, project.stats.likes)
      this.projects.set(projectId, project)
    }
  }

  // Share Methods
  generateShareData(type: 'profile' | 'project', id: string): ShareData | null {
    if (type === 'profile') {
      const profile = this.getProfileById(id)
      if (!profile || !profile.isPublic) return null

      return {
        url: `${window.location.origin}/u/${profile.username}`,
        title: `${profile.displayName} - Synexa Portfolio`,
        description: profile.bio,
        image: profile.avatar,
        type: 'profile'
      }
    } else {
      const project = this.getProject(id)
      if (!project || project.visibility === 'private') return null

      return {
        url: `${window.location.origin}/project/${project.id}`,
        title: project.title,
        description: project.description,
        image: project.coverImage,
        type: 'project'
      }
    }
  }

  // Premium Limits
  canAddProject(userId: string): { canAdd: boolean; reason?: string } {
    const profile = this.getProfileById(userId)
    if (!profile) return { canAdd: false, reason: 'Profile not found' }

    if (profile.isPremium) {
      return { canAdd: true }
    }

    const publicProjects = this.getPublicProjects(userId)
    if (publicProjects.length >= 2) {
      return { 
        canAdd: false, 
        reason: 'Free users can have maximum 2 public projects. Upgrade to Premium for unlimited projects.' 
      }
    }

    return { canAdd: true }
  }

  // Search and Discovery
  searchProfiles(query: string): PublicProfile[] {
    const lowercaseQuery = query.toLowerCase()
    return Array.from(this.profiles.values())
      .filter(profile => 
        profile.isPublic && (
          profile.displayName.toLowerCase().includes(lowercaseQuery) ||
          profile.username.toLowerCase().includes(lowercaseQuery) ||
          profile.bio.toLowerCase().includes(lowercaseQuery)
        )
      )
      .slice(0, 10)
  }

  searchProjects(query: string): PortfolioProject[] {
    const lowercaseQuery = query.toLowerCase()
    return Array.from(this.projects.values())
      .filter(project => 
        project.visibility === 'public' && (
          project.title.toLowerCase().includes(lowercaseQuery) ||
          project.description.toLowerCase().includes(lowercaseQuery) ||
          project.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        )
      )
      .slice(0, 20)
  }

  // Featured/Trending
  getFeaturedProjects(): PortfolioProject[] {
    return Array.from(this.projects.values())
      .filter(project => project.visibility === 'public')
      .sort((a, b) => b.stats.views - a.stats.views)
      .slice(0, 6)
  }

  getTrendingProfiles(): PublicProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isPublic)
      .sort((a, b) => b.stats.totalViews - a.stats.totalViews)
      .slice(0, 6)
  }
}

// Singleton instance
export const portfolioManager = new PortfolioManager()

// Utility functions
export const getProjectTypeIcon = (type: ProjectType): string => {
  const icons = {
    code: '💻',
    image: '🎨',
    chat: '💬'
  }
  return icons[type] || '📄'
}

export const getProjectTypeName = (type: ProjectType): string => {
  const names = {
    code: 'Code Project',
    image: 'Design Project',
    chat: 'Chat Highlight'
  }
  return names[type] || 'Project'
}

export const getRoleIcon = (role: UserRole): string => {
  const icons = {
    developer: '👨‍💻',
    designer: '🎨',
    founder: '🚀',
    student: '📚',
    chat: '🤖'
  }
  return icons[role] || '👤'
}

export const getRoleName = (role: UserRole): string => {
  const names = {
    developer: 'Developer',
    designer: 'Designer',
    founder: 'Founder',
    student: 'Student',
    chat: 'AI Enthusiast'
  }
  return names[role] || 'User'
}

export const formatProjectStats = (stats: PortfolioProject['stats']): string => {
  const { views, likes, duplicates } = stats
  const parts = []
  
  if (views > 0) parts.push(`${views} views`)
  if (likes > 0) parts.push(`${likes} likes`)
  if (duplicates > 0) parts.push(`${duplicates} duplicates`)
  
  return parts.join(' • ')
}

export const getVisibilityIcon = (visibility: ProjectVisibility): string => {
  const icons = {
    public: '🌍',
    unlisted: '🔗',
    private: '🔒'
  }
  return icons[visibility] || '🔒'
}

export const getVisibilityName = (visibility: ProjectVisibility): string => {
  const names = {
    public: 'Public',
    unlisted: 'Unlisted',
    private: 'Private'
  }
  return names[visibility] || 'Private'
}






