import { NacosService } from '@app/nacos';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const nacosService = app.get(NacosService);
  await nacosService.registry('user-service', {
    ip: process.env.SERVICE_HOST || 'localhost',
    instanceId: process.env.INSTANCE_ID || 'default-instance-id',
    port: parseInt(process.env.PORT ?? '3001', 10),
    weight: 1,
    healthy: true,
    enabled: true,
  });

  process.on('SIGINT', () => {
    return nacosService.deregisterInstance('user-service', {
      ip: process.env.SERVICE_HOST || 'localhost',
      instanceId: process.env.INSTANCE_ID || 'default-instance-id',
      port: parseInt(process.env.PORT ?? '3001', 10),
      weight: 1,
      healthy: true,
      enabled: true,
    });
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
