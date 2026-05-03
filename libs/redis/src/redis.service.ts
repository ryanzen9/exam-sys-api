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

  async pipeline(commands: Array<[string, ...any[]]>) {
    const pipeline = this.redisClient.pipeline();
    for (const [command, ...args] of commands) {
      pipeline[command](...args);
    }
    return pipeline.exec();
  }

  async zAdd(key: string, score: number, member: string): Promise<void> {
    await this.redisClient.zadd(key, score, member);
  }

  async zRem(key: string, member: string) {
    await this.redisClient.zrem(key, member);
  }

  async zRange(
    key: string,
    start: number = 0,
    stop: number = -1,
    sort?: 'REV' | 'WITHSCORES',
  ) {
    if (sort === 'REV') {
      return await this.redisClient.zrevrange(key, start, stop);
    }
    if (sort === 'WITHSCORES') {
      return await this.redisClient.zrange(key, start, stop, 'WITHSCORES');
    }
    return await this.redisClient.zrange(key, start, stop);
  }
}
