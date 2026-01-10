'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/GlobalHeader'
import { BottomTabBar } from '@/components/ui/BottomTabBar'
import { developerManager } from '@/lib/developer'
import { 
  Code2,
  Key,
  BookOpen,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  Webhook,
  BarChart3,
  Users,
  Sparkles,
  Bot,
  MessageSquare,
  Image as ImageIcon,
  Github,
  Play
} from 'lucide-react'

export default function DevelopersPage() {
  const router = useRouter()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  
  const usage = developerManager.getUsage()
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

// Generate AI response
const response = await synexa.chat.create({
  messages: [{ role: 'user', content: 'Hello!' }]
});

console.log(response.choices[0].message.content);`

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader 
        title="Developers" 
        showBack={true}
        backUrl="/"
      />

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Code2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Build with Synexa API
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Chat, Agents, Code ve Image yeteneklerini ürününe ekle.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/developers/dashboard')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              <Key className="w-5 h-5" />
              Get API Key
            </button>
            <button
              onClick={() => router.push('/docs')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 rounded-xl font-medium transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              View Docs
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{developerManager.formatUsageCount(usage.totalRequests)}</div>
            <div className="text-sm text-gray-400">API Calls</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{endpoints.length}</div>
            <div className="text-sm text-gray-400">Endpoints</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">99.9%</div>
            <div className="text-sm text-gray-400">Uptime</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">200ms</div>
            <div className="text-sm text-gray-400">Response</div>
          </div>
        </div>

        {/* API Capabilities */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Powerful AI APIs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Chat API</h3>
              <p className="text-gray-400 text-sm mb-4">
                Conversational AI with context awareness
              </p>
              <div className="flex items-center gap-2 text-blue-400 text-sm">
                <span>Free tier available</span>
                <Zap className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Agents API</h3>
              <p className="text-gray-400 text-sm mb-4">
                Automated workflows and complex tasks
              </p>
              <div className="flex items-center gap-2 text-purple-400 text-sm">
                <span>Premium required</span>
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Code API</h3>
              <p className="text-gray-400 text-sm mb-4">
                Generate and analyze code in any language
              </p>
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <span>Free tier available</span>
                <Zap className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-4">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Image API</h3>
              <p className="text-gray-400 text-sm mb-4">
                Generate and edit images from text
              </p>
              <div className="flex items-center gap-2 text-orange-400 text-sm">
                <span>Free tier available</span>
                <Zap className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Quick Start
          </h2>
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  1
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Get API Key</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Create your account and generate an API key
                </p>
                <button
                  onClick={() => router.push('/developers/dashboard')}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  Create Key →
                </button>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  2
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Install SDK</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Use our JavaScript or Python SDK
                </p>
                <div className="bg-gray-900 rounded-lg p-3 text-left">
                  <code className="text-green-400 text-sm">npm install @synexa/sdk</code>
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  3
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Make Request</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Start building with AI capabilities
                </p>
                <button
                  onClick={() => router.push('/docs/playground')}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  Try Playground →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Example Code
          </h2>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300 font-medium">JavaScript</span>
              </div>
              <button
                onClick={() => copyToClipboard(quickStartCode, 'quickstart')}
                className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
              >
                {copiedCode === 'quickstart' ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="p-6">
              <pre className="text-gray-300 text-sm overflow-x-auto">
                <code>{quickStartCode}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* SDKs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Official SDKs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sdks.map((sdk) => (
              <div key={sdk.id} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-white" />
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
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                  <button
                    onClick={() => router.push(`/docs/sdks/${sdk.id}`)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    Docs
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Developer Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fast & Reliable</h3>
              <p className="text-gray-400 text-sm">
                99.9% uptime with 200ms response times
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Secure</h3>
              <p className="text-gray-400 text-sm">
                Enterprise-grade security with API key management
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Global CDN</h3>
              <p className="text-gray-400 text-sm">
                Worldwide infrastructure for low latency
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to start building?
            </h2>
            <p className="text-gray-400 mb-6">
              Join thousands of developers using Synexa API
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/developers/dashboard')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                <Key className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/docs')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 rounded-xl font-medium transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Read Documentation
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}