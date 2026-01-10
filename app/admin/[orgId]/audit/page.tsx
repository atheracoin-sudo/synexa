'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { BottomTabBar } from '@/components/ui/BottomTabBar'
import { OrganizationSwitcher } from '@/components/enterprise/OrganizationSwitcher'
import { enterpriseManager, type AuditLogEntry, type AuditAction } from '@/lib/enterprise'
import { 
  FileText,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Activity,
  Shield,
  Key,
  Users,
  Settings,
  Database,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react'

export default function AuditLogsPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.orgId as string
  
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAction, setSelectedAction] = useState<AuditAction | 'all'>('all')
  const [selectedUser, setSelectedUser] = useState<string>('all')
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const logs = enterpriseManager.getAuditLogs(orgId)
    setAuditLogs(logs)
    setFilteredLogs(logs)
  }, [orgId])

  useEffect(() => {
    let filtered = auditLogs

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Action filter
    if (selectedAction !== 'all') {
      filtered = filtered.filter(log => log.action === selectedAction)
    }

    // User filter
    if (selectedUser !== 'all') {
      filtered = filtered.filter(log => log.userId === selectedUser)
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date()
      const cutoff = new Date()
      
      switch (dateRange) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0)
          break
        case 'week':
          cutoff.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoff.setDate(now.getDate() - 30)
          break
      }
      
      filtered = filtered.filter(log => new Date(log.timestamp) >= cutoff)
    }

    setFilteredLogs(filtered)
  }, [auditLogs, searchQuery, selectedAction, selectedUser, dateRange])

  const handleExportLogs = () => {
    const csvContent = enterpriseManager.exportAuditLogs(orgId)
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${orgId}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const getActionIcon = (action: AuditAction) => {
    switch (action) {
      case 'login':
      case 'sso_login':
        return User
      case 'project_created':
        return Database
      case 'api_key_rotated':
        return Key
      case 'member_invited':
      case 'member_removed':
        return Users
      case 'role_changed':
        return Shield
      case 'settings_changed':
        return Settings
      default:
        return Activity
    }
  }

  const getActionColor = (action: AuditAction) => {
    switch (action) {
      case 'login':
      case 'sso_login':
        return 'text-green-400 bg-green-400/20'
      case 'project_created':
        return 'text-blue-400 bg-blue-400/20'
      case 'api_key_rotated':
        return 'text-yellow-400 bg-yellow-400/20'
      case 'member_invited':
        return 'text-purple-400 bg-purple-400/20'
      case 'member_removed':
        return 'text-red-400 bg-red-400/20'
      case 'role_changed':
        return 'text-orange-400 bg-orange-400/20'
      case 'settings_changed':
        return 'text-indigo-400 bg-indigo-400/20'
      default:
        return 'text-gray-400 bg-gray-400/20'
    }
  }

  const uniqueUsers = Array.from(new Set(auditLogs.map(log => log.userEmail)))
  const uniqueActions = Array.from(new Set(auditLogs.map(log => log.action)))

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
              <div className="px-3 py-1 bg-purple-600/20 text-purple-400 text-sm rounded-full">
                Audit Logs
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
              <FileText className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
            </div>
            <p className="text-gray-400">
              Track all security events and user activities
            </p>
          </div>
          <button
            onClick={handleExportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{auditLogs.length}</div>
                <div className="text-sm text-gray-400">Total Events</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              All time
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {auditLogs.filter(log => log.success).length}
                </div>
                <div className="text-sm text-gray-400">Successful</div>
              </div>
            </div>
            <div className="text-green-400 text-sm">
              {Math.round((auditLogs.filter(log => log.success).length / auditLogs.length) * 100)}% success rate
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {auditLogs.filter(log => !log.success).length}
                </div>
                <div className="text-sm text-gray-400">Failed Events</div>
              </div>
            </div>
            <div className="text-red-400 text-sm">
              Requires attention
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{uniqueUsers.length}</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              This period
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Filters</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search logs..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Quick filters */}
            <div className="flex gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>

              {showFilters && (
                <>
                  <select
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value as any)}
                    className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm"
                  >
                    <option value="all">All Actions</option>
                    {uniqueActions.map(action => (
                      <option key={action} value={action}>
                        {enterpriseManager.getActionDisplayName(action)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm"
                  >
                    <option value="all">All Users</option>
                    {uniqueUsers.map(user => (
                      <option key={user} value={user}>{user}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
            <span>Showing {filteredLogs.length} of {auditLogs.length} events</span>
            {(searchQuery || selectedAction !== 'all' || selectedUser !== 'all' || dateRange !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedAction('all')
                  setSelectedUser('all')
                  setDateRange('all')
                }}
                className="text-purple-400 hover:text-purple-300"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Audit Logs List */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              Security Events ({filteredLogs.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-700">
            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">No events found</h3>
                <p className="text-gray-500">
                  {searchQuery || selectedAction !== 'all' || selectedUser !== 'all' || dateRange !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Audit events will appear here as they occur'
                  }
                </p>
              </div>
            ) : (
              filteredLogs.map((log) => {
                const ActionIcon = getActionIcon(log.action)
                
                return (
                  <div key={log.id} className="p-6 hover:bg-gray-700/30 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Action Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getActionColor(log.action)}`}>
                        <ActionIcon className="w-5 h-5" />
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white">
                            {enterpriseManager.getActionDisplayName(log.action)}
                          </h3>
                          <div className={`px-2 py-1 rounded-full text-xs ${
                            log.success 
                              ? 'bg-green-600/20 text-green-400' 
                              : 'bg-red-600/20 text-red-400'
                          }`}>
                            {log.success ? 'Success' : 'Failed'}
                          </div>
                          <span className="text-xs text-gray-500">
                            {log.resource}
                          </span>
                        </div>

                        <p className="text-gray-300 mb-3">{log.details}</p>

                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{log.userEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{enterpriseManager.formatTimestamp(log.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span>{log.ipAddress}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            <span className="truncate max-w-32">{log.userAgent}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}





