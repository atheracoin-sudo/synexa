'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/GlobalHeader'
import { BottomTabBar } from '@/components/ui/BottomTabBar'
import { portfolioManager, PortfolioProject, PublicProfile, getProjectTypeIcon, getProjectTypeName, formatProjectStats } from '@/lib/portfolio'
import { 
  ExternalLink, 
  Copy, 
  Share2, 
  Eye, 
  Heart, 
  Download,
  Code,
  Palette,
  MessageCircle,
  Calendar,
  User,
  Tag,
  Zap,
  ArrowRight,
  Github,
  Globe,
  ChevronLeft,
  ChevronRight,
  Play,
  Bookmark,
  MoreHorizontal
} from 'lucide-react'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [project, setProject] = useState<PortfolioProject | null>(null)
  const [author, setAuthor] = useState<PublicProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Mock images for project gallery
  const mockImages = [
    '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600'
  ]

  useEffect(() => {
    if (!projectId) return

    // Fetch project data
    const projectData = portfolioManager.getProject(projectId)
    if (!projectData) {
      setIsLoading(false)
      return
    }

    setProject(projectData)
    
    // Increment view count
    portfolioManager.incrementProjectViews(projectId)
    
    // Find author
    const profiles = [
      portfolioManager.getProfileById('user_1'),
      portfolioManager.getProfileById('user_2')
    ].filter(Boolean) as PublicProfile[]
    
    const authorProfile = profiles.find(profile => {
      const userProjects = portfolioManager.getUserProjects(profile.id)
      return userProjects.some(p => p.id === projectId)
    })
    
    setAuthor(authorProfile || null)
    setIsLoading(false)
  }, [projectId])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleShare = () => {
    if (!project) return
    
    const shareData = portfolioManager.generateShareData('project', project.id)
    if (shareData && navigator.share) {
      navigator.share({
        title: shareData.title,
        text: shareData.description,
        url: shareData.url
      })
    }
  }

  const handleLike = () => {
    if (!project) return
    
    const newLikedState = !isLiked
    setIsLiked(newLikedState)
    portfolioManager.toggleProjectLike(project.id, newLikedState)
    
    // Update local state
    setProject({
      ...project,
      stats: {
        ...project.stats,
        likes: project.stats.likes + (newLikedState ? 1 : -1)
      }
    })
  }

  const handleDuplicate = () => {
    if (!project) return
    
    // Mock duplicate functionality
    alert('Project duplicated to your workspace!')
    
    // Increment duplicate count
    setProject({
      ...project,
      stats: {
        ...project.stats,
        duplicates: project.stats.duplicates + 1
      }
    })
  }

  const getToolIcon = (tool: string) => {
    const icons: Record<string, JSX.Element> = {
      'chat': <MessageCircle className="w-4 h-4" />,
      'code-studio': <Code className="w-4 h-4" />,
      'image-studio': <Palette className="w-4 h-4" />
    }
    return icons[tool] || <Zap className="w-4 h-4" />
  }

  const getToolName = (tool: string) => {
    const names: Record<string, string> = {
      'chat': 'AI Chat',
      'code-studio': 'Code Studio',
      'image-studio': 'Image Studio'
    }
    return names[tool] || tool
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader title="Loading..." showBack={true} />
        <main className="container mx-auto px-4 py-8 pb-24">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
        <BottomTabBar />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader title="Project Not Found" showBack={true} />
        <main className="container mx-auto px-4 py-8 pb-24">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Code className="w-12 h-12 text-gray-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
            <p className="text-gray-400 mb-6">
              The project you're looking for doesn't exist or is private.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:scale-105 transition-transform"
            >
              Go Home
            </button>
          </div>
        </main>
        <BottomTabBar />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader 
        title={project.title} 
        showBack={true}
        backUrl={author ? `/u/${author.username}` : '/'}
      />

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Project Header */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Project Gallery */}
            <div className="lg:w-2/3">
              <div className="relative aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl overflow-hidden mb-4">
                <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-50">
                  {getProjectTypeIcon(project.type)}
                </div>
                
                {/* Navigation arrows for multiple images */}
                {mockImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                      disabled={currentImageIndex === 0}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(Math.min(mockImages.length - 1, currentImageIndex + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                      disabled={currentImageIndex === mockImages.length - 1}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image indicators */}
                {mockImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {mockImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {mockImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {mockImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 bg-gray-700 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                      }`}
                    >
                      <div className="w-full h-full flex items-center justify-center text-2xl opacity-75">
                        {getProjectTypeIcon(project.type)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="lg:w-1/3">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-lg text-sm">
                  <span>{getProjectTypeIcon(project.type)}</span>
                  <span className="text-blue-400">{getProjectTypeName(project.type)}</span>
                </div>
                
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">{project.title}</h1>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Author */}
              {author && (
                <div 
                  onClick={() => router.push(`/u/${author.username}`)}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl mb-6 cursor-pointer hover:bg-gray-800/70 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-lg">
                    {author.avatar}
                  </div>
                  <div>
                    <p className="text-white font-medium">{author.displayName}</p>
                    <p className="text-gray-400 text-sm">@{author.username}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{project.stats.views}</div>
                  <div className="text-sm text-gray-400">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{project.stats.likes}</div>
                  <div className="text-sm text-gray-400">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{project.stats.duplicates}</div>
                  <div className="text-sm text-gray-400">Duplicates</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                {project.liveUrl && (
                  <button
                    onClick={() => window.open(project.liveUrl, '_blank')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:scale-105 transition-transform"
                  >
                    <Play className="w-4 h-4" />
                    View Live Demo
                  </button>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleLike}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                      isLiked 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    Like
                  </button>
                  
                  <button
                    onClick={handleDuplicate}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl font-medium transition-colors"
                  >
                    {copiedLink ? (
                      <>
                        <Download className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl font-medium transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Project Meta */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tools Used */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Tools Used
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.tools.map((tool) => (
                  <div
                    key={tool}
                    className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl"
                  >
                    {getToolIcon(tool)}
                    <span className="text-gray-300">{getToolName(tool)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Agents */}
            {project.agents && project.agents.length > 0 && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  AI Agents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.agents.map((agent) => (
                    <div
                      key={agent}
                      className="flex items-center gap-3 p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">
                        🤖
                      </div>
                      <span className="text-blue-400">{agent}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-green-400" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-green-600/10 border border-green-500/20 text-green-400 rounded-lg text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Projects */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">More from {author?.displayName}</h3>
              <div className="space-y-3">
                {/* Mock related projects */}
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-700/50 hover:bg-gray-700/70 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center text-lg">
                      {getProjectTypeIcon('code')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">Sample Project {i}</p>
                      <p className="text-gray-400 text-sm">2 days ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Stats */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Project Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Views</span>
                  <span className="text-white font-medium">{project.stats.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Likes</span>
                  <span className="text-white font-medium">{project.stats.likes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Duplicates</span>
                  <span className="text-white font-medium">{project.stats.duplicates}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white font-medium">{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 mt-12 border-t border-gray-800">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
            <span>Created with</span>
            <span className="text-blue-400 font-medium">Synexa AI</span>
          </div>
          <p className="text-xs text-gray-600">
            Discover more amazing projects on Synexa
          </p>
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}






