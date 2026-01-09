/**
 * API Cache Utility
 * Provides caching for API responses with TTL and optimistic loading support
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
  key: string;
  forceRefresh?: boolean;
}

class APICache {
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cached data if available and not expired
   */
  get<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);
      
      // Check if expired
      if (Date.now() > entry.expiresAt) {
        this.delete(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set cache data with TTL
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Delete cached data
   */
  delete(key: string): void {
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * Clear all cached data
   */
  clearAll(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Check if cache exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Fetch with cache - Optimistic loading pattern
   * Returns cached data immediately, then fetches fresh data
   */
  async fetchWithCache<T>(
    options: CacheOptions,
    fetchFn: () => Promise<T>,
    onCachedData?: (data: T) => void
  ): Promise<T> {
    const { key, ttl = this.DEFAULT_TTL, forceRefresh = false } = options;

    // Try to get cached data first (optimistic loading)
    if (!forceRefresh) {
      const cached = this.get<T>(key);
      if (cached && onCachedData) {
        // Immediately return cached data to caller
        onCachedData(cached);
      }
    }

    // Fetch fresh data
    try {
      const freshData = await fetchFn();
      this.set(key, freshData, ttl);
      return freshData;
    } catch (error) {
      // If fetch fails, return cached data if available
      const cached = this.get<T>(key);
      if (cached) {
        console.warn('Using cached data due to fetch error:', error);
        return cached;
      }
      throw error;
    }
  }

  /**
   * Get cache age in milliseconds
   */
  getCacheAge(key: string): number | null {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const entry: CacheEntry<any> = JSON.parse(cached);
      return Date.now() - entry.timestamp;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if cache is stale (older than threshold)
   */
  isStale(key: string, threshold: number = 60000): boolean {
    const age = this.getCacheAge(key);
    return age !== null && age > threshold;
  }
}

export const apiCache = new APICache();
export default apiCache;
