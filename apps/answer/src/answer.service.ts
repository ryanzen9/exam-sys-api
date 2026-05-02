import { Answer, AnswerStatus } from '@app/domains/entities/answer.entity';
import { Exam } from '@app/domains/entities/exam.entity';
import { User } from '@app/domains/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import {
  AnswerListQueryDto,
  BeginAnswerDto,
  SubmitAnswerDto,
} from './answer.dto';

@Injectable()
export class AnswerService {
  private readonly answerRepo: Repository<Answer>;

  private readonly examRepo: Repository<Exam>;

  private readonly userRepo: Repository<User>;

  constructor(private readonly entityManager: EntityManager) {
    this.answerRepo = this.entityManager.getRepository(Answer);
    this.examRepo = this.entityManager.getRepository(Exam);
    this.userRepo = this.entityManager.getRepository(User);
  }

  async beginAnswer(
    userId: number,
    beginAnswerDto: BeginAnswerDto,
  ): Promise<Answer> {
    const exam = await this.examRepo.findOneBy({ id: beginAnswerDto.examId });

    if (!exam) {
      throw new Error('Exam not found');
    }

    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user) {
      throw new Error('User not found');
    }

    const answer = new Answer({
      exam,
      user,
    });

    const savedAnswer = await this.answerRepo.save(answer);

    return savedAnswer;
  }

  async submitAnswer(
    id: number,
    submitAnswerDto: SubmitAnswerDto,
  ): Promise<Answer> {
    const answer = await this.answerRepo.findOneBy({ id });

    if (!answer) {
      throw new Error('Answer not found');
    }

    answer.content = submitAnswerDto.content;
    answer.status = AnswerStatus.Submitted;

    // 执行自动改卷的逻辑
    answer.score = await this.calculateScore(answer);

    const savedAnswer = await this.answerRepo.save(answer);

    return savedAnswer;
  }

  async getAnswerList(
    userId: number,
    query: AnswerListQueryDto,
  ): Promise<{
    data: Answer[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { page = 1, pageSize = 10 } = query;

    const [data, total] = await this.answerRepo.findAndCount({
      where: {
        user: { id: userId },
        exam: { id: query.examId },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  private async calculateScore(answer: Answer): Promise<number> {
    // 这里是一个简单的示例，实际的评分逻辑可能会更复杂
    let score = 0;

    const exam = await this.examRepo.findOneBy({ id: answer.exam.id });

    const examContent = exam?.content;
    if (!examContent) {
      return score;
    }

    for (const content of examContent) {
      const no = content.no;

      const userAnswer = answer.content.find((c) => c.no === no);

      if (!userAnswer) {
        continue;
      }

      if (content.type === 'single-choice' || content.type === 'true-false') {
        if (userAnswer.answer === content.answer) {
          score += content.points;
        }
      } else if (content.type === 'multiple-choice') {
        const correctAnswers = content.answer as string[];
        const userAnswers = userAnswer.answer as string[];

        const isCorrect =
          correctAnswers.length === userAnswers.length &&
          correctAnswers.every((a) => userAnswers.includes(a));

        if (isCorrect) {
          score += content.points;
        }
      }
    }

    return score;
  }
}
