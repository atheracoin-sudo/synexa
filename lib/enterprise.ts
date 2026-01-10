'use client'

// Enterprise Management System
export type UserRole = 'owner' | 'admin' | 'member' | 'viewer'
export type UserStatus = 'active' | 'invited' | 'suspended'
export type SSOProvider = 'google' | 'azure' | 'okta' | 'saml'
export type AuditAction = 'login' | 'sso_login' | 'project_created' | 'api_key_rotated' | 'member_invited' | 'member_removed' | 'role_changed' | 'settings_changed'

export interface Organization {
  id: string
  name: string
  domain: string
  plan: 'team' | 'enterprise'
  createdAt: string
  memberCount: number
  workspaceCount: number
  settings: OrganizationSettings
}

export interface OrganizationSettings {
  sso: {
    enabled: boolean
    provider?: SSOProvider
    enforced: boolean
    metadata?: any
  }
  security: {
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireNumbers: boolean
      requireSymbols: boolean
    }
    sessionTimeout: number // minutes
    twoFactorRequired: boolean
    ipWhitelist: string[]
  }
  data: {
    retentionDays: number
    exportEnabled: boolean
    deleteEnabled: boolean
  }
}

export interface OrganizationMember {
  id: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  joinedAt: string
  lastActive?: string
  avatar?: string
  invitedBy?: string
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userEmail: string
  action: AuditAction
  resource: string
  details: string
  ipAddress: string
  userAgent: string
  success: boolean
}

export interface Permission {
  feature: string
  owner: boolean
  admin: boolean
  member: boolean
  viewer: boolean
}

export interface Workspace {
  id: string
  name: string
  organizationId: string
  createdAt: string
  memberCount: number
  isDefault: boolean
}

class EnterpriseManager {
  private organizations: Map<string, Organization> = new Map()
  private members: Map<string, OrganizationMember[]> = new Map()
  private auditLogs: Map<string, AuditLogEntry[]> = new Map()
  private workspaces: Map<string, Workspace[]> = new Map()
  private permissions: Permission[]

  constructor() {
    this.initializeMockData()
    this.permissions = this.getDefaultPermissions()
  }

