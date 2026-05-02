import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AnswerModule } from './answer.module';

async function bootstrap() {
  const app = await NestFactory.create(AnswerModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Exam System API')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(process.env.port ?? 3002);
}
bootstrap();
