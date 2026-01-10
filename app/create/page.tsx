'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Image as ImageIcon, 
  Video, 
  ArrowLeft,
  Sparkles,
  Wand2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlobalHeader, BottomTabBar } from '@/components/ui'

const createOptions = [
  {
    id: 'image',
    title: 'Image Studio',
    description: 'Create stunning AI-generated images',
    icon: ImageIcon,
    href: '/create/image',
    gradient: 'bg-gradient-to-br from-blue-500 to-purple-600',
    comingSoon: false,
  },
  {
    id: 'video',
    title: 'Video Studio',
    description: 'Generate amazing AI videos',
    icon: Video,
    href: '/create/video',
    gradient: 'bg-gradient-to-br from-pink-500 to-red-500',
    comingSoon: true,
  },
]

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <GlobalHeader 
        title="Create Studio" 
        variant="blur"
      />

      {/* Main Content */}
      <main className="px-4 pb-24 pt-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-premium">
            <Wand2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Create with AI
          </h1>
          <p className="text-muted-foreground">
            Choose your creative studio and bring your ideas to life
          </p>
        </div>

        {/* Create Options */}
        <div className="max-w-md mx-auto space-y-4">
          {createOptions.map((option) => {
            const Icon = option.icon
            
            return (
              <div key={option.id} className="relative">
                {option.comingSoon ? (
                  <div className={cn(
                    'relative overflow-hidden rounded-2xl p-6 shadow-card',
                    'opacity-60 cursor-not-allowed',
                    option.gradient
                  )}>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {option.title}
                          </h3>
                          <p className="text-white/80 text-sm">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 inline-block">
                        <span className="text-white text-sm font-medium">Coming Soon</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={option.href}
                    className="group block"
                  >
                    <div className={cn(
                      'relative overflow-hidden rounded-2xl p-6 shadow-card',
                      'transition-all duration-200 group-hover:scale-[1.02] group-active:scale-[0.98]',
                      option.gradient
                    )}>
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {option.title}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {option.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                          <Sparkles className="h-4 w-4" />
                          <span className="text-sm font-medium">Start Creating</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            )
          })}
        </div>

        {/* Tips Section */}
        <div className="mt-12 max-w-md mx-auto">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card">
            <h3 className="font-semibold text-foreground mb-3">💡 Pro Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Be specific in your descriptions for better results</li>
              <li>• Try different art styles: realistic, cartoon, abstract</li>
              <li>• Mention colors, lighting, and mood in your prompts</li>
              <li>• Use aspect ratios: square, portrait, or landscape</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}