  private initializeMockData() {
    // Mock Organizations
    const organizations: Organization[] = [
      {
        id: 'org-1',
        name: 'Acme Corporation',
        domain: 'acme.com',
        plan: 'enterprise',
        createdAt: '2024-01-01T00:00:00Z',
        memberCount: 25,
        workspaceCount: 3,
        settings: {
          sso: {
            enabled: true,
            provider: 'google',
            enforced: false
          },
          security: {
            passwordPolicy: {
              minLength: 8,
              requireUppercase: true,
              requireNumbers: true,
              requireSymbols: false
            },
            sessionTimeout: 480, // 8 hours
            twoFactorRequired: false,
            ipWhitelist: []
          },
          data: {
            retentionDays: 365,
            exportEnabled: true,
            deleteEnabled: true
          }
        }
      },
      {
        id: 'org-2',
        name: 'TechStart Inc',
        domain: 'techstart.io',
        plan: 'team',
        createdAt: '2024-02-15T00:00:00Z',
        memberCount: 8,
        workspaceCount: 1,
        settings: {
          sso: {
            enabled: false,
            enforced: false
          },
          security: {
            passwordPolicy: {
              minLength: 6,
              requireUppercase: false,
              requireNumbers: false,
              requireSymbols: false
            },
            sessionTimeout: 240, // 4 hours
            twoFactorRequired: false,
            ipWhitelist: []
          },
          data: {
            retentionDays: 90,
            exportEnabled: false,
            deleteEnabled: false
          }
        }
      }
    ]

    // Mock Members
    const members: Record<string, OrganizationMember[]> = {
      'org-1': [
        {
          id: 'user-1',
          email: 'john.doe@acme.com',
          name: 'John Doe',
          role: 'owner',
          status: 'active',
          joinedAt: '2024-01-01T00:00:00Z',
          lastActive: '2024-01-08T15:30:00Z',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
        },
        {
          id: 'user-2',
          email: 'jane.smith@acme.com',
          name: 'Jane Smith',
          role: 'admin',
          status: 'active',
          joinedAt: '2024-01-02T00:00:00Z',
          lastActive: '2024-01-08T14:20:00Z',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'
        },
        {
          id: 'user-3',
          email: 'bob.wilson@acme.com',
          name: 'Bob Wilson',
          role: 'member',
          status: 'active',
          joinedAt: '2024-01-05T00:00:00Z',
          lastActive: '2024-01-08T10:15:00Z',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
        },
        {
          id: 'user-4',
          email: 'alice.brown@acme.com',
          name: 'Alice Brown',
          role: 'viewer',
          status: 'invited',
          joinedAt: '2024-01-07T00:00:00Z',
          invitedBy: 'john.doe@acme.com'
        }
      ],
      'org-2': [
        {
          id: 'user-5',
          email: 'mike@techstart.io',
          name: 'Mike Johnson',
          role: 'owner',
          status: 'active',
          joinedAt: '2024-02-15T00:00:00Z',
          lastActive: '2024-01-08T16:45:00Z'
        }
      ]
    }

    // Mock Audit Logs
    const auditLogs: Record<string, AuditLogEntry[]> = {
      'org-1': [
        {
          id: 'audit-1',
          timestamp: '2024-01-08T15:30:00Z',
          userId: 'user-1',
          userEmail: 'john.doe@acme.com',
          action: 'sso_login',
          resource: 'organization',
          details: 'Logged in via Google SSO',
          ipAddress: '192.168.1.***',
          userAgent: 'Chrome/120.0.0.0',
          success: true
        },
        {
          id: 'audit-2',
          timestamp: '2024-01-08T14:20:00Z',
          userId: 'user-2',
          userEmail: 'jane.smith@acme.com',
          action: 'member_invited',
          resource: 'user',
          details: 'Invited alice.brown@acme.com as viewer',
          ipAddress: '192.168.1.***',
          userAgent: 'Chrome/120.0.0.0',
          success: true
        },
        {
          id: 'audit-3',
          timestamp: '2024-01-08T13:15:00Z',
          userId: 'user-3',
          userEmail: 'bob.wilson@acme.com',
          action: 'project_created',
          resource: 'project',
          details: 'Created project "Marketing Dashboard"',
          ipAddress: '192.168.1.***',
          userAgent: 'Chrome/120.0.0.0',
          success: true
        },
        {
          id: 'audit-4',
          timestamp: '2024-01-08T12:00:00Z',
          userId: 'user-1',
          userEmail: 'john.doe@acme.com',
          action: 'settings_changed',
          resource: 'organization',
          details: 'Updated security settings',
          ipAddress: '192.168.1.***',
          userAgent: 'Chrome/120.0.0.0',
          success: true
        },
        {
          id: 'audit-5',
          timestamp: '2024-01-08T11:30:00Z',
          userId: 'user-2',
          userEmail: 'jane.smith@acme.com',
          action: 'api_key_rotated',
          resource: 'api_key',
          details: 'Rotated API key "Production Key"',
          ipAddress: '192.168.1.***',
          userAgent: 'Chrome/120.0.0.0',
          success: true
        }
      ]
    }

    // Mock Workspaces
    const workspaces: Record<string, Workspace[]> = {
      'org-1': [
        {
          id: 'ws-1',
          name: 'Marketing Team',
          organizationId: 'org-1',
          createdAt: '2024-01-01T00:00:00Z',
          memberCount: 8,
          isDefault: true
        },
        {
          id: 'ws-2',
          name: 'Engineering',
          organizationId: 'org-1',
          createdAt: '2024-01-02T00:00:00Z',
          memberCount: 12,
          isDefault: false
        },
        {
          id: 'ws-3',
          name: 'Sales',
          organizationId: 'org-1',
          createdAt: '2024-01-03T00:00:00Z',
          memberCount: 5,
          isDefault: false
        }
      ],
      'org-2': [
        {
          id: 'ws-4',
          name: 'Main Workspace',
          organizationId: 'org-2',
          createdAt: '2024-02-15T00:00:00Z',
          memberCount: 8,
          isDefault: true
        }
      ]
    }

    // Initialize data
    organizations.forEach(org => this.organizations.set(org.id, org))
    Object.entries(members).forEach(([orgId, memberList]) => this.members.set(orgId, memberList))
    Object.entries(auditLogs).forEach(([orgId, logList]) => this.auditLogs.set(orgId, logList))
    Object.entries(workspaces).forEach(([orgId, workspaceList]) => this.workspaces.set(orgId, workspaceList))
  }

