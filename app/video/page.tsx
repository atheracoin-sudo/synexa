'use client'

import { useState, useEffect } from 'react'
import { 
  Video, 
  Upload, 
  Play, 
  Download, 
  Settings,
  Sparkles,
  FileVideo,
  Wand2,
  Clock,
  Share2
} from 'lucide-react'
import { GlobalHeader } from '@/components/ui/global-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { usePremium } from '@/lib/hooks/usePremium'
import { FeatureLock } from '@/components/premium/FeatureLock'

const videoTemplates = [
  {
    id: 'social-reel',
    name: 'Social Media Reel',
    description: 'Vertical video optimized for Instagram, TikTok',
    duration: '15-60s',
    format: '9:16',
    premium: false
  },
  {
    id: 'youtube-short',
    name: 'YouTube Short',
    description: 'Short-form content for YouTube',
    duration: '15-60s', 
    format: '9:16',
    premium: false
  },
  {
    id: 'product-demo',
    name: 'Product Demo',
    description: 'Professional product showcase',
    duration: '30-120s',
    format: '16:9',
    premium: true
  },
  {
    id: 'explainer',
    name: 'Explainer Video',
    description: 'Educational content with animations',
    duration: '60-180s',
    format: '16:9',
    premium: true
  }
]

export default function VideoStudioPage() {
  const { isPremium } = usePremium()
  const [selectedTemplate, setSelectedTemplate] = useState(videoTemplates[0])
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Prompt Required',
        description: 'Please describe what video you want to create',
        variant: 'destructive'
      })
      return
    }

    if (selectedTemplate.premium && !isPremium) {
      toast({
        title: 'Premium Feature',
        description: 'This template requires a Premium subscription',
        variant: 'destructive'
      })
      return
    }

    setIsGenerating(true)
    
    try {
      // Simulate video generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock generated video URL
      setGeneratedVideo('/mock-video-preview.mp4')
      
      toast({
        title: 'Video Generated!',
        description: 'Your video has been created successfully'
      })
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate video. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith('video/')) {
        setUploadedFile(file)
        toast({
          title: 'Video Uploaded',
          description: `${file.name} ready for editing`
        })
      } else {
        toast({
          title: 'Invalid File',
          description: 'Please upload a video file',
          variant: 'destructive'
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader 
        title="Video Studio"
        showBackButton={false}
      />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Studio Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-full text-white">
            <Video className="w-5 h-5" />
            <span className="font-medium">AI Video Studio</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Create Amazing Videos with AI
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate professional videos from text prompts or enhance your existing footage with AI-powered tools
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Selection */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileVideo className="w-5 h-5" />
                Video Templates
              </h3>
              <div className="space-y-3">
                {videoTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={cn(
                      'p-4 rounded-xl border cursor-pointer transition-all',
                      selectedTemplate.id === template.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{template.name}</h4>
                      {template.premium && (
                        <Badge variant="default" className="text-xs">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {template.description}
                    </p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {template.duration}
                      </span>
                      <span>{template.format}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Generation Controls */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Generate Video
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="prompt">Video Description</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe the video you want to create... (e.g., 'A product showcase of a modern smartphone with smooth transitions and upbeat music')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                </div>

                <FeatureLock featureId="video-generation">
                  <Button 
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Video
                      </>
                    )}
                  </Button>
                </FeatureLock>
              </div>
            </Card>

            {/* Upload Section */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload & Edit
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="video-upload">Upload Video File</Label>
                  <Input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="mt-2"
                  />
                </div>

                {uploadedFile && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileVideo className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{uploadedFile.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            <Card className="p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Preview
                </h3>
                
                {generatedVideo && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                )}
              </div>

              <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                    <div>
                      <p className="font-medium">Generating your video...</p>
                      <p className="text-sm text-muted-foreground">This may take a few moments</p>
                    </div>
                  </div>
                ) : generatedVideo ? (
                  <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
                    <div className="text-center text-white space-y-2">
                      <Play className="w-16 h-16 mx-auto opacity-80" />
                      <p className="text-sm">Video Preview</p>
                      <p className="text-xs opacity-60">Click to play generated video</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <Video className="w-16 h-16 mx-auto text-muted-foreground/50" />
                    <div>
                      <p className="font-medium text-muted-foreground">No video yet</p>
                      <p className="text-sm text-muted-foreground">
                        Generate a video or upload one to get started
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Info */}
              {selectedTemplate && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Selected Template: {selectedTemplate.name}</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Duration:</span> {selectedTemplate.duration}
                    </div>
                    <div>
                      <span className="font-medium">Format:</span> {selectedTemplate.format}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {selectedTemplate.premium ? 'Premium' : 'Free'}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
