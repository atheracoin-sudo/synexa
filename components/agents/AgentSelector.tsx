'use client'

import React, { useState } from 'react'
import { useAgents } from '@/lib/hooks/useAgents'
import { AIAgent } from '@/lib/types'
import { WorkflowAgent } from '@/lib/agents'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SimpleDropdown, SimpleDropdownItem } from '@/components/ui/simple-dropdown'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, Bot, Plus, Sparkles } from 'lucide-react'

interface AgentSelectorProps {
  className?: string
  onCreateAgent?: () => void
}

export function AgentSelector({ className, onCreateAgent }: AgentSelectorProps) {
  const { currentAgent, agents, selectAgent } = useAgents()

  const handleAgentSelect = (agentId: string | null) => {
    selectAgent(agentId)
  }

  const getAgentCapabilityBadges = (agent: WorkflowAgent) => {
    const capabilityColors = {
      chat: 'bg-blue-500/10 text-blue-500',
      code: 'bg-green-500/10 text-green-500', 
      design: 'bg-purple-500/10 text-purple-500',
      analysis: 'bg-orange-500/10 text-orange-500'
    }

    // WorkflowAgent doesn't have capabilities, return empty array
    return []
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <SimpleDropdown
        trigger={
          <Button
            variant="outline"
            className="flex items-center gap-2 min-w-[200px] justify-between"
          >
            <div className="flex items-center gap-2">
              {currentAgent ? (
                <>
                  <span className="text-lg">{currentAgent.icon}</span>
                  <span className="font-medium">{currentAgent.name}</span>
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4" />
                  <span>Agent Seç</span>
                </>
              )}
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        }
        className="w-80"
      >
        {/* No Agent Option */}
        <SimpleDropdownItem
          onClick={() => handleAgentSelect(null)}
          className={cn(
            "flex items-center gap-3 p-3",
            !currentAgent && "bg-muted"
          )}
        >
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Genel AI</div>
              <div className="text-xs text-muted-foreground">Standart AI asistan</div>
            </div>
          </div>
        </SimpleDropdownItem>

        <div className="my-2 h-px bg-border" />

        {/* Built-in Agents */}
        <div className="px-2 py-1">
          <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Hazır Agentlar
          </div>
          {agents.map((agent) => (
            <SimpleDropdownItem
              key={agent.id}
              onClick={() => handleAgentSelect(agent.id)}
              className={cn(
                "flex items-start gap-3 p-3 mb-1",
                currentAgent?.id === agent.id && "bg-muted"
              )}
            >
              <span className="text-xl flex-shrink-0 mt-0.5">{agent.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{agent.name}</div>
                <div className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {agent.description}
                </div>
                <div className="flex flex-wrap gap-1">
                  {getAgentCapabilityBadges(agent)}
                </div>
              </div>
            </SimpleDropdownItem>
          ))}
        </div>

        {/* Custom Agents */}
        {false && ( // Disabled custom agents section for WorkflowAgent
          <>
            <div className="my-2 h-px bg-border" />
            <div className="px-2 py-1">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                Özel Agentlar
              </div>
              {/* Custom agents disabled for WorkflowAgent */}
            </div>
          </>
        )}

        {/* Create Agent */}
        {onCreateAgent && (
          <>
            <div className="my-2 h-px bg-border" />
            <SimpleDropdownItem
              onClick={onCreateAgent}
              className="flex items-center gap-2 p-3 text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium">Kendi Agent'ını Oluştur</span>
            </SimpleDropdownItem>
          </>
        )}
      </SimpleDropdown>

      {/* Current Agent Badge */}
      {currentAgent && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <span>{currentAgent.icon}</span>
          <span className="text-xs">{currentAgent.description}</span>
        </Badge>
      )}
    </div>
  )
}






