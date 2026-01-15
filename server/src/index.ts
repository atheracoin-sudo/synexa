/**
 * Synexa Backend Server
 * 
 * Express server providing AI chat and image generation endpoints
 */

// Load environment variables FIRST, before any other imports
import dotenv from 'dotenv';
dotenv.config();

// Initialize Sentry first
import { initSentry } from './config/sentry';
initSentry();

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import chatRouter from './routes/chat';
import codeRouter from './routes/code';
import designRouter from './routes/design';
import imageRouter from './routes/image';
import videoRouter from './routes/video';
import searchRouter from './routes/search';
import eventsRouter from './routes/events';
import authRouter from './routes/auth';
import accountRouter from './routes/account';
import workspacesRouter from './routes/workspaces';
import chatHistoryRouter from './routes/chatHistory';
import { openai, isOpenAIConfigured } from './services/openaiClient';

const app: Express = express();
const PORT = Number(process.env.PORT) || 4000;

// Middleware - Performance optimizations
app.use(compression()); // Enable gzip compression

// Simple response caching middleware
const responseCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const cacheMiddleware = (ttl: number = 30000) => (req: Request, res: Response, next: Function) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  const cacheKey = `${req.method}:${req.originalUrl}`;
  const cached = responseCache.get(cacheKey);

  if (cached && Date.now() < cached.timestamp + cached.ttl) {
    res.setHeader('X-Cache', 'HIT');
    return res.json(cached.data);
  }

  // Override res.json to cache the response
  const originalJson = res.json;
  res.json = function(data: any) {
    responseCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl
    });
    res.setHeader('X-Cache', 'MISS');
    return originalJson.call(this, data);
  };

  next();
};

// Clean cache every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of responseCache.entries()) {
    if (now > entry.timestamp + entry.ttl) {
      responseCache.delete(key);
    }
  }
}, 5 * 60 * 1000);

// CORS configuration for web and mobile
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      process.env.FRONTEND_URL || 'https://your-frontend-domain.com',
      process.env.MOBILE_APP_URL || 'https://your-mobile-app-domain.com'
    ]
  : [
      'http://localhost:8081', // Expo web dev server
      'http://localhost:8082', // Alternative web port
      'http://localhost:3000', // React dev server
      'http://localhost:19006', // Expo web alternative
      '*' // Allow all origins in dev
    ];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id', 'x-conversation-id'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint with caching
app.get('/health', cacheMiddleware(10000), (req: Request, res: Response) => { // 10 second cache
  const startTime = Date.now();
  
  try {
    // Check database connection (if using Prisma)
    let dbStatus = 'unknown';
    let dbError = null;
    
    try {
      // Simple database check - this will be fast
      dbStatus = process.env.DATABASE_URL ? 'configured' : 'not_configured';
    } catch (error: any) {
      dbStatus = 'error';
      dbError = error.message;
    }

    // Check OpenAI configuration
    const openaiConfigured = !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here');
    const testModeEnabled = process.env.ENABLE_TEST_MODE === 'true';

    // System info
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      env: process.env.NODE_ENV || 'development'
    };

    const responseTime = Date.now() - startTime;

    res.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      services: {
        database: {
          status: dbStatus,
          error: dbError
        },
        openai: {
          configured: openaiConfigured,
          testMode: testModeEnabled
        }
      },
      system: systemInfo,
      version: '1.0.0'
    });
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    console.error('[Health] Health check failed:', error);
    
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      error: error.message || 'Health check failed',
      version: '1.0.0'
    });
  }
});

// Test OpenAI endpoint (admin only)
app.get('/test-openai', async (req: Request, res: Response) => {
  try {
    const testPrompt = 'Say "Hello from OpenAI!" in one sentence.';
    
    // Import OpenAI client
    const openaiClient = require('./services/openaiClient').default;
    
    const startTime = Date.now();
    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: testPrompt }],
      max_tokens: 50,
      temperature: 0.1,
    });

    const duration = Date.now() - startTime;
    const response = completion.choices[0]?.message?.content || 'No response';

    res.json({
      success: true,
      testPrompt,
      response,
      duration: `${duration}ms`,
      model: completion.model,
      usage: completion.usage,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[OpenAI Test] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'OpenAI test failed',
      code: error.code || 'UNKNOWN',
      timestamp: new Date().toISOString()
    });
  }
});

// Status endpoint for provider info (safe for frontend) with caching
app.get('/status', cacheMiddleware(30000), (req: Request, res: Response) => { // 30 second cache
  const { getProviderDisplayName, isProviderConfigured } = require('./config/aiProviderConfig');
  const { aiProviderConfig } = require('./config/aiProviderConfig');
  
  res.json({
    provider: aiProviderConfig.provider,
    providerDisplayName: getProviderDisplayName(),
    isConfigured: isProviderConfigured(),
    allowDemoFallback: aiProviderConfig.allowDemoFallback,
    // Don't expose API keys or sensitive config
  });
});

