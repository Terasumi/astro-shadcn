// Cache utilities for API responses
export interface CacheConfig {
  maxAge: number; // seconds
  staleWhileRevalidate: number; // seconds
}

export const CACHE_CONFIGS = {
  SECTION_DATA: {
    maxAge: 7200, // 2 hours
    staleWhileRevalidate: 86400, // 24 hours
  },
  MOVIE_DETAIL: {
    maxAge: 14400, // 4 hours
    staleWhileRevalidate: 86400, // 24 hours
  },
  SEARCH_RESULTS: {
    maxAge: 3600, // 1 hour
    staleWhileRevalidate: 7200, // 2 hours
  }
} as const;

export function getCacheHeaders(config: CacheConfig) {
  return {
    "Cache-Control": `public, max-age=${config.maxAge}, s-maxage=${config.maxAge * 3}, stale-while-revalidate=${config.staleWhileRevalidate}`,
  };
}

// Astro-specific cache utilities for SSR
export function getAstroCacheHeaders() {
  return {
    "CDN-Cache-Control": "public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400",
  };
}