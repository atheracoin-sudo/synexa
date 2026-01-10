'use client'

import { useState, useEffect } from 'react'
import { X, Copy, Check, ExternalLink, Mail, MessageCircle } from 'lucide-react'
import { portfolioManager, ShareData } from '@/lib/portfolio'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'profile' | 'project'
  id: string
}

export function ShareModal({ isOpen, onClose, type, id }: ShareModalProps) {
  const [shareData, setShareData] = useState<ShareData | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedEmbed, setCopiedEmbed] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const data = portfolioManager.generateShareData(type, id)
      setShareData(data)
    }
  }, [isOpen, type, id])

  const handleCopyLink = async () => {
    if (!shareData) return
    
    try {
      await navigator.clipboard.writeText(shareData.url)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleCopyEmbed = async () => {
    if (!shareData) return
    
    const embedCode = `<iframe src="${shareData.url}?embed=true" width="600" height="400" frameborder="0"></iframe>`
    
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopiedEmbed(true)
      setTimeout(() => setCopiedEmbed(false), 2000)
    } catch (error) {
      console.error('Failed to copy embed code:', error)
    }
  }

  const handleNativeShare = async () => {
    if (!shareData || !navigator.share) return
    
    try {
      await navigator.share({
        title: shareData.title,
        text: shareData.description,
        url: shareData.url
      })
    } catch (error) {
      console.error('Failed to share:', error)
    }
  }

  const handleSocialShare = (platform: string) => {
    if (!shareData) return
    
    const encodedUrl = encodeURIComponent(shareData.url)
    const encodedTitle = encodeURIComponent(shareData.title)
    const encodedDescription = encodeURIComponent(shareData.description)
    
    let shareUrl = ''
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
        break
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  if (!isOpen || !shareData) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-bold text-foreground">Share {type === 'profile' ? 'Profile' : 'Project'}</h2>
              <p className="text-muted-foreground text-sm">Spread the word about your work</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Preview */}
            <div className="bg-muted/50 border border-border rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-xl">
                  {type === 'profile' ? '👤' : '📄'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{shareData.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {shareData.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 truncate">
                    {shareData.url}
                  </p>
                </div>
              </div>
            </div>

            {/* Copy Link */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Share Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareData.url}
                  readOnly
                  className="flex-1 p-3 bg-muted border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  {copiedLink ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              {copiedLink && (
                <p className="text-sm text-green-400 mt-1">Link copied to clipboard!</p>
              )}
            </div>

            {/* Social Sharing */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Share on Social Media
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Twitter */}
                <button
                  onClick={() => handleSocialShare('twitter')}
                  className="flex flex-col items-center gap-2 p-4 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 bg-[#1DA1F2] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    𝕏
                  </div>
                  <span className="text-xs text-[#1DA1F2]">Twitter</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={() => handleSocialShare('linkedin')}
                  className="flex flex-col items-center gap-2 p-4 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 bg-[#0A66C2] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    in
                  </div>
                  <span className="text-xs text-[#0A66C2]">LinkedIn</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => handleSocialShare('whatsapp')}
                  className="flex flex-col items-center gap-2 p-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 bg-[#25D366] rounded-lg flex items-center justify-center text-white">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-[#25D366]">WhatsApp</span>
                </button>

                {/* Email */}
                <button
                  onClick={() => handleSocialShare('email')}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-600/10 hover:bg-gray-600/20 border border-gray-600/30 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center text-white">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-gray-400">Email</span>
                </button>

                {/* Telegram */}
                <button
                  onClick={() => handleSocialShare('telegram')}
                  className="flex flex-col items-center gap-2 p-4 bg-[#0088CC]/10 hover:bg-[#0088CC]/20 border border-[#0088CC]/30 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 bg-[#0088CC] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    t
                  </div>
                  <span className="text-xs text-[#0088CC]">Telegram</span>
                </button>

                {/* Native Share (if available) */}
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    onClick={handleNativeShare}
                    className="flex flex-col items-center gap-2 p-4 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/30 rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-blue-400">More</span>
                  </button>
                )}
              </div>
            </div>

            {/* Embed Code (for projects) */}
            {type === 'project' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Embed Code
                </label>
                <div className="flex gap-2">
                  <textarea
                    value={`<iframe src="${shareData.url}?embed=true" width="600" height="400" frameborder="0"></iframe>`}
                    readOnly
                    rows={3}
                    className="flex-1 p-3 bg-muted border border-border rounded-lg text-foreground text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleCopyEmbed}
                    className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors self-start"
                  >
                    {copiedEmbed ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {copiedEmbed && (
                  <p className="text-sm text-green-400 mt-1">Embed code copied!</p>
                )}
              </div>
            )}

            {/* QR Code (placeholder) */}
            <div className="text-center">
              <div className="w-32 h-32 bg-muted border-2 border-dashed border-border rounded-xl flex items-center justify-center mx-auto mb-3">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mx-auto mb-2"></div>
                  <p className="text-xs text-muted-foreground">QR Code</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Scan to share quickly
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Share your work and inspire others
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}






