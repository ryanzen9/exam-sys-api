import { RedisService } from '@app/redis';
import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Answer } from '../../../libs/domains/src/entities/answer.entity';
import { RankingItemDto } from './analyse.dto';

@Injectable()
export class AnalyseService {
  @Inject()
  private readonly redisService: RedisService;

  private readonly answerRepo: Repository<Answer>;

  constructor(private readonly entityManager: EntityManager) {
    this.answerRepo = this.entityManager.getRepository(Answer);
  }

  // 排名
  async ranking(examId?: number) {
    const rankKey = examId ? `ranking:${examId}` : `ranking`;
    const rankList: { answerId: number; score: number; rank: number }[] = [];

    // 从 Redis 中获取排名数据
    const rankingData = await this.redisService.zRange(rankKey);

    if (!rankingData) {
      // 如果 Redis 中没有排名数据，则计算排名并存储到 Redis 中
      const answer = await this.answerRepo.find();
      const ranking = await this.computeRanking(answer, examId);
      rankList.push(...ranking);
    } else {
      // 返回从 Redis 中获取的排名数据
      const ranking = await this.rank(rankKey, 0, -1);
      rankList.push(...ranking);
    }

    const data: RankingItemDto[] = [];

    for (const item of rankList) {
      const answer = await this.answerRepo.findOne({
        where: { id: item.answerId },
        relations: ['user', 'exam'],
      });

      if (answer) {
        data.push({
          rank: item.rank,
          userId: answer.user.id,
          username: answer.user.username,
          nickName: answer.user.nickName,
          score: item.score,
          examName: answer.exam.name,
        });
      }
    }

    return {
      data,
      total: data.length,
    };
  }

  private async computeRanking(answers: Answer[], examId?: number) {
    // 1. 参数验证
    if (!answers || answers.length === 0) {
      return [];
    }

    // 2. 确定排名 key
    const rankKey = examId ? `ranking:${examId}` : `ranking`;

    // 3. 批量更新排名数据
    const commands: Array<[string, ...any[]]> = answers.map((answer) => [
      'zadd',
      rankKey,
      answer.score,
      answer.id.toString(),
    ]);
    await this.redisService.pipeline(commands);

    return this.rank(rankKey, 0, -1);
  }

  private async rank(rankKey: string, start: number, stop: number) {
    const rankings = await this.redisService.zRange(
      rankKey,
      start,
      stop,
      'WITHSCORES',
    );
    return this.formatRankingResult(rankings);
  }

  private formatRankingResult(
    rankings: string[],
  ): { answerId: number; score: number; rank: number }[] {
    const result: { answerId: number; score: number; rank: number }[] = [];
    for (let i = 0; i < rankings.length; i += 2) {
      result.push({
        answerId: parseInt(rankings[i]),
        score: parseFloat(rankings[i + 1]),
        rank: i / 2 + 1,
      });
    }
    return result;
  }
}
