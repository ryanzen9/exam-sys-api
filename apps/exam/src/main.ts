import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExamModule } from './exam.module';

async function bootstrap() {
  const app = await NestFactory.create(ExamModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Exam System API')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 8000,
    },
  });
  app.startAllMicroservices();

  await app.listen(process.env.port ?? 3000);
  console.log(
    `Exam service is running on http://localhost:${process.env.port ?? 3000}`,
  );
}
bootstrap();
