import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const event = await request.json()
    
    // Validate event structure
    if (!event.name || typeof event.name !== 'string') {
      return NextResponse.json(
        { error: 'Invalid event name' },
        { status: 400 }
      )
    }

    // Log event (in production, send to analytics service)
    console.log('[Analytics API] Event received:', {
      name: event.name,
      properties: event.properties,
      timestamp: event.timestamp || Date.now(),
      userAgent: request.headers.get('user-agent'),
      ip: request.ip || 'unknown'
    })

    // In production, you would send this to:
    // - Google Analytics
    // - Mixpanel
    // - PostHog
    // - Custom analytics backend
    // - Database for storage

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Analytics API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to process analytics event' },
      { status: 500 }
    )
  }
}






