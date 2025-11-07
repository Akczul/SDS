import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suscripcion } from './suscripcion.entity';
import { SuscripcionController } from './suscripcion.controller';
import { SuscripcionesService } from './suscripcion.service';
import { UsersModule } from '../users/user.module';
import { MailModule } from '../mail/mail.module';
import { Categoria } from '../categorias/categoria.entity';  

@Module({
  imports: [
    TypeOrmModule.forFeature([Suscripcion, Categoria]),  
    UsersModule,
    MailModule,
  ],
  controllers: [SuscripcionController],
  providers: [SuscripcionesService],
  exports: [SuscripcionesService],  
})
export class SuscripcionesModule {}