  private getDefaultPermissions(): Permission[] {
    return [
      { feature: 'Chat', owner: true, admin: true, member: true, viewer: true },
      { feature: 'Code Studio', owner: true, admin: true, member: true, viewer: false },
      { feature: 'Image Studio', owner: true, admin: true, member: true, viewer: false },
      { feature: 'AI Agents', owner: true, admin: true, member: true, viewer: false },
      { feature: 'API Access', owner: true, admin: true, member: false, viewer: false },
      { feature: 'Billing', owner: true, admin: true, member: false, viewer: false },
      { feature: 'Member Management', owner: true, admin: true, member: false, viewer: false },
      { feature: 'Security Settings', owner: true, admin: false, member: false, viewer: false },
      { feature: 'Audit Logs', owner: true, admin: true, member: false, viewer: false },
      { feature: 'Data Export', owner: true, admin: false, member: false, viewer: false }
    ]
  }

  // Organization Management
  getOrganizations(): Organization[] {
    return Array.from(this.organizations.values())
  }

  getOrganization(id: string): Organization | null {
    return this.organizations.get(id) || null
  }

  updateOrganizationSettings(orgId: string, settings: Partial<OrganizationSettings>): boolean {
    const org = this.organizations.get(orgId)
    if (!org) return false

    org.settings = { ...org.settings, ...settings }
    this.organizations.set(orgId, org)
    
    // Log the change
    this.addAuditLog(orgId, {
      userId: 'current-user',
      userEmail: 'admin@example.com',
      action: 'settings_changed',
      resource: 'organization',
      details: 'Updated organization settings',
      success: true
    })

    return true
  }

  // Member Management
  getOrganizationMembers(orgId: string): OrganizationMember[] {
    return this.members.get(orgId) || []
  }

  inviteMember(orgId: string, email: string, role: UserRole): OrganizationMember {
    const members = this.members.get(orgId) || []
    const newMember: OrganizationMember = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      role,
      status: 'invited',
      joinedAt: new Date().toISOString(),
      invitedBy: 'admin@example.com'
    }

    members.push(newMember)
    this.members.set(orgId, members)

    // Update organization member count
    const org = this.organizations.get(orgId)
    if (org) {
      org.memberCount = members.length
      this.organizations.set(orgId, org)
    }

    // Log the action
    this.addAuditLog(orgId, {
      userId: 'current-user',
      userEmail: 'admin@example.com',
      action: 'member_invited',
      resource: 'user',
      details: `Invited ${email} as ${role}`,
      success: true
    })

