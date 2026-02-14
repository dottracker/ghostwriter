import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create the Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Define the limit: 10 requests every 10 seconds per IP
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
});

export default async function middleware(request: NextRequest) {
  // 1. Try to get IP from the built-in helper
  // 2. If that fails, try the Vercel 'x-forwarded-for' header
  // 3. If that fails, try 'x-real-ip'
  // 4. Finally, fallback to a local string
  const ip = 
    (request as any).ip || 
    request.headers.get('x-forwarded-for')?.split(',')[0] || 
    request.headers.get('x-real-ip') || 
    "127.0.0.1";

  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return new NextResponse(
      JSON.stringify({ 
        error: "Too many requests.", 
        message: "The Library is currently busy. Please wait a moment before requesting another scroll." 
      }),
      { 
        status: 429, 
        headers: { 
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        } 
      }
    );
  }

  return NextResponse.next();
}
// Only apply rate limiting to the main pages and posts
export const config = {
  matcher: ['/', '/post/:path*'],
};