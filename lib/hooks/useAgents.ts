import { useState, useEffect } from 'react'
import { agentManager } from '../agents'
import { AIAgent, AgentCapability } from '../types'

export function useAgents() {
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [currentAgent, setCurrentAgent] = useState<AIAgent | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const updateState = () => {
      setAgents(agentManager.getAllAgents())
      setCurrentAgent(agentManager.getCurrentAgent())
      setIsLoading(false)
    }

    // Initial load
    updateState()

    // Subscribe to changes
    const unsubscribe = agentManager.subscribe(updateState)

    return unsubscribe
  }, [])

  const selectAgent = (agentId: string | null) => {
    agentManager.setCurrentAgent(agentId)
  }

  const createCustomAgent = (agent: {
    name: string
    role: string
    description: string
    avatar: string
    capabilities: AgentCapability[]
    systemPrompt: string
  }) => {
    return agentManager.createCustomAgent(agent)
  }

  const updateCustomAgent = (agentId: string, updates: Partial<AIAgent>) => {
    return agentManager.updateCustomAgent(agentId, updates)
  }

  const deleteCustomAgent = (agentId: string) => {
    return agentManager.deleteCustomAgent(agentId)
  }

  const getBuiltInAgents = () => {
    return agentManager.getBuiltInAgents()
  }

  const getCustomAgents = () => {
    return agentManager.getCustomAgents()
  }

  const getCurrentSystemPrompt = () => {
    return agentManager.getCurrentSystemPrompt()
  }

  const updateAgentMemory = (agentId: string, context: string) => {
    agentManager.updateAgentMemory(agentId, context)
  }

  return {
    // State
    agents,
    currentAgent,
    isLoading,

    // Actions
    selectAgent,
    createCustomAgent,
    updateCustomAgent,
    deleteCustomAgent,
    getBuiltInAgents,
    getCustomAgents,
    getCurrentSystemPrompt,
    updateAgentMemory
  }
}





