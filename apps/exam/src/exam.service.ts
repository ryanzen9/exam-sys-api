import { Exam, ExamStatus } from '@app/domains/entities/exam.entity';
import { User } from '@app/domains/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { CreateExamDto, ExamListQueryDto, UpdateExamDto } from './exam.dto';

@Injectable()
export class ExamService {
  private readonly examRepo: Repository<Exam>;

  private readonly userRepo: Repository<User>;

  constructor(private readonly entityManager: EntityManager) {
    this.examRepo = this.entityManager.getRepository(Exam);
    this.userRepo = this.entityManager.getRepository(User);
  }

  async save(userId: number, createExamDto: CreateExamDto) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const exam = new Exam();
    exam.name = createExamDto.name;
    exam.content = createExamDto.content;
    exam.isPublish = createExamDto.isPublish || ExamStatus.Unpublished;
    exam.creator = user;

    await this.examRepo.save(exam);

    return exam;
  }

  async update(id: number, updateExamDto: UpdateExamDto) {
    const exam = await this.examRepo.findOneBy({ id });

    if (!exam) {
      throw new Error('Exam not found');
    }

    exam.name = updateExamDto.name || exam.name;
    exam.content = updateExamDto.content || exam.content;

    await this.examRepo.save(exam);

    return exam;
  }

  async delete(id: number) {
    const result = await this.examRepo.update(id, {
      is_deleted: true,
    });

    if (result.affected === 0) {
      throw new Error('Exam not found');
    }

    return id;
  }

  async publish(id: number) {
    const result = await this.examRepo.update(id, {
      isPublish: ExamStatus.Published,
    });

    if (result.affected === 0) {
      throw new Error('Exam not found');
    }

    const exam = await this.examRepo.findOneBy({ id });

    return exam;
  }

  async unpublish(id: number) {
    const result = await this.examRepo.update(id, {
      isPublish: ExamStatus.Unpublished,
    });

    if (result.affected === 0) {
      throw new Error('Exam not found');
    }

    const exam = await this.examRepo.findOneBy({ id });

    return exam;
  }

  async findAll(query: ExamListQueryDto) {
    const { page = 1, pageSize = 10 } = query;

    const [exams, total] = await this.examRepo.findAndCount({
      where: {
        is_deleted: false,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data: exams,
      total,
      page,
      pageSize,
    };
  }
}
