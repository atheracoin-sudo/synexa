'use client'

// Marketplace Data Management System
export type MarketplaceCategory = 'all' | 'apps' | 'agents' | 'designs'
export type TemplateType = 'app' | 'agent' | 'design'
export type TechStack = 'React' | 'Next.js' | 'Vue' | 'Angular' | 'HTML/CSS' | 'Node.js' | 'Python' | 'TypeScript'

export interface MarketplaceItem {
  id: string
  title: string
  description: string
  shortDescription: string
  type: TemplateType
  category: string
  preview: string
  thumbnail: string
  isPremium: boolean
  isPopular: boolean
  isNew: boolean
  usageCount: number
  rating: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface AppTemplate extends MarketplaceItem {
  type: 'app'
  techStack: TechStack[]
  features: string[]
  demoUrl?: string
  githubUrl?: string
  components: number
  pages: number
  responsive: boolean
  darkMode: boolean
}

export interface AgentTemplate extends MarketplaceItem {
  type: 'agent'
  agentId: string
  estimatedTime: number
  tools: string[]
  successRate: number
  complexity: 'beginner' | 'intermediate' | 'advanced'
  steps: number
}

export interface DesignTemplate extends MarketplaceItem {
  type: 'design'
  dimensions: string
  format: string
  style: string
  colors: string[]
  useCase: string
  variations: number
}

export type Template = AppTemplate | AgentTemplate | DesignTemplate

export interface MarketplaceStats {
  totalTemplates: number
  totalDownloads: number
  popularThisWeek: Template[]
  newThisWeek: Template[]
  categories: Record<MarketplaceCategory, number>
}

class MarketplaceManager {
  private templates: Map<string, Template> = new Map()
  private stats: MarketplaceStats

  constructor() {
    this.initializeMockData()
    this.stats = this.calculateStats()
  }

