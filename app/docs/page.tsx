'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/global-header'
import { BottomTabBar } from '@/components/ui/bottom-tab-bar'
import { developerManager } from '@/lib/developer'
import { 
  Search,
  BookOpen,
  Key,
  MessageSquare,
  Bot,
  Code2,
  Image as ImageIcon,
  Webhook,
  AlertTriangle,
  Package,
  Zap,
  ArrowRight,
  ExternalLink,
  Play,
  Copy,
  Check,
  ChevronRight,
  Star,
  Clock,
  Users
} from 'lucide-react'

export default function DocsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const endpoints = developerManager.getEndpoints()
  const sdks = developerManager.getSdks()

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const quickStartCode = `import { Synexa } from '@synexa/sdk';

const synexa = new Synexa({
  apiKey: 'your-api-key'
});

const response = await synexa.chat.create({
  messages: [{ role: 'user', content: 'Hello!' }]
});`

  const navigation = [
    {
      title: 'Getting Started',
      items: [
        { name: 'Quick Start', href: '/docs/quickstart', icon: Zap },
        { name: 'Authentication', href: '/docs/auth', icon: Key },
        { name: 'Rate Limits', href: '/docs/limits', icon: AlertTriangle }
      ]
    },
    {
      title: 'API Reference',
      items: [
        { name: 'Chat API', href: '/docs/chat', icon: MessageSquare },
        { name: 'Agents API', href: '/docs/agents', icon: Bot },
        { name: 'Code API', href: '/docs/code', icon: Code2 },
        { name: 'Image API', href: '/docs/images', icon: ImageIcon }
      ]
    },
    {
      title: 'Advanced',
      items: [
        { name: 'Webhooks', href: '/docs/webhooks', icon: Webhook },
        { name: 'SDKs', href: '/docs/sdks', icon: Package },
        { name: 'Errors', href: '/docs/errors', icon: AlertTriangle }
      ]
    }
  ]

  const popularEndpoints = [
    { name: 'Chat Completions', endpoint: '/v1/chat/completions', description: 'Generate AI responses' },
    { name: 'Code Generation', endpoint: '/v1/code/generate', description: 'Generate code from prompts' },
    { name: 'Image Generation', endpoint: '/v1/images/generate', description: 'Create images from text' },
    { name: 'Run Agent', endpoint: '/v1/agents/run', description: 'Execute AI workflows' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader 
        title="API Documentation" 
        showBack={true}
        backUrl="/developers"
      />

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Synexa API Documentation
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Everything you need to integrate AI capabilities into your applications
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation... (⌘K)"
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Quick Start */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Get started in minutes
              </h2>
              <p className="text-gray-300 mb-6">
                Install our SDK and make your first API call
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <span className="text-gray-300">Get your API key</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <span className="text-gray-300">Install the SDK</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <span className="text-gray-300">Make your first request</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => router.push('/docs/quickstart')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Quick Start
                </button>
                <button
                  onClick={() => router.push('/docs/playground')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 rounded-lg font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Try Playground
                </button>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-3 border-b border-gray-700">
                <span className="text-gray-300 text-sm font-medium">JavaScript</span>
                <button
                  onClick={() => copyToClipboard(quickStartCode, 'quickstart')}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm transition-colors"
                >
                  {copiedCode === 'quickstart' ? (
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
              <div className="p-4">
                <pre className="text-gray-300 text-sm overflow-x-auto">
                  <code>{quickStartCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {navigation.map((section) => (
            <div key={section.title} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">{section.title}</h3>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-700/50 rounded-lg transition-colors text-left group"
                  >
                    <div className="w-8 h-8 bg-gray-700 group-hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                      <item.icon className="w-4 h-4 text-gray-400 group-hover:text-white" />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 ml-auto" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Popular Endpoints */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Popular Endpoints</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularEndpoints.map((endpoint) => (
              <div key={endpoint.endpoint} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {endpoint.name}
                  </h3>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  {endpoint.description}
                </p>
                <code className="text-sm text-blue-400 bg-gray-900 px-2 py-1 rounded">
                  {endpoint.endpoint}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* SDKs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Official SDKs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sdks.map((sdk) => (
              <div key={sdk.id} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{sdk.name}</h3>
                    <p className="text-gray-400 text-sm">v{sdk.version}</p>
                  </div>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-3 mb-4">
                  <code className="text-green-400 text-sm">{sdk.installCommand}</code>
                </div>

                <div className="flex gap-3">
                  <a
                    href={sdk.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    GitHub
                  </a>
                  <button
                    onClick={() => router.push(`/docs/sdks/${sdk.id}`)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    Documentation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community & Support */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Community</h3>
            <p className="text-gray-400 text-sm mb-4">
              Join our Discord community for help and discussions
            </p>
            <button className="text-green-400 hover:text-green-300 text-sm font-medium">
              Join Discord →
            </button>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Examples</h3>
            <p className="text-gray-400 text-sm mb-4">
              Browse code examples and sample applications
            </p>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View Examples →
            </button>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Status</h3>
            <p className="text-gray-400 text-sm mb-4">
              Check API status and service uptime
            </p>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              View Status →
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}











