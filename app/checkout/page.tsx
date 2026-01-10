'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, CreditCard, Shield, Check, Apple, Smartphone, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { pricingManager } from '@/lib/pricing'
import { cn } from '@/lib/utils'

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const planId = searchParams.get('plan') || 'premium'
  const billingCycle = (searchParams.get('billing') as 'monthly' | 'yearly') || 'monthly'
  
  const [plan, setPlan] = useState(pricingManager.getPlan(planId))
  const [currentBilling, setCurrentBilling] = useState(billingCycle)
  const [teamSeats, setTeamSeats] = useState(5)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  // Form state
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    nameOnCard: '',
    teamName: ''
  })

  useEffect(() => {
    const foundPlan = pricingManager.getPlan(planId)
    if (foundPlan) {
      setPlan(foundPlan)
    }
  }, [planId])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value)
    handleInputChange('cardNumber', formatted)
  }

  const handleExpiryChange = (value: string) => {
    const formatted = formatExpiryDate(value)
    handleInputChange('expiryDate', formatted)
  }

  const calculateTotalPrice = () => {
    if (!plan) return 0
    const basePrice = pricingManager.getPrice(plan.id, currentBilling)
    if (plan.id === 'team' as any as any) {
      return basePrice * teamSeats
    }
    return basePrice
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setShowError(false)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate random success/failure for demo
      const success = Math.random() > 0.3 // 70% success rate
      
      if (success) {
        // Update user's premium status
        localStorage.setItem('synexa_user_premium', 'true')
        localStorage.setItem('synexa_user_plan', plan?.id || 'premium')
        localStorage.setItem('synexa_subscription_date', new Date().toISOString())
        
        setShowSuccess(true)
      } else {
        throw new Error('Payment failed')
      }
    } catch (error) {
      setErrorMessage('Kart bilgilerini kontrol edip tekrar deneyebilirsin.')
      setShowError(true)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSuccessContinue = (action: string) => {
    switch (action) {
      case 'chat':
        router.push('/chat')
        break
      case 'code':
        router.push('/studio/code')
        break
      case 'image':
        router.push('/studio/image')
        break
      default:
        router.push('/')
    }
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Plan bulunamadı</h1>
          <Button onClick={() => router.push('/pricing')}>
            Pricing'e dön
          </Button>
        </div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-card border border-border/50 shadow-lg">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {plan.id === 'team' as any as any ? 'Team Plan\'a hoş geldin!' : 'Premium\'a hoş geldin!'}
            </h1>
            <p className="text-muted-foreground text-lg">
              Tüm özellikler artık açık.
            </p>
          </div>

            <div className="space-y-3 mb-8">
              <Button 
                onClick={() => handleSuccessContinue('chat')} 
                className="w-full"
                variant="primary"
              >
                Chat'e devam et
              </Button>
              <Button 
                onClick={() => handleSuccessContinue('code')} 
                className="w-full"
                variant="secondary"
              >
                Uygulama oluşturmaya başla
              </Button>
              <Button 
                onClick={() => handleSuccessContinue('image')} 
                className="w-full"
                variant="secondary"
              >
                Image Studio'yu keşfet
              </Button>
              <Button 
                onClick={() => router.push('/invite')} 
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Share2 className="h-4 w-4" />
                Invite & Earn Rewards
              </Button>
            </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Badge variant="premium" className="text-xs">
              👑 Premium Active
            </Badge>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri dön
          </Button>
          <h1 className="text-xl font-bold text-foreground">Checkout</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Plan Summary */}
          <div className="space-y-6">
            <Card className="p-6 bg-card border border-border/50 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    {plan.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-primary">
                      ${calculateTotalPrice()}
                    </span>
                    <span className="text-muted-foreground">
                      /{currentBilling === 'yearly' ? 'year' : 'month'}
                    </span>
                    {currentBilling === 'yearly' && (
                      <Badge variant="success" className="text-xs">
                        17% OFF
                      </Badge>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/pricing')}
                >
                  Change plan
                </Button>
              </div>

              {/* Team seats selector */}
              {plan.id === 'team' as any && (
                <div className="mb-6 p-4 bg-muted/30 rounded-xl">
                  <Label className="text-sm font-medium text-foreground mb-3 block">
                    Team size
                  </Label>
                  <div className="space-y-3">
                    <Slider
                      value={[teamSeats]}
                      onValueChange={(value) => setTeamSeats(value[0])}
                      max={50}
                      min={2}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>2 users</span>
                      <span className="font-medium text-foreground">
                        {teamSeats} users
                      </span>
                      <span>50 users</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Included features:</h3>
                <div className="space-y-2">
                  {plan.features.slice(0, 5).map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust elements */}
              <div className="mt-6 pt-4 border-t border-border/50 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span>30-day money back guarantee</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel - Payment Form */}
          <div className="space-y-6">
            <Card className="p-6 bg-card border border-border/50 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-6">Payment details</h2>

              {/* Quick payment options */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button variant="outline" className="h-12 flex items-center justify-center gap-2">
                  <Apple className="h-5 w-5" />
                  <span>Pay</span>
                </Button>
                <Button variant="outline" className="h-12 flex items-center justify-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  <span>Google Pay</span>
                </Button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-2 text-muted-foreground">or pay with card</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Team name for team plans */}
                {plan.id === 'team' as any && (
                  <div>
                    <Label htmlFor="teamName" className="text-sm font-medium text-foreground">
                      Team name
                    </Label>
                    <Input
                      id="teamName"
                      type="text"
                      placeholder="Your team name"
                      value={formData.teamName}
                      onChange={(e) => handleInputChange('teamName', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                )}

                {/* Card number */}
                <div>
                  <Label htmlFor="cardNumber" className="text-sm font-medium text-foreground">
                    Card number
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      maxLength={19}
                      required
                      className="pl-10"
                    />
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Expiry and CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate" className="text-sm font-medium text-foreground">
                      Expiry date
                    </Label>
                    <Input
                      id="expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      maxLength={5}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc" className="text-sm font-medium text-foreground">
                      CVC
                    </Label>
                    <Input
                      id="cvc"
                      type="text"
                      placeholder="123"
                      value={formData.cvc}
                      onChange={(e) => handleInputChange('cvc', e.target.value.replace(/\D/g, ''))}
                      maxLength={4}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Name on card */}
                <div>
                  <Label htmlFor="nameOnCard" className="text-sm font-medium text-foreground">
                    Name on card
                  </Label>
                  <Input
                    id="nameOnCard"
                    type="text"
                    placeholder="John Doe"
                    value={formData.nameOnCard}
                    onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                {/* Error message */}
                {showError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-sm font-medium text-red-600">Ödeme tamamlanamadı</span>
                    </div>
                    <p className="text-sm text-red-600/80 mt-1">{errorMessage}</p>
                  </div>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>İşlemin gerçekleştiriliyor...</span>
                    </div>
                  ) : (
                    `Ödemeyi Tamamla - $${calculateTotalPrice()}`
                  )}
                </Button>

                {/* Security notice */}
                <div className="mt-6 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>Secure payment</span>
                    </div>
                    <span>•</span>
                    <span>We do not store your card details</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-2">
                    <div className="px-2 py-1 bg-muted/50 rounded text-xs font-mono">
                      STRIPE
                    </div>
                    <div className="px-2 py-1 bg-muted/50 rounded text-xs font-mono">
                      SSL
                    </div>
                  </div>
                </div>
              </form>
            </Card>

            {/* Legal links */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <button className="hover:text-foreground transition-colors">Privacy</button>
                <span>•</span>
                <button className="hover:text-foreground transition-colors">Terms</button>
                <span>•</span>
                <button className="hover:text-foreground transition-colors">Refund policy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
