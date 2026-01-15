import { MemoryItem, MemoryContext, MemorySuggestion, MemoryCategory } from './types'
import { generateId } from './utils'

// Memory detection patterns
const MEMORY_PATTERNS = {
  tech_stack: [
    { pattern: /react/i, value: 'React', title: 'Tech Stack' },
    { pattern: /vue/i, value: 'Vue.js', title: 'Tech Stack' },
    { pattern: /angular/i, value: 'Angular', title: 'Tech Stack' },
    { pattern: /next\.?js/i, value: 'Next.js', title: 'Tech Stack' },
    { pattern: /flutter/i, value: 'Flutter', title: 'Tech Stack' },
    { pattern: /python/i, value: 'Python', title: 'Tech Stack' },
    { pattern: /node\.?js/i, value: 'Node.js', title: 'Tech Stack' },
    { pattern: /typescript/i, value: 'TypeScript', title: 'Tech Stack' },
  ],
  response_style: [
    { pattern: /(kısa|özet|brief|concise)/i, value: 'Kısa yanıtlar', title: 'Yanıt Stili' },
    { pattern: /(detaylı|ayrıntılı|detailed|comprehensive)/i, value: 'Detaylı açıklamalar', title: 'Yanıt Stili' },
    { pattern: /(adım adım|step by step)/i, value: 'Adım adım rehber', title: 'Yanıt Stili' },
  ],
  usage_purpose: [
    { pattern: /(öğren|learn|study)/i, value: 'Öğrenme amaçlı', title: 'Kullanım Amacı' },
    { pattern: /(proje|project|production)/i, value: 'Proje geliştirme', title: 'Kullanım Amacı' },
    { pattern: /(hızlı|quick|fast)/i, value: 'Hızlı çözüm', title: 'Kullanım Amacı' },
  ],
  project_context: [
    { pattern: /(mobil uygulama|mobile app)/i, value: 'Mobil uygulama', title: 'Proje Tipi' },
    { pattern: /(web sitesi|website)/i, value: 'Web sitesi', title: 'Proje Tipi' },
    { pattern: /(e-ticaret|ecommerce)/i, value: 'E-ticaret', title: 'Proje Tipi' },
    { pattern: /(dashboard|admin panel)/i, value: 'Dashboard/Admin', title: 'Proje Tipi' },
  ],
  communication_style: [
    { pattern: /(türkçe|turkish)/i, value: 'Türkçe', title: 'Dil Tercihi' },
    { pattern: /(english|ingilizce)/i, value: 'English', title: 'Dil Tercihi' },
  ]
}

// Storage keys
const STORAGE_KEYS = {
  MEMORY_CONTEXT: 'synexa_memory_context',
  MEMORY_SUGGESTIONS: 'synexa_memory_suggestions',
} as const

export class MemoryManager {
  private static instance: MemoryManager
  private memoryContext: MemoryContext
  private suggestions: MemorySuggestion[] = []
  private listeners: Set<(context: MemoryContext) => void> = new Set()

