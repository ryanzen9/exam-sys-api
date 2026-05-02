import { CommonModule } from '@app/common';
import { DomainsModule } from '@app/domains';
import { JwtModule } from '@app/jwt';
import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';

@Module({
  imports: [DomainsModule, CommonModule, JwtModule],
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}
