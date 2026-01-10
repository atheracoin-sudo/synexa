'use client'

import { config } from '@/lib/config'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  metadata?: {
    model?: string
    tokens?: number
    processingTime?: number
  }
}

export interface ChatConversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
  pinned?: boolean
  archived?: boolean
}

export interface ChatResponse {
  message: ChatMessage
  conversation: ChatConversation
  usage: {
    tokensUsed: number
    remainingQuota: number
  }
}

// Simulated AI responses for production-like behavior
const aiResponses = [
  "I'd be happy to help you with that! Let me break this down step by step.",
  "That's a great question. Here's what I think about this topic:",
  "I can definitely assist you with this. Let me provide a comprehensive solution:",
  "Based on your request, here's my recommendation:",
  "Let me help you understand this concept better:",
  "I'll walk you through this process:",
  "Here's a detailed explanation of what you're asking about:",
  "That's an interesting challenge. Here's how I would approach it:",
  "I can see what you're trying to accomplish. Let me suggest:",
  "This is a common question, and here's the best way to handle it:"
]

// Simulate streaming response
export async function* streamChatResponse(
  message: string,
  conversationId?: string
): AsyncGenerator<{ content: string; done: boolean }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Generate response based on user message
  let response = generateContextualResponse(message)
  
  // Stream the response word by word
  const words = response.split(' ')
  let currentContent = ''
  
  for (let i = 0; i < words.length; i++) {
    currentContent += (i > 0 ? ' ' : '') + words[i]
    
    yield {
      content: currentContent,
      done: false
    }
    
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100))
  }
  
  yield {
    content: currentContent,
    done: true
  }
}

// Generate contextual response based on user input
function generateContextualResponse(userMessage: string): string {
  const message = userMessage.toLowerCase()
  
  // Code-related responses
  if (message.includes('code') || message.includes('programming') || message.includes('app')) {
    return `I can help you with coding! Whether you need to build a web app, mobile app, or just write some functions, I'm here to assist. Would you like me to generate some code for you, or would you prefer to move this conversation to Code Studio where I can build a complete application?

Here are some things I can help with:
- Writing functions and components
- Debugging existing code  
- Explaining programming concepts
- Building full applications in Code Studio

What specific coding task are you working on?`
  }
  
  // Design-related responses
  if (message.includes('design') || message.includes('image') || message.includes('visual')) {
    return `I'd love to help with your design needs! I can assist with creating images, graphics, UI designs, and visual concepts. 

For more advanced design work, you might want to try our Image Studio where you can:
- Generate custom images with AI
- Create logos and graphics
- Design UI mockups
- Edit and enhance existing images

What kind of design are you looking to create?`
  }
  
  // Business/startup related
  if (message.includes('business') || message.includes('startup') || message.includes('idea')) {
    return `That sounds like an exciting business opportunity! I can help you think through various aspects of your idea:

- Market research and validation
- Business model development  
- Technical implementation planning
- Go-to-market strategy
- Product roadmap planning

If you're looking to build an MVP or prototype, our AI Agents can help automate much of the initial development work. Would you like to explore that option?

What's the core problem your business idea solves?`
  }
  
  // Learning/education related
  if (message.includes('learn') || message.includes('tutorial') || message.includes('how to')) {
    return `I'm here to help you learn! I can explain concepts, provide step-by-step tutorials, and guide you through complex topics.

Some ways I can assist with learning:
- Breaking down complex concepts into simple terms
- Providing practical examples and exercises
- Creating custom learning paths
- Answering follow-up questions

Our AI Agents also include specialized tutors for different subjects if you need more structured learning.

What would you like to learn about today?`
  }
  
  // Default responses
  const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
  
  return `${randomResponse}

${generateFollowUpSuggestion(message)}`
}

function generateFollowUpSuggestion(message: string): string {
  const suggestions = [
    "Is there anything specific you'd like me to elaborate on?",
    "Would you like me to provide more details about any particular aspect?",
    "Do you have any follow-up questions about this?",
    "Would you like to see this implemented in one of our studios?",
    "Is there a particular use case you have in mind?",
    "Would you like me to break this down further?",
    "Are you looking for a more technical or conceptual explanation?",
    "Would you like to explore this topic in more depth?"
  ]
  
  return suggestions[Math.floor(Math.random() * suggestions.length)]
}

