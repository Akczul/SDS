import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/http-exception.filter';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // CORS (si es necesario)
  app.enableCors();

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Anuncios y Suscripciones')
    .setDescription(
      'API REST para gestión de anuncios por categorías con sistema de suscripciones y notificaciones por correo electrónico',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Endpoints de autenticación y registro')
    .addTag('users', 'Gestión de usuarios (admin)')
    .addTag('categorias', 'Gestión de categorías')
    .addTag('anuncios', 'Gestión de anuncios')
    .addTag('suscripciones', 'Gestión de suscripciones de usuarios')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
  console.log('🚀 Server running on http://localhost:3000');
  console.log('📘 Swagger docs at http://localhost:3000/docs');
}
bootstrap();
