/**
 * Auth Service
 * 
 * Handles JWT token generation and verification
 */

import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.AUTH_JWT_SECRET || 'change_me_in_production';
const JWT_EXPIRY = process.env.AUTH_TOKEN_EXPIRY || '30d';

export interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Issue a JWT token for a user
 */
export function issueTokenForUser(user: { id: string; email: string }): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
  };

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  // @ts-ignore - JWT library type issue
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY || '30d',
  });
}

/**
 * Verify a JWT token and return the payload
 * Returns null if token is invalid
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Extract token from Authorization header
 * Format: "Bearer <token>"
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove "Bearer " prefix
}




