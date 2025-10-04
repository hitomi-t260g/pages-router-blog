import type { BlogHookError, CacheEntry } from "./types";

/**
 * Utility functions for blog hooks
 */

/**
 * Parse error from Contentful API response
 * @param error The error object
 * @returns Standardized error type
 */
export function parseContentfulError(error: unknown): BlogHookError {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes("network") || message.includes("fetch")) {
      return "NETWORK_ERROR";
    }

    if (
      message.includes("rate limit") ||
      message.includes("too many requests")
    ) {
      return "RATE_LIMITED";
    }

    if (message.includes("not found") || message.includes("404")) {
      return "NOT_FOUND";
    }

    if (message.includes("parse") || message.includes("json")) {
      return "PARSING_ERROR";
    }
  }

  return "API_ERROR";
}

/**
 * Simple cache implementation for hook data
 */
class SimpleCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  set(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: new Date(),
      ttl,
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp.getTime() > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const isExpired = Date.now() - entry.timestamp.getTime() > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

// Export singleton cache instances
export const blogListCache = new SimpleCache();
export const blogPostCache = new SimpleCache();
