import { PricingPlan, BillingPeriod } from './types'

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    badge: 'Free',
    price: {
      monthly: 0,
      yearly: 0
    },
    features: [
      { name: 'Chat Messages', included: '20/day', tooltip: 'Daily limit resets at midnight' },
      { name: 'App Builder', included: 'Basic', tooltip: 'Limited templates and features' },
      { name: 'Image Studio', included: 'Basic Export', tooltip: 'Low resolution exports only' },
      { name: 'AI Agents', included: '1 Agent', tooltip: 'Choose from built-in agents' },
      { name: 'Version History', included: false, tooltip: 'Premium feature' },
      { name: 'Brand Kit', included: false, tooltip: 'Premium feature' },
      { name: 'Team Workspace', included: false, tooltip: 'Team plan feature' },
      { name: 'Priority Support', included: false, tooltip: 'Team plan feature' }
    ],
    cta: 'Ücretsiz Başla',
    disabled: false
  },
  {
    id: 'premium',
    name: 'Premium',
    badge: 'Most Popular',
    price: {
      monthly: 19,
      yearly: 190 // ~17$/month with yearly discount
    },
    features: [
      { name: 'Chat Messages', included: 'Unlimited', tooltip: 'No daily limits' },
      { name: 'App Builder', included: 'Full Access', tooltip: 'All templates and features' },
      { name: 'Image Studio', included: 'HD Export', tooltip: 'High resolution exports' },
      { name: 'AI Agents', included: 'Unlimited', tooltip: 'All built-in + custom agents' },
      { name: 'Version History', included: true, tooltip: 'Track all project changes' },
      { name: 'Brand Kit', included: true, tooltip: 'Custom colors, fonts, logos' },
      { name: 'Multi-device Preview', included: true, tooltip: 'Test on different screen sizes' },
      { name: 'Priority Support', included: false, tooltip: 'Team plan feature' }
    ],
    cta: "Premium'a Geç",
    highlight: true
  },
  {
    id: 'team',
    name: 'Team',
    badge: 'For Teams',
    price: {
      monthly: 49,
      yearly: 490 // ~41$/month with yearly discount
    },
    features: [
      { name: 'Everything in Premium', included: true, tooltip: 'All Premium features included' },
      { name: 'Team Workspace', included: 'Unlimited', tooltip: 'Create multiple workspaces' },
      { name: 'Shared Memory', included: true, tooltip: 'Team-wide AI memory and context' },
      { name: 'Role Management', included: true, tooltip: 'Admin, Editor, Viewer roles' },
      { name: 'Team Projects', included: 'Unlimited', tooltip: 'Collaborative projects' },
      { name: 'Priority Support', included: true, tooltip: '24/7 priority support' },
      { name: 'Advanced Analytics', included: true, tooltip: 'Team usage and insights' },
      { name: 'Custom Integrations', included: true, tooltip: 'API access and webhooks' }
    ],
    cta: "Team Plan'ı İncele"
  }
]

export const BILLING_PERIODS: BillingPeriod[] = [
  {
    type: 'monthly'
  },
  {
    type: 'yearly',
    discount: 17 // 17% discount for yearly billing
  }
]

export class PricingManager {
  private static instance: PricingManager

  static getInstance(): PricingManager {
    if (!PricingManager.instance) {
      PricingManager.instance = new PricingManager()
    }
    return PricingManager.instance
  }

  getPlan(planId: string): PricingPlan | null {
    return PRICING_PLANS.find(plan => plan.id === planId) || null
  }

  getAllPlans(): PricingPlan[] {
    return PRICING_PLANS
  }

  getPrice(planId: string, billingPeriod: 'monthly' | 'yearly'): number {
    const plan = this.getPlan(planId)
    return plan ? plan.price[billingPeriod] : 0
  }

  getYearlyDiscount(): number {
    const yearlyPeriod = BILLING_PERIODS.find(period => period.type === 'yearly')
    return yearlyPeriod?.discount || 0
  }

  formatPrice(price: number, currency: string = 'USD'): string {
    if (price === 0) return 'Free'
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
    
    return formatter.format(price)
  }

  getPlanFeatures(planId: string): string[] {
    const plan = this.getPlan(planId)
    if (!plan) return []
    
    return plan.features
      .filter(feature => feature.included !== false)
      .map(feature => {
        if (typeof feature.included === 'string') {
          return `${feature.name}: ${feature.included}`
        }
        return feature.name
      })
  }

  comparePlans(): { feature: string, free: boolean | string, premium: boolean | string, team: boolean | string }[] {
    const allFeatures = new Set<string>()
    
    // Collect all unique features
    PRICING_PLANS.forEach(plan => {
      plan.features.forEach(feature => {
        allFeatures.add(feature.name)
      })
    })

    return Array.from(allFeatures).map(featureName => {
      const comparison: any = { feature: featureName }
      
      PRICING_PLANS.forEach(plan => {
        const feature = plan.features.find(f => f.name === featureName)
        comparison[plan.id] = feature ? feature.included : false
      })
      
      return comparison
    })
  }
}

// Export singleton instance
export const pricingManager = PricingManager.getInstance()





