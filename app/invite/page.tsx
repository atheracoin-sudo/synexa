'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  Share2,
  Users,
  Gift,
  Crown,
  Mail,
  Link,
  MessageCircle,
  Twitter,
  Linkedin,
  Copy,
  Check,
  Plus,
  Calendar,
  Award,
  Sparkles,
  Target
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { referralManager, ReferralData, ReferralInvite, ReferralReward } from '@/lib/referral'
import { usePremium } from '@/lib/hooks/usePremium'
import { cn } from '@/lib/utils'

export default function InvitePage() {
  const router = useRouter()
  const { isPremium, userPlan } = usePremium()
  
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [referralInvites, setReferralInvites] = useState<ReferralInvite[]>([])
  const [availableRewards, setAvailableRewards] = useState<ReferralReward[]>([])
  const [showShareModal, setShowShareModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    // Load referral data
    const userId = 'demo-user' // In real app, get from auth
    const data = referralManager.getReferralData(userId)
    const invites = referralManager.getReferralInvites(userId)
    const rewards = referralManager.getAvailableRewards(userPlan.id as 'free' | 'premium' | 'team')
    
    setReferralData(data)
    setReferralInvites(invites)
    setAvailableRewards(rewards)
  }, [userPlan])

  const handleCopyLink = async () => {
    if (!referralData) return
    
    try {
      await navigator.clipboard.writeText(referralData.referralLink)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleShare = (platform: string) => {
    if (!referralData) return
    
    const message = referralManager.getDefaultShareMessage()
    const platforms = referralManager.getSharePlatforms()
    const selectedPlatform = platforms.find(p => p.id === platform)
    
    if (!selectedPlatform) return
    
    if (platform === 'copy') {
      handleCopyLink()
      return
    }
    
    if (platform === 'email') {
      setShowEmailModal(true)
      return
    }
    
    const shareUrl = selectedPlatform.shareUrl(referralData.referralLink, message)
    window.open(shareUrl, '_blank')
    setShowShareModal(false)
  }

  const progressData = referralData ? referralManager.getProgressToNextReward('demo-user', userPlan.id as 'free' | 'premium' | 'team') : null

  if (!referralData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading referral data...</p>
        </div>
      </div>
    )
  }

  const hasInvites = referralInvites.length > 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Geri
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Invite Friends</h1>
                <p className="text-muted-foreground">Paylaş, ödül kazan</p>
              </div>
            </div>
            {isPremium && (
              <Badge variant="premium" className="text-sm px-3 py-1">
                👑 Premium Boost
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Share2 className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Synexa'yı paylaş, birlikte üret 🚀
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Arkadaşların başlasın, sen ödül kazan.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 text-lg px-8 py-3"
              size="lg"
            >
              <Share2 className="h-5 w-5" />
              Paylaş
            </Button>
            <Button 
              variant="secondary"
              onClick={handleCopyLink}
              className="flex items-center gap-2 text-lg px-8 py-3"
              size="lg"
            >
              {copiedLink ? (
                <>
                  <Check className="h-5 w-5 text-green-500" />
                  Kopyalandı!
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  Link Kopyala
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Total Invites */}
          <Card className="p-6 text-center bg-gradient-to-br from-blue-500/5 to-blue-600/5 border-blue-500/20">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{referralData.totalInvites}</div>
            <div className="text-sm text-muted-foreground">Toplam davet</div>
          </Card>

          {/* Completed Invites */}
          <Card className="p-6 text-center bg-gradient-to-br from-green-500/5 to-green-600/5 border-green-500/20">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{referralData.completedInvites}</div>
            <div className="text-sm text-muted-foreground">Tamamlanan</div>
          </Card>

          {/* Available Rewards */}
          <Card className="p-6 text-center bg-gradient-to-br from-purple-500/5 to-purple-600/5 border-purple-500/20">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Gift className="h-6 w-6 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{referralData.availableRewards}</div>
            <div className="text-sm text-muted-foreground">Ödül günü</div>
          </Card>
        </div>

        {/* Progress to Next Reward */}
        {progressData && progressData.nextReward && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 border-indigo-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">Sonraki ödül</h3>
                  <p className="text-sm text-muted-foreground">{progressData.nextReward.description}</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {progressData.current}/{progressData.target}
              </Badge>
            </div>
            
            <div className="w-full bg-muted rounded-full h-3 mb-3">
              <div 
                className="bg-gradient-primary h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressData.progress}%` }}
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              {progressData.target - progressData.current > 0 
                ? `${progressData.target - progressData.current} davet daha → ${progressData.nextReward.description}`
                : 'Ödül kazandın! 🎉'
              }
            </p>
          </Card>
        )}

        {/* Premium Tease for Free Users */}
        {!isPremium && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-yellow-500/5 via-orange-500/5 to-red-500/5 border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Crown className="h-8 w-8 text-yellow-500" />
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    Premium kullanıcılar daha fazla ödül kazanır 👑
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Premium ile her davet daha değerli ödüller getirir.
                  </p>
                </div>
              </div>
              <Button onClick={() => router.push('/pricing')} className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Premium'a Geç
              </Button>
            </div>
          </Card>
        )}

        {/* Referral Link */}
        <Card className="p-6 mb-8">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Link className="h-5 w-5 text-primary" />
            Referral Link'in
          </h3>
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
            <div className="flex-1 font-mono text-sm text-foreground bg-background px-3 py-2 rounded-lg border">
              {referralData.referralLink}
            </div>
            <Button onClick={handleCopyLink} size="sm" className="flex items-center gap-2">
              {copiedLink ? (
                <>
                  <Check className="h-4 w-4" />
                  Kopyalandı
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Kopyala
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Referral Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Davet Durumu
            </h3>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setShowEmailModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Email ile davet et
            </Button>
          </div>

          {hasInvites ? (
            <div className="space-y-4">
              {referralInvites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{invite.maskedEmail}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(invite.invitedAt).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {invite.rewardUnlocked && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          +{invite.rewardAmount} gün
                        </div>
                        <div className="text-xs text-muted-foreground">Ödül</div>
                      </div>
                    )}
                    <Badge 
                      variant={
                        invite.status === 'completed' ? 'success' : 
                        invite.status === 'joined' ? 'warning' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {invite.status === 'completed' && '🎉 Reward unlocked'}
                      {invite.status === 'joined' && 'Joined'}
                      {invite.status === 'pending' && 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium text-foreground mb-2">Henüz kimseyi davet etmedin</h4>
              <p className="text-sm text-muted-foreground mb-6">
                İlk davetini göndererek ödül kazanmaya başla
              </p>
              <Button onClick={() => setShowEmailModal(true)} className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                İlk davetini gönder
              </Button>
            </div>
          )}
        </Card>

        {/* Trust & Clarity */}
        <div className="text-center mt-8 text-sm text-muted-foreground space-y-2">
          <div className="flex items-center justify-center gap-6">
            <span>• Davet edilen kişiler spam almaz</span>
            <span>• Ödüller otomatik tanımlanır</span>
          </div>
          <button className="text-primary hover:underline">
            Referral terms
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          onShare={handleShare}
          referralLink={referralData.referralLink}
        />
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <EmailInviteModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          referralLink={referralData.referralLink}
        />
      )}
    </div>
  )
}

// Share Modal Component
interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  onShare: (platform: string) => void
  referralLink: string
}

function ShareModal({ isOpen, onClose, onShare, referralLink }: ShareModalProps) {
  const platforms = referralManager.getSharePlatforms()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Share2 className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Paylaşmaya hazır 🎉
          </h3>
          <p className="text-sm text-muted-foreground">
            Arkadaşlarınla Synexa'yı paylaş
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {platforms.map((platform) => {
            const IconComponent = platform.id === 'copy' ? Copy :
                                platform.id === 'whatsapp' ? MessageCircle :
                                platform.id === 'twitter' ? Twitter :
                                platform.id === 'linkedin' ? Linkedin :
                                platform.id === 'email' ? Mail : Link

            return (
              <Button
                key={platform.id}
                variant="outline"
                onClick={() => onShare(platform.id)}
                className="flex flex-col items-center gap-2 h-20 hover:bg-muted/50"
              >
                <IconComponent className={cn("h-5 w-5", platform.color)} />
                <span className="text-xs">{platform.name}</span>
              </Button>
            )
          })}
        </div>

        <Button variant="secondary" onClick={onClose} className="w-full">
          Kapat
        </Button>
      </div>
    </div>
  )
}

