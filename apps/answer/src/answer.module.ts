import { CommonModule } from '@app/common';
import { DomainsModule } from '@app/domains';
import { JwtModule } from '@app/jwt';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';

@Module({
  imports: [
    DomainsModule,
    CommonModule,
    JwtModule,
    ClientsModule.register([
      {
        name: 'EXAM_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 8000,
        },
      },
    ]),
  ],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
