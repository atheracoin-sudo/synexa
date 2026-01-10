import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '@/lib/api/client'

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Check backend health
    let backendHealthy = false
    let backendError = null
    let backendData = null
    
    try {
      const backendResponse = await apiClient.healthCheck()
      backendHealthy = backendResponse.success
      if (backendHealthy) {
        backendData = backendResponse.data
      } else {
        backendError = backendResponse.error || 'Backend unhealthy'
      }
    } catch (error: any) {
      backendError = error.message || 'Backend connection failed'
    }

    // Check backend status (OpenAI info)
    let openaiStatus = null
    try {
      const statusResponse = await apiClient.statusCheck()
      if (statusResponse.success) {
        openaiStatus = statusResponse.data
      }
    } catch (error: any) {
      console.warn('Status check failed:', error.message)
    }

    // Frontend OpenAI key (fallback)
    const hasDirectOpenAIKey = !!process.env.OPENAI_API_KEY

    // Overall health determination
    const isHealthy = backendHealthy || hasDirectOpenAIKey
    const responseTime = Date.now() - startTime

    const health = {
      ok: isHealthy,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      frontend: {
        environment: process.env.NODE_ENV,
        hasDirectOpenAI: hasDirectOpenAIKey,
        version: '1.0.0'
      },
      backend: {
        healthy: backendHealthy,
        error: backendError,
        url: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
        data: backendData
      },
      ai: {
        provider: openaiStatus?.provider || 'unknown',
        configured: openaiStatus?.isConfigured || hasDirectOpenAIKey,
        testMode: openaiStatus?.allowDemoFallback || false
      }
    }

    return NextResponse.json(health, {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error: any) {
    const responseTime = Date.now() - startTime
    console.error('[Health] Frontend health check failed:', error)
    
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Health check failed',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`
      },
      { status: 500 }
    )
  }
}