'use client'

import { useState, useCallback } from 'react'
import { 
  ArrowLeft, 
  Sparkles, 
  Download, 
  Share2,
  Loader2,
  Image as ImageIcon,
  Palette,
  Camera,
  Brush,
  Wand2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

const artStyles = [
  { id: 'realistic', name: 'Realistic', active: true },
  { id: 'anime', name: 'Anime', active: false },
  { id: '3d', name: '3D Render', active: false },
  { id: 'illustration', name: 'Illustration', active: false },
]

const aspectRatios = [
  { id: 'square', name: '1:1', dimensions: '1024x1024', active: true },
  { id: 'portrait', name: '3:4', dimensions: '768x1024', active: false },
  { id: 'landscape', name: '16:9', dimensions: '1024x576', active: false },
]

const examplePrompts = [
  'A serene mountain landscape at sunset with golden light',
  'Modern minimalist living room with natural lighting',
  'Futuristic city skyline with flying cars and neon lights',
  'Cute cartoon character in a magical forest',
  'Abstract geometric pattern in vibrant colors',
  'Portrait of a wise old wizard with a long beard',
]

export default function ImageStudioPage() {
  const router = useRouter()
  const { addToast } = useToast()
  
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('realistic')
  const [selectedRatio, setSelectedRatio] = useState('square')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      addToast({
        type: 'error',
        title: 'Please enter a description',
        description: 'Describe what you want to create'
      })
      return
    }

    setIsGenerating(true)
    
    try {
      // Simulate API call (replace with real API)
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock generated image
      setGeneratedImage('/api/placeholder/512/512')
      
      addToast({
        type: 'success',
        title: 'Image generated successfully!',
        description: 'Your AI artwork is ready'
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Generation failed',
        description: 'Please try again'
      })
    } finally {
      setIsGenerating(false)
    }
  }, [prompt, addToast])

  const handlePromptSelect = (selectedPrompt: string) => {
    setPrompt(selectedPrompt)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-premium">
              <ImageIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Image Studio</h1>
              <p className="text-xs text-muted-foreground">AI Image Generation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 pb-6 pt-6">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Prompt Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Describe your image
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A beautiful sunset over mountains with golden light..."
                className={cn(
                  "w-full h-24 px-4 py-3 rounded-2xl border border-border/50 bg-background",
                  "placeholder:text-muted-foreground resize-none",
                  "focus:outline-none focus:border-primary/50 focus:shadow-premium",
                  "transition-all duration-200"
                )}
                disabled={isGenerating}
              />
              <div className="absolute bottom-3 right-3">
                <Wand2 className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Try these examples
            </label>
            <div className="grid grid-cols-1 gap-2">
              {examplePrompts.slice(0, 3).map((example, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptSelect(example)}
                  className="text-left p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground"
                  disabled={isGenerating}
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>

          {/* Art Style Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Art Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {artStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={cn(
                    "p-3 rounded-xl border transition-all duration-200",
                    selectedStyle === style.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 bg-background hover:bg-muted/50 text-muted-foreground"
                  )}
                  disabled={isGenerating}
                >
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <span className="text-sm font-medium">{style.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-2">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setSelectedRatio(ratio.id)}
                  className={cn(
                    "p-3 rounded-xl border transition-all duration-200",
                    selectedRatio === ratio.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 bg-background hover:bg-muted/50 text-muted-foreground"
                  )}
                  disabled={isGenerating}
                >
                  <div className="text-center">
                    <div className="text-sm font-medium">{ratio.name}</div>
                    <div className="text-xs opacity-70">{ratio.dimensions}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={cn(
              "w-full py-4 rounded-2xl font-semibold transition-all duration-200",
              "flex items-center justify-center gap-2",
              prompt.trim() && !isGenerating
                ? "bg-gradient-primary text-white shadow-premium hover:scale-[1.02] active:scale-[0.98]"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Image
              </>
            )}
          </button>

          {/* Generated Image */}
          {generatedImage && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Your AI Artwork
                </h3>
                <p className="text-sm text-muted-foreground">
                  Generated in {selectedStyle} style
                </p>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-card bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                {/* Premium placeholder for generated image */}
                <div className="w-full aspect-square relative">
                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]" />
                  
                  {/* Mock generated content */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-premium">
                        <Sparkles className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        AI Generated Artwork
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Your {selectedStyle.toLowerCase()} style creation
                      </p>
                    </div>
                  </div>
                  
                  {/* Subtle animation */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-pulse" />
                </div>
                
                {/* Action Buttons Overlay */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 px-4 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors">
                  Save to Library
                </button>
                <button 
                  onClick={() => {
                    setGeneratedImage(null)
                    setPrompt('')
                  }}
                  className="py-3 px-4 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"
                >
                  Create Another
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