  private initializeMockData() {
    // App Templates
    const appTemplates: AppTemplate[] = [
      {
        id: 'saas-dashboard-pro',
        title: 'SaaS Dashboard Pro',
        description: 'Complete SaaS dashboard with authentication, analytics, billing, and user management. Built with Next.js and TypeScript.',
        shortDescription: 'Professional SaaS dashboard template',
        type: 'app',
        category: 'Dashboard',
        preview: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/400/300',
        isPremium: true,
        isPopular: true,
        isNew: false,
        usageCount: 1247,
        rating: 4.8,
        tags: ['SaaS', 'Dashboard', 'Analytics', 'Billing', 'Authentication'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-08T00:00:00Z',
        techStack: ['Next.js', 'TypeScript', 'React'],
        features: [
          'User authentication & authorization',
          'Real-time analytics dashboard',
          'Subscription billing integration',
          'Team management',
          'API key management',
          'Dark/light mode toggle',
          'Responsive design',
          'Email notifications'
        ],
        demoUrl: 'https://saas-demo.synexa.ai',
        components: 45,
        pages: 12,
        responsive: true,
        darkMode: true
      },
      {
        id: 'landing-page-startup',
        title: 'Startup Landing Page',
        description: 'High-converting landing page template designed for startups and new products. Includes hero section, features, testimonials, and pricing.',
        shortDescription: 'High-converting startup landing page',
        type: 'app',
        category: 'Landing Page',
        preview: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/400/300',
        isPremium: false,
        isPopular: true,
        isNew: false,
        usageCount: 2156,
        rating: 4.6,
        tags: ['Landing Page', 'Startup', 'Marketing', 'Conversion'],
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-07T00:00:00Z',
        techStack: ['React', 'HTML/CSS'],
        features: [
          'Hero section with CTA',
          'Feature showcase',
          'Customer testimonials',
          'Pricing tables',
          'Contact form',
          'Newsletter signup',
          'Social media integration',
          'SEO optimized'
        ],
        demoUrl: 'https://landing-demo.synexa.ai',
        components: 18,
        pages: 1,
        responsive: true,
        darkMode: false
      },
      {
        id: 'ecommerce-store',
        title: 'E-commerce Store',
        description: 'Complete e-commerce solution with product catalog, shopping cart, checkout, and order management.',
        shortDescription: 'Full-featured e-commerce store',
        type: 'app',
        category: 'E-commerce',
        preview: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/400/300',
        isPremium: true,
        isPopular: false,
        isNew: true,
        usageCount: 543,
        rating: 4.7,
        tags: ['E-commerce', 'Shopping', 'Payment', 'Inventory'],
        createdAt: '2024-01-06T00:00:00Z',
        updatedAt: '2024-01-08T00:00:00Z',
        techStack: ['Next.js', 'TypeScript', 'Node.js'],
        features: [
          'Product catalog with search',
          'Shopping cart & wishlist',
          'Secure checkout process',
          'Payment gateway integration',
          'Order tracking',
          'Inventory management',
          'Customer reviews',
          'Admin dashboard'
        ],
        components: 38,
        pages: 15,
        responsive: true,
        darkMode: true
      },
      {
        id: 'portfolio-creative',
        title: 'Creative Portfolio',
        description: 'Stunning portfolio template for designers, developers, and creative professionals.',
        shortDescription: 'Beautiful creative portfolio template',
        type: 'app',
        category: 'Portfolio',
        preview: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/400/300',
        isPremium: false,
        isPopular: false,
        isNew: false,
        usageCount: 892,
        rating: 4.4,
        tags: ['Portfolio', 'Creative', 'Design', 'Showcase'],
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-05T00:00:00Z',
        techStack: ['React', 'HTML/CSS'],
        features: [
          'Project showcase gallery',
          'About section',
          'Skills & experience',
          'Contact form',
          'Blog integration',
          'Smooth animations',
          'Mobile optimized'
        ],
        components: 22,
        pages: 6,
        responsive: true,
        darkMode: true
      },
      {
        id: 'admin-panel-modern',
        title: 'Modern Admin Panel',
        description: 'Comprehensive admin panel with data visualization, user management, and system monitoring.',
        shortDescription: 'Feature-rich admin panel template',
        type: 'app',
        category: 'Admin',
        preview: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/400/300',
        isPremium: true,
        isPopular: true,
        isNew: false,
        usageCount: 1678,
        rating: 4.9,
        tags: ['Admin', 'Dashboard', 'Management', 'Analytics'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-08T00:00:00Z',
        techStack: ['React', 'TypeScript', 'Node.js'],
        features: [
          'Advanced data tables',
          'Interactive charts',
          'User role management',
          'System monitoring',
          'File management',
          'Notification system',
          'Activity logs',
          'Settings panel'
        ],
        components: 52,
        pages: 18,
        responsive: true,
        darkMode: true
      }
    ]

    // Agent Templates (from existing agents)
    const agentTemplates: AgentTemplate[] = [
      {
        id: 'saas-mvp-builder-template',
        title: 'SaaS MVP Builder',
        description: 'Build a complete SaaS MVP with authentication, dashboard, and payments in minutes.',
        shortDescription: 'Automated SaaS MVP creation',
        type: 'agent',
        category: 'Build',
        preview: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/400/300',
        isPremium: true,
        isPopular: true,
        isNew: false,
        usageCount: 856,
        rating: 4.8,
        tags: ['SaaS', 'MVP', 'Full-stack', 'Authentication'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-08T00:00:00Z',
        agentId: 'saas-mvp-builder',
        estimatedTime: 15,
        tools: ['Chat', 'Code Studio'],
        successRate: 88,
        complexity: 'advanced',
        steps: 6
      },
      {
        id: 'landing-page-builder-template',
        title: 'Landing Page Builder',
        description: 'Create high-converting landing pages with modern design and optimization.',
        shortDescription: 'Automated landing page creation',
        type: 'agent',
        category: 'Build',
        preview: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/400/300',
        isPremium: false,
        isPopular: true,
        isNew: false,
        usageCount: 1234,
        rating: 4.6,
        tags: ['Landing Page', 'Marketing', 'Conversion'],
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-07T00:00:00Z',
        agentId: 'landing-page-builder',
        estimatedTime: 8,
        tools: ['Chat', 'Code Studio', 'Image Studio'],
        successRate: 92,
        complexity: 'beginner',
        steps: 5
      },
      {
        id: 'brand-kit-designer-template',
        title: 'Brand Kit Designer',
        description: 'Create complete brand identity with logo, colors, and guidelines.',
        shortDescription: 'Automated brand identity creation',
        type: 'agent',
        category: 'Design',
        preview: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/400/300',
        isPremium: true,
        isPopular: false,
        isNew: false,
        usageCount: 567,
        rating: 4.7,
        tags: ['Branding', 'Logo', 'Identity', 'Guidelines'],
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-06T00:00:00Z',
        agentId: 'brand-kit-designer',
        estimatedTime: 12,
        tools: ['Chat', 'Image Studio'],
        successRate: 85,
        complexity: 'intermediate',
        steps: 5
      }
    ]

    // Design Templates
    const designTemplates: DesignTemplate[] = [
      {
        id: 'instagram-post-modern',
        title: 'Modern Instagram Post',
        description: 'Clean and modern Instagram post template with customizable colors and text.',
        shortDescription: 'Clean modern Instagram post design',
        type: 'design',
        category: 'Social Media',
        preview: '/api/placeholder/800/800',
        thumbnail: '/api/placeholder/400/400',
        isPremium: false,
        isPopular: true,
        isNew: false,
        usageCount: 3456,
        rating: 4.5,
        tags: ['Instagram', 'Social Media', 'Modern', 'Clean'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-08T00:00:00Z',
        dimensions: '1080x1080',
        format: 'PNG/JPG',
        style: 'Modern',
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
        useCase: 'Social media marketing',
        variations: 8
      },
      {
        id: 'youtube-thumbnail-gaming',
        title: 'Gaming YouTube Thumbnail',
        description: 'Eye-catching YouTube thumbnail template designed for gaming content.',
        shortDescription: 'High-impact gaming thumbnail',
        type: 'design',
        category: 'YouTube',
        preview: '/api/placeholder/800/450',
        thumbnail: '/api/placeholder/400/225',
        isPremium: true,
        isPopular: true,
        isNew: false,
        usageCount: 2134,
        rating: 4.7,
        tags: ['YouTube', 'Gaming', 'Thumbnail', 'Clickbait'],
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-07T00:00:00Z',
        dimensions: '1280x720',
        format: 'PNG/JPG',
        style: 'Bold',
        colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
        useCase: 'YouTube gaming content',
        variations: 12
      },
      {
        id: 'story-template-business',
        title: 'Business Story Template',
        description: 'Professional Instagram/Facebook story template for business content.',
        shortDescription: 'Professional business story design',
        type: 'design',
        category: 'Social Media',
        preview: '/api/placeholder/600/1067',
        thumbnail: '/api/placeholder/300/533',
        isPremium: false,
        isPopular: false,
        isNew: true,
        usageCount: 789,
        rating: 4.3,
        tags: ['Story', 'Business', 'Professional', 'Instagram'],
        createdAt: '2024-01-06T00:00:00Z',
        updatedAt: '2024-01-08T00:00:00Z',
        dimensions: '1080x1920',
        format: 'PNG/JPG',
        style: 'Professional',
        colors: ['#2C3E50', '#3498DB', '#E74C3C', '#F39C12'],
        useCase: 'Business storytelling',
        variations: 6
      },
      {
        id: 'pitch-deck-startup',
        title: 'Startup Pitch Deck',
        description: 'Complete pitch deck template with all essential slides for startup presentations.',
        shortDescription: 'Complete startup pitch deck template',
        type: 'design',
        category: 'Presentation',
        preview: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/400/300',
        isPremium: true,
        isPopular: true,
        isNew: false,
        usageCount: 1567,
        rating: 4.9,
        tags: ['Pitch Deck', 'Startup', 'Presentation', 'Investment'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-08T00:00:00Z',
        dimensions: '1920x1080',
        format: 'PNG/PDF',
        style: 'Professional',
        colors: ['#1A1A1A', '#FFFFFF', '#007AFF', '#34C759'],
        useCase: 'Investor presentations',
        variations: 15
      },
      {
        id: 'logo-template-tech',
        title: 'Tech Logo Template',
        description: 'Modern logo template perfect for tech startups and digital companies.',
        shortDescription: 'Modern tech company logo',
        type: 'design',
        category: 'Logo',
        preview: '/api/placeholder/800/800',
        thumbnail: '/api/placeholder/400/400',
        isPremium: true,
        isPopular: false,
        isNew: true,
        usageCount: 432,
        rating: 4.6,
        tags: ['Logo', 'Tech', 'Startup', 'Modern'],
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-08T00:00:00Z',
        dimensions: '512x512',
        format: 'SVG/PNG',
        style: 'Modern',
        colors: ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B'],
        useCase: 'Brand identity',
        variations: 10
      }
    ]

    // Initialize templates
    const allTemplates = [...appTemplates, ...agentTemplates, ...designTemplates]
    allTemplates.forEach(template => {
      this.templates.set(template.id, template)
    })
  }

  private calculateStats(): MarketplaceStats {
    const templates = Array.from(this.templates.values())
    
    return {
      totalTemplates: templates.length,
      totalDownloads: templates.reduce((sum, t) => sum + t.usageCount, 0),
      popularThisWeek: templates
        .filter(t => t.isPopular)
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 6),
      newThisWeek: templates
        .filter(t => t.isNew)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6),
      categories: {
        all: templates.length,
        apps: templates.filter(t => t.type === 'app').length,
        agents: templates.filter(t => t.type === 'agent').length,
        designs: templates.filter(t => t.type === 'design').length
      }
    }
  }

  // Template Management
  getAllTemplates(): Template[] {
    return Array.from(this.templates.values())
  }

  getTemplatesByType(type: TemplateType): Template[] {
    return Array.from(this.templates.values())
      .filter(template => template.type === type)
      .sort((a, b) => b.usageCount - a.usageCount)
  }

  getTemplate(id: string): Template | null {
    return this.templates.get(id) || null
  }

  getFeaturedTemplates(): Template[] {
    return Array.from(this.templates.values())
      .filter(template => template.isPopular)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8)
  }

  getPopularTemplates(): Template[] {
    return Array.from(this.templates.values())
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 12)
  }

  getNewTemplates(): Template[] {
    return Array.from(this.templates.values())
      .filter(template => template.isNew)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)
  }

