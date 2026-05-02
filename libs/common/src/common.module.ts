import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CommonService } from './common.service';
import { AuthGuard } from './guards/auth.guard';

@Module({
  providers: [
    CommonService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [CommonService],
})
export class CommonModule {}
