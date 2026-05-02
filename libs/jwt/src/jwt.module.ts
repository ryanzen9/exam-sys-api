import { Global, Module } from '@nestjs/common';
import { JwtModule as JwtSourceModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtSourceModule.register({
      secret: 'your_secret_key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  exports: [JwtSourceModule],
})
export class JwtModule {}
