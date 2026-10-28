import type { Request, Response, NextFunction, CookieOptions } from 'express'
import jwt from 'jsonwebtoken'
import 'cookie-parser'

export interface AuthenticatedRequest extends Request {
  userId?: string
  userEmail?: string
  userName?: string
  cookies: Record<string, string | undefined>
}

const JWT_SECRET = process.env.JWT_SECRET || 'ocean-explorer-dev-secret-CHANGE-IN-PRODUCTION'
const TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export function cookieOptions(): CookieOptions {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: TOKEN_MAX_AGE_MS,
    path: '/'
  }
}

export function signToken(userId: string, email: string, name: string): string {
  return jwt.sign({ userId, email, name }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string; email: string; name: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string }
  } catch {
    return null
  }
}

/** Middleware: reject if not authenticated */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void {
  const token = req.cookies?.ocean_token
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in.'
    })
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      name: string
    }
    req.userId = payload.userId
    req.userEmail = payload.email
    req.userName = payload.name
    return next()
  } catch {
    return res.status(401).json({
      success: false,
      error: 'Session expired. Please sign in again.'
    })
  }
}

/** Middleware: attach user if authenticated, proceed either way */
export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const token = req.cookies?.ocean_token
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as {
        userId: string
        email: string
        name: string
      }
      req.userId = payload.userId
      req.userEmail = payload.email
      req.userName = payload.name
    } catch {
      // Expired or invalid token — proceed as guest
    }
  }
  next()
}
