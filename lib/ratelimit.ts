import { NextResponse } from 'next/server'

/**
 * Simple in-memory rate limiter
 * Similar to how major websites handle rate limiting
 * 
 * For production with multiple servers, consider:
 * - Redis-based rate limiting (@upstash/ratelimit)
 * - Vercel Edge Config
 * - Cloudflare Rate Limiting
 */

type RateLimitStore = {
  [key: string]: {
    count: number
    resetAt: number
  }
}

const store: RateLimitStore = {}

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach(key => {
    if (store[key].resetAt < now) {
      delete store[key]
    }
  })
}, 10 * 60 * 1000)

export type RateLimitConfig = {
  /**
   * Maximum number of requests allowed
   */
  max: number
  
  /**
   * Time window in milliseconds
   */
  windowMs: number
  
  /**
   * Optional: Custom error message
   */
  message?: string
}

export type RateLimitResult = {
  success: boolean
  limit: number
  remaining: number
  reset: number
  message?: string
}

/**
 * Rate limit a request based on identifier (usually IP address)
 * 
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 * 
 * @example
 * ```typescript
 * const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
 * const result = rateLimit(ip, { max: 5, windowMs: 60 * 60 * 1000 }) // 5 per hour
 * 
 * if (!result.success) {
 *   return NextResponse.json(
 *     { error: result.message },
 *     { status: 429, headers: { 'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)) } }
 *   )
 * }
 * ```
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const key = identifier
  
  // Get or create entry
  let entry = store[key]
  
  // If entry doesn't exist or window has expired, create new entry
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + config.windowMs
    }
    store[key] = entry
  }
  
  // Increment count
  entry.count++
  
  const remaining = Math.max(0, config.max - entry.count)
  const success = entry.count <= config.max
  
  return {
    success,
    limit: config.max,
    remaining,
    reset: entry.resetAt,
    message: success 
      ? undefined 
      : config.message || `Too many requests. Please try again in ${Math.ceil((entry.resetAt - now) / 1000 / 60)} minutes.`
  }
}

/**
 * Common rate limit configurations used by major websites
 */
export const RateLimits = {
  /**
   * Strict: For sensitive operations (login, register, password reset)
   * 5 requests per hour
   * Used by: GitHub, Twitter for auth endpoints
   */
  STRICT: {
    max: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many attempts. Please try again in 1 hour.'
  },
  
  /**
   * Moderate: For user actions (subscribe, contact form, comments)
   * 10 requests per hour
   * Used by: Medium, Substack for subscriptions
   */
  MODERATE: {
    max: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests. Please try again later.'
  },
  
  /**
   * Relaxed: For general API usage (search, browse)
   * 100 requests per 15 minutes
   * Used by: Twitter API, GitHub API
   */
  RELAXED: {
    max: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Rate limit exceeded. Please slow down.'
  },
  
  /**
   * Admin: For admin operations (send digest, bulk actions)
   * 3 requests per hour
   * Used by: Most admin panels
   */
  ADMIN: {
    max: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many admin actions. Please wait before trying again.'
  }
} as const

/**
 * Get client IP address from request
 * Handles various proxy headers
 */
export function getClientIp(request: Request): string {
  // Check common proxy headers (in order of preference)
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim()
  }
  
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }
  
  const cfConnectingIp = request.headers.get('cf-connecting-ip') // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp.trim()
  }
  
  // Fallback
  return 'unknown'
}

/**
 * Create rate limit response with proper headers
 * Following standard HTTP 429 response format
 */
export function createRateLimitResponse(result: RateLimitResult) {
  const retryAfter = Math.ceil((result.reset - Date.now()) / 1000)
  
  return NextResponse.json(
    { 
      error: result.message || 'Too many requests',
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset
    },
    { 
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.reset)
      }
    }
  )
}
