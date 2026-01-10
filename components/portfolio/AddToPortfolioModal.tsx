'use client'

import { useState } from 'react'
import { X, Upload, Eye, Link, Lock, Globe, Image as ImageIcon, Code, MessageCircle } from 'lucide-react'
import { portfolioManager, ProjectType, ProjectVisibility } from '@/lib/portfolio'

interface AddToPortfolioModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (projectId: string) => void
  projectData?: {
    title: string
    description?: string
    type: ProjectType
    tools: string[]
    agents?: string[]
    liveUrl?: string
    sourceUrl?: string
  }
}

export function AddToPortfolioModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  projectData 
}: AddToPortfolioModalProps) {
  const [formData, setFormData] = useState({
    title: projectData?.title || '',
    description: projectData?.description || '',
    visibility: 'public' as ProjectVisibility,
    tags: [] as string[],
    coverImage: '/api/placeholder/400/300'
  })
  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleSubmit = async () => {
    if (!projectData) return

    setIsSubmitting(true)
    
    try {
      // Check if user can add project (Premium limits)
      const canAdd = portfolioManager.canAddProject('user_1') // Mock current user
      if (!canAdd.canAdd) {
        alert(canAdd.reason)
        setIsSubmitting(false)
        return
      }

      // Add project to portfolio
      const projectId = portfolioManager.addToPortfolio('user_1', {
        title: formData.title,
        description: formData.description,
        type: projectData.type,
        visibility: formData.visibility,
        coverImage: formData.coverImage,
        tools: projectData.tools,
        agents: projectData.agents,
        liveUrl: projectData.liveUrl,
        sourceUrl: projectData.sourceUrl,
        tags: formData.tags
      })

      onSuccess(projectId)
      onClose()
      
      // Reset form
      setFormData({
        title: projectData?.title || '',
        description: projectData?.description || '',
        visibility: 'public',
        tags: [],
        coverImage: '/api/placeholder/400/300'
      })
      setCurrentStep(1)
    } catch (error) {
      console.error('Failed to add to portfolio:', error)
      alert('Failed to add project to portfolio. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getProjectTypeIcon = (type: ProjectType) => {
    const icons = {
      code: <Code className="w-5 h-5" />,
      image: <ImageIcon className="w-5 h-5" />,
      chat: <MessageCircle className="w-5 h-5" />
    }
    return icons[type] || <Code className="w-5 h-5" />
  }

  const getVisibilityInfo = (visibility: ProjectVisibility) => {
    const info = {
      public: {
        icon: <Globe className="w-4 h-4" />,
        title: 'Public',
        description: 'Anyone can see this project'
      },
      unlisted: {
        icon: <Link className="w-4 h-4" />,
        title: 'Unlisted',
        description: 'Only people with the link can see this'
      },
      private: {
        icon: <Lock className="w-4 h-4" />,
        title: 'Private',
        description: 'Only you can see this project'
      }
    }
    return info[visibility]
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-bold text-foreground">Add to Portfolio</h2>
              <p className="text-muted-foreground text-sm">Share your creation with the world</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-blue-400' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  1
                </div>
                <span className="text-sm font-medium">Details</span>
              </div>
              <div className={`flex-1 h-px ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-700'}`} />
              <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-blue-400' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  2
                </div>
                <span className="text-sm font-medium">Privacy</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Project Preview */}
                {projectData && (
                  <div className="bg-muted/50 border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
                        {getProjectTypeIcon(projectData.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{projectData.title}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{projectData.type} Project</p>
                      </div>
                    </div>
                    {projectData.description && (
                      <p className="text-sm text-muted-foreground">{projectData.description}</p>
                    )}
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter project title"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full p-3 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe your project (optional)"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 p-3 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Add tags (press Enter)"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm"
                        >
                          #{tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-blue-300 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cover Image
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload a cover image or use auto-generated preview
                    </p>
                    <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      Choose File
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-4">Privacy Settings</h3>
                  <p className="text-muted-foreground mb-6">
                    Choose who can see your project
                  </p>
                </div>

                {/* Visibility Options */}
                <div className="space-y-3">
                  {(['public', 'unlisted', 'private'] as ProjectVisibility[]).map((visibility) => {
                    const info = getVisibilityInfo(visibility)
                    return (
                      <label
                        key={visibility}
                        className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                          formData.visibility === visibility
                            ? 'border-blue-500 bg-blue-600/10'
                            : 'border-border hover:border-gray-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value={visibility}
                          checked={formData.visibility === visibility}
                          onChange={(e) => setFormData({ ...formData, visibility: e.target.value as ProjectVisibility })}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {info.icon}
                            <span className="font-medium text-foreground">{info.title}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{info.description}</p>
                        </div>
                      </label>
                    )
                  })}
                </div>

                {/* Premium Notice */}
                <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-yellow-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                      !
                    </div>
                    <div>
                      <p className="text-yellow-400 font-medium mb-1">Free Plan Limit</p>
                      <p className="text-yellow-300/80 text-sm">
                        Free users can have maximum 2 public projects. 
                        <button className="text-yellow-400 hover:text-yellow-300 underline ml-1">
                          Upgrade to Premium
                        </button> for unlimited projects.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border">
            <div className="flex items-center gap-2">
              {currentStep === 2 && (
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              
              {currentStep === 1 ? (
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.title.trim()}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.title.trim()}
                  className="px-6 py-2 bg-gradient-primary hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Publishing...
                    </div>
                  ) : (
                    'Publish to Portfolio'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}





