import { CommonModule } from '@app/common';
import { DomainsModule } from '@app/domains';
import { EmailModule } from '@app/email';
import { JwtModule } from '@app/jwt';
import { NacosModule } from '@app/nacos';
import { RedisModule } from '@app/redis';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    DomainsModule,
    JwtModule,
    CommonModule,
    EmailModule,
    RedisModule,
    NacosModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