    return newMember
  }

  updateMemberRole(orgId: string, userId: string, newRole: UserRole): boolean {
    const members = this.members.get(orgId) || []
    const memberIndex = members.findIndex(m => m.id === userId)
    
    if (memberIndex === -1) return false

    const oldRole = members[memberIndex].role
    members[memberIndex].role = newRole
    this.members.set(orgId, members)

    // Log the action
    this.addAuditLog(orgId, {
      userId: 'current-user',
      userEmail: 'admin@example.com',
      action: 'role_changed',
      resource: 'user',
      details: `Changed ${members[memberIndex].email} role from ${oldRole} to ${newRole}`,
      success: true
    })

    return true
  }

  removeMember(orgId: string, userId: string): boolean {
    const members = this.members.get(orgId) || []
    const memberIndex = members.findIndex(m => m.id === userId)
    
    if (memberIndex === -1) return false

    const removedMember = members[memberIndex]
    members.splice(memberIndex, 1)
    this.members.set(orgId, members)

    // Update organization member count
    const org = this.organizations.get(orgId)
    if (org) {
      org.memberCount = members.length
      this.organizations.set(orgId, org)
    }

    // Log the action
    this.addAuditLog(orgId, {
      userId: 'current-user',
      userEmail: 'admin@example.com',
      action: 'member_removed',
      resource: 'user',
      details: `Removed ${removedMember.email}`,
      success: true
    })

    return true
  }

  suspendMember(orgId: string, userId: string): boolean {
    const members = this.members.get(orgId) || []
    const member = members.find(m => m.id === userId)
    
    if (!member) return false

    member.status = 'suspended'
    this.members.set(orgId, members)

    // Log the action
    this.addAuditLog(orgId, {
      userId: 'current-user',
      userEmail: 'admin@example.com',
      action: 'member_removed',
      resource: 'user',
      details: `Suspended ${member.email}`,
      success: true
    })

    return true
  }

  // Audit Logs
  getAuditLogs(orgId: string, filters?: {
    userId?: string
    action?: AuditAction
    startDate?: string
    endDate?: string
  }): AuditLogEntry[] {
    let logs = this.auditLogs.get(orgId) || []

    if (filters) {
      if (filters.userId) {
        logs = logs.filter(log => log.userId === filters.userId)
      }
      if (filters.action) {
        logs = logs.filter(log => log.action === filters.action)
      }
      if (filters.startDate) {
        logs = logs.filter(log => log.timestamp >= filters.startDate!)
      }
      if (filters.endDate) {
        logs = logs.filter(log => log.timestamp <= filters.endDate!)
      }
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  private addAuditLog(orgId: string, logData: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ipAddress' | 'userAgent'>): void {
    const logs = this.auditLogs.get(orgId) || []
    const newLog: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.***',
      userAgent: 'Chrome/120.0.0.0',
      ...logData
    }

    logs.unshift(newLog)
    this.auditLogs.set(orgId, logs)
  }

  exportAuditLogs(orgId: string): string {
    const logs = this.getAuditLogs(orgId)
    const headers = ['Timestamp', 'User', 'Action', 'Resource', 'Details', 'IP Address', 'Success']
    const rows = logs.map(log => [
      log.timestamp,
      log.userEmail,
      log.action,
      log.resource,
      log.details,
      log.ipAddress,
      log.success ? 'Yes' : 'No'
    ])

    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  // Permissions
  getPermissions(): Permission[] {
    return this.permissions
  }

  updatePermission(feature: string, role: UserRole, allowed: boolean): boolean {
    const permission = this.permissions.find(p => p.feature === feature)
    if (!permission) return false

    permission[role] = allowed
    return true
  }

  // Workspaces
  getOrganizationWorkspaces(orgId: string): Workspace[] {
    return this.workspaces.get(orgId) || []
  }

  createWorkspace(orgId: string, name: string): Workspace {
    const workspaces = this.workspaces.get(orgId) || []
    const newWorkspace: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      organizationId: orgId,
      createdAt: new Date().toISOString(),
      memberCount: 1,
      isDefault: workspaces.length === 0
    }

    workspaces.push(newWorkspace)
    this.workspaces.set(orgId, workspaces)

    // Update organization workspace count
    const org = this.organizations.get(orgId)
    if (org) {
      org.workspaceCount = workspaces.length
      this.organizations.set(orgId, org)
    }

    return newWorkspace
  }

  // SSO Management
  configureSSOProvider(orgId: string, provider: SSOProvider, metadata: any): boolean {
    const org = this.organizations.get(orgId)
    if (!org) return false

    org.settings.sso = {
      enabled: true,
      provider,
      enforced: false,
      metadata
    }

    this.organizations.set(orgId, org)

    // Log the action
    this.addAuditLog(orgId, {
      userId: 'current-user',
      userEmail: 'admin@example.com',
      action: 'settings_changed',
      resource: 'sso',
      details: `Configured ${provider} SSO`,
      success: true
    })

    return true
  }

  testSSOConnection(orgId: string): Promise<boolean> {
    // Simulate SSO test
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1 // 90% success rate
        
        this.addAuditLog(orgId, {
          userId: 'current-user',
          userEmail: 'admin@example.com',
          action: 'settings_changed',
          resource: 'sso',
          details: `SSO connection test ${success ? 'successful' : 'failed'}`,
          success
        })

        resolve(success)
      }, 2000)
    })
  }

  // Utility functions
  getRoleDisplayName(role: UserRole): string {
    const names = {
      owner: 'Owner',
      admin: 'Admin',
      member: 'Member',
      viewer: 'Viewer'
    }
    return names[role]
  }

  getRoleDescription(role: UserRole): string {
    const descriptions = {
      owner: 'Full access to all features and settings',
      admin: 'Manage members and most settings',
      member: 'Access to core features',
      viewer: 'Read-only access'
    }
    return descriptions[role]
  }

  getActionDisplayName(action: AuditAction): string {
    const names = {
      login: 'Login',
      sso_login: 'SSO Login',
      project_created: 'Project Created',
      api_key_rotated: 'API Key Rotated',
      member_invited: 'Member Invited',
      member_removed: 'Member Removed',
      role_changed: 'Role Changed',
      settings_changed: 'Settings Changed'
    }
    return names[action]
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  getStatusColor(status: UserStatus): string {
    const colors = {
      active: 'text-green-400 bg-green-400/20',
      invited: 'text-yellow-400 bg-yellow-400/20',
      suspended: 'text-red-400 bg-red-400/20'
    }
    return colors[status]
  }

  getRoleColor(role: UserRole): string {
    const colors = {
      owner: 'text-purple-400 bg-purple-400/20',
      admin: 'text-blue-400 bg-blue-400/20',
      member: 'text-green-400 bg-green-400/20',
      viewer: 'text-gray-400 bg-gray-400/20'
    }
    return colors[role]
  }
}

// Singleton instance
export const enterpriseManager = new EnterpriseManager()






