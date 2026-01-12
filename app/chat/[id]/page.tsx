'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { ChatConversation } from '@/lib/api/chat'
import { conversationManager } from '@/lib/conversation'

interface ChatConversationPageProps {
  params: {
    id: string
  }
}

export default function ChatConversationPage({ params }: ChatConversationPageProps) {
  const router = useRouter()
  const [conversation, setConversation] = useState<ChatConversation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConversation = async () => {
      try {
        // Get conversation from conversation manager
        const conversations = conversationManager.getConversations()
        const foundConversation = conversations.find(c => c.id === params.id)
        
        if (!foundConversation) {
          notFound()
          return
        }
        
        // Convert to ChatConversation format
        const chatConversation: ChatConversation = {
          id: foundConversation.id,
          title: foundConversation.title,
          messages: foundConversation.messages.map(msg => ({
            id: msg.id,
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content,
            timestamp: msg.createdAt.toISOString()
          })),
          createdAt: foundConversation.createdAt.toISOString(),
          updatedAt: foundConversation.updatedAt.toISOString()
        }
        
        setConversation(chatConversation)
        
        // Set as current conversation
        conversationManager.setCurrentConversation(params.id)
      } catch (error) {
        console.error('Failed to load conversation:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadConversation()
  }, [params.id])

  useEffect(() => {
    // If conversation is loaded, redirect to main chat page with this conversation active
    if (conversation) {
      router.replace('/chat')
    }
  }, [conversation, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    )
  }

  // This component will redirect, so we don't need to render anything
  return null
}