  private constructor() {
    this.memoryContext = this.loadMemoryContext()
    this.suggestions = this.loadSuggestions()
  }

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager()
    }
    return MemoryManager.instance
  }

  // Load memory context from storage
  private loadMemoryContext(): MemoryContext {
    if (typeof window === 'undefined') {
      return this.getDefaultContext()
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEMORY_CONTEXT)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          ...this.getDefaultContext(),
          ...parsed,
          items: parsed.items?.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            lastUsed: item.lastUsed ? new Date(item.lastUsed) : undefined,
          })) || [],
          lastUpdated: new Date(parsed.lastUpdated),
        }
      }
    } catch (error) {
      console.warn('Failed to load memory context:', error)
    }

    return this.getDefaultContext()
  }

  // Load suggestions from storage
  private loadSuggestions(): MemorySuggestion[] {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEMORY_SUGGESTIONS)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.warn('Failed to load memory suggestions:', error)
      return []
    }
  }

  // Save memory context to storage
  private saveMemoryContext(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEYS.MEMORY_CONTEXT, JSON.stringify(this.memoryContext))
      this.notifyListeners()
    } catch (error) {
      console.warn('Failed to save memory context:', error)
    }
  }

  // Save suggestions to storage
  private saveSuggestions(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEYS.MEMORY_SUGGESTIONS, JSON.stringify(this.suggestions))
    } catch (error) {
      console.warn('Failed to save memory suggestions:', error)
    }
  }

  // Get default memory context
  private getDefaultContext(): MemoryContext {
    return {
      items: [],
      lastUpdated: new Date(),
      totalItems: 0,
    }
  }

  // Subscribe to memory changes
  subscribe(callback: (context: MemoryContext) => void): () => void {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  // Notify listeners of memory changes
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.memoryContext))
  }

  // Get current memory context
  getMemoryContext(): MemoryContext {
    return { ...this.memoryContext }
  }

  // Get memory items by category
  getMemoryByCategory(category: MemoryCategory): MemoryItem[] {
    return this.memoryContext.items.filter(item => item.category === category && item.isActive)
  }

  // Get all active memory items
  getActiveMemory(): MemoryItem[] {
    return this.memoryContext.items.filter(item => item.isActive)
  }

  // Detect potential memory from message
  detectMemoryFromMessage(messageContent: string, messageId: string): MemorySuggestion[] {
    const detectedSuggestions: MemorySuggestion[] = []

    Object.entries(MEMORY_PATTERNS).forEach(([category, patterns]) => {
      patterns.forEach(({ pattern, value, title }) => {
        if (pattern.test(messageContent)) {
          // Check if we already have this memory
          const existingMemory = this.memoryContext.items.find(
            item => item.category === category as MemoryCategory && 
                   item.value.toLowerCase() === value.toLowerCase()
          )

          // Check if we already suggested this
          const existingSuggestion = this.suggestions.find(
            suggestion => suggestion.category === category as MemoryCategory && 
                         suggestion.value.toLowerCase() === value.toLowerCase()
          )

          if (!existingMemory && !existingSuggestion) {
            detectedSuggestions.push({
              id: generateId(),
              category: category as MemoryCategory,
              title,
              value,
              confidence: 0.8, // Could be improved with ML
              messageId,
            })
          }
        }
      })
    })

    // Add to suggestions
    this.suggestions.push(...detectedSuggestions)
    this.saveSuggestions()

    return detectedSuggestions
  }

  // Accept a memory suggestion
  acceptSuggestion(suggestionId: string): MemoryItem | null {
    const suggestion = this.suggestions.find(s => s.id === suggestionId)
    if (!suggestion) return null

    const memoryItem: MemoryItem = {
      id: generateId(),
      category: suggestion.category,
      title: suggestion.title,
      value: suggestion.value,
      isActive: true,
      createdAt: new Date(),
      source: 'auto_detected',
    }

    this.memoryContext.items.push(memoryItem)
    this.memoryContext.totalItems = this.memoryContext.items.length
    this.memoryContext.lastUpdated = new Date()

    // Mark suggestion as accepted
    suggestion.isAccepted = true
    
    this.saveMemoryContext()
    this.saveSuggestions()

    return memoryItem
  }

  // Reject a memory suggestion
  rejectSuggestion(suggestionId: string): void {
    const suggestion = this.suggestions.find(s => s.id === suggestionId)
    if (suggestion) {
      suggestion.isRejected = true
      this.saveSuggestions()
    }
  }

  // Add memory manually
  addMemory(category: MemoryCategory, title: string, value: string, source: 'manual' | 'command' = 'manual'): MemoryItem {
    const memoryItem: MemoryItem = {
      id: generateId(),
      category,
      title,
      value,
      isActive: true,
      createdAt: new Date(),
      source,
    }

    this.memoryContext.items.push(memoryItem)
    this.memoryContext.totalItems = this.memoryContext.items.length
    this.memoryContext.lastUpdated = new Date()

    this.saveMemoryContext()
    return memoryItem
  }

  // Update memory item
  updateMemory(memoryId: string, updates: Partial<MemoryItem>): MemoryItem | null {
    const memoryIndex = this.memoryContext.items.findIndex(item => item.id === memoryId)
    if (memoryIndex === -1) return null

    this.memoryContext.items[memoryIndex] = {
      ...this.memoryContext.items[memoryIndex],
      ...updates,
    }

    this.memoryContext.lastUpdated = new Date()
    this.saveMemoryContext()

    return this.memoryContext.items[memoryIndex]
  }

  // Delete memory item
  deleteMemory(memoryId: string): boolean {
    const initialLength = this.memoryContext.items.length
    this.memoryContext.items = this.memoryContext.items.filter(item => item.id !== memoryId)
    
    if (this.memoryContext.items.length < initialLength) {
      this.memoryContext.totalItems = this.memoryContext.items.length
      this.memoryContext.lastUpdated = new Date()
      this.saveMemoryContext()
      return true
    }

    return false
  }

  // Toggle memory item active state
  toggleMemory(memoryId: string): MemoryItem | null {
    const memory = this.memoryContext.items.find(item => item.id === memoryId)
    if (!memory) return null

    memory.isActive = !memory.isActive
    this.memoryContext.lastUpdated = new Date()
    this.saveMemoryContext()

    return memory
  }

  // Mark memory as used (for analytics)
  markMemoryUsed(memoryId: string): void {
    const memory = this.memoryContext.items.find(item => item.id === memoryId)
    if (memory) {
      memory.lastUsed = new Date()
      this.saveMemoryContext()
    }
  }

  // Get pending suggestions for a message
  getPendingSuggestions(messageId?: string): MemorySuggestion[] {
    return this.suggestions.filter(s => 
      !s.isAccepted && 
      !s.isRejected && 
      (!messageId || s.messageId === messageId)
    )
  }

  // Parse /remember command
  parseRememberCommand(command: string): { category: MemoryCategory; title: string; value: string } | null {
    const content = command.replace(/^\/remember\s*/i, '').trim()
    
    if (!content) return null

    // Simple parsing - could be enhanced with NLP
    // For now, treat everything as custom memory
    return {
      category: 'custom',
      title: 'Özel Tercih',
      value: content,
    }
  }

  // Get memory context for AI prompt
  getMemoryPromptContext(): string {
    const activeMemory = this.getActiveMemory()
    
    if (activeMemory.length === 0) {
      return ''
    }

    const memoryText = activeMemory.map(item => `${item.title}: ${item.value}`).join(', ')
    return `Kullanıcı tercihleri: ${memoryText}`
  }

  // Clear all memory (for testing/reset)
  clearAllMemory(): void {
    this.memoryContext = this.getDefaultContext()
    this.suggestions = []
    this.saveMemoryContext()
    this.saveSuggestions()
  }
}

// Singleton instance
export const memoryManager = MemoryManager.getInstance()











