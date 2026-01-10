/**
 * Events Route
 * 
 * Simple endpoint for receiving analytics events from the frontend.
 * Logs events to console. In production, you would store these in a database.
 */

import express, { Request, Response } from 'express';

const router = express.Router();

interface AnalyticsEvent {
  name: string;
  timestamp: number;
  properties?: Record<string, any>;
}

interface EventsRequest {
  name: string;
  timestamp?: number;
  properties?: Record<string, any>;
}

router.post('/', (req: Request, res: Response) => {
  try {
    const { name, timestamp, properties }: EventsRequest = req.body;

    // Validate required fields
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Event name is required' });
    }

    const event: AnalyticsEvent = {
      name,
      timestamp: timestamp || Date.now(),
      properties: properties || {},
    };

    // Log event to console
    console.log('[Analytics Event]', JSON.stringify(event, null, 2));

    // TODO: In production, store events in a database (PostgreSQL, MongoDB, etc.)
    // Example:
    // await db.analyticsEvents.insert(event);
    // 
    // Or send to a third-party analytics service:
    // await sendToAnalyticsService(event);

    // Always respond with 200 to avoid blocking the frontend
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('[Events Route] Error processing event:', error);
    // Still return 200 to avoid blocking frontend
    res.status(200).json({ success: false, error: 'Event logged but may not be processed' });
  }
});

export default router;




