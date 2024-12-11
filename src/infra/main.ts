import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = configService.get<number>('PORT', 3333)

  const config = new DocumentBuilder()
    .setTitle('Pharma API')
    .setDescription('API para gerenciamento de medicamentos e movimentações')
    .setVersion('1.0')
    .addBearerAuth() // Suporte para autenticação JWT no Swagger
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  console.log(`🚀 Application is running on: http://localhost:${port}`)
  await app.listen(port)
}

bootstrap()
