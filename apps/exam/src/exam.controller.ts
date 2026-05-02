import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ExamService } from './exam.service';

@Controller()
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get()
  getHello(): string {
    return this.examService.getHello();
  }

  @MessagePattern({ cmd: 'get_exam_sum' })
  getExamSum(data: Array<number>) {
    return data.reduce((a, b) => a + b, 0);
  }
}
