import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './env/env';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:3333',
      'https://pharma-web-s3mo.vercel.app',
      'https://webpharma.vercel.app',
    ],
    credentials: true,
  });

  const configService = app.get<ConfigService<Env, true>>(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Pharma API')
    .setDescription('API para gerenciamento de medicamentos e movimentações')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  await app.listen(port, '0.0.0.0');
}

bootstrap();
