'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/GlobalHeader'
import { BottomTabBar } from '@/components/ui/BottomTabBar'
import { agentsManager, AgentHistory, WorkflowAgent } from '@/lib/agents'
import { 
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Filter,
  Calendar,
  TrendingUp,
  BarChart3,
  Crown,
  Play,
  Eye,
  Trash2,
  Search
} from 'lucide-react'

export default function AgentHistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState<AgentHistory[]>([])
  const [agents, setAgents] = useState<Map<string, WorkflowAgent>>(new Map())
  const [filteredHistory, setFilteredHistory] = useState<AgentHistory[]>([])
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'failed'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load history and agent data
    const userHistory = agentsManager.getUserHistory('user_1')
    setHistory(userHistory)

    // Load agent details
    const agentMap = new Map<string, WorkflowAgent>()
    userHistory.forEach(item => {
      const agent = agentsManager.getAgent(item.agentId)
      if (agent) {
        agentMap.set(item.agentId, agent)
      }
    })
    setAgents(agentMap)
    
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Filter history
    let filtered = history

    // Status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(item => item.status === selectedFilter)
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item => {
        const agent = agents.get(item.agentId)
        return agent?.name.toLowerCase().includes(query) ||
               agent?.description.toLowerCase().includes(query) ||
               agent?.tags.some(tag => tag.toLowerCase().includes(query))
      })
    }

    setFilteredHistory(filtered)
  }, [history, agents, selectedFilter, searchQuery])

  const handleRerun = (agentId: string) => {
    router.push(`/agents/${agentId}`)
  }

  const handleViewResults = (historyId: string) => {
    // In a real app, you'd navigate to the specific execution results
    // For now, we'll navigate to the agent detail page
    const historyItem = history.find(h => h.id === historyId)
    if (historyItem) {
      router.push(`/agents/${historyItem.agentId}`)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-600/10 border-green-500/30'
      case 'failed':
        return 'text-red-400 bg-red-600/10 border-red-500/30'
      default:
        return 'text-gray-400 bg-gray-600/10 border-gray-500/30'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  // Calculate stats
  const totalExecutions = history.length
  const completedExecutions = history.filter(h => h.status === 'completed').length
  const totalTimeSpent = history.reduce((acc, h) => acc + h.duration, 0)
  const averageSuccessRate = totalExecutions > 0 ? Math.round((completedExecutions / totalExecutions) * 100) : 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader title="Agent History" showBack={true} backUrl="/agents" />
        <main className="container mx-auto px-4 py-8 pb-24">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
        <BottomTabBar />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader 
        title="Agent History" 
        showBack={true}
        backUrl="/agents"
      />

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <BarChart3 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalExecutions}</div>
            <div className="text-sm text-gray-400">Total Runs</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{completedExecutions}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{agentsManager.formatDuration(totalTimeSpent)}</div>
            <div className="text-sm text-gray-400">Time Saved</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <TrendingUp className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{averageSuccessRate}%</div>
            <div className="text-sm text-gray-400">Success Rate</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by agent name or description..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as any)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length > 0 ? (
          <div className="space-y-4">
            {filteredHistory.map((item) => {
              const agent = agents.get(item.agentId)
              if (!agent) return null

              return (
                <div
                  key={item.id}
                  className="bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 rounded-2xl p-6 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Agent Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                      {agent.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {agent.name}
                            {agent.isPremium && <Crown className="w-4 h-4 text-yellow-400" />}
                          </h3>
                          <p className="text-gray-400 text-sm">{agent.description}</p>
                        </div>
                        
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm border ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          <span className="capitalize">{item.status}</span>
                        </div>
                      </div>

                      {/* Execution Details */}
                      <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.executedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{agentsManager.formatDuration(item.duration)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" />
                          <span>{agent.steps.length} steps</span>
                        </div>
                      </div>

                      {/* Outputs Summary */}
                      {item.outputs && Object.keys(item.outputs).length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm text-gray-300 mb-2">Outputs:</div>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(item.outputs).map(([key, value]) => (
                              <span
                                key={key}
                                className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg text-xs"
                              >
                                {key}: {typeof value === 'string' ? value.substring(0, 30) + '...' : String(value)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        {item.status === 'completed' && (
                          <button
                            onClick={() => handleViewResults(item.id)}
                            className="flex items-center gap-2 px-3 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View Results
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleRerun(agent.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Run Again
                        </button>

                        <button
                          onClick={() => router.push(`/agents/${agent.id}`)}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 text-gray-400 rounded-lg text-sm font-medium transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Agent
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              {history.length === 0 ? 'No Agent History' : 'No Results Found'}
            </h3>
            <p className="text-gray-400 mb-6">
              {history.length === 0 
                ? 'You haven\'t run any agents yet. Start by exploring our agent marketplace.'
                : `No agents match your search "${searchQuery}" with the selected filters.`
              }
            </p>
            <div className="flex justify-center gap-3">
              {history.length === 0 ? (
                <button
                  onClick={() => router.push('/agents')}
                  className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:scale-105 transition-transform"
                >
                  Explore Agents
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedFilter('all')
                    }}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => router.push('/agents')}
                    className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:scale-105 transition-transform"
                  >
                    Run New Agent
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {history.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-4">Ready for More?</h3>
            <p className="text-blue-200 mb-6">
              Explore new agents or create custom workflows to automate more of your tasks.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => router.push('/agents')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Play className="w-4 h-4" />
                Browse Agents
              </button>
              <button
                onClick={() => router.push('/agents/create')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Create Custom Agent
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}






