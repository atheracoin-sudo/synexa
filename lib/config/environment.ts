// Environment Configuration
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
}

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 
           (ENV.IS_PRODUCTION ? 'https://api.synexa.ai' : 'http://localhost:4000'),
  TIMEOUT: {
    DEFAULT: 30000,
    CHAT: 60000,
    CODE: 45000,
    DESIGN: 30000,
  },
  RETRY: {
    MAX_ATTEMPTS: ENV.IS_PRODUCTION ? 3 : 1,
    DELAY: 1000,
  }
}

// App Configuration
export const APP_CONFIG = {
  NAME: 'Synexa AI Studio',
  VERSION: '1.0.0',
  DESCRIPTION: 'All-in-one AI Studio for Chat, Code, and Design',
  URL: process.env.NEXT_PUBLIC_APP_URL || 
       (ENV.IS_PRODUCTION ? 'https://studio.synexa.ai' : 'http://localhost:3000'),
}

// Feature Flags
export const FEATURES = {
  DEBUG_PANEL: ENV.IS_DEVELOPMENT,
  ANALYTICS: ENV.IS_PRODUCTION,
  ERROR_REPORTING: ENV.IS_PRODUCTION,
  RATE_LIMITING: true,
}

// Security Configuration
export const SECURITY_CONFIG = {
  CSP_ENABLED: ENV.IS_PRODUCTION,
  HTTPS_ONLY: ENV.IS_PRODUCTION,
  ALLOWED_ORIGINS: ENV.IS_PRODUCTION 
    ? ['https://studio.synexa.ai', 'https://synexa.ai']
    : ['http://localhost:3000', 'http://localhost:3001'],
}

// Validate required environment variables
export function validateEnvironment(): void {
  const required = [
    'NEXT_PUBLIC_API_BASE_URL',
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`)
    
    if (ENV.IS_PRODUCTION) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
  }
}

// Initialize environment validation
if (typeof window === 'undefined') { // Server-side only
  validateEnvironment()
}






