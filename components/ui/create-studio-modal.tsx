'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, MessageCircle, Code2, Palette, Video, Sparkles, Zap, Crown, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CreateStudioModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (studio: string) => void
}

const studios = [
  {
    id: 'chat',
    title: 'Chat',
    subtitle: 'Talk',
    description: 'AI conversations',
    icon: MessageCircle,
    gradient: 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500',
    available: true,
    route: '/chat',
  },
  {
    id: 'code',
    title: 'Code',
    subtitle: 'Build',
    description: 'Apps & websites',
    icon: Code2,
    gradient: 'bg-gradient-to-br from-green-500 via-teal-500 to-blue-500',
    available: true,
    route: '/code',
  },
  {
    id: 'image',
    title: 'Design',
    subtitle: 'Create',
    description: 'Images & graphics',
    icon: Palette,
    gradient: 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500',
    available: true,
    route: '/design',
  },
  {
    id: 'video',
    title: 'Video',
    subtitle: 'Create',
    description: 'AI-powered videos',
    icon: Video,
    gradient: 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500',
    available: true,
    route: '/video',
  },
  {
    id: 'agents',
    title: 'Agents',
    subtitle: 'Automate',
    description: 'AI assistants',
    icon: Bot,
    gradient: 'bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500',
    available: true,
    route: '/agents',
  },
]

export function CreateStudioModal({ isOpen, onClose, onSelect }: CreateStudioModalProps) {
  const router = useRouter()
  const [selectedStudio, setSelectedStudio] = useState<string | null>(null)

  if (!isOpen) return null

  const handleStudioClick = (studio: typeof studios[0]) => {
    if (!studio.available) return
    
    setSelectedStudio(studio.id)
    onSelect(studio.id)
    
    // Navigate to the studio route
    router.push(studio.route)
    
    // Close modal after navigation
    setTimeout(() => {
      onClose()
    }, 100)
    
    // Navigate to the studio
    if (studio.route) {
      window.location.href = studio.route
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-card rounded-3xl border border-border/50 shadow-premium animate-in fade-in scale-in duration-300">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Create
              </h2>
              <p className="text-muted-foreground">
                What do you want to build?
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Studios Grid */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studios.map((studio) => {
              const Icon = studio.icon
              const isSelected = selectedStudio === studio.id
              const isDisabled = !studio.available

              return (
                <button
                  key={studio.id}
                  onClick={() => handleStudioClick(studio)}
                  disabled={isDisabled}
                  className={cn(
                    "group relative p-6 rounded-2xl border transition-all duration-200 text-left",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    isSelected && "ring-2 ring-primary",
                    isDisabled 
                      ? "opacity-50 cursor-not-allowed" 
                      : "hover:shadow-lg cursor-pointer",
                    "border-border/50 bg-card"
                  )}
                >
                  {/* Premium Badge for Coming Soon */}
                  {!studio.available && (
                    <div className="absolute top-4 right-4">
                      <div className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium rounded-lg shadow-premium">
                        Soon
                      </div>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-premium",
                    "group-hover:scale-110 transition-transform",
                    studio.gradient
                  )}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {studio.title}
                      </h3>
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-lg">
                        {studio.subtitle}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {studio.description}
                    </p>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute inset-0 rounded-2xl bg-primary/10 border-2 border-primary animate-pulse" />
                  )}

                  {/* Hover Effect */}
                  {studio.available && (
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>AI-powered creation</span>
              </div>
              
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Templates
                </button>
                <button className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-xl hover:bg-primary/90 transition-colors">
                  Start Creating
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
