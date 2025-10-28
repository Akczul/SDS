import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { AnunciosModule } from './anuncios/anuncio.module';
import { SuscripcionesModule } from './suscripciones/suscripcion.module';
import { MailModule } from './mail/mail.module';
import { User } from './users/user.entity';
import { Anuncio } from './anuncios/anuncio.entity';
import { Suscripcion } from './suscripciones/suscripcion.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
})
export class AppModule {}
