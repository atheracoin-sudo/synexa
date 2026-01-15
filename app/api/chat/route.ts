import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Timeout configuration (25 seconds)
const TIMEOUT_MS = 25000

// Request timeout wrapper
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ])
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      console.error('[Chat API] OPENAI_API_KEY environment variable is not configured.')
      return NextResponse.json(
        { 
          error: 'OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.',
          code: 'MISSING_API_KEY'
        },
        { status: 500 }
      )
    }

    console.log('[Chat API] Using OpenAI API key:', apiKey.substring(0, 10) + '...')

    // Parse and validate request body
    let body: any
    try {
      body = await request.json()
    } catch (error) {
      console.error('[Chat API] Invalid JSON body:', error)
      return NextResponse.json(
        { error: 'Geçersiz JSON formatı' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!body.messages || !Array.isArray(body.messages)) {
      console.error('[Chat API] Missing or invalid messages array')
      return NextResponse.json(
        { error: 'Mesajlar dizisi eksik veya geçersiz' },
        { status: 400 }
      )
    }

    if (body.messages.length === 0) {
      console.error('[Chat API] Empty messages array')
      return NextResponse.json(
        { error: 'Mesajlar dizisi boş olamaz' },
        { status: 400 }
      )
    }

    // Validate message structure
    for (const message of body.messages) {
      if (!message.role || !message.content) {
        console.error('[Chat API] Invalid message structure:', message)
        return NextResponse.json(
          { error: 'Her mesajın role ve content alanları olmalı' },
          { status: 400 }
        )
      }
      if (!['user', 'assistant', 'system'].includes(message.role)) {
        console.error('[Chat API] Invalid message role:', message.role)
        return NextResponse.json(
          { error: 'Geçersiz mesaj rolü. user, assistant veya system olmalı' },
          { status: 400 }
        )
      }
    }

    const { messages } = body

    console.log(`[Chat API] Processing ${messages.length} messages with OpenAI`)

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // Make API call with timeout
    const completion = await withTimeout(
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: 0.7,
        max_tokens: 2000,
      }),
      TIMEOUT_MS
    )

    const reply = completion.choices[0]?.message?.content || 'Üzgünüm, yanıt oluşturamadım.'
    const duration = Date.now() - startTime

    console.log(`[Chat API] OpenAI success in ${duration}ms, response length: ${reply.length}`)

    return NextResponse.json({
      reply
    })

  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error(`[Chat API] Error after ${duration}ms:`, error.message)

    // Handle specific error types
    if (error.message === 'Request timeout') {
      return NextResponse.json(
        { error: 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.' },
        { status: 408 }
      )
    }

    // Handle OpenAI API errors
    if (error.status) {
      let errorMessage = 'AI servisi hatası'
      
      switch (error.status) {
        case 401:
          errorMessage = 'API anahtarı geçersiz'
          break
        case 429:
          errorMessage = 'Çok fazla istek. Lütfen biraz bekleyip tekrar deneyin.'
          break
        case 500:
        case 502:
        case 503:
          errorMessage = 'AI servisi geçici olarak kullanılamıyor'
          break
        default:
          errorMessage = error.message || 'AI servisi hatası'
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: error.status >= 500 ? 503 : error.status }
      )
    }

    // Generic error
    return NextResponse.json(
      { error: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    )
  }
}

// Ensure this runs on Node.js runtime, not Edge
export const runtime = 'nodejs'