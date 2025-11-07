import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Suscripcion } from './suscripcion.entity';
import { UsersService } from '../users/user.service';
import { MailService } from '../mail/mail.service';
import { Categoria } from '../categorias/categoria.entity';

@Injectable()
export class SuscripcionesService {
  private readonly logger = new Logger(SuscripcionesService.name);

  constructor(
    @InjectRepository(Suscripcion) private repo: Repository<Suscripcion>,
    @InjectRepository(Categoria) private catRepo: Repository<Categoria>,
    private users: UsersService,
    private mail: MailService,
  ) {}

  async suscribirse(userId: number, categoriaId: number) {
    try {
      const user = await this.users.findById(userId);
      const categoria = await this.catRepo.findOne({ where: { id: categoriaId } });
      
      if (!categoria) {
        throw new NotFoundException(`La categoría con ID ${categoriaId} no existe`);
      }

      const existing = await this.repo.findOne({ 
        where: { user: { id: userId }, categoria: { id: categoriaId } } 
      });

      if (existing) {
        throw new BadRequestException(`Ya estás suscrito a la categoría "${categoria.nombre}"`);
      }

      const suscripcion = this.repo.create({ user, categoria });
      const saved = await this.repo.save(suscripcion);
      
      this.logger.log(`Usuario ${userId} suscrito a categoría ${categoria.nombre}`);
      
      const preferencias = await this.listarPreferencias(userId);
      await this.mail.enviarConfirmacionSuscripcion(
        user.email, 
        user.nombre, 
        preferencias.items
      );

      return {
        ...saved,
        message: `Te has suscrito exitosamente a la categoría "${categoria.nombre}"`,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error al suscribir usuario ${userId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al procesar la suscripción');
    }
  }

  async desuscribirse(userId: number, categoriaId: number) {
    try {
      const user = await this.users.findById(userId);
      const categoria = await this.catRepo.findOne({ where: { id: categoriaId } });
      
      if (!categoria) {
        throw new NotFoundException(`La categoría con ID ${categoriaId} no existe`);
      }

      const existing = await this.repo.findOne({ 
        where: { user: { id: userId }, categoria: { id: categoriaId } } 
      });

      if (!existing) {
        throw new BadRequestException(`No estás suscrito a la categoría "${categoria.nombre}"`);
      }

      await this.repo.remove(existing);
      this.logger.log(`Usuario ${userId} desuscrito de categoría ${categoria.nombre}`);

      const preferencias = await this.listarPreferencias(userId);
      await this.mail.enviarConfirmacionSuscripcion(
        user.email, 
        user.nombre, 
        preferencias.items
      );

      return { 
        success: true, 
        message: `Te has desuscrito exitosamente de la categoría "${categoria.nombre}"` 
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error al desuscribir usuario ${userId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al procesar la desuscripción');
    }
  }

  async listarPreferencias(userId: number) {
    try {
      const suscripciones = await this.repo.find({ 
        where: { user: { id: userId } }, 
        relations: ['categoria'] 
      });

      return {
        items: suscripciones,
        total: suscripciones.length,
        message: suscripciones.length === 0 
          ? 'No tienes suscripciones activas' 
          : `Tienes ${suscripciones.length} suscripción(es) activa(s)`,
      };
    } catch (error) {
      this.logger.error(`Error al listar preferencias usuario ${userId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al obtener tus suscripciones');
    }
  }
}
