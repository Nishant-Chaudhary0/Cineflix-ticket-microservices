import Redis from 'ioredis';
import logger from '../utils/logger.js';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || 6379,
  db: 0,

  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },

  reconnectOnError(err) {
    return err.message.includes('READONLY');
  },

  lazyConnect: true,
});

redis.on('connect', () => logger.info('Redis Connected'));
redis.on('error', (err) => logger.error('Redis error:', err));

export default redis;