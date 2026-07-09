import { Request, Response, NextFunction } from 'express';
import { redisClient } from '@database/redis.js';

const DEFAULT_CACHE_TTL = 60;

interface CacheOptions {
  ttl?: number;
  key?: string;
}

export const cacheMiddleware = (options: CacheOptions = {}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    if (!redisClient?.isOpen) {
      return next();
    }

    try {
      const cacheKey = options.key || `cache:${req.originalUrl}:${req.user?.tenantId || 'public'}`;
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      const originalJson = res.json.bind(res);
      res.json = (body: unknown) => {
        if (res.statusCode === 200) {
          redisClient.setex(
            cacheKey,
            options.ttl || DEFAULT_CACHE_TTL,
            JSON.stringify(body)
          ).catch(() => {});
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      next();
    }
  };
};

export const clearCache = async (pattern: string) => {
  if (!redisClient?.isOpen) {
    return;
  }

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  } catch (error) {}
};
