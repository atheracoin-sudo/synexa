import { Request, Response, NextFunction } from 'express'
import { captureError } from '../config/sentry'

export interface ErrorWithStatus extends Error {
  status?: number
  statusCode?: number
}

export function errorHandler(
  error: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Capture error in Sentry
  captureError(error, {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  })

  // Log error
  console.error('[Error]', {
    message: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
  })

  // Determine status code
  const statusCode = error.status || error.statusCode || 500

  // Send error response
  res.status(statusCode).json({
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : error.message,
      status: statusCode,
      ...(process.env.NODE_ENV !== 'production' && {
        stack: error.stack,
      }),
    },
    timestamp: new Date().toISOString(),
  })
}

export function notFoundHandler(req: Request, res: Response) {
  const message = `Route ${req.method} ${req.originalUrl} not found`
  
  res.status(404).json({
    error: {
      message,
      status: 404,
    },
    timestamp: new Date().toISOString(),
  })
}







