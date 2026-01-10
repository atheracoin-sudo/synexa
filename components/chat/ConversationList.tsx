'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Conversation } from '@/lib/types'
import { useConversation } from '@/lib/hooks/useConversation'
import { cn } from '@/lib/utils'
import { 
  MessageSquare, 
  Pin, 
  Archive, 
  Trash2, 
  Edit3, 
  MoreVertical,
  Search,
  Filter,
  Plus,
  ArchiveRestore
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SimpleDropdown, SimpleDropdownItem, SimpleDropdownSeparator } from '@/components/ui/simple-dropdown'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ConversationListProps {
  className?: string
}

export function ConversationList({ className }: ConversationListProps) {
  const {
    conversations,
    currentConversation,
    createConversation,
    switchConversation,
    renameConversation,
    togglePin,
    toggleArchive,
    deleteConversation,
    searchConversations,
    getConversations
  } = useConversation()

  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'pinned' | 'archived'>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
  
  const editInputRef = useRef<HTMLInputElement>(null)

  // Update filtered conversations
  useEffect(() => {
    let result: Conversation[]
    
    if (searchQuery.trim()) {
      result = searchConversations(searchQuery)
    } else {
      result = getConversations(filter)
    }
    
    setFilteredConversations(result)
  }, [conversations, searchQuery, filter, searchConversations, getConversations])

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingId])

  const handleNewChat = () => {
    createConversation()
  }

  const handleConversationClick = (conversation: Conversation) => {
    if (editingId === conversation.id) return
    switchConversation(conversation.id)
  }

  const handleStartEdit = (conversation: Conversation) => {
    setEditingId(conversation.id)
    setEditingTitle(conversation.title)
  }

  const handleSaveEdit = () => {
    if (editingId && editingTitle.trim()) {
      renameConversation(editingId, editingTitle.trim())
    }
    setEditingId(null)
    setEditingTitle('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const handleDeleteClick = (conversationId: string) => {
    setDeleteConfirmId(conversationId)
  }

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deleteConversation(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return date.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } else if (days === 1) {
      return 'Dün'
    } else if (days < 7) {
      return `${days} gün önce`
    } else {
      return date.toLocaleDateString('tr-TR', { 
        day: 'numeric', 
        month: 'short' 
      })
    }
  }

  const pinnedConversations = filteredConversations.filter(conv => conv.isPinned)
  const regularConversations = filteredConversations.filter(conv => !conv.isPinned)

  return (
    <div className={cn("flex flex-col h-full bg-background border-r border-border", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Sohbetler</h2>
          <Button
            onClick={handleNewChat}
            size="sm"
            className="bg-gradient-primary hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Chat
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sohbetlerde ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
            className="flex-1"
          >
            Tümü
          </Button>
          <Button
            variant={filter === 'pinned' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('pinned')}
            className="flex-1"
          >
            <Pin className="h-4 w-4 mr-1" />
            Sabitli
          </Button>
          <Button
            variant={filter === 'archived' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('archived')}
            className="flex-1"
          >
            <Archive className="h-4 w-4 mr-1" />
            Arşiv
          </Button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? 'Sonuç bulunamadı' : 
               filter === 'archived' ? 'Arşivlenmiş sohbet yok' :
               filter === 'pinned' ? 'Sabitlenmiş sohbet yok' :
               'Henüz sohbetin yok'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Farklı anahtar kelimeler deneyin' :
               filter === 'archived' ? 'Arşivlenen sohbetler burada görünür' :
               filter === 'pinned' ? 'Önemli sohbetleri sabitle' :
               'İlk sohbetini başlatmak için yeni chat oluştur'}
            </p>
            {!searchQuery && filter === 'all' && (
              <Button onClick={handleNewChat} className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                İlk Sohbeti Başlat
              </Button>
            )}
          </div>
        ) : (
          <div className="p-2">
            {/* Pinned Conversations */}
            {pinnedConversations.length > 0 && filter !== 'archived' && (
              <div className="mb-4">
                <div className="flex items-center gap-2 px-2 py-1 mb-2">
                  <Pin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Sabitli</span>
                </div>
                {pinnedConversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={currentConversation?.id === conversation.id}
                    isEditing={editingId === conversation.id}
                    editingTitle={editingTitle}
                    onEditingTitleChange={setEditingTitle}
                    onClick={() => handleConversationClick(conversation)}
                    onStartEdit={() => handleStartEdit(conversation)}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}
                    onKeyDown={handleKeyDown}
                    onPin={() => togglePin(conversation.id)}
                    onArchive={() => toggleArchive(conversation.id)}
                    onDelete={() => handleDeleteClick(conversation.id)}
                    formatDate={formatDate}
                    editInputRef={editInputRef}
                  />
                ))}
              </div>
            )}

            {/* Regular Conversations */}
            {regularConversations.length > 0 && (
              <div>
                {pinnedConversations.length > 0 && filter !== 'archived' && (
                  <div className="flex items-center gap-2 px-2 py-1 mb-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {filter === 'archived' ? 'Arşivlenmiş' : 'Diğer Sohbetler'}
                    </span>
                  </div>
                )}
                {regularConversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={currentConversation?.id === conversation.id}
                    isEditing={editingId === conversation.id}
                    editingTitle={editingTitle}
                    onEditingTitleChange={setEditingTitle}
                    onClick={() => handleConversationClick(conversation)}
                    onStartEdit={() => handleStartEdit(conversation)}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}
                    onKeyDown={handleKeyDown}
                    onPin={() => togglePin(conversation.id)}
                    onArchive={() => toggleArchive(conversation.id)}
                    onDelete={() => handleDeleteClick(conversation.id)}
                    formatDate={formatDate}
                    editInputRef={editInputRef}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sohbeti Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu sohbet kalıcı olarak silinecek. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  isEditing: boolean
  editingTitle: string
  onEditingTitleChange: (title: string) => void
  onClick: () => void
  onStartEdit: () => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onPin: () => void
  onArchive: () => void
  onDelete: () => void
  formatDate: (date: Date) => string
  editInputRef: React.RefObject<HTMLInputElement>
}

function ConversationItem({
  conversation,
  isActive,
  isEditing,
  editingTitle,
  onEditingTitleChange,
  onClick,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onKeyDown,
  onPin,
  onArchive,
  onDelete,
  formatDate,
  editInputRef
}: ConversationItemProps) {
  return (
    <div
      className={cn(
        "group relative p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1",
        "hover:bg-muted/50",
        isActive && "bg-muted border border-border shadow-sm"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              ref={editInputRef}
              value={editingTitle}
              onChange={(e) => onEditingTitleChange(e.target.value)}
              onKeyDown={onKeyDown}
              onBlur={onSaveEdit}
              className="h-6 text-sm font-medium p-1 -ml-1"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="flex items-center gap-2 mb-1">
              {conversation.isPinned && (
                <Pin className="h-3 w-3 text-blue-500 flex-shrink-0" />
              )}
              <h3 className="text-sm font-medium text-foreground truncate">
                {conversation.title}
              </h3>
            </div>
          )}
          
          {!isEditing && (
            <>
              <p className="text-xs text-muted-foreground truncate mb-1">
                {conversation.preview || 'Henüz mesaj yok'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatDate(conversation.updatedAt)}
                </span>
                {conversation.isArchived && (
                  <Archive className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            </>
          )}
        </div>

        {!isEditing && (
          <SimpleDropdown
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            }
            className="w-48"
          >
            <SimpleDropdownItem onClick={(e) => {
              e?.stopPropagation()
              onStartEdit()
            }}>
              <Edit3 className="h-4 w-4 mr-2" />
              Yeniden Adlandır
            </SimpleDropdownItem>
            
            <SimpleDropdownItem onClick={(e) => {
              e?.stopPropagation()
              onPin()
            }}>
              <Pin className="h-4 w-4 mr-2" />
              {conversation.isPinned ? 'Sabitlemeyi Kaldır' : 'Sabitle'}
            </SimpleDropdownItem>
            
            <SimpleDropdownItem onClick={(e) => {
              e?.stopPropagation()
              onArchive()
            }}>
              {conversation.isArchived ? (
                <>
                  <ArchiveRestore className="h-4 w-4 mr-2" />
                  Geri Yükle
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4 mr-2" />
                  Arşivle
                </>
              )}
            </SimpleDropdownItem>
            
            <SimpleDropdownSeparator />
            
            <SimpleDropdownItem 
              onClick={(e) => {
                e?.stopPropagation()
                onDelete()
              }}
              variant="destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Sil
            </SimpleDropdownItem>
          </SimpleDropdown>
        )}
      </div>
    </div>
  )
}
