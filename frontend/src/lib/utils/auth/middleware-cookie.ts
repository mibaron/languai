import { NextRequest } from 'next/server'

export const AUTH_TOKEN_COOKIE_KEY = 'at' // stands for Auth Token

/**
 * Get user token from cookies in middleware
 * This function is specifically designed to work in Next.js middleware
 */
export function getUserTokenFromRequest(req: NextRequest): string | undefined {
  const cookie = req.cookies.get(AUTH_TOKEN_COOKIE_KEY)
  return cookie?.value
}
