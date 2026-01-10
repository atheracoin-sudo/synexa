import { NextRequest, NextResponse } from 'next/server'
import { DesignRequest, DesignScene } from '@/lib/types'
import { designRateLimit, getClientIP } from '@/lib/security/rateLimit'
import { 
  validateRequestSize, 
  validateDesignRequest, 
  createErrorResponse, 
  createSuccessResponse,
  REQUEST_SIZE_LIMITS 
} from '@/lib/security/validation'
import { apiClient } from '@/lib/api/client'

const DESIGN_SYSTEM_PROMPT = `You are an expert UI/UX designer. Your job is to create design layouts based on user requests.

When given a design request, you should:
1. Understand the purpose and target audience
2. Choose appropriate colors, typography, and layout
3. Create a structured design with proper hierarchy
4. Generate specific design elements as JSON

IMPORTANT RULES:
- Always respond with valid JSON
- Use the exact format specified below
- Create visually appealing and balanced layouts
- Consider modern design principles (contrast, alignment, proximity, repetition)
- Use appropriate sizing and positioning
- Choose colors that work well together

Response format:
{
  "scene": {
    "width": number,
    "height": number,
    "background": "hex color",
    "nodes": [
      {
        "type": "text|rect|circle",
        "x": number,
        "y": number,
        "width": number,
        "height": number,
        "fill": "hex color",
        "stroke": "hex color (optional)",
        "strokeWidth": number (optional),
        "text": "string (for text nodes)",
        "fontSize": number (for text nodes)",
        "fontFamily": "string (for text nodes)"
      }
    ]
  }
}

Size presets:
- instagram-post: 1080x1080
- youtube-thumbnail: 1280x720
- twitter-header: 1500x500
- custom: use provided width/height

Design principles to follow:
- Use proper visual hierarchy
- Maintain good contrast ratios
- Apply consistent spacing
- Choose readable fonts and sizes
- Create balanced compositions
- Use colors that complement each other`

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const clientIP = getClientIP(request)
  
  try {
    // Rate limiting
    const rateLimitResult = designRateLimit.check(clientIP)
    if (!rateLimitResult.allowed) {
      console.warn(`[Design API] Rate limit exceeded for IP: ${clientIP}`)
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
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime / 1000).toString()
          }
        }
      )
    }


    const body: DesignRequest = await request.json()

    // Validate request size
    const sizeError = validateRequestSize(body, REQUEST_SIZE_LIMITS.DESIGN, 'design')
    if (sizeError) {
      return NextResponse.json(sizeError, { status: sizeError.status })
    }

    // Validate request structure
    const validationError = validateDesignRequest(body)
    if (validationError) {
      return NextResponse.json(validationError, { status: validationError.status })
    }

    const { prompt, sizePreset = 'instagram-post', width, height, brand } = body

    // Determine canvas size
    let canvasWidth = 1080
    let canvasHeight = 1080

    switch (sizePreset) {
      case 'instagram-post':
        canvasWidth = 1080
        canvasHeight = 1080
        break
      case 'youtube-thumbnail':
        canvasWidth = 1280
        canvasHeight = 720
        break
      case 'twitter-header':
        canvasWidth = 1500
        canvasHeight = 500
        break
      case 'custom':
        canvasWidth = width || 1080
        canvasHeight = height || 1080
        break
    }

    // Build context for the AI
    let contextMessage = `Create a ${sizePreset} design (${canvasWidth}x${canvasHeight}px) for: ${prompt}`

    if (brand) {
      contextMessage += `\n\nBrand guidelines:
- Colors: ${brand.colors.join(', ')}
- Font: ${brand.font}`
    }

    // Prepare request for backend
    const designRequest = {
      prompt,
      style: brand ? `Colors: ${brand.colors.join(', ')}, Font: ${brand.font}` : undefined,
      width: canvasWidth,
      height: canvasHeight
    }

    // Forward request to backend API
    const backendResponse = await apiClient.generateDesign(designRequest)

    if (!backendResponse.success) {
      console.error(`[Design API] Backend error for IP: ${clientIP}:`, backendResponse.error)
      
      // Map backend errors to frontend format
      const statusCode = backendResponse.error?.status || 500
      const errorCode = backendResponse.error?.code || 'BACKEND_ERROR'
      const message = backendResponse.error?.message || 'Backend service unavailable'
      
      return NextResponse.json(
        createErrorResponse(errorCode, message, statusCode),
        { status: statusCode }
      )
    }

    const designData = backendResponse.data

    // Ensure scene has required properties for frontend compatibility
    const scene: DesignScene = {
      id: `design-${Date.now()}`,
      name: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
      width: designData?.scene?.width || canvasWidth,
      height: designData?.scene?.height || canvasHeight,
      background: designData?.scene?.background || '#ffffff',
      nodes: (designData?.scene?.nodes || []).map((node, index) => ({
        id: `node-${index}`,
        type: node.type,
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        fill: node.fill,
        stroke: node.stroke,
        strokeWidth: node.strokeWidth,
        text: node.text,
        fontSize: node.fontSize,
        fontFamily: node.fontFamily,
        rotation: 0
      }))
    }

    const duration = Date.now() - startTime
    console.log(`[Design API] Success for IP: ${clientIP}, duration: ${duration}ms, nodes: ${scene.nodes.length}`)

    return NextResponse.json(createSuccessResponse(scene), {
      headers: {
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      }
    })

  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[Design API] Error for IP: ${clientIP}, duration: ${duration}ms:`, error)
    
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
          createErrorResponse('AI_PARSE_ERROR', 'Failed to generate valid design. Please try rephrasing your request.', 422),
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
