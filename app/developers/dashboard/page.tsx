'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/GlobalHeader'
import { BottomTabBar } from '@/components/ui/BottomTabBar'
import { developerManager, type ApiKey, type ApiScope } from '@/lib/developer'
import { 
  Key,
  Plus,
  Copy,
  Check,
  Eye,
  EyeOff,
  MoreVertical,
  Trash2,
  RotateCcw,
  Activity,
  Zap,
  Shield,
  Webhook,
  BarChart3,
  AlertTriangle,
  ExternalLink,
  Calendar,
  TrendingUp,
  Users,
  Globe
} from 'lucide-react'

export default function DeveloperDashboardPage() {
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showKeyModal, setShowKeyModal] = useState<ApiKey | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const usage = developerManager.getUsage()

  useEffect(() => {
    setApiKeys(developerManager.getApiKeys())
  }, [])

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(keyId)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys)
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId)
    } else {
      newVisible.add(keyId)
    }
    setVisibleKeys(newVisible)
  }

  const handleRotateKey = (keyId: string) => {
    const rotatedKey = developerManager.rotateApiKey(keyId)
    if (rotatedKey) {
      setApiKeys(developerManager.getApiKeys())
      setShowKeyModal(rotatedKey)
    }
    setActiveDropdown(null)
  }

  const handleRevokeKey = (keyId: string) => {
    developerManager.revokeApiKey(keyId)
    setApiKeys(developerManager.getApiKeys())
    setActiveDropdown(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20'
      case 'revoked': return 'text-red-400 bg-red-400/20'
      case 'expired': return 'text-yellow-400 bg-yellow-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader 
        title="Developer Dashboard" 
        showBack={true}
        backUrl="/developers"
      />

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {developerManager.formatUsageCount(usage.requestsThisMonth)}
                </div>
                <div className="text-sm text-gray-400">Requests This Month</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12% from last month</span>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {apiKeys.filter(k => k.status === 'active').length}
                </div>
                <div className="text-sm text-gray-400">Active API Keys</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              {apiKeys.length} total keys
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {usage.rateLimitHits}
                </div>
                <div className="text-sm text-gray-400">Rate Limit Hits</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              Last 30 days
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-sm text-gray-400">API Uptime</div>
              </div>
            </div>
            <div className="text-green-400 text-sm">
              All systems operational
            </div>
          </div>
        </div>

        {/* Usage Chart */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">API Usage</h2>
            <button className="text-gray-400 hover:text-white text-sm">
              View Details →
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Usage by Day Chart */}
            <div className="lg:col-span-2">
              <div className="h-48 bg-gray-900 rounded-xl p-4 flex items-end justify-between gap-2">
                {usage.usageByDay.map((day, index) => {
                  const height = (day.requests / Math.max(...usage.usageByDay.map(d => d.requests))) * 100
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      />
                      <div className="text-xs text-gray-400 mt-2">
                        {new Date(day.date).getDate()}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top Endpoints */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Top Endpoints</h3>
              <div className="space-y-3">
                {usage.topEndpoints.map((endpoint) => (
                  <div key={endpoint.endpoint} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {endpoint.endpoint}
                      </div>
                      <div className="text-xs text-gray-400">
                        {developerManager.formatUsageCount(endpoint.count)} calls
                      </div>
                    </div>
                    <div className="text-sm text-gray-300">
                      {endpoint.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">API Keys</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Key
            </button>
          </div>

          {apiKeys.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No API Keys</h3>
              <p className="text-gray-400 mb-6">Create your first API key to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                Create API Key
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="bg-gray-900/50 border border-gray-600 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Key className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{apiKey.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apiKey.status)}`}>
                            {apiKey.status}
                          </span>
                          <span className="text-xs text-gray-400">
                            Created {formatDate(apiKey.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === apiKey.id ? null : apiKey.id)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>

                      {activeDropdown === apiKey.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => handleRotateKey(apiKey.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:bg-gray-700 rounded-t-lg"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Rotate Key
                          </button>
                          <button
                            onClick={() => handleRevokeKey(apiKey.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-400 hover:bg-gray-700 rounded-b-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                            Revoke Key
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* API Key Value */}
                  <div className="bg-gray-800 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <code className="text-sm text-gray-300 font-mono">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : apiKey.maskedKey}
                      </code>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                        >
                          {visibleKeys.has(apiKey.id) ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                          className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                        >
                          {copiedKey === apiKey.id ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Usage</div>
                      <div className="text-white font-medium">
                        {developerManager.formatUsageCount(apiKey.usageCount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Rate Limit</div>
                      <div className="text-white font-medium">
                        {apiKey.rateLimitRemaining}/{apiKey.rateLimit}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Scopes</div>
                      <div className="flex gap-1">
                        {apiKey.scopes.map((scope) => (
                          <span key={scope} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                            {developerManager.getScopeIcon(scope)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Last Used</div>
                      <div className="text-white font-medium text-sm">
                        {apiKey.lastUsed ? formatDate(apiKey.lastUsed) : 'Never'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/docs')}
            className="bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 rounded-2xl p-6 text-left transition-colors group"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ExternalLink className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Documentation</h3>
            <p className="text-gray-400 text-sm">
              Learn how to integrate Synexa API
            </p>
          </button>

          <button
            onClick={() => router.push('/developers/webhooks')}
            className="bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 rounded-2xl p-6 text-left transition-colors group"
          >
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Webhook className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Webhooks</h3>
            <p className="text-gray-400 text-sm">
              Configure event notifications
            </p>
          </button>

          <button
            onClick={() => router.push('/docs/playground')}
            className="bg-gray-800/50 border border-gray-700 hover:border-green-500/50 rounded-2xl p-6 text-left transition-colors group"
          >
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">API Playground</h3>
            <p className="text-gray-400 text-sm">
              Test API endpoints interactively
            </p>
          </button>
        </div>
      </main>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <CreateApiKeyModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(newKey) => {
            setApiKeys(developerManager.getApiKeys())
            setShowKeyModal(newKey)
            setShowCreateModal(false)
          }}
        />
      )}

      {/* Show New Key Modal */}
      {showKeyModal && (
        <ShowKeyModal
          apiKey={showKeyModal}
          onClose={() => setShowKeyModal(null)}
        />
      )}

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}

// Create API Key Modal Component
function CreateApiKeyModal({ 
  onClose, 
  onCreated 
}: { 
  onClose: () => void
  onCreated: (key: ApiKey) => void 
}) {
  const [keyName, setKeyName] = useState('')
  const [selectedScopes, setSelectedScopes] = useState<ApiScope[]>(['chat'])
  const [isCreating, setIsCreating] = useState(false)

  const scopes: { id: ApiScope; name: string; description: string; isPremium: boolean }[] = [
    { id: 'chat', name: 'Chat API', description: 'Conversational AI capabilities', isPremium: false },
    { id: 'agents', name: 'Agents API', description: 'Automated workflow execution', isPremium: true },
    { id: 'code', name: 'Code API', description: 'Code generation and analysis', isPremium: false },
    { id: 'image', name: 'Image API', description: 'Image generation and editing', isPremium: false }
  ]

  const toggleScope = (scope: ApiScope) => {
    if (selectedScopes.includes(scope)) {
      setSelectedScopes(selectedScopes.filter(s => s !== scope))
    } else {
      setSelectedScopes([...selectedScopes, scope])
    }
  }

  const handleCreate = async () => {
    if (!keyName.trim() || selectedScopes.length === 0) return

    setIsCreating(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newKey = developerManager.createApiKey(keyName.trim(), selectedScopes)
    onCreated(newKey)
    setIsCreating(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-6">Create API Key</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Key Name
            </label>
            <input
              type="text"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="e.g., Production Key"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Scopes
            </label>
            <div className="space-y-2">
              {scopes.map((scope) => (
                <label key={scope.id} className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedScopes.includes(scope.id)}
                    onChange={() => toggleScope(scope.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{scope.name}</span>
                      {scope.isPremium && (
                        <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs rounded">
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{scope.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-3 mt-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
            <p className="text-sm text-yellow-200">
              Key'i yalnızca bir kez görebilirsin. Güvenli bir yerde sakla.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!keyName.trim() || selectedScopes.length === 0 || isCreating}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isCreating ? 'Creating...' : 'Create Key'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Show New Key Modal Component
function ShowKeyModal({ 
  apiKey, 
  onClose 
}: { 
  apiKey: ApiKey
  onClose: () => void 
}) {
  const [copied, setCopied] = useState(false)

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey.key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">API Key Created</h2>
        
        <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-200 font-medium mb-1">
                Save this key now!
              </p>
              <p className="text-sm text-yellow-200">
                You won't be able to see it again.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">API Key</span>
            <button
              onClick={copyKey}
              className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          </div>
          <code className="text-sm text-white font-mono break-all">
            {apiKey.key}
          </code>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-400">Name:</span>
            <span className="text-white">{apiKey.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Scopes:</span>
            <div className="flex gap-1">
              {apiKey.scopes.map((scope) => (
                <span key={scope} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  {developerManager.getScopeIcon(scope)}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  )
}





