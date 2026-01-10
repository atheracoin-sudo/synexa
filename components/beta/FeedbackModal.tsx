'use client'

import { useState } from 'react'
import { X, MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

interface FeedbackData {
  whatTrying: string
  whereStuck: string
  whatLiked: string
}

export function FeedbackModal({ isOpen, onClose, className }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState<FeedbackData>({
    whatTrying: '',
    whereStuck: '',
    whatLiked: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Store feedback locally for now
      const feedbackEntry = {
        ...feedback,
        timestamp: new Date().toISOString(),
        userId: 'user_1' // Get from context in real app
      }
      
      // In real app, send to API
      console.log('Feedback submitted:', feedbackEntry)
      
      setSubmitted(true)
      
      // Auto-close after success
      setTimeout(() => {
        onClose()
        setSubmitted(false)
        setFeedback({ whatTrying: '', whereStuck: '', whatLiked: '' })
      }, 2000)
      
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid = feedback.whatTrying.trim() || feedback.whereStuck.trim() || feedback.whatLiked.trim()

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <Card className={cn('w-full max-w-md bg-background p-8 text-center', className)}>
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Teşekkürler! 🙏
          </h2>
          <p className="text-muted-foreground">
            Geri bildirimin bizim için çok değerli.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className={cn('w-full max-w-lg bg-background', className)}>
        <form onSubmit={handleSubmit} className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Geri Bildirim Gönder
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Kapat"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Question 1 */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                1. Ne yapmaya çalışıyordun?
              </label>
              <textarea
                value={feedback.whatTrying}
                onChange={(e) => setFeedback(prev => ({ ...prev, whatTrying: e.target.value }))}
                placeholder="Örn: Bir todo uygulaması oluşturmaya çalışıyordum..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Question 2 */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                2. Nerede zorlandın?
              </label>
              <textarea
                value={feedback.whereStuck}
                onChange={(e) => setFeedback(prev => ({ ...prev, whereStuck: e.target.value }))}
                placeholder="Örn: Kod oluşturma butonu çalışmadı..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Question 3 */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                3. En çok neyi sevdin?
              </label>
              <textarea
                value={feedback.whatLiked}
                onChange={(e) => setFeedback(prev => ({ ...prev, whatLiked: e.target.value }))}
                placeholder="Örn: Chat arayüzü çok sezgisel..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex-1 flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Gönder
            </Button>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-muted-foreground text-center mt-4">
            En az bir alanı doldurman yeterli
          </p>
        </form>
      </Card>
    </div>
  )
}






