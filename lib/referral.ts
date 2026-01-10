export interface ReferralData {
  userId: string
  referralCode: string
  referralLink: string
  totalInvites: number
  completedInvites: number
  pendingInvites: number
  totalRewards: number
  availableRewards: number
}

export interface ReferralInvite {
  id: string
  email: string
  maskedEmail: string
  invitedAt: string
  status: 'pending' | 'joined' | 'completed'
  rewardUnlocked: boolean
  rewardAmount: number
  rewardType: 'credits' | 'premium_days' | 'team_seats'
}

export interface ReferralReward {
  id: string
  type: 'credits' | 'premium_days' | 'team_seats'
  amount: number
  description: string
  requirement: string
  isActive: boolean
}

export interface SharePlatform {
  id: string
  name: string
  icon: string
  shareUrl: (referralLink: string, message: string) => string
  color: string
}

export class ReferralManager {
  private static instance: ReferralManager

  static getInstance(): ReferralManager {
    if (!ReferralManager.instance) {
      ReferralManager.instance = new ReferralManager()
    }
    return ReferralManager.instance
  }

  // Generate unique referral code for user
  generateReferralCode(userId: string): string {
    const stored = localStorage.getItem(`synexa_referral_code_${userId}`)
    if (stored) {
      return stored
    }

    // Generate 8-character code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    localStorage.setItem(`synexa_referral_code_${userId}`, code)
    return code
  }

  // Get user's referral data
  getReferralData(userId: string): ReferralData {
    const stored = localStorage.getItem(`synexa_referral_data_${userId}`)
    if (stored) {
      return JSON.parse(stored)
    }

    const referralCode = this.generateReferralCode(userId)
    const referralLink = `https://synexa.ai/join?ref=${referralCode}`

    const defaultData: ReferralData = {
      userId,
      referralCode,
      referralLink,
      totalInvites: 0,
      completedInvites: 0,
      pendingInvites: 0,
      totalRewards: 0,
      availableRewards: 0
    }

    this.saveReferralData(defaultData)
    return defaultData
  }

  // Save referral data
  saveReferralData(data: ReferralData): void {
    localStorage.setItem(`synexa_referral_data_${data.userId}`, JSON.stringify(data))
  }

  // Get user's referral invites
  getReferralInvites(userId: string): ReferralInvite[] {
    const stored = localStorage.getItem(`synexa_referral_invites_${userId}`)
    if (stored) {
      return JSON.parse(stored)
    }

    // Mock data for demonstration
    const mockInvites: ReferralInvite[] = [
      {
        id: '1',
        email: 'alice@example.com',
        maskedEmail: 'a***e@example.com',
        invitedAt: '2024-01-15T10:00:00Z',
        status: 'completed',
        rewardUnlocked: true,
        rewardAmount: 3,
        rewardType: 'premium_days'
      },
      {
        id: '2',
        email: 'bob@example.com',
        maskedEmail: 'b**@example.com',
        invitedAt: '2024-01-14T15:30:00Z',
        status: 'joined',
        rewardUnlocked: false,
        rewardAmount: 0,
        rewardType: 'premium_days'
      },
      {
        id: '3',
        email: 'carol@example.com',
        maskedEmail: 'c****@example.com',
        invitedAt: '2024-01-13T09:15:00Z',
        status: 'pending',
        rewardUnlocked: false,
        rewardAmount: 0,
        rewardType: 'premium_days'
      }
    ]

    this.saveReferralInvites(userId, mockInvites)
    return mockInvites
  }

  // Save referral invites
  saveReferralInvites(userId: string, invites: ReferralInvite[]): void {
    localStorage.setItem(`synexa_referral_invites_${userId}`, JSON.stringify(invites))
  }

  // Get available rewards based on user plan
  getAvailableRewards(userPlan: 'free' | 'premium' | 'team'): ReferralReward[] {
    const baseRewards: ReferralReward[] = [
      {
        id: 'chat_credits',
        type: 'credits',
        amount: 50,
        description: '+50 chat mesajı',
        requirement: '1 arkadaş katıldı',
        isActive: true
      },
      {
        id: 'premium_trial',
        type: 'premium_days',
        amount: 3,
        description: '+3 gün Premium',
        requirement: '1 arkadaş ilk işini yaptı',
        isActive: true
      }
    ]

    const premiumRewards: ReferralReward[] = [
      {
        id: 'premium_extension',
        type: 'premium_days',
        amount: 7,
        description: '+7 gün Premium',
        requirement: '1 arkadaş Premium oldu',
        isActive: true
      }
    ]

    const teamRewards: ReferralReward[] = [
      {
        id: 'team_seat',
        type: 'team_seats',
        amount: 1,
        description: '+1 team seat',
        requirement: '1 arkadaş Team plan aldı',
        isActive: true
      }
    ]

    switch (userPlan) {
      case 'premium':
        return [...baseRewards, ...premiumRewards]
      case 'team':
        return [...baseRewards, ...premiumRewards, ...teamRewards]
      default:
        return baseRewards
    }
  }

