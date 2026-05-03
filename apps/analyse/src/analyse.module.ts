import { CommonModule } from '@app/common';
import { DomainsModule } from '@app/domains';
import { JwtModule } from '@app/jwt';
import { RedisModule } from '@app/redis';
import { Module } from '@nestjs/common';
import { AnalyseController } from './analyse.controller';
import { AnalyseService } from './analyse.service';

@Module({
  imports: [CommonModule, RedisModule, DomainsModule, JwtModule],
  controllers: [AnalyseController],
  providers: [AnalyseService],
})
export class AnalyseModule {}
