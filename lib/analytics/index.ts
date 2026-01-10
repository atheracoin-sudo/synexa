// Simple analytics system
interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: number
}

class Analytics {
  private isEnabled: boolean
  private events: AnalyticsEvent[] = []

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production'
  }

  track(name: string, properties?: Record<string, any>) {
    if (!this.isEnabled) {
      console.log(`[Analytics] ${name}`, properties)
      return
    }

    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: Date.now()
    }

    this.events.push(event)

    // Send to analytics service (placeholder)
    this.sendEvent(event)
  }

  private async sendEvent(event: AnalyticsEvent) {
    try {
      // In production, send to your analytics service
      // For now, just log to console
      console.log('[Analytics] Event:', event)

      // Example: Send to Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event.name, {
          custom_parameter: event.properties,
          timestamp: event.timestamp
        })
      }

      // Example: Send to custom backend
      if (typeof window !== 'undefined') {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        }).catch(err => console.warn('Analytics send failed:', err))
      }
    } catch (error) {
      console.warn('Analytics error:', error)
    }
  }

  // Common events
  pageView(page: string) {
    this.track('page_view', { page })
  }

  chatMessage(messageLength: number, responseTime?: number) {
    this.track('chat_message', { 
      messageLength, 
      responseTime 
    })
  }

  codeGeneration(fileCount: number, operationCount: number) {
    this.track('code_generation', { 
      fileCount, 
      operationCount 
    })
  }

  designGeneration(nodeCount: number, canvasSize: { width: number, height: number }) {
    this.track('design_generation', { 
      nodeCount, 
      canvasSize 
    })
  }

  userLogin(method: 'demo' | 'google' | 'email') {
    this.track('user_login', { method })
  }

  error(errorType: string, errorMessage: string, component?: string) {
    this.track('error', { 
      errorType, 
      errorMessage, 
      component 
    })
  }
}

export const analytics = new Analytics()

// React hook for analytics
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export function useAnalytics() {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      analytics.pageView(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return analytics
}






