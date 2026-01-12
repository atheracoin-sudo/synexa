'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  MessageSquare, 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit3,
  Trash2,
  Pin,
  Archive,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SimpleDropdown, SimpleDropdownItem } from '@/components/ui/simple-dropdown'
import { ChatConversation } from '@/lib/api/chat'

interface ConversationSidebarProps {
  conversations: ChatConversation[]
  activeConversation: ChatConversation | null
  onSelectConversation: (conversation: ChatConversation) => void
  onNewConversation: () => void
  onDeleteConversation: (conversationId: string) => void
  onRenameConversation: (conversationId: string, newTitle: string) => void
  className?: string
}

export function ConversationSidebar({
  conversations,
  activeConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  className
}: ConversationSidebarProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conversation =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.messages.some(msg => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  // Group conversations by date
  const groupedConversations = filteredConversations.reduce((groups, conversation) => {
    const date = new Date(conversation.updatedAt)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    let groupKey: string
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Yesterday'
    } else if (date.getTime() > today.getTime() - 7 * 24 * 60 * 60 * 1000) {
      groupKey = 'This Week'
    } else {
      groupKey = 'Older'
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(conversation)
    return groups
  }, {} as Record<string, ChatConversation[]>)

  const handleStartEdit = (conversation: ChatConversation) => {
    setEditingId(conversation.id)
    setEditingTitle(conversation.title)
  }

  const handleSaveEdit = () => {
    if (editingId && editingTitle.trim()) {
      onRenameConversation(editingId, editingTitle.trim())
    }
    setEditingId(null)
    setEditingTitle('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const handleConversationClick = (conversation: ChatConversation) => {
    onSelectConversation(conversation)
    // Navigate to conversation URL
    router.push(`/chat/${conversation.id}`)
  }

  return (
    <div className={cn('flex flex-col h-full bg-card border-r border-border', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Conversations</h2>
          <Button
            onClick={onNewConversation}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            {!searchQuery && (
              <Button
                onClick={onNewConversation}
                variant="ghost"
                size="sm"
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start a conversation
              </Button>
            )}
          </div>
        ) : (
          <div className="p-2">
            {Object.entries(groupedConversations).map(([groupName, groupConversations]) => (
              <div key={groupName} className="mb-6">
                {/* Group Header */}
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {groupName}
                </div>
                
                {/* Group Conversations */}
                <div className="space-y-1">
                  {groupConversations.map((conversation) => {
                    const isActive = activeConversation?.id === conversation.id
                    const isEditing = editingId === conversation.id
                    
                    return (
                      <div
                        key={conversation.id}
                        className={cn(
                          'group relative p-3 rounded-lg cursor-pointer transition-all',
                          isActive
                            ? 'bg-primary/10 border border-primary/20'
                            : 'hover:bg-muted/50'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {/* Conversation Icon */}
                          <div className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                            isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          )}>
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          
                          {/* Conversation Content */}
                          <div className="flex-1 min-w-0" onClick={() => !isEditing && handleConversationClick(conversation)}>
                            {isEditing ? (
                              <Input
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onKeyDown={handleKeyPress}
                                onBlur={handleSaveEdit}
                                className="h-6 text-sm font-medium"
                                autoFocus
                              />
                            ) : (
                              <>
                                <h3 className="text-sm font-medium text-foreground truncate">
                                  {conversation.title}
                                </h3>
                                <p className="text-xs text-muted-foreground truncate mt-1">
                                  {conversation.messages.length > 0 
                                    ? conversation.messages[conversation.messages.length - 1].content.substring(0, 60) + '...'
                                    : 'No messages yet'
                                  }
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(conversation.updatedAt).toLocaleDateString()}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {conversation.messages.length} messages
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                          
                          {/* Actions Menu */}
                          {!isEditing && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <SimpleDropdown
                                trigger={
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                  >
                                    <MoreHorizontal className="w-3 h-3" />
                                  </Button>
                                }
                              >
                                <SimpleDropdownItem onClick={() => handleStartEdit(conversation)}>
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Rename
                                </SimpleDropdownItem>
                                <SimpleDropdownItem onClick={() => {}}>
                                  <Pin className="w-4 h-4 mr-2" />
                                  Pin
                                </SimpleDropdownItem>
                                <SimpleDropdownItem onClick={() => {}}>
                                  <Archive className="w-4 h-4 mr-2" />
                                  Archive
                                </SimpleDropdownItem>
                                <SimpleDropdownItem 
                                  onClick={() => onDeleteConversation(conversation.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </SimpleDropdownItem>
                              </SimpleDropdown>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
