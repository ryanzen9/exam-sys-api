import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AnswerController {
  @Inject('EXAM_SERVICE')
  private readonly examService: ClientProxy;

  @Get('sum')
  getExamSum() {
    return this.examService.send({ cmd: 'get_exam_sum' }, [1, 2, 3]);
  }
}
