import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { DomainsService } from './domains.service';
import { Exam } from './entities/exam.entity';
import { User } from './entities/user.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true,
      logging: true,
      entities: [User, Exam],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {},
    }),
  ],

  providers: [DomainsService],
  exports: [DomainsService],
})
export class DomainsModule {}
