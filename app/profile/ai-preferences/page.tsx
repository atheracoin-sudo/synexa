'use client'

import { useState } from 'react'
import { ArrowLeft, Brain, Plus, Trash2, ToggleLeft, ToggleRight, Edit3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlobalHeader } from '@/components/ui'
import { useMemory } from '@/lib/hooks/useMemory'
import { usePremium } from '@/lib/hooks/usePremium'
import { MemoryCategory, MemoryItem } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

const CATEGORY_LABELS: Record<MemoryCategory, string> = {
  tech_stack: 'Teknoloji Stack',
  language_preference: 'Dil Tercihi',
  response_style: 'Yanıt Stili',
  usage_purpose: 'Kullanım Amacı',
  project_context: 'Proje Tipi',
  communication_style: 'İletişim Stili',
  custom: 'Özel Tercih',
}

const CATEGORY_COLORS: Record<MemoryCategory, string> = {
  tech_stack: 'text-blue-500 bg-blue-500/10',
  language_preference: 'text-green-500 bg-green-500/10',
  response_style: 'text-purple-500 bg-purple-500/10',
  usage_purpose: 'text-orange-500 bg-orange-500/10',
  project_context: 'text-pink-500 bg-pink-500/10',
  communication_style: 'text-cyan-500 bg-cyan-500/10',
  custom: 'text-gray-500 bg-gray-500/10',
}

