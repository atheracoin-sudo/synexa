// Chat types
export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
  isError?: boolean // Flag for error messages that need special handling
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  isPinned: boolean
  isArchived: boolean
  preview: string // Last message preview
  agentId?: string // Associated AI agent
}

// AI Agent types
export interface AIAgent {
  id: string
  name: string
  role: string
  description: string
  avatar: string
  isBuiltIn: boolean
  capabilities: AgentCapability[]
  systemPrompt: string
  createdAt: Date
  createdBy?: string // User ID for custom agents
}

export type AgentCapability = 'chat' | 'code' | 'design' | 'analysis'

export interface AgentMemory {
  agentId: string
  context: string
  lastUsed: Date
}

// Pricing & Plans types
export interface PricingPlan {
  id: PlanType
  name: string
  badge?: string
  price: {
    monthly: number
    yearly: number
  }
  features: PlanFeature[]
  cta: string
  highlight?: boolean
  disabled?: boolean
}

export interface PlanFeature {
  name: string
  included: boolean | string // true, false, or limited value like "5 projects"
  tooltip?: string
}

export interface BillingPeriod {
  type: 'monthly' | 'yearly'
  discount?: number // percentage discount for yearly
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
}

// Code mode types
export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  path: string
  content?: string
  children?: FileNode[]
  isExpanded?: boolean
}

export interface Workspace {
  id: string
  name: string
  files: Record<string, string> // path -> content
  activeFile?: string
}

export interface CodePatch {
  plan: string
  operations: CodeOperation[]
}

export interface CodeOperation {
  op: 'write' | 'delete' | 'rename'
  path: string
  content?: string
  newPath?: string
}

// Design mode types
export interface DesignNode {
  id: string
  type: 'text' | 'rect' | 'circle' | 'image'
  name?: string // Custom name for layers panel
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  // Text specific
  text?: string
  fontSize?: number
  fontFamily?: string
  // Image specific
  src?: string
}

export interface DesignScene {
  id: string
  name: string
  width: number
  height: number
  nodes: DesignNode[]
  background?: string
}

export interface DesignTemplate {
  id: string
  name: string
  category: string
  scene: DesignScene
  thumbnail?: string
}

// AI API types
export interface AIResponse {
  success: boolean
  data?: any
  error?: string
}

export interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}

export interface CodeRequest {
  prompt: string
  files: Record<string, string>
  activeFilePath?: string
}

export interface DesignRequest {
  prompt: string
  sizePreset?: 'instagram-post' | 'youtube-thumbnail' | 'twitter-header' | 'custom'
  width?: number
  height?: number
  brand?: {
    colors: string[]
    font: string
  }
}

// Studio types
export type StudioMode = 'chat' | 'code' | 'design'

export interface StudioState {
  currentMode: StudioMode
  sidebarCollapsed: boolean
}

// Onboarding types
export type OnboardingPurpose = 'chat' | 'code' | 'design'
export type OnboardingLevel = 'beginner' | 'intermediate' | 'pro'
export type OnboardingGoal = 'learn' | 'build' | 'quick'

export interface OnboardingData {
  purpose: OnboardingPurpose
  level: OnboardingLevel
  goal: OnboardingGoal
  completed: boolean
  completedAt?: Date
}

export interface UserPreferences {
  onboarding: OnboardingData | null
  theme: 'light' | 'dark' | 'system'
  language: 'tr' | 'en'
}

// Premium & Monetization types
export type PlanType = 'free' | 'premium' | 'team'

export interface UsageStats {
  chatMessages: number
  codeProjects: number
  imageExports: number
  period: 'daily' | 'monthly'
  resetDate: Date
}

export interface PlanLimits {
  chatMessages: number | null // null = unlimited
  codeProjects: number | null
  imageExports: number | null
  versionHistory: boolean
  brandKit: boolean
  hdExport: boolean
  multiDevicePreview: boolean
  aiDesignAssistant: boolean
}

export interface UserPlan {
  type: PlanType
  limits: PlanLimits
  usage: UsageStats
  subscriptionDate?: Date
  expiryDate?: Date
}

export interface FeatureLock {
  feature: string
  isLocked: boolean
  reason?: string
  upgradeMessage?: string
}

// Chat Memory & Personalization types
export type MemoryCategory = 
  | 'tech_stack' 
  | 'language_preference' 
  | 'response_style' 
  | 'usage_purpose' 
  | 'project_context'
  | 'communication_style'
  | 'custom'

export interface MemoryItem {
  id: string
  category: MemoryCategory
  title: string
  value: string
  description?: string
  isActive: boolean
  createdAt: Date
  lastUsed?: Date
  source: 'auto_detected' | 'manual' | 'command'
}

export interface MemoryContext {
  items: MemoryItem[]
  lastUpdated: Date
  totalItems: number
}

export interface MemorySuggestion {
  id: string
  category: MemoryCategory
  title: string
  value: string
  confidence: number
  messageId: string
  isAccepted?: boolean
  isRejected?: boolean
}