  getFreeTemplates(): Template[] {
    return Array.from(this.templates.values())
      .filter(template => !template.isPremium)
      .sort((a, b) => b.usageCount - a.usageCount)
  }

  getPremiumTemplates(): Template[] {
    return Array.from(this.templates.values())
      .filter(template => template.isPremium)
      .sort((a, b) => b.rating - a.rating)
  }

  // Search and Filter
  searchTemplates(query: string): Template[] {
    const lowercaseQuery = query.toLowerCase()
    return Array.from(this.templates.values())
      .filter(template => 
        template.title.toLowerCase().includes(lowercaseQuery) ||
        template.description.toLowerCase().includes(lowercaseQuery) ||
        template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        template.category.toLowerCase().includes(lowercaseQuery)
      )
      .sort((a, b) => b.usageCount - a.usageCount)
  }

  filterTemplates(filters: {
    type?: TemplateType
    isPremium?: boolean
    isPopular?: boolean
    isNew?: boolean
    category?: string
    minRating?: number
  }): Template[] {
    let filtered = Array.from(this.templates.values())

    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type)
    }

    if (filters.isPremium !== undefined) {
      filtered = filtered.filter(t => t.isPremium === filters.isPremium)
    }

    if (filters.isPopular) {
      filtered = filtered.filter(t => t.isPopular)
    }

