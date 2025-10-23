import { defineMiddleware } from 'astro:middleware';

// Vercel Edge Middleware for performance optimization
export const onRequest = defineMiddleware(async ({ request, locals }, next) => {
  try {
    // Add Vercel edge context to locals
    if (import.meta.env.VERCEL_ENV === 'production') {
      locals.vercel = {
        edge: {
          geo: request.headers.get('x-vercel-ip-country') || undefined,
          ip: request.headers.get('x-real-ip') || undefined,
          city: request.headers.get('x-vercel-ip-city') || undefined,
          region: request.headers.get('x-vercel-ip-region') || undefined,
        }
      };
    }

    // Security headers
    const response = await next();
    
    // Add security headers for Vercel
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // Content Security Policy for movie streaming sites
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self' https:; connect-src 'self' https://phimapi.com https://wsrv.nl;"
    );
    
    // Cache headers for static assets
    const url = new URL(request.url);
    if (url.pathname.startsWith('/_astro/') || url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
    
    // Cache headers for images
    if (url.pathname.includes('/images/') || url.pathname.includes('/_vercel/image')) {
      response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    }

    // Cache headers for API routes
    if (url.pathname.startsWith('/api/')) {
      response.headers.set('Cache-Control', 'public, max-age=7200, stale-while-revalidate=86400');
    }
    
    // Cache headers for server islands
    if (url.pathname.includes('/_server-islands/')) {
      response.headers.set('Cache-Control', 'public, max-age=14400, stale-while-revalidate=86400');
    }

    return response;
  } catch (error) {
    // Log error and return a fallback response
    console.error('Middleware error:', error);
    
    // Return a basic response if next() fails
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
});