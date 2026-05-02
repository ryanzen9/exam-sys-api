import { Inject, Injectable } from '@nestjs/common';
import 'dotenv/config';
import Redis from 'ioredis';
@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private readonly redisClient: Redis;

  async set(key: string, value: string, expire?: number): Promise<void> {
    if (expire) {
      await this.redisClient.set(key, value, 'EX', expire);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
