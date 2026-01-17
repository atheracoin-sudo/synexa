'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  RocketLaunchIcon,
  XMarkIcon,
  CommandLineIcon,
  SwatchIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetBody, 
  SheetTitle, 
  SheetClose 
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface BuildAppModalProps {
  isOpen: boolean
  onClose: () => void
}

type AppType = 'e-commerce' | 'blog' | 'dashboard' | 'booking'
type StyleTheme = 'light' | 'dark'

const appTypes = [
  {
    id: 'e-commerce' as AppType,
    name: 'E-commerce Store',
    description: 'Online store with products, cart, and checkout',
    icon: '🛍️'
  },
  {
    id: 'blog' as AppType,
    name: 'Blog/News Site',
    description: 'Content-focused site with articles and posts',
    icon: '📝'
  },
  {
    id: 'dashboard' as AppType,
    name: 'Admin Dashboard',
    description: 'Data visualization and management interface',
    icon: '📊'
  },
  {
    id: 'booking' as AppType,
    name: 'Booking System',
    description: 'Appointment or reservation management',
    icon: '📅'
  }
]

const primaryColors = [
  { name: 'Blue', value: '#3B82F6', class: 'bg-blue-500' },
  { name: 'Purple', value: '#8B5CF6', class: 'bg-purple-500' },
  { name: 'Green', value: '#10B981', class: 'bg-green-500' },
  { name: 'Orange', value: '#F59E0B', class: 'bg-orange-500' },
  { name: 'Pink', value: '#EC4899', class: 'bg-pink-500' },
  { name: 'Red', value: '#EF4444', class: 'bg-red-500' }
]

export function BuildAppModal({ isOpen, onClose }: BuildAppModalProps) {
  const router = useRouter()
  const [appType, setAppType] = useState<AppType>('e-commerce')
  const [description, setDescription] = useState('')
  const [styleTheme, setStyleTheme] = useState<StyleTheme>('light')
  const [primaryColor, setPrimaryColor] = useState(primaryColors[0])
  const [isGenerating, setIsGenerating] = useState(false)

  const selectedAppType = appTypes.find(type => type.id === appType)

  const generateStructuredPrompt = () => {
    const themeDescription = styleTheme === 'dark' 
      ? 'dark theme with modern styling' 
      : 'clean, light theme with bright colors'
    
    return `Create a ${selectedAppType?.name.toLowerCase()} with the following specifications:

**App Type**: ${selectedAppType?.name}
**Description**: ${description || selectedAppType?.description}

**Design Requirements**:
- Theme: ${themeDescription}
- Primary color: ${primaryColor.name} (${primaryColor.value})
- Modern, responsive design
- Professional UI/UX

**Technical Stack**:
- React with TypeScript
- Tailwind CSS for styling
- Component-based architecture
- Mobile-responsive design

**Key Features**:
${getFeaturesByAppType(appType)}

Please generate a complete, production-ready application with proper file structure, components, and styling.`
  }

  const getFeaturesByAppType = (type: AppType): string => {
    switch (type) {
      case 'e-commerce':
        return `- Product catalog with search and filters
- Shopping cart functionality
- Product detail pages
- Checkout process
- User authentication
- Order management`
      case 'blog':
        return `- Article listing with pagination
- Individual blog post pages
- Categories and tags
- Search functionality
- Author profiles
- Comment system`
      case 'dashboard':
        return `- Data visualization charts
- User management interface
- Analytics overview
- Settings panels
- Real-time updates
- Export functionality`
      case 'booking':
        return `- Calendar/date picker
- Time slot selection
- Booking form
- Confirmation system
- User dashboard
- Admin management panel`
      default:
        return '- Core functionality based on app type'
    }
  }

  const handleGenerate = async () => {
    if (!description.trim()) {
      return
    }

    setIsGenerating(true)
    
    // Simulate brief loading
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Create the structured prompt
    const prompt = generateStructuredPrompt()
    
    // Store the prompt in sessionStorage to pass to Build Workspace
    sessionStorage.setItem('buildAppPrompt', prompt)
    sessionStorage.setItem('buildAppConfig', JSON.stringify({
      appType,
      description,
      styleTheme,
      primaryColor: primaryColor.value
    }))
    
    // Navigate to Build Workspace
    router.push('/build')
    
    // Close modal
    onClose()
    setIsGenerating(false)
  }

  const handleClose = () => {
    if (!isGenerating) {
      onClose()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="right" size="lg" className="bg-card border-border shadow-2xl">
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <RocketLaunchIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <SheetTitle className="text-xl font-semibold">Build New App</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Create a complete application in minutes
              </p>
            </div>
          </div>
          <SheetClose onClick={handleClose} disabled={isGenerating} />
        </SheetHeader>

        <SheetBody className="py-6 space-y-6">
          {/* App Type Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CommandLineIcon className="w-5 h-5 text-primary" />
              <label className="text-sm font-medium">App Type</label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {appTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setAppType(type.id)}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50",
                    appType === type.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <h3 className="font-medium text-sm">{type.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-primary" />
              <label className="text-sm font-medium">What should the app do?</label>
            </div>
            <Textarea
              placeholder={`Describe your ${selectedAppType?.name.toLowerCase()}... For example: "A modern online store for handmade jewelry with user reviews and wishlist functionality"`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              Be specific about features, target audience, and functionality
            </p>
          </div>

          {/* Style Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <SwatchIcon className="w-5 h-5 text-primary" />
              <label className="text-sm font-medium">Style & Theme</label>
            </div>
            
            {/* Theme Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Theme</label>
              <div className="flex gap-2">
                {(['light', 'dark'] as StyleTheme[]).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setStyleTheme(theme)}
                    className={cn(
                      "flex-1 p-3 rounded-lg border-2 text-center transition-all capitalize",
                      styleTheme === theme
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card hover:bg-muted/50"
                    )}
                    disabled={isGenerating}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Color Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Primary Color</label>
              <div className="grid grid-cols-3 gap-2">
                {primaryColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setPrimaryColor(color)}
                    className={cn(
                      "p-3 rounded-lg border-2 text-center text-sm transition-all",
                      primaryColor.name === color.name
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:bg-muted/50"
                    )}
                    disabled={isGenerating}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <div className={cn("w-4 h-4 rounded-full", color.class)} />
                      {color.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <h4 className="text-sm font-medium mb-2">Preview</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>App:</strong> {selectedAppType?.name}</p>
              <p><strong>Theme:</strong> {styleTheme} with {primaryColor.name.toLowerCase()} accents</p>
              <p><strong>Description:</strong> {description || selectedAppType?.description}</p>
            </div>
          </div>
        </SheetBody>

        {/* Footer */}
        <div className="border-t border-border p-6">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isGenerating}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!description.trim() || isGenerating}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <RocketLaunchIcon className="w-4 h-4 mr-2" />
                  Generate App
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            This will create a new project in Build Workspace
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}