'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  MessageSquare, 
  Code2, 
  Palette,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  ExternalLink,
  Clock,
  Plus,
  FileText,
  Image as ImageIcon
} from 'lucide-react'
import { GlobalHeader } from '@/components/ui/GlobalHeader'
import { BottomTabBar } from '@/components/ui/BottomTabBar'
import { EmptyState } from '@/components/ui/LoadingStates'
import { cn } from '@/lib/utils'
import { ChatAPI, ChatConversation } from '@/lib/api/chat'
import { AgentAPI, AgentExecution } from '@/lib/api/agents'

interface LibraryItem {
  id: string
  type: 'chat' | 'app' | 'design'
  title: string
  preview?: string
  updatedAt: string
  status?: 'ready' | 'error' | 'draft'
  thumbnail?: string
  metadata?: any
}

export default function SimpleLibraryPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'chats' | 'apps' | 'designs'>('chats')
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState<LibraryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const tabs = [
    { id: 'chats' as const, name: 'Chats', icon: MessageSquare },
    { id: 'apps' as const, name: 'Apps', icon: Code2 },
    { id: 'designs' as const, name: 'Designs', icon: Palette }
  ]

  useEffect(() => {
    loadItems()
  }, [activeTab])

  const loadItems = async () => {
    setIsLoading(true)
    try {
      let libraryItems: LibraryItem[] = []

      switch (activeTab) {
        case 'chats':
          const conversations = await ChatAPI.getConversations()
          libraryItems = conversations.map(conv => ({
            id: conv.id,
            type: 'chat' as const,
            title: conv.title,
            preview: conv.messages[conv.messages.length - 1]?.content.substring(0, 100) + '...',
            updatedAt: conv.updatedAt,
            metadata: { messageCount: conv.messages.length }
          }))
          break

        case 'apps':
          const executions = await AgentAPI.getUserExecutions()
          const appExecutions = executions.filter(exec => 
            exec.agentId === 'frontend-dev' && exec.status === 'completed'
          )
          libraryItems = appExecutions.map(exec => ({
            id: exec.id,
            type: 'app' as const,
            title: `Dashboard App`, // Could be extracted from answers
            preview: 'Created from chat conversation',
            updatedAt: exec.completedAt || exec.startedAt,
            status: 'ready' as const,
            metadata: exec.answers
          }))
          break

        case 'designs':
          // Mock design items for now
          libraryItems = [
            {
              id: 'design_1',
              type: 'design' as const,
              title: 'Logo Design',
              preview: 'Modern minimal logo',
              updatedAt: new Date(Date.now() - 86400000).toISOString(),
              status: 'ready' as const,
              thumbnail: '/api/placeholder/200/200'
            }
          ]
          break
      }

      setItems(libraryItems)
    } catch (error) {
      console.error('Failed to load library items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.preview?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleItemClick = (item: LibraryItem) => {
    switch (item.type) {
      case 'chat':
        router.push(`/chat?conversation=${item.id}`)
        break
      case 'app':
        router.push(`/code?project=${item.id}`)
        break
      case 'design':
        router.push(`/design?project=${item.id}`)
        break
    }
  }

  const handleRename = (itemId: string) => {
    const newTitle = prompt('Enter new title:')
    if (newTitle) {
      // Update item title
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, title: newTitle } : item
      ))
    }
  }

  const handleDelete = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(prev => prev.filter(item => item.id !== itemId))
    }
  }

  const getEmptyState = () => {
    switch (activeTab) {
      case 'chats':
        return {
          icon: MessageSquare,
          title: 'Henüz sohbetin yok',
          description: 'AI ile konuşmaya başla ve sohbetlerin burada görünsün',
          action: (
            <button
              onClick={() => router.push('/chat')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Chat'e Başla
            </button>
          )
        }
      case 'apps':
        return {
          icon: Code2,
          title: 'Henüz bir uygulama oluşturmadın',
          description: 'Code Studio ile ilk uygulamanı oluştur',
          action: (
            <button
              onClick={() => router.push('/code')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              App Oluştur
            </button>
          )
        }
      case 'designs':
        return {
          icon: Palette,
          title: 'Henüz tasarım yok',
          description: 'Image Studio ile ilk tasarımını oluştur',
          action: (
            <button
              onClick={() => router.push('/design')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tasarım Yap
            </button>
          )
        }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader title="Library" />
      
      <div className="max-w-6xl mx-auto p-6 pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your Library
          </h1>
          <p className="text-muted-foreground">
            All your creations in one place
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-muted p-1 rounded-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-all flex-1 justify-center',
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.name}</span>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState {...getEmptyState()} />
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all group cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon/Thumbnail */}
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                    {item.type === 'chat' && <MessageSquare className="w-6 h-6 text-blue-500" />}
                    {item.type === 'app' && <Code2 className="w-6 h-6 text-green-500" />}
                    {item.type === 'design' && item.thumbnail ? (
                      <img src={item.thumbnail} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Palette className="w-6 h-6 text-purple-500" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                        {item.preview && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {item.preview}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.updatedAt).toLocaleDateString()}
                          </div>
                          {item.status && (
                            <span className={cn(
                              'px-2 py-1 rounded-lg',
                              item.status === 'ready' && 'bg-green-100 text-green-700',
                              item.status === 'error' && 'bg-red-100 text-red-700',
                              item.status === 'draft' && 'bg-yellow-100 text-yellow-700'
                            )}>
                              {item.status}
                            </span>
                          )}
                          {item.metadata?.messageCount && (
                            <span>{item.metadata.messageCount} messages</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleItemClick(item)
                            }}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Open"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRename(item.id)
                            }}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Rename"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(item.id)
                            }}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                Create Something New
              </h3>
              <p className="text-muted-foreground text-sm">
                Start a chat, build an app, or create a design
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/chat')}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Chat
              </button>
              <button
                onClick={() => router.push('/code')}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Code
              </button>
              <button
                onClick={() => router.push('/design')}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Design
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomTabBar />
    </div>
  )
}





