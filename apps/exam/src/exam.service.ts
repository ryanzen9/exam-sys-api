import { Exam, ExamStatus } from '@app/domains/entities/exam.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { CreateExamDto, ExamListQueryDto, UpdateExamDto } from './exam.dto';

@Injectable()
export class ExamService {
  private readonly examRepo: Repository<Exam>;

  constructor(private readonly entityManager: EntityManager) {
    this.examRepo = this.entityManager.getRepository(Exam);
  }

  async save(createExamDto: CreateExamDto) {
    const exam = await this.examRepo.save(createExamDto);

    return exam;
  }

  async update(id: number, updateExamDto: UpdateExamDto) {
    const result = await this.examRepo.update(id, updateExamDto);

    if (result.affected === 0) {
      throw new Error('Exam not found');
    }

    const exam = await this.examRepo.findOneBy({ id });

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