  // Get share platforms
  getSharePlatforms(): SharePlatform[] {
    return [
      {
        id: 'copy',
        name: 'Copy Link',
        icon: 'Link',
        shareUrl: (link) => link,
        color: 'text-gray-600'
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: 'MessageCircle',
        shareUrl: (link, message) => `https://wa.me/?text=${encodeURIComponent(message + ' ' + link)}`,
        color: 'text-green-600'
      },
      {
        id: 'twitter',
        name: 'Twitter',
        icon: 'Twitter',
        shareUrl: (link, message) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(link)}`,
        color: 'text-blue-500'
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: 'Linkedin',
        shareUrl: (link, message) => `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
        color: 'text-blue-700'
      },
      {
        id: 'email',
        name: 'Email',
        icon: 'Mail',
        shareUrl: (link, message) => `mailto:?subject=${encodeURIComponent('Synexa AI ile tanış')}&body=${encodeURIComponent(message + '\n\n' + link)}`,
        color: 'text-purple-600'
      }
    ]
  }

  // Send email invites
  async sendEmailInvites(userId: string, emails: string[], message: string): Promise<boolean> {
    try {
      const referralData = this.getReferralData(userId)
      const currentInvites = this.getReferralInvites(userId)
      
      // Create new invites
      const newInvites: ReferralInvite[] = emails.map((email, index) => ({
        id: `invite_${Date.now()}_${index}`,
        email,
        maskedEmail: this.maskEmail(email),
        invitedAt: new Date().toISOString(),
        status: 'pending',
        rewardUnlocked: false,
        rewardAmount: 0,
        rewardType: 'premium_days'
      }))

      // Update invites
      const updatedInvites = [...currentInvites, ...newInvites]
      this.saveReferralInvites(userId, updatedInvites)

      // Update referral data
      referralData.totalInvites += emails.length
      referralData.pendingInvites += emails.length
      this.saveReferralData(referralData)

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      return true
    } catch (error) {
      console.error('Failed to send email invites:', error)
      return false
    }
  }

  // Mask email for privacy
  private maskEmail(email: string): string {
    const [username, domain] = email.split('@')
    if (username.length <= 2) {
      return `${username[0]}*@${domain}`
    }
    const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
    return `${maskedUsername}@${domain}`
  }

  // Calculate progress to next reward
  getProgressToNextReward(userId: string, userPlan: 'free' | 'premium' | 'team'): {
    current: number
    target: number
    nextReward: ReferralReward | null
    progress: number
  } {
    const referralData = this.getReferralData(userId)
    const rewards = this.getAvailableRewards(userPlan)
    
    // Find next achievable reward
    const nextReward = rewards.find(reward => {
      const requiredInvites = this.getRequiredInvitesForReward(reward)
      return referralData.completedInvites < requiredInvites
    })

    if (!nextReward) {
      return {
        current: referralData.completedInvites,
        target: referralData.completedInvites,
        nextReward: null,
        progress: 100
      }
    }

    const target = this.getRequiredInvitesForReward(nextReward)
    const progress = Math.min((referralData.completedInvites / target) * 100, 100)

    return {
      current: referralData.completedInvites,
      target,
      nextReward,
      progress
    }
  }

  // Get required invites for a reward
  private getRequiredInvitesForReward(reward: ReferralReward): number {
    // Simple mapping - in real app this would be more sophisticated
    switch (reward.id) {
      case 'chat_credits':
        return 1
      case 'premium_trial':
        return 1
      case 'premium_extension':
        return 2
      case 'team_seat':
        return 3
      default:
        return 1
    }
  }

  // Get default share message
  getDefaultShareMessage(): string {
    return "Synexa AI ile harika projeler oluşturuyorum! Sen de dene 🚀"
  }

  // Update invite status (would be called by backend webhook)
  updateInviteStatus(userId: string, inviteId: string, status: 'joined' | 'completed'): void {
    const invites = this.getReferralInvites(userId)
    const referralData = this.getReferralData(userId)
    
    const inviteIndex = invites.findIndex(invite => invite.id === inviteId)
    if (inviteIndex === -1) return

    const invite = invites[inviteIndex]
    const oldStatus = invite.status

    // Update invite status
    invite.status = status
    
    // Update referral data counters
    if (oldStatus === 'pending' && status === 'joined') {
      referralData.pendingInvites--
    }
    
    if (status === 'completed') {
      invite.rewardUnlocked = true
      invite.rewardAmount = 3 // Example reward
      referralData.completedInvites++
      referralData.totalRewards += invite.rewardAmount
      referralData.availableRewards += invite.rewardAmount
      
      if (oldStatus === 'pending') {
        referralData.pendingInvites--
      }
    }

    // Save updates
    this.saveReferralInvites(userId, invites)
    this.saveReferralData(referralData)
  }
}

// Export singleton instance
export const referralManager = ReferralManager.getInstance()






