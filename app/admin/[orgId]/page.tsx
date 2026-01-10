'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { GlobalHeader } from '@/components/ui/GlobalHeader'
import { BottomTabBar } from '@/components/ui/BottomTabBar'
import { OrganizationSwitcher } from '@/components/enterprise/OrganizationSwitcher'
import { enterpriseManager, type Organization } from '@/lib/enterprise'
import { 
  Shield,
  Users,
  Settings,
  FileText,
  Database,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
  Lock,
  UserCheck,
  Clock,
  BarChart3,
  Zap,
  Globe
} from 'lucide-react'

export default function AdminDashboardPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.orgId as string
  
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [members, setMembers] = useState<any[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])

  useEffect(() => {
    const org = enterpriseManager.getOrganization(orgId)
    const orgMembers = enterpriseManager.getOrganizationMembers(orgId)
    const logs = enterpriseManager.getAuditLogs(orgId).slice(0, 5) // Recent 5

    setOrganization(org)
    setMembers(orgMembers)
    setAuditLogs(logs)
  }, [orgId])

  if (!organization) {
    return <div>Loading...</div>
  }

  const adminActions = [
    {
      id: 'members',
      title: 'Members & Roles',
      description: 'Manage team members and permissions',
      icon: Users,
      href: `/admin/${orgId}/members`,
      stats: `${members.length} members`,
      color: 'from-blue-600 to-blue-700'
    },
    {
      id: 'security',
      title: 'Security & SSO',
      description: 'Configure authentication and security',
      icon: Shield,
      href: `/admin/${orgId}/security`,
      stats: organization.settings.sso.enabled ? 'SSO Active' : 'SSO Inactive',
      color: 'from-green-600 to-green-700'
    },
    {
      id: 'audit',
      title: 'Audit Logs',
      description: 'View security and activity logs',
      icon: FileText,
      href: `/admin/${orgId}/audit`,
      stats: `${auditLogs.length} recent events`,
      color: 'from-purple-600 to-purple-700'
    },
    {
      id: 'permissions',
      title: 'Permissions',
      description: 'Configure role-based access control',
      icon: Lock,
      href: `/admin/${orgId}/permissions`,
      stats: '4 roles configured',
      color: 'from-orange-600 to-orange-700'
    },
    {
      id: 'data',
      title: 'Data & Privacy',
      description: 'Manage data retention and exports',
      icon: Database,
      href: `/admin/${orgId}/data`,
      stats: `${organization.settings.data.retentionDays} days retention`,
      color: 'from-indigo-600 to-indigo-700'
    },
    {
      id: 'billing',
      title: 'Billing & Usage',
      description: 'View invoices and manage subscription',
      icon: CreditCard,
      href: `/admin/${orgId}/billing`,
      stats: `${organization.plan} plan`,
      color: 'from-pink-600 to-pink-700'
    }
  ]

  const securityChecklist = [
    {
      id: 'sso',
      title: 'Single Sign-On',
      completed: organization.settings.sso.enabled,
      description: 'Configure SSO for secure authentication'
    },
    {
      id: '2fa',
      title: 'Two-Factor Authentication',
      completed: organization.settings.security.twoFactorRequired,
      description: 'Require 2FA for all members'
    },
    {
      id: 'password',
      title: 'Password Policy',
      completed: organization.settings.security.passwordPolicy.minLength >= 8,
      description: 'Set strong password requirements'
    },
    {
      id: 'session',
      title: 'Session Timeout',
      completed: organization.settings.security.sessionTimeout <= 480,
      description: 'Configure automatic session expiry'
    }
  ]

  const completedChecks = securityChecklist.filter(item => item.completed).length

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header with Org Switcher */}
      <div className="border-b border-gray-700 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
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
                Admin Panel
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-400">
            Manage {organization.name} organization settings and security
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{organization.memberCount}</div>
                <div className="text-sm text-gray-400">Total Members</div>
              </div>
            </div>
            <div className="text-green-400 text-sm">
              {members.filter(m => m.status === 'active').length} active
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{organization.workspaceCount}</div>
                <div className="text-sm text-gray-400">Workspaces</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              Across organization
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{auditLogs.length}</div>
                <div className="text-sm text-gray-400">Recent Events</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              Last 24 hours
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{completedChecks}/4</div>
                <div className="text-sm text-gray-400">Security Score</div>
              </div>
            </div>
            <div className="text-yellow-400 text-sm">
              {completedChecks === 4 ? 'Excellent' : 'Needs attention'}
            </div>
          </div>
        </div>

        {/* Security Checklist */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Security Checklist</h2>
              <p className="text-gray-400">
                Complete these steps to secure your organization
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{completedChecks}/4</div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityChecklist.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-4 bg-gray-900/50 rounded-xl">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  item.completed 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-gray-400'
                }`}>
                  {item.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Administration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminActions.map((action) => (
              <button
                key={action.id}
                onClick={() => router.push(action.href)}
                className="bg-gray-800/50 border border-gray-700 hover:border-gray-600 rounded-2xl p-6 text-left transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm text-gray-400">{action.stats}</div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <button
              onClick={() => router.push(`/admin/${orgId}/audit`)}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-4 bg-gray-900/50 rounded-xl">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">{log.userEmail}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-400">
                      {enterpriseManager.getActionDisplayName(log.action)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{log.details}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-500">
                      {enterpriseManager.formatTimestamp(log.timestamp)}
                    </span>
                    <span className="text-xs text-gray-500">{log.ipAddress}</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  log.success ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                }`}>
                  {log.success ? 'Success' : 'Failed'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}






