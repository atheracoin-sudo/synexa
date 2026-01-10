'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/GlobalHeader'
import { BottomTabBar } from '@/components/ui/BottomTabBar'
import { OrganizationSwitcher } from '@/components/enterprise/OrganizationSwitcher'
import { enterpriseManager, type OrganizationMember, type UserRole } from '@/lib/enterprise'
import { 
  Users,
  Plus,
  Search,
  MoreVertical,
  Mail,
  Shield,
  UserX,
  UserCheck,
  Crown,
  Eye,
  Settings,
  Trash2,
  UserMinus,
  Clock,
  Check,
  X
} from 'lucide-react'

export default function MembersPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.orgId as string
  
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<UserRole>('member')

  useEffect(() => {
    const orgMembers = enterpriseManager.getOrganizationMembers(orgId)
    setMembers(orgMembers)
  }, [orgId])

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInviteMember = (email: string, role: UserRole) => {
    const newMember = enterpriseManager.inviteMember(orgId, email, role)
    setMembers(enterpriseManager.getOrganizationMembers(orgId))
    setShowInviteModal(false)
  }

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    enterpriseManager.updateMemberRole(orgId, userId, newRole)
    setMembers(enterpriseManager.getOrganizationMembers(orgId))
    setActiveDropdown(null)
  }

  const handleRemoveMember = (userId: string) => {
    enterpriseManager.removeMember(orgId, userId)
    setMembers(enterpriseManager.getOrganizationMembers(orgId))
    setActiveDropdown(null)
  }

  const handleSuspendMember = (userId: string) => {
    enterpriseManager.suspendMember(orgId, userId)
    setMembers(enterpriseManager.getOrganizationMembers(orgId))
    setActiveDropdown(null)
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'owner': return Crown
      case 'admin': return Shield
      case 'member': return UserCheck
      case 'viewer': return Eye
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return UserCheck
      case 'invited': return Mail
      case 'suspended': return UserX
      default: return UserCheck
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/admin/${orgId}`)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <OrganizationSwitcher currentOrgId={orgId} />
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full">
                Members & Roles
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">Members & Roles</h1>
            </div>
            <p className="text-gray-400">
              Manage team members and their permissions
            </p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Invite Member
          </button>
        </div>

        {/* Search and Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span>{members.filter(m => m.status === 'active').length} Active</span>
            <span>{members.filter(m => m.status === 'invited').length} Invited</span>
            <span>{members.filter(m => m.status === 'suspended').length} Suspended</span>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              Team Members ({filteredMembers.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-700">
            {filteredMembers.map((member) => {
              const RoleIcon = getRoleIcon(member.role)
              const StatusIcon = getStatusIcon(member.status)
              
              return (
                <div key={member.id} className="p-6 hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full" />
                        ) : (
                          <span className="text-white font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        )}
                      </div>

                      {/* Member Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{member.name}</h3>
                          <div className={`px-2 py-1 rounded-full text-xs ${enterpriseManager.getStatusColor(member.status)}`}>
                            {member.status}
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm">{member.email}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">
                            Joined {enterpriseManager.formatTimestamp(member.joinedAt)}
                          </span>
                          {member.lastActive && (
                            <span className="text-xs text-gray-500">
                              Last active {enterpriseManager.formatTimestamp(member.lastActive)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Role and Actions */}
                    <div className="flex items-center gap-4">
                      {/* Role Badge */}
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${enterpriseManager.getRoleColor(member.role)}`}>
                        <RoleIcon className="w-4 h-4" />
                        <span className="text-sm font-medium capitalize">{member.role}</span>
                      </div>

                      {/* Actions Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === member.id ? null : member.id)}
                          className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>

                        {activeDropdown === member.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
                            {/* Role Changes */}
                            <div className="p-2 border-b border-gray-700">
                              <div className="text-xs font-medium text-gray-400 px-2 py-1">Change Role</div>
                              {(['owner', 'admin', 'member', 'viewer'] as UserRole[]).map((role) => (
                                <button
                                  key={role}
                                  onClick={() => handleRoleChange(member.id, role)}
                                  disabled={member.role === role}
                                  className="w-full flex items-center gap-2 px-2 py-2 text-left text-gray-300 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {(() => {
                                    const RoleIcon = getRoleIcon(role)
                                    return <RoleIcon className="w-4 h-4" />
                                  })()}
                                  <span className="capitalize">{role}</span>
                                  {member.role === role && <Check className="w-4 h-4 ml-auto text-blue-400" />}
                                </button>
                              ))}
                            </div>

                            {/* Actions */}
                            <div className="p-2">
                              {member.status === 'active' && (
                                <button
                                  onClick={() => handleSuspendMember(member.id)}
                                  className="w-full flex items-center gap-2 px-2 py-2 text-left text-yellow-400 hover:bg-gray-700 rounded"
                                >
                                  <UserMinus className="w-4 h-4" />
                                  Suspend
                                </button>
                              )}
                              <button
                                onClick={() => handleRemoveMember(member.id)}
                                className="w-full flex items-center gap-2 px-2 py-2 text-left text-red-400 hover:bg-gray-700 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                                Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <InviteMemberModal
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInviteMember}
        />
      )}

      {/* Backdrop */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setActiveDropdown(null)}
        />
      )}

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}

// Invite Member Modal Component
function InviteMemberModal({ 
  onClose, 
  onInvite 
}: { 
  onClose: () => void
  onInvite: (email: string, role: UserRole) => void 
}) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('member')
  const [isInviting, setIsInviting] = useState(false)

  const handleInvite = async () => {
    if (!email.trim()) return

    setIsInviting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onInvite(email.trim(), role)
    setIsInviting(false)
  }

  const roles: { value: UserRole; label: string; description: string }[] = [
    { value: 'viewer', label: 'Viewer', description: 'Read-only access to content' },
    { value: 'member', label: 'Member', description: 'Access to core features' },
    { value: 'admin', label: 'Admin', description: 'Manage members and settings' },
    { value: 'owner', label: 'Owner', description: 'Full access to everything' }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Invite Team Member</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Role
            </label>
            <div className="space-y-2">
              {roles.map((roleOption) => (
                <label key={roleOption.value} className="flex items-start gap-3 p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value={roleOption.value}
                    checked={role === roleOption.value}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">{roleOption.label}</div>
                    <p className="text-sm text-gray-400">{roleOption.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            disabled={!email.trim() || isInviting}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isInviting ? 'Inviting...' : 'Send Invite'}
          </button>
        </div>
      </div>
    </div>
  )
}






