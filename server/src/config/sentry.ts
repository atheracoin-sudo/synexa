import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

export function initSentry() {
  if (!process.env.SENTRY_DSN) {
    console.log('[Sentry] DSN not configured, skipping initialization')
    return
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    
    // Set tracesSampleRate to 1.0 to capture 100%
    // of the transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    environment: process.env.NODE_ENV,
    
    debug: process.env.NODE_ENV === 'development',
    
    beforeSend(event, hint) {
      // Don't send events in test environment
      if (process.env.NODE_ENV === 'test') {
        return null
      }
      
      // Log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Sentry] Capturing event:', event.exception?.values?.[0]?.value || event.message)
      }
      
      return event
    },
    
    integrations: [
      // Add profiling integration
      nodeProfilingIntegration(),
    ],
  })

  console.log('[Sentry] ✅ Initialized successfully')
}

export function captureError(error: Error, context?: Record<string, any>) {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setTag(key, value)
      })
      Sentry.captureException(error)
    })
  } else {
    Sentry.captureException(error)
  }
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level)
}

export { Sentry }












