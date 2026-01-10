'use client'

import { useState } from 'react'
import { MessageCircle, Mail, Phone, ExternalLink, Send, X } from 'lucide-react'

interface SupportEscalationProps {
  context?: string
  articleId?: string
  className?: string
}

export default function SupportEscalation({ 
  context, 
  articleId, 
  className = "" 
}: SupportEscalationProps) {
  const [selectedMethod, setSelectedMethod] = useState<'chat' | 'email' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChatEscalation = () => {
    // Redirect to chat with context
    const chatUrl = context 
      ? `/chat?context=${encodeURIComponent(context)}`
      : '/chat'
    window.location.href = chatUrl
  }

  const handleEmailEscalation = () => {
    setSelectedMethod('email')
  }

  const handleSubmitEmail = async (formData: FormData) => {
    setIsSubmitting(true)
    
    // Simulate email submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setSelectedMethod(null)
    }, 3000)
  }

  if (isSubmitted) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          Mesajınız Gönderildi
        </h3>
        <p className="text-gray-400">
          Destek ekibimiz en kısa sürede size dönüş yapacak
        </p>
      </div>
    )
  }

  if (selectedMethod === 'email') {
    return (
      <div className={`${className}`}>
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              Destek Ekibi ile İletişime Geç
            </h3>
            <button
              onClick={() => setSelectedMethod(null)}
              className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleSubmitEmail(formData)
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Adresiniz
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Konu
              </label>
              <input
                type="text"
                name="subject"
                required
                defaultValue={context ? `${context} ile ilgili yardım` : ''}
                className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sorununuzu kısaca özetleyin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mesajınız
              </label>
              <textarea
                name="message"
                required
                rows={4}
                className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sorununuzu detaylı bir şekilde açıklayın..."
              />
            </div>

            {/* Context Info */}
            {(context || articleId) && (
              <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">
                  Aşağıdaki bilgiler otomatik olarak eklenecek:
                </p>
                <div className="space-y-1 text-xs text-gray-500">
                  {context && <div>• Sayfa: {context}</div>}
                  {articleId && <div>• Makale ID: {articleId}</div>}
                  <div>• Tarih: {new Date().toLocaleString('tr-TR')}</div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Mesajı Gönder
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-white mb-2">
          Aradığını bulamadın mı?
        </h3>
        <p className="text-gray-400">
          Yardım merkezinde aradığın bilgiyi bulamadıysan, bizimle iletişime geçebilirsin
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Chat Support */}
        <button
          onClick={handleChatEscalation}
          className="group p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 hover:border-blue-500/40 rounded-2xl transition-all text-left"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          
          <h4 className="font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            Chat'e Sor
          </h4>
          <p className="text-gray-400 text-sm mb-3">
            AI ile hemen konuş, anında yanıt al
          </p>
          
          <div className="flex items-center gap-2 text-blue-400 text-sm">
            <span>Hemen başla</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </button>

        {/* Email Support */}
        <button
          onClick={handleEmailEscalation}
          className="group p-6 bg-gradient-to-br from-gray-500/10 to-gray-600/10 border border-gray-500/20 hover:border-gray-500/40 rounded-2xl transition-all text-left"
        >
          <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Mail className="w-6 h-6 text-white" />
          </div>
          
          <h4 className="font-bold text-white mb-2 group-hover:text-gray-300 transition-colors">
            Destek Ekibi
          </h4>
          <p className="text-gray-400 text-sm mb-3">
            Detaylı yardım için ekibimize yaz
          </p>
          
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>24 saat içinde yanıt</span>
            <Mail className="w-3 h-3" />
          </div>
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-gray-800/30 border border-gray-700 rounded-xl">
        <h5 className="font-medium text-white mb-2">
          Daha hızlı yardım için:
        </h5>
        <ul className="space-y-1 text-sm text-gray-400">
          <li>• Sorununuzu detaylı bir şekilde açıklayın</li>
          <li>• Hangi tarayıcı kullandığınızı belirtin</li>
          <li>• Hata mesajı varsa ekran görüntüsü paylaşın</li>
          <li>• Sorunu yeniden oluşturma adımlarını yazın</li>
        </ul>
      </div>
    </div>
  )
}

// Compact support widget for sidebars
export function SupportWidget({ 
  context,
  className = "" 
}: {
  context?: string
  className?: string
}) {
  return (
    <div className={`p-4 bg-gray-800/50 border border-gray-700 rounded-xl ${className}`}>
      <h4 className="font-medium text-white mb-3 flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-blue-400" />
        Yardıma mı ihtiyacın var?
      </h4>
      
      <div className="space-y-2">
        <button
          onClick={() => window.location.href = '/chat'}
          className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Chat'e Sor
        </button>
        
        <button
          onClick={() => window.location.href = '/help'}
          className="w-full flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Help Center
        </button>
      </div>
    </div>
  )
}

// Error state with help suggestions
export function ErrorWithHelp({ 
  error, 
  context,
  onRetry 
}: {
  error: string
  context?: string
  onRetry?: () => void
}) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <X className="w-8 h-8 text-red-400" />
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2">
        Bir sorun oluştu
      </h3>
      <p className="text-gray-400 mb-6">
        {error}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Tekrar Dene
          </button>
        )}
        
        <button
          onClick={() => window.location.href = '/help'}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors"
        >
          Yardım Al
        </button>
      </div>
    </div>
  )
}






