'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { MessagesList } from '@/components/chat/MessagesList'
import { ChatComposer } from '@/components/chat/ChatComposer'
import { ChatErrorBanner } from '@/components/chat/ChatErrorBanner'

export type ChatMode = 'chat' | 'build' | 'review'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isLoading?: boolean
}

// Mock conversation data
const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Merhaba! Bir e-ticaret sitesi yapmak istiyorum.',
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Harika! Size modern bir e-ticaret sitesi yapmada yardımcı olabilirim. Öncelikle hangi ürünleri satacağınızı ve hedef kitlenizi belirtir misiniz?\n\nBir e-ticaret sitesi için şunları planlayabiliriz:\n\n• **Ana Sayfa**: Öne çıkan ürünler ve kategoriler\n• **Ürün Kataloğu**: Filtreleme ve arama özellikleri\n• **Sepet ve Ödeme**: Güvenli ödeme sistemi\n• **Kullanıcı Hesapları**: Kayıt ve giriş sistemi\n• **Admin Paneli**: Ürün ve sipariş yönetimi\n\nHangi teknolojileri tercih edersiniz? React, Next.js ile modern bir çözüm önerebilirim.',
    timestamp: new Date(Date.now() - 3500000)
  },
  {
    id: '3',
    role: 'user',
    content: 'React ve Next.js ile yapalım. Elektronik ürünler satacağım.',
    timestamp: new Date(Date.now() - 3000000)
  },
  {
    id: '4',
    role: 'assistant',
    content: 'Mükemmel seçim! Elektronik ürünler için özelleştirilmiş bir e-ticaret sitesi tasarlayalım.\n\n**Önerilen Yapı:**\n\n1. **Ürün Özellikleri**\n   - Teknik özellikler tablosu\n   - Ürün görselleri ve zoom özelliği\n   - Karşılaştırma aracı\n   - Kullanıcı yorumları ve puanlama\n\n2. **Kategoriler**\n   - Telefon & Tablet\n   - Bilgisayar & Laptop\n   - Ses & Görüntü\n   - Akıllı Ev\n   - Aksesuar\n\n3. **Özel Özellikler**\n   - Stok durumu göstergesi\n   - Garanti bilgileri\n   - Taksit seçenekleri\n   - Kargo takibi\n\nBu yapıyı Studio\'da kodlamaya başlayalım mı?',
    timestamp: new Date(Date.now() - 2500000)
  }
]

export default function ChatPage() {
  const router = useRouter()
  const [mode, setMode] = useState<ChatMode>('chat')
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUserMessage, setLastUserMessage] = useState<string>('')

  const sendChatMessage = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: userMessage
            }
          ]
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.reply) {
        throw new Error('Geçersiz API yanıtı')
      }

      return data.reply
    } catch (error: any) {
      console.error('Chat API error:', error)
      throw error
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'Synexa düşünüyor…',
      timestamp: new Date(),
      isLoading: true
    }

    // Clear any previous error
    setError(null)
    setLastUserMessage(content.trim())
    
    // Add user message and loading message optimistically
    setMessages(prev => [...prev, userMessage, loadingMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const reply = await sendChatMessage(content.trim())
      
      // Replace loading message with actual response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { ...msg, content: reply, isLoading: false }
            : msg
        )
      )
    } catch (error: any) {
      console.error('Failed to send message:', error)
      
      // Remove loading message and show error
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id))
      setError(error.message || 'Bilinmeyen hata')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    if (lastUserMessage && !isLoading) {
      handleSendMessage(lastUserMessage)
    }
  }

  const handleGoToHealth = () => {
    router.push('/health')
  }

  const handleDismissError = () => {
    setError(null)
  }

  const handleQuickAction = (prompt: string) => {
    setInputValue(prompt)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <ChatHeader mode={mode} onModeChange={setMode} />
      
      {/* Error Banner */}
      {error && (
        <div className="flex-shrink-0">
          <ChatErrorBanner
            error={error}
            onRetry={handleRetry}
            onGoToHealth={handleGoToHealth}
            onDismiss={handleDismissError}
          />
        </div>
      )}
      
      {/* Messages - Flex-1 with proper overflow */}
      <div className="flex-1 overflow-hidden min-h-0">
        <MessagesList messages={messages} />
      </div>
      
      {/* Composer - Sticky at bottom */}
      <div className="flex-shrink-0 sticky bottom-0 z-10">
        <ChatComposer
          mode={mode}
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          onQuickAction={handleQuickAction}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}