import { Request, Response, NextFunction } from 'express'

interface AnalyticsEvent {
  event: string
  userId?: string
  properties: Record<string, any>
  timestamp: number
}

export function analyticsMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now()

  // Override res.json to capture response data
  const originalJson = res.json
  res.json = function(body: any) {
    const duration = Date.now() - startTime
    
    // Track API usage
    trackEvent('api_request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      userId: req.userId, // From auth middleware
    })

    return originalJson.call(this, body)
  }

  next()
}

function trackEvent(event: string, properties: Record<string, any>) {
  const analyticsEvent: AnalyticsEvent = {
    event,
    properties,
    timestamp: Date.now()
  }

  // In development, just log
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', analyticsEvent)
    return
  }

  // In production, send to analytics service
  // This could be:
  // - Database storage
  // - External analytics service
  // - Message queue for processing
  
  console.log('[Analytics] Event:', analyticsEvent)
}

export { trackEvent }









