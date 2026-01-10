import { NextRequest, NextResponse } from 'next/server'
import { SynexaApiClient } from '@/lib/api/client'
import { chatRateLimit, getClientIP } from '@/lib/security/rateLimit'
import { 
  validateRequestSize, 
  validateChatRequest, 
  createErrorResponse, 
  REQUEST_SIZE_LIMITS 
} from '@/lib/security/validation'

// Backend API client
const backendClient = new SynexaApiClient()

// Check if backend is available
const USE_BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL !== undefined

// Fallback OpenAI client for direct calls (if backend is not available)
import OpenAI from 'openai'

let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiClient
}

// Use streaming for production experience
const USE_STREAMING = true

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const clientIP = getClientIP(request)
  
  console.log(`\n[Chat API] Request from ${clientIP}`)
  console.log(`[Chat API] Using backend: ${USE_BACKEND}`)
  
  try {
    // Rate limiting - DISABLED in development for debugging
    if (process.env.NODE_ENV !== 'development') {
      const rateLimitResult = chatRateLimit.check(clientIP)
      if (!rateLimitResult.allowed) {
        console.warn(`[Chat API] Rate limit exceeded for IP: ${clientIP}`)
        return NextResponse.json(
          { 
            error: { 
              code: 'RATE_LIMIT_EXCEEDED', 
              message: 'Too many requests. Please try again later.',
              status: 429
            } 
          },
          { status: 429 }
        )
      }
    }

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (e) {
      console.error('[Chat API] ❌ Invalid JSON body')
      return NextResponse.json(
        { error: { code: 'INVALID_JSON', message: 'Invalid JSON body', status: 400 } },
        { status: 400 }
      )
    }

    console.log('[Chat API] Messages count:', body.messages?.length || 0)

    // Validate request size
    const sizeError = validateRequestSize(body, REQUEST_SIZE_LIMITS.CHAT, 'chat')
    if (sizeError) {
      console.error('[Chat API] ❌ Request too large')
      return NextResponse.json(
        { error: { code: 'REQUEST_TOO_LARGE', message: sizeError.error, status: 413 } },
        { status: 413 }
      )
    }

    // Validate request structure
    const validationError = validateChatRequest(body)
    if (validationError) {
      console.error('[Chat API] ❌ Validation error:', validationError)
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: validationError.error, status: 400 } },
        { status: 400 }
      )
    }

    const { messages } = body

    // Try backend first if available
    if (USE_BACKEND) {
      console.log('[Chat API] Using backend API...')
      
      try {
        const backendResponse = await backendClient.chat({
          messages,
          modelId: body.modelId || 'synexa-gpt-5.1',
          workspaceId: body.workspaceId,
          conversationId: body.conversationId
        })

        if (backendResponse.success && backendResponse.data) {
          const duration = Date.now() - startTime
          console.log(`[Chat API] ✅ Backend success in ${duration}ms`)
          
          return NextResponse.json({
            role: 'assistant',
            content: backendResponse.data.outputText || backendResponse.data.text,
            latency: duration,
            source: 'backend',
            requestId: backendResponse.data.requestId,
            model: backendResponse.data.model
          })
        } else {
          console.warn('[Chat API] Backend failed, falling back to direct OpenAI:', backendResponse.error)
        }
      } catch (backendError) {
        console.warn('[Chat API] Backend error, falling back to direct OpenAI:', backendError)
      }
    }

    // Fallback to direct OpenAI
    console.log('[Chat API] Using direct OpenAI...')

    // Check if API key is configured for fallback
    if (!process.env.OPENAI_API_KEY) {
      console.error('[Chat API] ❌ No backend available and OPENAI_API_KEY not configured')
      
      // Return proper error for missing API key - no technical details to user
      console.error('[Chat API] ❌ No backend available and OPENAI_API_KEY not configured')
      return NextResponse.json(
        { 
          error: { 
            code: 'SERVICE_UNAVAILABLE', 
            message: 'Synexa geçici olarak yanıt veremiyor. Lütfen biraz sonra tekrar dene.',
            status: 503
          } 
        },
        { status: 503 }
      )
    }

    // Get OpenAI client
    const openai = getOpenAIClient()
    if (!openai) {
      console.error('[Chat API] ❌ Failed to initialize OpenAI client')
      return NextResponse.json(
        { 
          error: { 
            code: 'CLIENT_ERROR', 
            message: 'Failed to initialize AI service',
            status: 503
          } 
        },
        { status: 503 }
      )
    }

    // NON-STREAMING MODE (for debugging)
    if (!USE_STREAMING) {
      console.log('[Chat API] Using non-streaming mode...')
      
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: 0.7,
          max_tokens: 2000,
        })

        const responseContent = completion.choices[0]?.message?.content || ''
        const duration = Date.now() - startTime

        console.log(`[Chat API] ✅ Direct OpenAI success in ${duration}ms, response length: ${responseContent.length}`)

        return NextResponse.json({
          role: 'assistant',
          content: responseContent,
          latency: duration,
          source: 'direct-openai'
        })
        
      } catch (openaiError: any) {
        const duration = Date.now() - startTime
        console.error(`[Chat API] ❌ OpenAI error after ${duration}ms:`)
        console.error('  Status:', openaiError.status)
        console.error('  Message:', openaiError.message)
        console.error('  Type:', openaiError.type)
        
        // Map OpenAI errors to appropriate status codes
        let status = 500
        let code = 'OPENAI_ERROR'
        let message = 'AI service error'

        if (openaiError.status === 401) {
          status = 401
          code = 'INVALID_API_KEY'
          message = 'Invalid OpenAI API key'
        } else if (openaiError.status === 429) {
          status = 429
          code = 'RATE_LIMITED'
          message = 'OpenAI rate limit exceeded. Please try again in a moment.'
        } else if (openaiError.status === 500 || openaiError.status === 503) {
          status = 503
          code = 'SERVICE_UNAVAILABLE'
          message = 'OpenAI service is temporarily unavailable'
        } else if (openaiError.message) {
          message = openaiError.message
        }

        return NextResponse.json(
          { error: { code, message, status, latency: duration } },
          { status }
        )
      }
    }

    // STREAMING MODE
    console.log('[Chat API] Using streaming mode...')
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messages.map((msg: any) => ({
              role: msg.role,
              content: msg.content,
            })),
            stream: true,
            temperature: 0.7,
            max_tokens: 2000,
          })

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || ''
            
            if (content) {
              const data = JSON.stringify({ content, done: false })
              controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`))
            }
          }

          // Send completion signal
          const doneData = JSON.stringify({ content: '', done: true })
          controller.enqueue(new TextEncoder().encode(`data: ${doneData}\n\n`))
          
          const duration = Date.now() - startTime
          console.log(`[Chat API] ✅ Stream complete in ${duration}ms`)
          
        } catch (error: any) {
          console.error('[Chat API] ❌ Stream error:', error.message)
          const errorData = JSON.stringify({ 
            error: { 
              code: 'STREAM_ERROR',
              message: error.message || 'Stream error'
            },
            done: true 
          })
          controller.enqueue(new TextEncoder().encode(`data: ${errorData}\n\n`))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error(`[Chat API] ❌ Unexpected error after ${duration}ms:`)
    console.error('  Stack:', error.stack)
    
    return NextResponse.json(
      { 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: error.message || 'An unexpected error occurred',
          status: 500,
          latency: duration
        } 
      },
      { status: 500 }
    )
  }
}