    if (filters.isNew) {
      filtered = filtered.filter(t => t.isNew)
    }

    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category)
    }

    if (filters.minRating) {
      filtered = filtered.filter(t => t.rating >= filters.minRating)
    }

    return filtered.sort((a, b) => b.usageCount - a.usageCount)
  }

  // Stats
  getStats(): MarketplaceStats {
    return this.stats
  }

  // Categories
  getCategories(type?: TemplateType): string[] {
    const templates = type 
      ? Array.from(this.templates.values()).filter(t => t.type === type)
      : Array.from(this.templates.values())
    
    const categories = [...new Set(templates.map(t => t.category))]
    return categories.sort()
  }

  // Usage tracking
  incrementUsage(templateId: string): boolean {
    const template = this.templates.get(templateId)
    if (!template) return false

    template.usageCount += 1
    template.updatedAt = new Date().toISOString()
    this.templates.set(templateId, template)
    
    // Recalculate stats
    this.stats = this.calculateStats()
    
    return true
  }

  // Premium checks
  canUseTemplate(userId: string, templateId: string): { canUse: boolean; reason?: string } {
    const template = this.templates.get(templateId)
    if (!template) return { canUse: false, reason: 'Template not found' }

    // Mock premium check
    const isPremiumUser = false // This would come from user context
    
    if (template.isPremium && !isPremiumUser) {
      return { 
        canUse: false, 
        reason: 'This template requires Premium. Upgrade to access premium templates.' 
      }
    }

    return { canUse: true }
  }

  // Utility functions
  getTypeIcon(type: TemplateType): string {
    const icons = {
      app: '💻',
      agent: '🤖',
      design: '🎨'
    }
    return icons[type] || '📄'
  }

  getTypeName(type: TemplateType): string {
    const names = {
      app: 'App Template',
      agent: 'AI Agent',
      design: 'Design Template'
    }
    return names[type] || 'Template'
  }

  formatUsageCount(count: number): string {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  formatRating(rating: number): string {
    return rating.toFixed(1)
  }
}

// Singleton instance
export const marketplaceManager = new MarketplaceManager()





