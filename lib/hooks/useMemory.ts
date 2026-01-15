'use client'

import { useState, useEffect } from 'react'
import { memoryManager } from '@/lib/memory'
import { MemoryContext, MemoryItem, MemorySuggestion, MemoryCategory } from '@/lib/types'

export function useMemory() {
  const [memoryContext, setMemoryContext] = useState<MemoryContext>(memoryManager.getMemoryContext())

  useEffect(() => {
    // Subscribe to memory changes
    const unsubscribe = memoryManager.subscribe(setMemoryContext)
    return unsubscribe
  }, [])

  return {
    // Memory context
    memoryContext,
    
    // Memory items
    activeMemory: memoryManager.getActiveMemory(),
    getMemoryByCategory: (category: MemoryCategory) => memoryManager.getMemoryByCategory(category),
    
    // Memory management
    addMemory: (category: MemoryCategory, title: string, value: string, source?: 'manual' | 'command') => 
      memoryManager.addMemory(category, title, value, source),
    updateMemory: (memoryId: string, updates: Partial<MemoryItem>) => 
      memoryManager.updateMemory(memoryId, updates),
    deleteMemory: (memoryId: string) => memoryManager.deleteMemory(memoryId),
    toggleMemory: (memoryId: string) => memoryManager.toggleMemory(memoryId),
    
    // Memory detection
    detectMemoryFromMessage: (messageContent: string, messageId: string) => 
      memoryManager.detectMemoryFromMessage(messageContent, messageId),
    
    // Suggestions
    getPendingSuggestions: (messageId?: string) => memoryManager.getPendingSuggestions(messageId),
    acceptSuggestion: (suggestionId: string) => memoryManager.acceptSuggestion(suggestionId),
    rejectSuggestion: (suggestionId: string) => memoryManager.rejectSuggestion(suggestionId),
    
    // Commands
    parseRememberCommand: (command: string) => memoryManager.parseRememberCommand(command),
    
    // AI context
    getMemoryPromptContext: () => memoryManager.getMemoryPromptContext(),
    markMemoryUsed: (memoryId: string) => memoryManager.markMemoryUsed(memoryId),
    
    // Utility
    clearAllMemory: () => memoryManager.clearAllMemory(),
  }
}











