import { Conversation, Message } from './types'

export class ConversationManager {
  private static instance: ConversationManager
  private conversations: Conversation[] = []
  private currentConversationId: string | null = null
  private listeners: Set<() => void> = new Set()

  static getInstance(): ConversationManager {
    if (!ConversationManager.instance) {
      ConversationManager.instance = new ConversationManager()
    }
    return ConversationManager.instance
  }

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem('synexa-conversations')
      if (stored) {
        const parsed = JSON.parse(stored)
        this.conversations = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            createdAt: new Date(msg.createdAt)
          }))
        }))
      }
      
      const currentId = localStorage.getItem('synexa-current-conversation')
      this.currentConversationId = currentId
    } catch (error) {
      console.error('Failed to load conversations:', error)
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem('synexa-conversations', JSON.stringify(this.conversations))
      if (this.currentConversationId) {
        localStorage.setItem('synexa-current-conversation', this.currentConversationId)
      }
    } catch (error) {
      console.error('Failed to save conversations:', error)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener())
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  // Create new conversation
  createConversation(): Conversation {
    const conversation: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
      isArchived: false,
      preview: ''
    }

    this.conversations.unshift(conversation)
    this.currentConversationId = conversation.id
    this.saveToStorage()
    this.notifyListeners()
    
    return conversation
  }

  // Get current conversation
  getCurrentConversation(): Conversation | null {
    if (!this.currentConversationId) return null
    return this.conversations.find(conv => conv.id === this.currentConversationId) || null
  }

  // Set current conversation
  setCurrentConversation(conversationId: string) {
    const conversation = this.conversations.find(conv => conv.id === conversationId)
    if (conversation && !conversation.isArchived) {
      this.currentConversationId = conversationId
      localStorage.setItem('synexa-current-conversation', conversationId)
      this.notifyListeners()
    }
  }

  // Add message to current conversation
  addMessage(message: Message) {
    const conversation = this.getCurrentConversation()
    if (!conversation) {
      // Create new conversation if none exists
      const newConv = this.createConversation()
      newConv.messages.push(message)
      newConv.updatedAt = new Date()
      newConv.preview = this.generatePreview(message.content)
      
      // Auto-generate title after first exchange
      if (newConv.messages.length >= 2) {
        this.generateTitle(newConv.id)
      }
    } else {
      conversation.messages.push(message)
      conversation.updatedAt = new Date()
      conversation.preview = this.generatePreview(message.content)
      
      // Auto-generate title after first exchange
      if (conversation.messages.length >= 2 && conversation.title === 'New Chat') {
        this.generateTitle(conversation.id)
      }
    }
    
    this.saveToStorage()
    this.notifyListeners()
  }

  // Update messages for current conversation
  updateMessages(messages: Message[]) {
    const conversation = this.getCurrentConversation()
    if (conversation) {
      conversation.messages = messages
      conversation.updatedAt = new Date()
      if (messages.length > 0) {
        conversation.preview = this.generatePreview(messages[messages.length - 1].content)
      }
      
      // Auto-generate title after first exchange
      if (messages.length >= 2 && conversation.title === 'New Chat') {
        this.generateTitle(conversation.id)
      }
      
      this.saveToStorage()
      this.notifyListeners()
    }
  }

  // Generate preview from message content
  private generatePreview(content: string): string {
    return content.length > 60 ? content.substring(0, 60) + '...' : content
  }

  // Auto-generate title (simplified version)
  private generateTitle(conversationId: string) {
    const conversation = this.conversations.find(conv => conv.id === conversationId)
    if (!conversation || conversation.messages.length < 2) return

    const firstUserMessage = conversation.messages.find(msg => msg.role === 'user')
    if (firstUserMessage) {
      // Simple title generation from first user message
      let title = firstUserMessage.content
      
      // Clean up and shorten
      title = title.replace(/[^\w\s]/g, '').trim()
      if (title.length > 30) {
        title = title.substring(0, 30) + '...'
      }
      
      if (title.length > 5) {
        conversation.title = title
        this.saveToStorage()
        this.notifyListeners()
      }
    }
  }

  // Rename conversation
  renameConversation(conversationId: string, newTitle: string) {
    const conversation = this.conversations.find(conv => conv.id === conversationId)
    if (conversation) {
      conversation.title = newTitle.trim() || 'Untitled Chat'
      conversation.updatedAt = new Date()
      this.saveToStorage()
      this.notifyListeners()
    }
  }

  // Pin/unpin conversation
  togglePin(conversationId: string) {
    const conversation = this.conversations.find(conv => conv.id === conversationId)
    if (conversation) {
      conversation.isPinned = !conversation.isPinned
      conversation.updatedAt = new Date()
      
      // Re-sort conversations
      this.sortConversations()
      this.saveToStorage()
      this.notifyListeners()
    }
  }

  // Archive/unarchive conversation
  toggleArchive(conversationId: string) {
    const conversation = this.conversations.find(conv => conv.id === conversationId)
    if (conversation) {
      conversation.isArchived = !conversation.isArchived
      conversation.updatedAt = new Date()
      
      // If archiving current conversation, switch to another
      if (conversation.isArchived && this.currentConversationId === conversationId) {
        const activeConversations = this.conversations.filter(conv => !conv.isArchived)
        this.currentConversationId = activeConversations.length > 0 ? activeConversations[0].id : null
        if (this.currentConversationId) {
          localStorage.setItem('synexa-current-conversation', this.currentConversationId)
        } else {
          localStorage.removeItem('synexa-current-conversation')
        }
      }
      
      this.saveToStorage()
      this.notifyListeners()
    }
  }

  // Delete conversation
  deleteConversation(conversationId: string) {
    const index = this.conversations.findIndex(conv => conv.id === conversationId)
    if (index !== -1) {
      this.conversations.splice(index, 1)
      
      // If deleting current conversation, switch to another
      if (this.currentConversationId === conversationId) {
        const activeConversations = this.conversations.filter(conv => !conv.isArchived)
        this.currentConversationId = activeConversations.length > 0 ? activeConversations[0].id : null
        if (this.currentConversationId) {
          localStorage.setItem('synexa-current-conversation', this.currentConversationId)
        } else {
          localStorage.removeItem('synexa-current-conversation')
        }
      }
      
      this.saveToStorage()
      this.notifyListeners()
    }
  }

  // Get all conversations with filtering
  getConversations(filter: 'all' | 'pinned' | 'archived' = 'all'): Conversation[] {
    let filtered = this.conversations

    switch (filter) {
      case 'pinned':
        filtered = this.conversations.filter(conv => conv.isPinned && !conv.isArchived)
        break
      case 'archived':
        filtered = this.conversations.filter(conv => conv.isArchived)
        break
      default:
        filtered = this.conversations.filter(conv => !conv.isArchived)
    }

    return this.sortConversations(filtered)
  }

  // Search conversations
  searchConversations(query: string): Conversation[] {
    const lowercaseQuery = query.toLowerCase()
    return this.conversations.filter(conv => 
      !conv.isArchived && (
        conv.title.toLowerCase().includes(lowercaseQuery) ||
        conv.preview.toLowerCase().includes(lowercaseQuery) ||
        conv.messages.some(msg => msg.content.toLowerCase().includes(lowercaseQuery))
      )
    )
  }

  // Sort conversations (pinned first, then by updatedAt)
  private sortConversations(conversations: Conversation[] = this.conversations): Conversation[] {
    return [...conversations].sort((a, b) => {
      // Pinned conversations first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      // Then by updatedAt (newest first)
      return b.updatedAt.getTime() - a.updatedAt.getTime()
    })
  }

  // Get conversation count
  getConversationCount(): { total: number, pinned: number, archived: number } {
    return {
      total: this.conversations.filter(conv => !conv.isArchived).length,
      pinned: this.conversations.filter(conv => conv.isPinned && !conv.isArchived).length,
      archived: this.conversations.filter(conv => conv.isArchived).length
    }
  }
}

// Export singleton instance
export const conversationManager = ConversationManager.getInstance()





