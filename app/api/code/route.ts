import { NextRequest, NextResponse } from 'next/server'
import { CodeRequest } from '@/lib/types'
import { codeRateLimit, getClientIP } from '@/lib/security/rateLimit'
import { 
  validateRequestSize, 
  validateCodeRequest, 
  createErrorResponse, 
  createSuccessResponse,
  REQUEST_SIZE_LIMITS 
} from '@/lib/security/validation'
import { apiClient } from '@/lib/api/client'


export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const clientIP = getClientIP(request)
  
  try {
    // Rate limiting
    const rateLimitResult = codeRateLimit.check(clientIP)
    if (!rateLimitResult.allowed) {
      console.warn(`[Code API] Rate limit exceeded for IP: ${clientIP}`)
      return NextResponse.json(
        createErrorResponse(
          'RATE_LIMIT_EXCEEDED',
          'Too many requests. Please try again later.',
          429,
          { resetTime: rateLimitResult.resetTime }
        ),
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '15',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime / 1000).toString()
          }
        }
      )
    }

    const body: CodeRequest = await request.json()

    // Validate request size
    const sizeError = validateRequestSize(body, REQUEST_SIZE_LIMITS.CODE, 'code')
    if (sizeError) {
      return NextResponse.json(sizeError, { status: sizeError.status })
    }

    // Validate request structure
    const validationError = validateCodeRequest(body)
    if (validationError) {
      return NextResponse.json(validationError, { status: validationError.status })
    }

    // Forward request to backend API
    const backendResponse = await apiClient.generateCode(body)

    const duration = Date.now() - startTime

    if (!backendResponse.success) {
      console.error(`[Code API] Backend error for IP: ${clientIP}, duration: ${duration}ms:`, backendResponse.error)
      
      // Map backend errors to frontend format
      const statusCode = backendResponse.error?.status || 500
      const errorCode = backendResponse.error?.code || 'BACKEND_ERROR'
      const message = backendResponse.error?.message || 'Backend service unavailable'
      
      return NextResponse.json(
        createErrorResponse(errorCode, message, statusCode),
        { status: statusCode }
      )
    }

    console.log(`[Code API] Success for IP: ${clientIP}, duration: ${duration}ms, operations: ${backendResponse.data?.operations?.length || 0}`)

    return NextResponse.json(createSuccessResponse(backendResponse.data), {
      headers: {
        'X-RateLimit-Limit': '15',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      }
    })

  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[Code API] Error for IP: ${clientIP}, duration: ${duration}ms:`, error)
    
    if (error instanceof Error) {
      // Handle specific OpenAI errors
      if (error.message.includes('API key')) {
        return NextResponse.json(
          createErrorResponse('INVALID_API_KEY', 'Invalid API configuration', 503),
          { status: 503 }
        )
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          createErrorResponse('OPENAI_RATE_LIMIT', 'Service temporarily busy. Please try again.', 429),
          { status: 429 }
        )
      }

      if (error.message.includes('AI response format is invalid')) {
        return NextResponse.json(
          createErrorResponse('AI_PARSE_ERROR', 'Failed to generate valid code changes. Please try rephrasing your request.', 422),
          { status: 422 }
        )
      }
    }
    
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'An unexpected error occurred', 500),
      { status: 500 }
    )
  }
}
