import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Anuncios y Suscripciones')
    .setDescription('API para anuncios, suscripciones y autenticación')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
  console.log('Server running on http://localhost:3000');
  console.log('Swagger docs at http://localhost:3000/docs');
}
bootstrap();
