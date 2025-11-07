import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suscripcion } from './suscripcion.entity';
import { SuscripcionController } from './suscripcion.controller';
import { SuscripcionesService } from './suscripcion.service';
import { UsersModule } from '../users/user.module';
import { MailModule } from '../mail/mail.module';
import { CategoriaModule } from '../categorias/categoria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Suscripcion]),
    UsersModule,
    CategoriaModule,
    MailModule,
  ],
  controllers: [SuscripcionController],
  providers: [SuscripcionesService],
  exports: [TypeOrmModule],
})
export class SuscripcionesModule {}