// Chat API functions
export class ChatAPI {
  private static conversations: Map<string, ChatConversation> = new Map()
  
  static async sendMessage(
    content: string,
    conversationId?: string
  ): Promise<ChatResponse> {
    try {
      // Get or create conversation
      let conversation = conversationId 
        ? this.conversations.get(conversationId)
        : null
      
      if (!conversation) {
        conversation = {
          id: conversationId || `conv_${Date.now()}`,
          title: this.generateTitle(content),
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
      
      // Add user message
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}_user`,
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      }
      
      conversation.messages.push(userMessage)
      
      // Generate AI response
      const aiContent = generateContextualResponse(content)
      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}_ai`,
        role: 'assistant',
        content: aiContent,
        timestamp: new Date().toISOString(),
        metadata: {
          model: 'synexa-ai-v1',
          tokens: Math.floor(aiContent.length / 4), // Rough token estimate
          processingTime: Math.floor(Math.random() * 2000) + 500
        }
      }
      
      conversation.messages.push(aiMessage)
      conversation.updatedAt = new Date().toISOString()
      
      // Save conversation
      this.conversations.set(conversation.id, conversation)
      
      return {
        message: aiMessage,
        conversation,
        usage: {
          tokensUsed: aiMessage.metadata?.tokens || 0,
          remainingQuota: 1000 // This would come from user's plan
        }
      }
      
    } catch (error) {
      throw new Error(config.errors.serverError)
    }
  }
  
  static async getConversations(): Promise<ChatConversation[]> {
    return Array.from(this.conversations.values())
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }
  
  static async getConversation(id: string): Promise<ChatConversation | null> {
    return this.conversations.get(id) || null
  }
  
  static async updateConversation(
    id: string, 
    updates: Partial<ChatConversation>
  ): Promise<ChatConversation | null> {
    const conversation = this.conversations.get(id)
    if (!conversation) return null
    
    const updated = { ...conversation, ...updates, updatedAt: new Date().toISOString() }
    this.conversations.set(id, updated)
    return updated
  }
  
  static async deleteConversation(id: string): Promise<boolean> {
    return this.conversations.delete(id)
  }
  
  private static generateTitle(firstMessage: string): string {
    // Generate a title from the first message
    const words = firstMessage.split(' ').slice(0, 6)
    let title = words.join(' ')
    
    if (title.length > 50) {
      title = title.substring(0, 47) + '...'
    }
    
    return title || 'New Conversation'
  }
  
  // Initialize with some sample conversations
  static initialize() {
    const sampleConversations: ChatConversation[] = [
      {
        id: 'conv_1',
        title: 'Building a Todo App',
        messages: [
          {
            id: 'msg_1_user',
            role: 'user',
            content: 'I want to build a todo app with React',
            timestamp: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 'msg_1_ai',
            role: 'assistant',
            content: 'I can help you build a todo app with React! Let me create a complete application for you with all the essential features like adding, editing, deleting, and marking todos as complete.\n\nWould you like me to move this to Code Studio where I can build the full application with a live preview?',
            timestamp: new Date(Date.now() - 86400000 + 30000).toISOString()
          }
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 + 30000).toISOString(),
        pinned: true
      },
      {
        id: 'conv_2',
        title: 'Logo Design Ideas',
        messages: [
          {
            id: 'msg_2_user',
            role: 'user',
            content: 'Can you help me design a logo for my startup?',
            timestamp: new Date(Date.now() - 172800000).toISOString()
          },
          {
            id: 'msg_2_ai',
            role: 'assistant',
            content: 'Absolutely! I\'d love to help you create a logo for your startup. To design something perfect for your brand, I\'ll need to know a bit more:\n\n- What\'s your startup about?\n- What style are you looking for? (modern, classic, playful, professional)\n- Any specific colors you prefer?\n- Do you have any existing brand elements?\n\nOnce I understand your vision, we can move to Image Studio where I can generate multiple logo concepts for you to choose from!',
            timestamp: new Date(Date.now() - 172800000 + 45000).toISOString()
          }
        ],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000 + 45000).toISOString()
      }
    ]
    
    sampleConversations.forEach(conv => {
      this.conversations.set(conv.id, conv)
    })
  }
}

// Initialize sample data
ChatAPI.initialize()






