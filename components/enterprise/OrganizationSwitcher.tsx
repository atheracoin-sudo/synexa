'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { enterpriseManager, type Organization } from '@/lib/enterprise'
import { 
  Building2,
  ChevronDown,
  Check,
  Plus,
  Settings,
  Users,
  Shield
} from 'lucide-react'

interface OrganizationSwitcherProps {
  currentOrgId?: string
  onOrgChange?: (orgId: string) => void
}

export function OrganizationSwitcher({ 
  currentOrgId = 'org-1', 
  onOrgChange 
}: OrganizationSwitcherProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  
  const organizations = enterpriseManager.getOrganizations()
  const currentOrg = organizations.find(org => org.id === currentOrgId) || organizations[0]

  const handleOrgSwitch = (orgId: string) => {
    onOrgChange?.(orgId)
    setIsOpen(false)
    // Could trigger a page refresh or state update here
  }

  const handleAdminPanel = () => {
    router.push(`/admin/${currentOrgId}`)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors"
      >
        <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <Building2 className="w-3 h-3 text-white" />
        </div>
        <div className="text-left min-w-0">
          <div className="text-sm font-medium text-white truncate">
            {currentOrg.name}
          </div>
          <div className="text-xs text-gray-400 capitalize">
            {currentOrg.plan}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 border border-gray-600 rounded-xl shadow-lg z-50">
          {/* Current Organization */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{currentOrg.name}</h3>
                <p className="text-sm text-gray-400">{currentOrg.domain}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-gray-500">{currentOrg.memberCount} members</span>
                  <span className="text-xs text-gray-500">{currentOrg.workspaceCount} workspaces</span>
                </div>
              </div>
              <div className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded capitalize">
                {currentOrg.plan}
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          {(currentOrg.plan === 'team' || currentOrg.plan === 'enterprise') && (
            <div className="p-2 border-b border-gray-700">
              <button
                onClick={handleAdminPanel}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                <Shield className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-sm font-medium text-white">Admin Panel</div>
                  <div className="text-xs text-gray-400">Manage organization settings</div>
                </div>
              </button>
            </div>
          )}

          {/* Organization List */}
          {organizations.length > 1 && (
            <div className="p-2">
              <div className="text-xs font-medium text-gray-400 px-3 py-2">Switch Organization</div>
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleOrgSwitch(org.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-left"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                    <Building2 className="w-3 h-3 text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{org.name}</div>
                    <div className="text-xs text-gray-400 capitalize">{org.plan}</div>
                  </div>
                  {org.id === currentOrgId && (
                    <Check className="w-4 h-4 text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Create Organization */}
          <div className="p-2 border-t border-gray-700">
            <button
              onClick={() => {
                router.push('/organizations/new')
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-left"
            >
              <Plus className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Create Organization</span>
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}





