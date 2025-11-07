import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anuncio } from './anuncio.entity';
import { AnuncioController } from './anuncio.controller';
import { AnunciosService } from './anuncio.service';
import { Suscripcion } from '../suscripciones/suscripcion.entity';
import { Categoria } from '../categorias/categoria.entity';  
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Anuncio, Suscripcion, Categoria]), MailModule],  
  controllers: [AnuncioController],
  providers: [AnunciosService],
  exports: [AnunciosService], // opcionalmente exporta el servicio (más útil que exportar TypeOrmModule)
})
export class AnunciosModule {}
