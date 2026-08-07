import Redis from 'ioredis';

// Fallback in-memory cache if Redis server is unavailable in dev environment
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

let redisClient: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (process.env.REDIS_URL && !redisClient) {
    try {
      redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 1,
        lazyConnect: true,
        connectTimeout: 2000,
      });
      redisClient.on('error', (err) => {
        console.warn('[Redis Connection Warning] Using fallback in-memory cache:', err.message);
      });
    } catch {
      redisClient = null;
    }
  }
  return redisClient;
}

/**
 * Cache string token with expiration TTL (in seconds)
 */
export async function cacheSet(key: string, value: string, ttlSeconds: number = 3300): Promise<void> {
  const client = getRedisClient();
  if (client) {
    try {
      await client.set(key, value, 'EX', ttlSeconds);
      return;
    } catch {
      // Fallback
    }
  }
  
  // In-memory fallback
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Get cached string token
 */
export async function cacheGet(key: string): Promise<string | null> {
  const client = getRedisClient();
  if (client) {
    try {
      const val = await client.get(key);
      if (val) return val;
    } catch {
      // Fallback
    }
  }

  const item = memoryCache.get(key);
  if (item) {
    if (Date.now() < item.expiresAt) {
      return item.value;
    }
    memoryCache.delete(key);
  }

  return null;
}

/**
 * Delete key from cache
 */
export async function cacheDel(key: string): Promise<void> {
  const client = getRedisClient();
  if (client) {
    try {
      await client.del(key);
    } catch {
      // Fallback
    }
  }
  memoryCache.delete(key);
}
