import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

export const CacheConfig = CacheModule.register({
  store: redisStore,
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  ttl: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL, 10) : 300, // seconds
  max: process.env.CACHE_MAX ? parseInt(process.env.CACHE_MAX, 10) : 100, // maximum number of items in cache
});
