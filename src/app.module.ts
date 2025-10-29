import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { AnunciosModule } from './anuncios/anuncio.module';
import { SuscripcionesModule } from './suscripciones/suscripcion.module';
import { MailModule } from './mail/mail.module';
import { User } from './users/user.entity';
import { Anuncio } from './anuncios/anuncio.entity';
import { Suscripcion } from './suscripciones/suscripcion.entity';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().hostname().required(),
        DB_PORT: Joi.number().port().default(3306),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().allow('').required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().min(10).required(),
        JWT_EXPIRES: Joi.string().default('3600s'),
        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.number().default(587),
        MAIL_SECURE: Joi.boolean().default(false),
        MAIL_USER: Joi.string().required(),
        MAIL_PASS: Joi.string().required(),
        APP_URL: Joi.string().uri().required(),
      }),
    }),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 10_000, limit: 5 }] }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        entities: [User, Anuncio, Suscripcion],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    AnunciosModule,
    SuscripcionesModule,
    MailModule,
    HealthModule,
  ],
})
export class AppModule {}
