'use client'

import { useState } from 'react'
import { CheckIcon, LockClosedIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePremium } from '@/lib/context/PremiumContext'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetBody, 
  SheetTitle, 
  SheetClose 
} from '@/components/ui/sheet'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started',
    features: [
      '20 chat messages per month',
      '1 app project',
      '5 AI-generated images',
      '1 AI agent',
      'Basic templates',
      'Community support'
    ],
    limitations: [
      'No code export',
      'No ZIP downloads',
      'Limited studio features'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For serious developers',
    features: [
      '1,000 chat messages per month',
      '10 app projects',
      '100 AI-generated images',
      '5 AI agents',
      'All templates',
      'Code export & download',
      'Advanced studio features',
      'Priority support'
    ],
    popular: true
  },
  {
    id: 'team',
    name: 'Team',
    price: '$49',
    period: '/month',
    description: 'For teams and organizations',
    features: [
      'Unlimited chat messages',
      'Unlimited app projects',
      '500 AI-generated images',
      '20 AI agents',
      'Team collaboration',
      'Advanced analytics',
      'Custom templates',
      'Dedicated support'
    ]
  }
]

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPlan: typeof plans[0] | null
  onSuccess: () => void
}

function CheckoutModal({ isOpen, onClose, selectedPlan, onSuccess }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    country: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Mock payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    onSuccess()
    onClose()
  }

  if (!selectedPlan) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" size="md">
        <SheetHeader>
          <SheetTitle>Complete Your Purchase</SheetTitle>
          <SheetClose onClick={onClose} />
        </SheetHeader>

        <SheetBody>
          {/* Plan Summary */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-foreground">{selectedPlan.name} Plan</h3>
            <p className="text-2xl font-bold text-foreground">
              {selectedPlan.price}<span className="text-sm font-normal text-muted-foreground">{selectedPlan.period}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">{selectedPlan.description}</p>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Card Number
              </label>
              <input
                type="text"
                required
                value={formData.cardNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="1234 5678 9012 3456"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Expiry
                </label>
                <input
                  type="text"
                  required
                  value={formData.expiry}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiry: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  CVC
                </label>
                <input
                  type="text"
                  required
                  value={formData.cvc}
                  onChange={(e) => setFormData(prev => ({ ...prev, cvc: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="123"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Country
              </label>
              <select
                required
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="TR">Turkey</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <>
                  <CreditCardIcon className="w-4 h-4 mr-2" />
                  Complete Purchase
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            Your payment is secure and encrypted. You can cancel anytime.
          </p>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}

export default function BillingPage() {
  const { plan, setPlan, usage } = usePremium()
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null)

  const handleUpgrade = (planId: string) => {
    const planData = plans.find(p => p.id === planId)
    if (planData && planId !== 'free') {
      setSelectedPlan(planData)
      setShowCheckout(true)
    }
  }

  const handleCheckoutSuccess = () => {
    if (selectedPlan) {
      setPlan(selectedPlan.id as any)
      // Show success toast - you could implement a toast system
      alert(`${selectedPlan.name} plan aktif edildi!`)
    }
  }

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0 // unlimited
    return Math.min((used / limit) * 100, 100)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock the full potential of Synexa with our premium plans. 
            Start building amazing apps with AI assistance.
          </p>
        </div>

        {/* Usage Section */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Usage This Month</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(usage).map(([key, data]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {data.used} / {data.limit === -1 ? '∞' : data.limit}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      getUsagePercentage(data.used, data.limit) > 80
                        ? "bg-destructive"
                        : getUsagePercentage(data.used, data.limit) > 60
                        ? "bg-yellow-500"
                        : "bg-primary"
                    )}
                    style={{ width: `${getUsagePercentage(data.used, data.limit)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((planData) => (
            <div
              key={planData.id}
              className={cn(
                "relative bg-card border rounded-2xl p-6 shadow-sm transition-all duration-200",
                planData.popular 
                  ? "border-primary shadow-lg scale-105" 
                  : "border-border hover:border-primary/50",
                plan === planData.id && "ring-2 ring-primary/20"
              )}
            >
              {planData.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground">{planData.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-foreground">{planData.price}</span>
                  <span className="text-muted-foreground">{planData.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">{planData.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {planData.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
                {planData.limitations?.map((limitation, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <LockClosedIcon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{limitation}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade(planData.id)}
                className={cn(
                  "w-full",
                  plan === planData.id
                    ? "bg-muted text-muted-foreground cursor-default"
                    : planData.popular
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-secondary hover:bg-secondary/80"
                )}
                disabled={plan === planData.id}
              >
                {plan === planData.id ? 'Current Plan' : planData.id === 'free' ? 'Downgrade' : 'Upgrade'}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Need help choosing? <a href="#" className="text-primary hover:underline">Contact our team</a> or 
            <a href="#" className="text-primary hover:underline ml-1">view detailed comparison</a>
          </p>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        selectedPlan={selectedPlan}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  )
}