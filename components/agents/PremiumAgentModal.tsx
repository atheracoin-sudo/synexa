'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Crown, Sparkles, CheckCircle, ArrowRight, Zap } from 'lucide-react'
import { WorkflowAgent } from '@/lib/agents'

interface PremiumAgentModalProps {
  isOpen: boolean
  onClose: () => void
  agent: WorkflowAgent | null
}

export function PremiumAgentModal({ isOpen, onClose, agent }: PremiumAgentModalProps) {
  const router = useRouter()
  const [isUpgrading, setIsUpgrading] = useState(false)

  const handleUpgrade = async () => {
    setIsUpgrading(true)
    
    // Simulate upgrade process
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Navigate to pricing page
    router.push('/pricing?plan=premium&feature=agents')
    setIsUpgrading(false)
    onClose()
  }

  const premiumFeatures = [
    'Access to all premium workflow agents',
    'Multi-step complex workflows',
    'Advanced agent customization',
    'Priority execution queue',
    'Export and share agent results',
    'Custom agent creation (unlimited)',
    'Team collaboration features',
    'Advanced analytics and insights'
  ]

  if (!isOpen || !agent) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-yellow-600 to-orange-600 p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                {agent.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-yellow-200" />
                  <span className="text-yellow-200 font-medium text-sm">Premium Agent</span>
                </div>
                <h2 className="text-xl font-bold text-white">{agent.name}</h2>
                <p className="text-white/80 text-sm">{agent.description}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Upgrade to Premium</h3>
              <p className="text-muted-foreground">
                This advanced workflow agent requires a Premium subscription to access its full capabilities.
              </p>
            </div>

            {/* Premium Features */}
            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-foreground mb-3">Premium includes:</h4>
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* Agent Preview */}
            <div className="bg-muted/50 border border-border rounded-xl p-4 mb-6">
              <h4 className="font-medium text-foreground mb-3">What you'll get with {agent.name}:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span>{agent.steps.length} automated workflow steps</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Complete deliverables in ~{agent.estimatedTime} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span>Advanced {agent.category} capabilities</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-xl p-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">
                  $19<span className="text-lg text-muted-foreground">/month</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">Premium Plan</div>
                <div className="text-xs text-blue-400">
                  7-day free trial • Cancel anytime
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all"
              >
                {isUpgrading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Upgrading...
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4" />
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              
              <button
                onClick={onClose}
                className="w-full px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                Maybe Later
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>No commitment</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>Secure payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}











