interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // time to live in milliseconds
}

class Cache {
  private storage: Map<string, CacheItem<any>> = new Map();
  
  // Set cache with TTL (default 5 minutes)
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.storage.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  // Get from cache if not expired
  get<T>(key: string): T | null {
    const item = this.storage.get(key);
    
    if (!item) {
      this.trackMiss();
      return null;
    }
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.storage.delete(key);
      this.trackMiss();
      return null;
    }
    
    this.trackHit();
    return item.data;
  }

  private trackHit(): void {
    const hits = parseInt(localStorage.getItem('cache_hits') || '0') + 1;
    localStorage.setItem('cache_hits', hits.toString());
  }

  private trackMiss(): void {
    const misses = parseInt(localStorage.getItem('cache_misses') || '0') + 1;
    localStorage.setItem('cache_misses', misses.toString());
  }
  
  // Clear expired items
  cleanup(): void {
    const now = Date.now();
    this.storage.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        this.storage.delete(key);
      }
    });
  }
  
  // Clear all cache
  clear(): void {
    this.storage.clear();
  }

  // Clear cache by pattern
  clearByPattern(pattern: string): number {
    let cleared = 0;
    this.storage.forEach((_, key) => {
      if (key.includes(pattern)) {
        this.storage.delete(key);
        cleared++;
      }
    });
    return cleared;
  }

  // Clear user-specific cache
  clearUserCache(userId: number): number {
    return this.clearByPattern(`_user_${userId}`);
  }
  
  // Get cache size
  size(): number {
    return this.storage.size;
  }
}

export const recommendationCache = new Cache();

// Auto cleanup every 10 minutes
setInterval(() => {
  recommendationCache.cleanup();
}, 10 * 60 * 1000); 