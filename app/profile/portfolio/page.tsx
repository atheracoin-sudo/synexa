'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/global-header'
import { BottomTabBar } from '@/components/ui/bottom-tab-bar'
import { portfolioManager, PublicProfile, PortfolioProject, getProjectTypeIcon, getProjectTypeName, getVisibilityIcon, getVisibilityName } from '@/lib/portfolio'
import { PortfolioLimitIndicator, PremiumFeatureList } from '@/components/portfolio/PremiumPortfolioFeatures'
import { 
  Eye, 
  EyeOff, 
  Edit3, 
  Trash2, 
  Share2, 
  Copy,
  Globe,
  Link,
  Lock,
  Settings,
  User,
  Image as ImageIcon,
  Save,
  X,
  Plus,
  Crown,
  Users
} from 'lucide-react'

export default function PortfolioSettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    bio: '',
    isPublic: false
  })

  useEffect(() => {
    // Mock current user ID
    const userId = 'user_1'
    
    // Fetch profile
    const profileData = portfolioManager.getProfileById(userId)
    if (profileData) {
      setProfile(profileData)
      setProfileForm({
        displayName: profileData.displayName,
        bio: profileData.bio,
        isPublic: profileData.isPublic
      })
    }

    // Fetch all projects (including private)
    const projectsData = portfolioManager.getUserProjects(userId, true)
    setProjects(projectsData)
    
    setIsLoading(false)
  }, [])

  const handleSaveProfile = () => {
    if (!profile) return

    const success = portfolioManager.updateProfile(profile.id, {
      displayName: profileForm.displayName,
      bio: profileForm.bio,
      isPublic: profileForm.isPublic
    })

    if (success) {
      const updatedProfile = portfolioManager.getProfileById(profile.id)
      if (updatedProfile) {
        setProfile(updatedProfile)
      }
      setEditingProfile(false)
    }
  }

  const handleToggleProjectVisibility = (projectId: string, newVisibility: 'public' | 'unlisted' | 'private') => {
    const success = portfolioManager.updateProject(projectId, { visibility: newVisibility })
    
    if (success) {
      setProjects(projects.map(project => 
        project.id === projectId 
          ? { ...project, visibility: newVisibility }
          : project
      ))
    }
  }

  const handleDeleteProject = (projectId: string) => {
    if (!profile) return
    
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      const success = portfolioManager.deleteProject(profile.id, projectId)
      
      if (success) {
        setProjects(projects.filter(project => project.id !== projectId))
      }
    }
  }

  const handleCopyProfileLink = async () => {
    if (!profile) return
    
    try {
      const profileUrl = `${window.location.origin}/u/${profile.username}`
      await navigator.clipboard.writeText(profileUrl)
      alert('Profile link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader title="Portfolio Settings" showBack={true} backUrl="/profile" />
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
        <GlobalHeader title="Portfolio Settings" showBack={true} backUrl="/profile" />
        <main className="container mx-auto px-4 py-8 pb-24">
          <div className="text-center py-16">
            <p className="text-gray-400">Profile not found</p>
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
        title="Portfolio Settings" 
        showBack={true}
        backUrl="/profile"
      />

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Profile Settings */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              Public Profile
            </h2>
            {!editingProfile && (
              <button
                onClick={() => setEditingProfile(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          {editingProfile ? (
            <div className="space-y-6">
              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profileForm.displayName}
                  onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                  className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your display name"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio (160 characters max)
                </label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value.slice(0, 160) })}
                  rows={3}
                  className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell the world about yourself..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {profileForm.bio.length}/160 characters
                </p>
              </div>

              {/* Public Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                <div>
                  <h3 className="font-medium text-white mb-1">Public Profile</h3>
                  <p className="text-sm text-gray-400">
                    Make your profile visible to everyone
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileForm.isPublic}
                    onChange={(e) => setProfileForm({ ...profileForm, isPublic: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditingProfile(false)
                    setProfileForm({
                      displayName: profile.displayName,
                      bio: profile.bio,
                      isPublic: profile.isPublic
                    })
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                  {profile.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {profile.displayName}
                    {profile.isPremium && <Crown className="w-4 h-4 text-yellow-400" />}
                    {profile.isTeam && <Users className="w-4 h-4 text-blue-400" />}
                  </h3>
                  <p className="text-gray-400">@{profile.username}</p>
                </div>
                <div className="flex items-center gap-2">
                  {profile.isPublic ? (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-600/20 border border-green-500/30 rounded-lg text-sm text-green-400">
                      <Globe className="w-3 h-3" />
                      Public
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-600/20 border border-gray-500/30 rounded-lg text-sm text-gray-400">
                      <Lock className="w-3 h-3" />
                      Private
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-gray-300">{profile.bio}</p>
              
              {profile.isPublic && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push(`/u/${profile.username}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Public Profile
                  </button>
                  <button
                    onClick={handleCopyProfileLink}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Portfolio Limit Indicator */}
        {!profile.isPremium && (
          <PortfolioLimitIndicator
            current={projects.filter(p => p.visibility === 'public').length}
            max={2}
            isPremium={profile.isPremium}
            className="mb-8"
          />
        )}

        {/* Portfolio Projects */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-green-400" />
              Portfolio Projects
            </h2>
            <button
              onClick={() => router.push('/create')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-lg font-medium hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          </div>

          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 p-4 bg-gray-900/50 border border-gray-700 rounded-xl"
                >
                  {/* Project Info */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg flex items-center justify-center text-xl">
                    {getProjectTypeIcon(project.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{project.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="capitalize">{getProjectTypeName(project.type)}</span>
                      <span>•</span>
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{project.stats.views} views</span>
                    </div>
                  </div>

                  {/* Visibility Control */}
                  <div className="flex items-center gap-2">
                    <select
                      value={project.visibility}
                      onChange={(e) => handleToggleProjectVisibility(project.id, e.target.value as any)}
                      className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="public">🌍 Public</option>
                      <option value="unlisted">🔗 Unlisted</option>
                      <option value="private">🔒 Private</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/project/${project.id}`)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="View project"
                    >
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Projects Yet</h3>
              <p className="text-gray-400 mb-6">
                Create your first project and add it to your portfolio
              </p>
              <button
                onClick={() => router.push('/create')}
                className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:scale-105 transition-transform"
              >
                Create Your First Project
              </button>
            </div>
          )}
        </div>

        {/* Premium Features */}
        {!profile.isPremium && (
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl p-6 mt-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center text-white">
                <Crown className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">Upgrade to Premium</h3>
                <p className="text-gray-300 mb-6">
                  Unlock unlimited projects, remove watermarks, and get priority support.
                </p>
                <PremiumFeatureList className="mb-6" />
                <button
                  onClick={() => router.push('/pricing')}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-medium hover:scale-105 transition-transform"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}
