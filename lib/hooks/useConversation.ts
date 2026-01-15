import { useState, useEffect } from 'react'
import { conversationManager } from '../conversation'
import { Conversation, Message } from '../types'

export function useConversation() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const updateState = () => {
      setConversations(conversationManager.getConversations())
      setCurrentConversation(conversationManager.getCurrentConversation())
      setIsLoading(false)
    }

    // Initial load
    updateState()

    // Subscribe to changes
    const unsubscribe = conversationManager.subscribe(updateState)

    return unsubscribe
  }, [])

  const createConversation = () => {
    return conversationManager.createConversation()
  }

  const switchConversation = (conversationId: string) => {
    conversationManager.setCurrentConversation(conversationId)
  }

  const addMessage = (message: Message) => {
    conversationManager.addMessage(message)
  }

  const updateMessages = (messages: Message[]) => {
    conversationManager.updateMessages(messages)
  }

  const renameConversation = (conversationId: string, newTitle: string) => {
    conversationManager.renameConversation(conversationId, newTitle)
  }

  const togglePin = (conversationId: string) => {
    conversationManager.togglePin(conversationId)
  }

  const toggleArchive = (conversationId: string) => {
    conversationManager.toggleArchive(conversationId)
  }

  const deleteConversation = (conversationId: string) => {
    conversationManager.deleteConversation(conversationId)
  }

  const searchConversations = (query: string) => {
    return conversationManager.searchConversations(query)
  }

  const getConversations = (filter: 'all' | 'pinned' | 'archived' = 'all') => {
    return conversationManager.getConversations(filter)
  }

  const getConversationCount = () => {
    return conversationManager.getConversationCount()
  }

  return {
    // State
    conversations,
    currentConversation,
    isLoading,

    // Actions
    createConversation,
    switchConversation,
    addMessage,
    updateMessages,
    renameConversation,
    togglePin,
    toggleArchive,
    deleteConversation,
    searchConversations,
    getConversations,
    getConversationCount
  }
}











