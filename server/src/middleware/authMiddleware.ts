/**
 * Authentication Middleware
 * 
 * Verifies JWT tokens and attaches userId to request
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../services/authService';

// Extend Express Request to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

/**
 * Middleware to verify JWT token and attach user info to request
 * 
 * If token is missing or invalid, returns 401 Unauthorized
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return res.status(401).json({
      error: {
        type: 'AUTH_REQUIRED',
        message: 'Authentication required',
        status: 401,
      },
      status: 401,
      errorCode: 'auth_required',
      errorType: 'authentication_error',
      errorMessage: 'Authentication required',
      category: 'AUTH_ERROR',
    });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({
      error: {
        type: 'AUTH_INVALID',
        message: 'Invalid or expired token',
        status: 401,
      },
      status: 401,
      errorCode: 'auth_invalid',
      errorType: 'authentication_error',
      errorMessage: 'Invalid or expired token',
      category: 'AUTH_ERROR',
    });
  }

  // Attach user info to request
  req.userId = payload.userId;
  req.userEmail = payload.email;

  next();
}

/**
 * Optional auth middleware - attaches user info if token is present
 * but doesn't require authentication
 */
export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = extractTokenFromHeader(authHeader);

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.userId = payload.userId;
      req.userEmail = payload.email;
    }
  }

  next();
}




