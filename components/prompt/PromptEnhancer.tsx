'use client'

import { useState, useCallback, useEffect } from 'react'
import { Sparkles, Eye, EyeOff, Wand2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface PromptEnhancerProps {
  originalPrompt: string
  onEnhancedPrompt: (enhanced: string) => void
  context?: 'chat' | 'code' | 'design'
  className?: string
}

// Mock AI prompt enhancement
const enhancePrompt = async (prompt: string, context: string): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const enhancements = {
    chat: {
      prefixes: [
        'Please provide a detailed and comprehensive response about',
        'I need expert-level information on',
        'Can you explain in depth',
        'Help me understand thoroughly',
      ],
      suffixes: [
        'Include practical examples and actionable insights.',
        'Please be specific and provide step-by-step guidance.',
        'Consider different perspectives and use cases.',
        'Make it easy to understand with clear explanations.',
      ]
    },
    code: {
      prefixes: [
        'Create a production-ready',
        'Develop a well-structured and documented',
        'Build a scalable and maintainable',
        'Generate clean, efficient code for',
      ],
      suffixes: [
        'Include error handling, comments, and best practices.',
        'Follow modern coding standards and patterns.',
        'Add proper TypeScript types and documentation.',
        'Ensure code is testable and follows SOLID principles.',
      ]
    },
    design: {
      prefixes: [
        'Create a visually stunning and professional',
        'Design a modern, eye-catching',
        'Generate a premium-quality',
        'Craft an aesthetically pleasing',
      ],
      suffixes: [
        'Use modern design principles and trending aesthetics.',
        'Ensure high contrast, readability, and visual hierarchy.',
        'Apply consistent branding and color psychology.',
        'Make it suitable for both digital and print media.',
      ]
    }
  }

  const contextEnhancements = enhancements[context as keyof typeof enhancements] || enhancements.chat
  const randomPrefix = contextEnhancements.prefixes[Math.floor(Math.random() * contextEnhancements.prefixes.length)]
  const randomSuffix = contextEnhancements.suffixes[Math.floor(Math.random() * contextEnhancements.suffixes.length)]

  // Simple enhancement logic
  let enhanced = prompt.trim()
  
  // Add context-specific improvements
  if (!enhanced.endsWith('.') && !enhanced.endsWith('!') && !enhanced.endsWith('?')) {
    enhanced += '.'
  }
  
  // Add prefix if prompt is too short or generic
  if (enhanced.length < 20 || !enhanced.includes(' ')) {
    enhanced = `${randomPrefix} ${enhanced.toLowerCase()}`
  }
  
  // Add suffix for more detailed output
  enhanced += ` ${randomSuffix}`
  
  return enhanced
}

export function PromptEnhancer({ 
  originalPrompt, 
  onEnhancedPrompt, 
  context = 'chat',
  className 
}: PromptEnhancerProps) {
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [showEnhanced, setShowEnhanced] = useState(false)
  const [hasEnhanced, setHasEnhanced] = useState(false)

  // Auto-enhance when prompt changes (debounced)
  useEffect(() => {
    if (!originalPrompt.trim() || originalPrompt.length < 10) {
      setHasEnhanced(false)
      setEnhancedPrompt('')
      return
    }

    const timer = setTimeout(async () => {
      try {
        setIsEnhancing(true)
        const enhanced = await enhancePrompt(originalPrompt, context)
        setEnhancedPrompt(enhanced)
        setHasEnhanced(true)
      } catch (error) {
        console.warn('Failed to enhance prompt:', error)
      } finally {
        setIsEnhancing(false)
      }
    }, 1500) // Wait 1.5s after user stops typing

    return () => clearTimeout(timer)
  }, [originalPrompt, context])

  const handleUseEnhanced = useCallback(() => {
    if (enhancedPrompt) {
      onEnhancedPrompt(enhancedPrompt)
      setShowEnhanced(false)
    }
  }, [enhancedPrompt, onEnhancedPrompt])

  const handleRegenerate = useCallback(async () => {
    if (!originalPrompt.trim()) return
    
    try {
      setIsEnhancing(true)
      const enhanced = await enhancePrompt(originalPrompt, context)
      setEnhancedPrompt(enhanced)
    } catch (error) {
      console.warn('Failed to regenerate prompt:', error)
    } finally {
      setIsEnhancing(false)
    }
  }, [originalPrompt, context])

  if (!hasEnhanced && !isEnhancing) return null

  return (
    <div className={cn("space-y-2", className)}>
      {/* Enhancement indicator */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowEnhanced(!showEnhanced)}
          className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
            "bg-primary/10 text-primary hover:bg-primary/20",
            isEnhancing && "animate-pulse"
          )}
        >
          {isEnhancing ? (
            <>
              <RefreshCw className="h-3 w-3 animate-spin" />
              AI enhancing...
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3" />
              Prompt AI tarafından iyileştirildi
              {showEnhanced ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </>
          )}
        </button>

        {hasEnhanced && !isEnhancing && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRegenerate}
              className="h-6 px-2 text-xs"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Enhanced prompt display */}
      {showEnhanced && enhancedPrompt && (
        <div className="p-3 bg-card border border-border/50 rounded-xl shadow-card animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Wand2 className="h-4 w-4 text-primary" />
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">
                  İyileştirilmiş Prompt
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {enhancedPrompt}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleUseEnhanced}
                  size="sm"
                  className="bg-gradient-primary text-white shadow-premium"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Bu Prompt'u Kullan
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEnhanced(false)}
                >
                  İptal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}