export default function AIPreferencesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { memoryContext, toggleMemory, deleteMemory, addMemory } = useMemory()
  const { isPremium } = usePremium()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMemory, setNewMemory] = useState({ title: '', value: '', category: 'custom' as MemoryCategory })

  const handleToggleMemory = (memoryId: string) => {
    toggleMemory(memoryId)
    toast({
      type: 'success',
      title: 'Tercih güncellendi',
      duration: 2000,
    })
  }

  const handleDeleteMemory = (memoryId: string, title: string) => {
    if (confirm(`"${title}" tercihini silmek istediğinize emin misiniz?`)) {
      deleteMemory(memoryId)
      toast({
        type: 'success',
        title: 'Tercih silindi',
        duration: 2000,
      })
    }
  }

  const handleAddMemory = () => {
    if (!newMemory.title.trim() || !newMemory.value.trim()) {
      toast({
        type: 'error',
        title: 'Lütfen tüm alanları doldurun',
      })
      return
    }

    // Check free user limits
    if (!isPremium && memoryContext.totalItems >= 3) {
      toast({
        type: 'error',
        title: 'Free kullanıcılar en fazla 3 tercih kaydedebilir. Premium ile sınırsız tercih ekleyin.',
        duration: 4000,
      })
      return
    }

    addMemory(newMemory.category, newMemory.title, newMemory.value, 'manual')
    setNewMemory({ title: '', value: '', category: 'custom' })
    setShowAddForm(false)
    toast({
      type: 'success',
      title: 'Yeni tercih eklendi! 💾',
      duration: 2000,
    })
  }

  const groupedMemory = memoryContext.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<MemoryCategory, MemoryItem[]>)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <GlobalHeader 
        title="AI Preferences" 
        variant="blur"
        showBackButton={true}
        onBackPress={() => router.back()}
      />

      {/* Main Content */}
      <main className="px-4 pb-24 pt-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-premium">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground text-center mb-2">
            AI Memory
          </h1>
          <p className="text-muted-foreground text-center max-w-sm mx-auto">
            {memoryContext.totalItems > 0 
              ? `Synexa seni şu şekilde tanıyor (${memoryContext.totalItems} tercih)`
              : 'Henüz seni tanımıyorum 👋'
            }
          </p>
        </div>

        {/* Free User Limit Warning */}
        {!isPremium && memoryContext.totalItems >= 2 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {memoryContext.totalItems >= 3 ? 'Tercih limitine ulaştın' : `${3 - memoryContext.totalItems} tercih hakkın kaldı`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Premium ile sınırsız tercih kaydet
                </p>
              </div>
              <button 
                onClick={() => router.push('/pricing')}
                className="px-3 py-1 bg-gradient-primary text-white text-xs font-medium rounded-lg hover:scale-105 transition-transform"
              >
                Premium
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {memoryContext.totalItems === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Brain className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Henüz seni tanımıyorum 👋
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Synexa, tercihlerini hatırlayarak sana daha iyi yardımcı olabilir.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-primary text-white font-medium rounded-xl hover:scale-105 transition-transform shadow-premium"
            >
              Tercih Ekle
            </button>
          </div>
        )}

        {/* Memory Items */}
        {memoryContext.totalItems > 0 && (
          <div className="space-y-6">
            {Object.entries(groupedMemory).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {CATEGORY_LABELS[category as MemoryCategory]}
                </h3>
                
                <div className="space-y-2">
                  {items.map((memory) => (
                    <div
                      key={memory.id}
                      className={cn(
                        "p-4 bg-card rounded-xl border border-border/50 shadow-card",
                        "transition-all duration-200 hover:shadow-lg"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Category Badge */}
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                            CATEGORY_COLORS[memory.category]
                          )}>
                            <Brain className="h-4 w-4" />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground">
                              {memory.title}
                            </h4>
                            <p className="text-sm text-muted-foreground truncate">
                              {memory.value}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {memory.source === 'auto_detected' ? 'Otomatik algılandı' : 
                                 memory.source === 'command' ? 'Komut ile eklendi' : 'Manuel eklendi'}
                              </span>
                              {memory.lastUsed && (
                                <span className="text-xs text-muted-foreground">
                                  • Son kullanım: {memory.lastUsed.toLocaleDateString('tr-TR')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Toggle */}
                          <button
                            onClick={() => handleToggleMemory(memory.id)}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              memory.isActive 
                                ? "text-primary hover:bg-primary/10" 
                                : "text-muted-foreground hover:bg-muted/50"
                            )}
                          >
                            {memory.isActive ? (
                              <ToggleRight className="h-5 w-5" />
                            ) : (
                              <ToggleLeft className="h-5 w-5" />
                            )}
                          </button>
                          
                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteMemory(memory.id, memory.title)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Memory */}
        {memoryContext.totalItems > 0 && !showAddForm && (
          <div className="mt-8">
            <button
              onClick={() => setShowAddForm(true)}
              disabled={!isPremium && memoryContext.totalItems >= 3}
              className={cn(
                "w-full p-4 border-2 border-dashed rounded-xl transition-all duration-200",
                "flex items-center justify-center gap-2",
                (!isPremium && memoryContext.totalItems >= 3)
                  ? "border-muted text-muted-foreground cursor-not-allowed"
                  : "border-primary/30 text-primary hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">
                {(!isPremium && memoryContext.totalItems >= 3) 
                  ? 'Premium ile daha fazla tercih ekle' 
                  : 'Yeni Tercih Ekle'
                }
              </span>
            </button>
          </div>
        )}

        {/* Add Memory Form */}
        {showAddForm && (
          <div className="mt-8 p-6 bg-card rounded-xl border border-border/50 shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Yeni Tercih Ekle
            </h3>
            
            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Kategori
                </label>
                <select
                  value={newMemory.category}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, category: e.target.value as MemoryCategory }))}
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg focus:outline-none focus:border-primary/50"
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              
              {/* Title */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Başlık
                </label>
                <input
                  type="text"
                  value={newMemory.title}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="örn: Teknoloji Stack"
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg focus:outline-none focus:border-primary/50"
                />
              </div>
              
              {/* Value */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Değer
                </label>
                <input
                  type="text"
                  value={newMemory.value}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="örn: React, Next.js"
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddMemory}
                className="flex-1 px-4 py-2 bg-gradient-primary text-white font-medium rounded-lg hover:scale-105 transition-transform"
              >
                Ekle
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setNewMemory({ title: '', value: '', category: 'custom' })
                }}
                className="px-4 py-2 bg-muted text-muted-foreground font-medium rounded-lg hover:bg-muted/80 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-8 p-4 bg-muted/30 rounded-xl">
          <p className="text-xs text-muted-foreground text-center">
            🔒 Synexa yalnızca sana daha iyi yardımcı olmak için bu bilgileri kullanır.
            Tercihlerini istediğin zaman görüntüleyebilir, kapatabilir veya silebilirsin.
          </p>
        </div>
      </main>

    </div>
  )
}






