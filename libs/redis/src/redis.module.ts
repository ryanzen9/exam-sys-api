import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const client = new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT
            ? parseInt(process.env.REDIS_PORT)
            : 6379,
          password: process.env.REDIS_PASSWORD,
          db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 0,
          retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
        });

        client.on('connect', () => {
          console.log('Redis 连接成功');
        });

        client.on('error', (err) => {
          console.error('Redis 连接错误:', err);
        });

        return client;
      },
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