// Email Invite Modal Component
interface EmailInviteModalProps {
  isOpen: boolean
  onClose: () => void
  referralLink: string
}

function EmailInviteModal({ isOpen, onClose, referralLink }: EmailInviteModalProps) {
  const [emails, setEmails] = useState('')
  const [message, setMessage] = useState(referralManager.getDefaultShareMessage())
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSend = async () => {
    const emailList = emails.split(',').map(email => email.trim()).filter(email => email)
    if (emailList.length === 0) return

    setIsLoading(true)
    
    try {
      const result = await referralManager.sendEmailInvites('demo-user', emailList, message)
      if (result) {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          onClose()
          setEmails('')
        }, 2000)
      }
    } catch (error) {
      console.error('Failed to send invites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-md shadow-lg text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Davetler gönderildi! 🎉
          </h3>
          <p className="text-sm text-muted-foreground">
            Arkadaşların yakında Synexa ile tanışacak.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Email ile davet et
          </h3>
          <p className="text-sm text-muted-foreground">
            Arkadaşlarına doğrudan davet gönder
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email adresleri (virgülle ayır)
            </label>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="alice@example.com, bob@example.com"
              className="w-full p-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Mesaj
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={isLoading}>
            İptal
          </Button>
          <Button onClick={handleSend} className="flex-1" disabled={isLoading || !emails.trim()}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Gönderiliyor...</span>
              </div>
            ) : (
              'Davet Gönder'
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Spam yok. Sadece bir davet maili.
        </p>
      </div>
    </div>
  )
}





