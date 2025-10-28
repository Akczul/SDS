import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anuncio } from './anuncio.entity';
import { AnuncioController } from './anuncio.controller';
import { AnunciosService } from './anuncio.service';
import { Suscripcion } from '../suscripciones/suscripcion.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Anuncio, Suscripcion]), MailModule],
  controllers: [AnuncioController],
  providers: [AnunciosService],
  exports: [TypeOrmModule],
})
export class AnunciosModule {}
