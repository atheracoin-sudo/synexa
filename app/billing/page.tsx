'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CreditCard, 
  Download, 
  Calendar, 
  Crown, 
  AlertTriangle,
  Check,
  X,
  ExternalLink,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// Modal components will be inline for now
import { pricingManager } from '@/lib/pricing'

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  planName: string
  downloadUrl?: string
}

export default function BillingPage() {
  const router = useRouter()
  const [userPlan, setUserPlan] = useState<string>('free')
  const [isPremium, setIsPremium] = useState(false)
  const [subscriptionDate, setSubscriptionDate] = useState<string>('')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock invoices data
  const [invoices] = useState<Invoice[]>([
    {
      id: 'inv_001',
      date: '2024-01-15',
      amount: 29,
      status: 'paid',
      planName: 'Premium Monthly',
      downloadUrl: '#'
    },
    {
      id: 'inv_002',
      date: '2023-12-15',
      amount: 29,
      status: 'paid',
      planName: 'Premium Monthly',
      downloadUrl: '#'
    },
    {
      id: 'inv_003',
      date: '2023-11-15',
      amount: 29,
      status: 'paid',
      planName: 'Premium Monthly',
      downloadUrl: '#'
    }
  ])

  useEffect(() => {
    // Load user subscription data
    const premium = localStorage.getItem('synexa_user_premium') === 'true'
    const plan = localStorage.getItem('synexa_user_plan') || 'free'
    const subDate = localStorage.getItem('synexa_subscription_date')
    
    setIsPremium(premium)
    setUserPlan(plan)
    setSubscriptionDate(subDate || '')
  }, [])

  const currentPlan = pricingManager.getPlan(userPlan)
  const nextRenewalDate = subscriptionDate 
    ? new Date(new Date(subscriptionDate).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR')
    : ''

  const handleCancelSubscription = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update local storage
      localStorage.setItem('synexa_user_premium', 'false')
      localStorage.setItem('synexa_user_plan', 'free')
      localStorage.removeItem('synexa_subscription_date')
      
      // Update state
      setIsPremium(false)
      setUserPlan('free')
      setSubscriptionDate('')
      setShowCancelModal(false)
      
      // Show success message (you could add a toast here)
      alert('Aboneliğin iptal edildi. Plan dönem sonunda sona erecek.')
    } catch (error) {
      alert('İptal işlemi başarısız oldu. Lütfen tekrar dene.')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success" className="text-xs">Paid</Badge>
      case 'pending':
        return <Badge variant="warning" className="text-xs">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive" className="text-xs">Failed</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Billing & Subscription</h1>
              <p className="text-muted-foreground mt-1">Manage your subscription and billing information</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/profile')}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Current Plan */}
        <Card className="p-6 bg-card border border-border/50 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              {isPremium ? (
                <Crown className="h-8 w-8 text-yellow-500" />
              ) : (
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-muted-foreground">F</span>
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {currentPlan?.name || 'Free Plan'}
                </h2>
                <p className="text-muted-foreground">
                  {isPremium ? 'Active subscription' : 'Free tier'}
                </p>
              </div>
            </div>
            {isPremium && (
              <Badge variant="premium" className="text-sm px-3 py-1">
                👑 Premium
              </Badge>
            )}
          </div>

          {isPremium && (
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Next renewal</p>
                  <p className="text-sm text-muted-foreground">{nextRenewalDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Payment method</p>
                  <p className="text-sm text-muted-foreground">•••• •••• •••• 1234</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {!isPremium ? (
              <Button 
                onClick={() => router.push('/pricing')}
                className="flex items-center gap-2"
              >
                <Crown className="h-4 w-4" />
                Upgrade to Premium
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/pricing')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Change Plan
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Update Payment Method
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel Subscription
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Invoices */}
        {isPremium && (
          <Card className="p-6 bg-card border border-border/50 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6">Invoice History</h2>
            
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div 
                  key={invoice.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Download className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{invoice.planName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.date).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${invoice.amount}</p>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Usage Summary */}
        <Card className="p-6 bg-card border border-border/50 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6">Current Usage</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/30 rounded-xl">
              <div className="text-2xl font-bold text-primary mb-1">47</div>
              <p className="text-sm text-muted-foreground">Chat messages</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isPremium ? 'Unlimited' : '50 limit'}
              </p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-xl">
              <div className="text-2xl font-bold text-primary mb-1">3</div>
              <p className="text-sm text-muted-foreground">Code projects</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isPremium ? 'Unlimited' : '5 limit'}
              </p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-xl">
              <div className="text-2xl font-bold text-primary mb-1">12</div>
              <p className="text-sm text-muted-foreground">Image exports</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isPremium ? 'HD quality' : 'Standard quality'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full p-6 bg-card border border-border/50 shadow-lg rounded-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Aboneliği iptal et
              </h2>
              <p className="text-muted-foreground mt-2">
                Aboneliğin dönem sonunda (31 Ocak) sona erecek. O zamana kadar tüm premium özelliklerini kullanabilirsin.
              </p>
            </div>

            <div className="py-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                İptal sebebin (opsiyonel)
              </label>
              <select 
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Sebep seç...</option>
                <option value="too_expensive">Çok pahalı</option>
                <option value="not_using">Yeterince kullanmıyorum</option>
                <option value="missing_features">İhtiyacım olan özellikler yok</option>
                <option value="found_alternative">Başka bir alternatif buldum</option>
                <option value="other">Diğer</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                onClick={() => setShowCancelModal(false)}
                className="flex-1"
                disabled={isProcessing}
              >
                Vazgeç
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancelSubscription}
                className="flex-1"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>İptal ediliyor...</span>
                  </div>
                ) : (
                  'İptal Et'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
