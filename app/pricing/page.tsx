'use client'

import { useState } from 'react'
import { 
  Crown, 
  Check, 
  Sparkles, 
  ArrowRight,
  MessageSquare,
  Code2,
  Palette,
  Bot,
  Zap,
  Shield
} from 'lucide-react'
import { GlobalHeader } from '@/components/ui/GlobalHeader'
import { BottomTabBar } from '@/components/ui/BottomTabBar'
import { PremiumBadge } from '@/components/premium/FeatureLock'
import { cn } from '@/lib/utils'
import { PLANS, PLAN_FEATURES, PricingAPI } from '@/lib/api/pricing'
import { useApp } from '@/lib/context/AppContext'

export default function PricingPage() {
  const { state, actions } = useApp()
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [upgradeSuccess, setUpgradeSuccess] = useState(false)
  
  const userPlan = state.user?.plan || 'free'
  const isPremium = userPlan === 'premium'

  const handleUpgrade = async () => {
    if (isPremium) return
    
    setIsUpgrading(true)
    try {
      const result = await PricingAPI.upgradeToPremium(state.user?.id || 'user_1')
      if (result.success) {
        // Update user plan
        actions.updateUser({ plan: 'premium' })
        setUpgradeSuccess(true)
        
        // Show success for 2 seconds then redirect
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      }
    } catch (error) {
      console.error('Upgrade failed:', error)
    } finally {
      setIsUpgrading(false)
    }
  }

  if (upgradeSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Welcome to Premium!</h2>
          <p className="text-muted-foreground">You now have access to all premium features.</p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader title="Pricing" />
      
      <div className="max-w-4xl mx-auto p-6 pb-24">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you need more power
          </p>
        </div>

        {/* Plans Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'relative bg-card border rounded-2xl p-8 transition-all',
                plan.popular 
                  ? 'border-primary shadow-premium scale-105' 
                  : 'border-border hover:border-primary/50'
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <PremiumBadge />
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {plan.id === 'premium' && <Crown className="w-6 h-6 text-yellow-500" />}
                  <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                </div>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.id === 'premium' && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
                
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={plan.id === 'premium' ? handleUpgrade : undefined}
                disabled={isUpgrading || (plan.id === 'free' && userPlan === 'free') || (plan.id === 'premium' && isPremium)}
                className={cn(
                  'w-full py-3 rounded-xl font-medium transition-all',
                  plan.id === 'premium'
                    ? isPremium
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-gradient-primary text-white hover:opacity-90'
                    : userPlan === 'free'
                      ? 'bg-muted text-muted-foreground cursor-default'
                      : 'border border-border text-foreground hover:bg-muted'
                )}
              >
                {isUpgrading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Upgrading...</span>
                  </div>
                ) : plan.id === 'premium' ? (
                  isPremium ? 'Current Plan' : 'Upgrade to Premium'
                ) : (
                  userPlan === 'free' ? 'Current Plan' : 'Downgrade'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Feature Comparison
          </h2>
          
          <div className="space-y-6">
            {PLAN_FEATURES.map((feature) => (
              <div key={feature.id} className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h4 className="font-medium text-foreground">{feature.name}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  {/* Free */}
                  <div className="text-center min-w-[120px]">
                    <div className="text-sm text-muted-foreground mb-1">Free</div>
                    <div className="text-sm font-medium">
                      {typeof feature.free === 'boolean' 
                        ? (feature.free ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : '—')
                        : feature.free
                      }
                    </div>
                  </div>
                  
                  {/* Premium */}
                  <div className="text-center min-w-[120px]">
                    <div className="text-sm text-muted-foreground mb-1">Premium</div>
                    <div className="text-sm font-medium text-primary">
                      {typeof feature.premium === 'boolean' 
                        ? (feature.premium ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : '—')
                        : feature.premium
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="font-semibold text-foreground mb-2">
                Can I cancel anytime?
              </h4>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your Premium subscription at any time. You'll keep access until the end of your billing period.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="font-semibold text-foreground mb-2">
                What happens to my projects?
              </h4>
              <p className="text-sm text-muted-foreground">
                All your projects remain yours forever. If you downgrade, you'll just have limited access to premium features.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="font-semibold text-foreground mb-2">
                Is there a free trial?
              </h4>
              <p className="text-sm text-muted-foreground">
                The free plan is your trial! You can use Synexa for free and upgrade when you need more features.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="font-semibold text-foreground mb-2">
                Need help choosing?
              </h4>
              <p className="text-sm text-muted-foreground">
                Start with Free and upgrade when you hit limits. Most users upgrade after creating their first few projects.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        {!isPremium && (
          <div className="mt-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-bold text-foreground">Ready to unlock everything?</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Join thousands of creators who've upgraded to Premium
            </p>
            <button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-primary text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              {isUpgrading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Upgrading...</span>
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  <span>Upgrade to Premium</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <BottomTabBar />
    </div>
  )
}