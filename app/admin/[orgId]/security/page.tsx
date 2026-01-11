'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { BottomTabBar } from '@/components/ui/bottom-tab-bar'
import { OrganizationSwitcher } from '@/components/enterprise/organization-switcher'
import { enterpriseManager, type Organization, type SSOProvider } from '@/lib/enterprise'
import { 
  Shield,
  Key,
  Lock,
  Clock,
  Users,
  Check,
  AlertTriangle,
  Settings,
  Globe,
  Smartphone,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader,
  ExternalLink
} from 'lucide-react'

export default function SecurityPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.orgId as string
  
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [activeTab, setActiveTab] = useState<'sso' | 'security' | 'compliance'>('sso')
  const [ssoStep, setSsoStep] = useState(1)
  const [selectedProvider, setSelectedProvider] = useState<SSOProvider>('google')
  const [isTestingSSO, setIsTestingSSO] = useState(false)
  const [ssoTestResult, setSsoTestResult] = useState<'success' | 'error' | null>(null)

  useEffect(() => {
    const org = enterpriseManager.getOrganization(orgId)
    setOrganization(org)
  }, [orgId])

  if (!organization) {
    return <div>Loading...</div>
  }

  const handleSSOTest = async () => {
    setIsTestingSSO(true)
    setSsoTestResult(null)
    
    try {
      const result = await enterpriseManager.testSSOConnection(orgId)
      setSsoTestResult(result ? 'success' : 'error')
    } catch (error) {
      setSsoTestResult('error')
    } finally {
      setIsTestingSSO(false)
    }
  }

  const handleEnableSSO = () => {
    enterpriseManager.configureSSOProvider(orgId, selectedProvider, {
      clientId: 'example-client-id',
      domain: organization.domain
    })
    setOrganization(enterpriseManager.getOrganization(orgId))
  }

  const handleSecuritySettingChange = (setting: string, value: any) => {
    const currentSettings = organization.settings
    const newSettings = {
      ...currentSettings,
      security: {
        ...currentSettings.security,
        [setting]: value
      }
    }
    enterpriseManager.updateOrganizationSettings(orgId, newSettings)
    setOrganization(enterpriseManager.getOrganization(orgId))
  }

  const ssoProviders = [
    {
      id: 'google' as SSOProvider,
      name: 'Google Workspace',
      description: 'Sign in with Google accounts',
      icon: '🔍',
      popular: true
    },
    {
      id: 'azure' as SSOProvider,
      name: 'Azure AD',
      description: 'Microsoft Azure Active Directory',
      icon: '🔷',
      popular: true
    },
    {
      id: 'okta' as SSOProvider,
      name: 'Okta',
      description: 'Enterprise identity platform',
      icon: '🔐',
      popular: false
    },
    {
      id: 'saml' as SSOProvider,
      name: 'SAML 2.0',
      description: 'Generic SAML provider',
      icon: '🔒',
      popular: false
    }
  ]

  const tabs = [
    { id: 'sso' as const, name: 'Single Sign-On', icon: Key },
    { id: 'security' as const, name: 'Security Policy', icon: Shield },
    { id: 'compliance' as const, name: 'Compliance', icon: CheckCircle }
  ]

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
              <div className="px-3 py-1 bg-green-600/20 text-green-400 text-sm rounded-full">
                Security & SSO
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold text-white">Security & SSO</h1>
          </div>
          <p className="text-gray-400">
            Configure authentication and security policies for your organization
          </p>
        </div>

        {/* Security Status Banner */}
        {organization.settings.sso.enabled && (
          <div className="bg-green-600/20 border border-green-500/30 rounded-2xl p-4 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <h3 className="font-semibold text-green-400">SSO Active</h3>
                <p className="text-green-200 text-sm">
                  {organization.settings.sso.provider} SSO is configured and active
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-xl mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* SSO Tab */}
        {activeTab === 'sso' && (
          <div className="space-y-8">
            {!organization.settings.sso.enabled ? (
              /* SSO Setup Flow */
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">Setup Single Sign-On</h2>
                  <p className="text-gray-400">
                    Enable SSO to allow your team to sign in with their corporate accounts
                  </p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-4 mb-8">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= ssoStep 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {step}
                      </div>
                      {step < 4 && (
                        <div className={`w-12 h-0.5 ${
                          step < ssoStep ? 'bg-blue-600' : 'bg-gray-700'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step Content */}
                {ssoStep === 1 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Choose Your Provider</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ssoProviders.map((provider) => (
                        <button
                          key={provider.id}
                          onClick={() => setSelectedProvider(provider.id)}
                          className={`p-4 border rounded-xl text-left transition-colors ${
                            selectedProvider === provider.id
                              ? 'border-blue-500 bg-blue-600/20'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{provider.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-white">{provider.name}</h4>
                                {provider.popular && (
                                  <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded">
                                    Popular
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-400 mt-1">{provider.description}</p>
                            </div>
                            {selectedProvider === provider.id && (
                              <Check className="w-5 h-5 text-blue-400" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setSsoStep(2)}
                      className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {ssoStep === 2 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Configure {ssoProviders.find(p => p.id === selectedProvider)?.name}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Client ID
                        </label>
                        <input
                          type="text"
                          placeholder="your-client-id"
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Domain
                        </label>
                        <input
                          type="text"
                          value={organization.domain}
                          disabled
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-400"
                        />
                      </div>
                      {selectedProvider === 'saml' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            SAML Metadata URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://your-provider.com/metadata"
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setSsoStep(1)}
                        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setSsoStep(3)}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {ssoStep === 3 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Test Connection</h3>
                    <p className="text-gray-400 mb-6">
                      Test your SSO configuration before enabling it for your organization
                    </p>
                    
                    <div className="bg-gray-900/50 border border-gray-600 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-white">Connection Test</h4>
                          <p className="text-sm text-gray-400">
                            {isTestingSSO ? 'Testing connection...' : 'Ready to test'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {ssoTestResult === 'success' && (
                            <div className="flex items-center gap-2 text-green-400">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm">Success</span>
                            </div>
                          )}
                          {ssoTestResult === 'error' && (
                            <div className="flex items-center gap-2 text-red-400">
                              <XCircle className="w-5 h-5" />
                              <span className="text-sm">Failed</span>
                            </div>
                          )}
                          <button
                            onClick={handleSSOTest}
                            disabled={isTestingSSO}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                          >
                            {isTestingSSO ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <ExternalLink className="w-4 h-4" />
                            )}
                            {isTestingSSO ? 'Testing...' : 'Test Connection'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSsoStep(2)}
                        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setSsoStep(4)}
                        disabled={ssoTestResult !== 'success'}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {ssoStep === 4 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Enable SSO</h3>
                    <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-400 mb-1">Important</h4>
                          <p className="text-yellow-200 text-sm">
                            Once enabled, users will be able to sign in using SSO. Make sure your configuration is correct.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                        <div>
                          <h4 className="font-medium text-white">Enforce SSO</h4>
                          <p className="text-sm text-gray-400">Require all users to sign in via SSO</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSsoStep(3)}
                        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleEnableSSO}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Enable SSO
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* SSO Management */
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">SSO Configuration</h2>
                    <p className="text-gray-400">
                      Your SSO is active and configured
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-green-600/20 text-green-400 text-sm rounded-full">
                    Active
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-white mb-3">Provider Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Provider:</span>
                        <span className="text-white capitalize">{organization.settings.sso.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Domain:</span>
                        <span className="text-white">{organization.domain}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Enforced:</span>
                        <span className="text-white">{organization.settings.sso.enforced ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-3">Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                        Test Connection
                      </button>
                      <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
                        Reconfigure
                      </button>
                      <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                        Disable SSO
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security Policy Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Password Policy */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Password Policy</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Minimum Length</h3>
                    <p className="text-sm text-gray-400">Require passwords to be at least this long</p>
                  </div>
                  <select 
                    value={organization.settings.security.passwordPolicy.minLength}
                    onChange={(e) => handleSecuritySettingChange('passwordPolicy', {
                      ...organization.settings.security.passwordPolicy,
                      minLength: parseInt(e.target.value)
                    })}
                    className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white"
                  >
                    <option value={6}>6 characters</option>
                    <option value={8}>8 characters</option>
                    <option value={10}>10 characters</option>
                    <option value={12}>12 characters</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Require Uppercase</h3>
                    <p className="text-sm text-gray-400">Passwords must contain uppercase letters</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={organization.settings.security.passwordPolicy.requireUppercase}
                      onChange={(e) => handleSecuritySettingChange('passwordPolicy', {
                        ...organization.settings.security.passwordPolicy,
                        requireUppercase: e.target.checked
                      })}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Require Numbers</h3>
                    <p className="text-sm text-gray-400">Passwords must contain numbers</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={organization.settings.security.passwordPolicy.requireNumbers}
                      onChange={(e) => handleSecuritySettingChange('passwordPolicy', {
                        ...organization.settings.security.passwordPolicy,
                        requireNumbers: e.target.checked
                      })}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Require Symbols</h3>
                    <p className="text-sm text-gray-400">Passwords must contain special characters</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={organization.settings.security.passwordPolicy.requireSymbols}
                      onChange={(e) => handleSecuritySettingChange('passwordPolicy', {
                        ...organization.settings.security.passwordPolicy,
                        requireSymbols: e.target.checked
                      })}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Session Management */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Session Management</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Session Timeout</h3>
                    <p className="text-sm text-gray-400">Automatically log out inactive users</p>
                  </div>
                  <select 
                    value={organization.settings.security.sessionTimeout}
                    onChange={(e) => handleSecuritySettingChange('sessionTimeout', parseInt(e.target.value))}
                    className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white"
                  >
                    <option value={60}>1 hour</option>
                    <option value={240}>4 hours</option>
                    <option value={480}>8 hours</option>
                    <option value={720}>12 hours</option>
                    <option value={1440}>24 hours</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Require Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-400">All users must enable 2FA</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded">
                        Recommended
                      </span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={organization.settings.security.twoFactorRequired}
                      onChange={(e) => handleSecuritySettingChange('twoFactorRequired', e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Compliance & Trust</h2>
              <p className="text-gray-400 mb-6">
                Synexa is built with enterprise security and compliance in mind
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gray-900/50 rounded-xl">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">GDPR Ready</h3>
                  <p className="text-sm text-gray-400">
                    Full compliance with European data protection regulations
                  </p>
                </div>

                <div className="text-center p-6 bg-gray-900/50 rounded-xl">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">SOC 2 Type II</h3>
                  <p className="text-sm text-gray-400">
                    Coming soon - Independent security audit certification
                  </p>
                </div>

                <div className="text-center p-6 bg-gray-900/50 rounded-xl">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">ISO 27001</h3>
                  <p className="text-sm text-gray-400">
                    Coming soon - International security management standard
                  </p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-600/20 border border-blue-500/30 rounded-xl">
                <h4 className="font-medium text-blue-400 mb-2">Enterprise Security</h4>
                <p className="text-blue-200 text-sm">
                  Synexa follows industry best practices for data security, encryption, and privacy protection. 
                  All data is encrypted in transit and at rest, with regular security audits and monitoring.
                </p>
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








