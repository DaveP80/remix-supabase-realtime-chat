import Redis from 'ioredis';
// Create Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
// Example functions for common Redis operations
export async function setCache(key: string, value: any, ttl?: number) {
    const serialized = JSON.stringify(value);
    if (ttl) {
        await redis.setex(key, ttl, serialized);
    } else {
        await redis.set(key, serialized);
    }
}

export async function getCache<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
}
export { redis };

export async function removeFromCache(key: string) {
    await redis.del(key);
}