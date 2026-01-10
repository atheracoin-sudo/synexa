'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/global-header'
import { BottomTabBar } from '@/components/ui/bottom-tab-bar'
import { portfolioManager, PublicProfile, PortfolioProject, getProjectTypeIcon, getProjectTypeName, getRoleIcon, getRoleName, formatProjectStats, getVisibilityIcon } from '@/lib/portfolio'
import { PortfolioWatermark } from '@/components/portfolio/PremiumPortfolioFeatures'
import { 
  ExternalLink, 
  Copy, 
  Share2, 
  Eye, 
  Heart, 
  Copy as CopyIcon,
  Github,
  Linkedin,
  Globe,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  Award,
  Settings,
  Plus
} from 'lucide-react'

export default function PublicProfilePage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string
  
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'code' | 'image' | 'chat'>('all')
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    if (!username) return

    // Fetch profile data
    const profileData = portfolioManager.getPublicProfile(username)
    if (!profileData) {
      setIsLoading(false)
      return
    }

    setProfile(profileData)
    
    // Fetch projects
    const projectsData = portfolioManager.getPublicProjects(profileData.id)
    setProjects(projectsData)
    
    // Check if current user is owner (mock check)
    setIsOwner(profileData.id === 'user_1') // Mock current user
    
    setIsLoading(false)
  }, [username])

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
    if (!profile) return
    
    const shareData = portfolioManager.generateShareData('profile', profile.id)
    if (shareData && navigator.share) {
      navigator.share({
        title: shareData.title,
        text: shareData.description,
        url: shareData.url
      })
    }
  }

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'all') return true
    return project.type === activeTab
  })

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

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader title="Profile Not Found" showBack={true} />
        <main className="container mx-auto px-4 py-8 pb-24">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-gray-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
            <p className="text-gray-400 mb-6">
              The profile you're looking for doesn't exist or is private.
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
        title={profile.displayName} 
        showBack={true}
        backUrl="/"
      />

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-4xl mb-4">
                {profile.avatar}
              </div>
              
              {/* Role Badge */}
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-lg text-sm">
                <span>{getRoleIcon(profile.role)}</span>
                <span className="text-blue-400">{getRoleName(profile.role)}</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    {profile.displayName}
                    {profile.isPremium && (
                      <span className="text-xl" title="Premium User">👑</span>
                    )}
                    {profile.isTeam && (
                      <span className="text-xl" title="Team User">👥</span>
                    )}
                  </h1>
                  <p className="text-gray-400 text-lg mb-4">@{profile.username}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {isOwner ? (
                    <>
                      <button
                        onClick={() => router.push('/profile/edit')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit Profile</span>
                      </button>
                      <button
                        onClick={() => window.open(`/u/${username}?preview=true`, '_blank')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Preview</span>
                      </button>
                    </>
                  ) : (
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      <Users className="w-4 h-4" />
                      <span className="hidden sm:inline">Follow</span>
                    </button>
                  )}
                  
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                  >
                    {copiedLink ? (
                      <>
                        <Award className="w-4 h-4 text-green-400" />
                        <span className="hidden sm:inline text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Copy Link</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {profile.bio}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <Briefcase className="w-4 h-4" />
                  <span>{profile.stats.totalProjects} projects</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>{profile.stats.totalViews.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{profile.stats.followers} followers</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Since {new Date(profile.createdAt).getFullYear()}</span>
                </div>
              </div>

              {/* Social Links */}
              {profile.social && (
                <div className="flex items-center gap-4">
                  {profile.social.website && (
                    <a
                      href={profile.social.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Website</span>
                    </a>
                  )}
                  {profile.social.github && (
                    <a
                      href={profile.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {profile.social.linkedin && (
                    <a
                      href={profile.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Portfolio</h2>
            {isOwner && (
              <button
                onClick={() => router.push('/create')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-xl font-medium hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            )}
          </div>

          {/* Project Filters */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto">
            {[
              { key: 'all', label: 'All', icon: '📁' },
              { key: 'code', label: 'Code', icon: '💻' },
              { key: 'image', label: 'Design', icon: '🎨' },
              { key: 'chat', label: 'Chat', icon: '💬' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className="text-xs opacity-75">
                  ({tab.key === 'all' ? projects.length : projects.filter(p => p.type === tab.key).length})
                </span>
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => router.push(`/project/${project.id}`)}
                  className="group bg-gray-800/50 border border-gray-700 hover:border-gray-600 rounded-2xl overflow-hidden transition-all hover:scale-[1.02] cursor-pointer"
                >
                  {/* Project Cover */}
                  <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-50">
                      {getProjectTypeIcon(project.type)}
                    </div>
                    
                    {/* Visibility Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-xs text-white">
                        <span>{getVisibilityIcon(project.visibility)}</span>
                        <span className="capitalize">{project.visibility}</span>
                      </div>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center gap-1 px-2 py-1 bg-blue-600/80 backdrop-blur-sm rounded-lg text-xs text-white">
                        <span>{getProjectTypeIcon(project.type)}</span>
                        <span>{getProjectTypeName(project.type)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-lg">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{project.stats.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>{project.stats.likes}</span>
                        </div>
                      </div>
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                {activeTab === 'all' ? 'No projects yet' : `No ${activeTab} projects`}
              </h3>
              <p className="text-gray-400 mb-6">
                {isOwner 
                  ? 'Start creating and add your first project to your portfolio.'
                  : `${profile.displayName} hasn't shared any ${activeTab === 'all' ? '' : activeTab} projects yet.`
                }
              </p>
              {isOwner && (
                <button
                  onClick={() => router.push('/create')}
                  className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:scale-105 transition-transform"
                >
                  Create Your First Project
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-800">
          <PortfolioWatermark isPremium={profile.isPremium} />
          {!profile.isPremium && (
            <p className="text-xs text-gray-600 mt-2">
              Create your own portfolio • <button className="text-blue-400 hover:text-blue-300 underline">Get Premium</button>
            </p>
          )}
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}