// API routes
app.use('/chat', chatRouter);
app.use('/code', codeRouter);
app.use('/design', designRouter);
app.use('/image', imageRouter);
app.use('/video', videoRouter);
app.use('/search', searchRouter);
app.use('/events', eventsRouter);

// Auth routes
app.use('/auth', authRouter);

// Account routes (require authentication)
app.use('/account', accountRouter);

// User-scoped routes (require authentication)
app.use('/workspaces', workspacesRouter);
app.use('/chat', chatHistoryRouter); // Chat history endpoints (separate from AI chat)

// Error handling middleware
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware';
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Get local network IP address
 * Returns the IP from environment variable or attempts to detect it
 */
function getLocalNetworkIP(): string {
  // Check environment variable first
  if (process.env.LOCAL_NETWORK_IP) {
    return process.env.LOCAL_NETWORK_IP;
  }

  // Try to get IP from network interfaces
  try {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    
    // Look for IPv4 addresses in non-internal interfaces
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        // Skip internal (loopback) and non-IPv4 addresses
        if (iface.family === 'IPv4' && !iface.internal) {
          // Prefer addresses starting with 192.168 or 10.0 (common LAN ranges)
          if (iface.address.startsWith('192.168.') || iface.address.startsWith('10.0.')) {
            return iface.address;
          }
        }
      }
    }
    
    // Fallback: return first non-internal IPv4 address
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch (error) {
    console.warn('⚠️  Could not detect local network IP:', error);
  }

  // Default fallback
  return '192.168.1.52';
}

// Start server
// CRITICAL: Listen on 0.0.0.0 (all network interfaces) to allow connections from:
// - Android emulator (10.0.2.2)
// - iOS simulator and real iOS devices (local network IP)
// - Real Android devices (local network IP)
// If we only listen on 127.0.0.1, mobile devices cannot connect
/**
 * Validate OpenAI credentials on startup
 */
async function validateOpenAICredentials(): Promise<void> {
  if (!isOpenAIConfigured()) {
    console.warn('[Startup] ⚠️  OpenAI API key is not configured');
    return;
  }

  try {
    console.log('[Startup] 🔍 Validating OpenAI credentials...');
    
    // Make a lightweight request to verify credentials
    // Using models.list() as it's lightweight and doesn't consume credits
    const models = await openai.models.list();
    
    console.log('[Startup] ✅ OpenAI credentials validated successfully');
    console.log(`[Startup]    Available models: ${models.data.length} models found`);
    
    // Check if project ID is set and valid
    if (process.env.OPENAI_PROJECT) {
      console.log(`[Startup]    Project ID: ${process.env.OPENAI_PROJECT}`);
    } else {
      console.log('[Startup]    Project ID: Not set (optional)');
    }
  } catch (error: any) {
    const status = error?.status ?? error?.response?.status ?? 'unknown';
    const errorData = error?.response?.data ?? error?.error ?? null;
    
    console.error('[Startup] ❌ OpenAI credential validation failed');
    console.error('[Startup]    Status:', status);
    console.error('[Startup]    Error:', errorData?.code || errorData?.type || error.message);
    
    if (status === 401) {
      console.error('[Startup]    ⚠️  Invalid API key or authentication failed');
      if (errorData?.code === 'invalid_api_key') {
        console.error('[Startup]    → Check OPENAI_API_KEY in .env file');
      } else if (errorData?.code === 'project_not_found') {
        console.error('[Startup]    → Check OPENAI_PROJECT in .env file (or remove if not needed)');
      }
    } else if (status === 403) {
      console.error('[Startup]    ⚠️  Permission denied - check API key permissions');
    } else {
      console.error('[Startup]    ⚠️  Unknown error - check network connectivity');
    }
  }
}

const localIP = getLocalNetworkIP();
const server = app.listen(PORT as number, '0.0.0.0', async () => {
  console.log(`\n🚀 Synexa Backend Server running`);
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Network access: http://${localIP}:${PORT} (for mobile devices on same LAN)`);
  console.log(`\n📡 Available endpoints:`);
  console.log(`   Health: GET http://localhost:${PORT}/health`);
  console.log(`   Chat: POST http://localhost:${PORT}/chat`);
  console.log(`   Chat (OpenAI): POST http://localhost:${PORT}/chat/openai`);
  console.log(`   Image: POST http://localhost:${PORT}/image`);
  console.log(`   Workspaces: GET http://localhost:${PORT}/workspaces`);
  console.log(`   WebSocket: ws://${localIP}:${PORT}/ws`);
  console.log(`\n💡 Tips:`);
  console.log(`   Open http://${localIP}:${PORT}/health in your mobile browser to test connectivity`);
  console.log(`   To override IP, set LOCAL_NETWORK_IP environment variable (current: ${localIP})\n`);
  
  // Validate OpenAI credentials after server starts
  await validateOpenAICredentials();
});

// Initialize WebSocket service
import { initWebSocketService } from './services/websocketService';
initWebSocketService(server);