import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Anuncio } from './anuncio.entity';
import { CreateAnuncioDto } from './dto/create-anuncio.dto';
import { UpdateAnuncioDto } from './dto/update-anuncio.dto';
import { Categoria } from '../categorias/categoria.entity';
import { MailService } from '../mail/mail.service';
import { Suscripcion } from '../suscripciones/suscripcion.entity';
import { ListAnunciosQueryDto } from './dto/list-anuncios.dto';

@Injectable()
export class AnunciosService {
  private readonly logger = new Logger(AnunciosService.name);

  constructor(
    @InjectRepository(Anuncio) private repo: Repository<Anuncio>,
    @InjectRepository(Suscripcion) private susRepo: Repository<Suscripcion>,
    @InjectRepository(Categoria) private catRepo: Repository<Categoria>,
    private mail: MailService,
  ) {}

  async create(dto: CreateAnuncioDto) {
    try {
      const categoria = await this.catRepo.findOne({ where: { id: dto.categoriaId } });
      if (!categoria) {
        throw new BadRequestException(`La categoría con ID ${dto.categoriaId} no existe`);
      }

      const anuncio = this.repo.create({
        titulo: dto.titulo,
        contenido: dto.contenido,
        categoria,
        fechaPublicacion: new Date(),
      });
      
      const saved = await this.repo.save(anuncio);
      this.logger.log(`Anuncio creado: ID ${saved.id}, Categoría: ${categoria.nombre}`);

      // Notificar a suscriptores de la categoría
      const suscriptores = await this.susRepo.find({ 
        where: { categoria: { id: categoria.id } }, 
        relations: ['user'] 
      });

      if (suscriptores.length > 0) {
        this.logger.log(`Enviando notificaciones a ${suscriptores.length} suscriptores`);
        await Promise.allSettled(
          suscriptores.map(s => this.mail.enviarNuevoAnuncio(s.user.email, s.user.nombre, saved))
        );
      }

      return saved;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error al crear anuncio: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al crear el anuncio');
    }
  }

  async findAllPaged(q: ListAnunciosQueryDto) {
    try {
      const page = q.page ?? 1;
      const limit = q.limit ?? 10;
      const where: any = q.categoria ? { categoria: { id: q.categoria } } : {};
      
      const [items, total] = await this.repo.findAndCount({
        where,
        order: { [q.sortBy ?? 'fechaPublicacion']: q.sortDir ?? 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        relations: ['categoria'],
      });

      return {
        items,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 1,
        message: items.length === 0 
          ? 'No se encontraron anuncios con los criterios especificados' 
          : `Se encontraron ${total} anuncio(s)`,
      };
    } catch (error) {
      this.logger.error(`Error al listar anuncios: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al obtener la lista de anuncios');
    }
  }

  async findOne(id: number) {
    try {
      const anuncio = await this.repo.findOne({ where: { id }, relations: ['categoria'] });
      if (!anuncio) {
        throw new NotFoundException(`No se encontró el anuncio con ID ${id}`);
      }
      return anuncio;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al buscar anuncio ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al obtener el anuncio');
    }
  }

  async update(id: number, dto: UpdateAnuncioDto) {
    try {
      const anuncio = await this.findOne(id);
      
      if (dto.categoriaId) {
        const categoria = await this.catRepo.findOne({ where: { id: dto.categoriaId } });
        if (!categoria) {
          throw new BadRequestException(`La categoría con ID ${dto.categoriaId} no existe`);
        }
        anuncio.categoria = categoria;
      }
      
      if (dto.titulo !== undefined) anuncio.titulo = dto.titulo;
      if (dto.contenido !== undefined) anuncio.contenido = dto.contenido;
      
      const updated = await this.repo.save(anuncio);
      this.logger.log(`Anuncio ${id} actualizado correctamente`);
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error al actualizar anuncio ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al actualizar el anuncio');
    }
  }

  async remove(id: number) {
    try {
      const anuncio = await this.findOne(id);
      await this.repo.remove(anuncio);
      this.logger.log(`Anuncio ${id} eliminado correctamente`);
      return { 
        success: true, 
        message: `El anuncio con ID ${id} fue eliminado exitosamente` 
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al eliminar anuncio ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al eliminar el anuncio');
    }
  }

  async listByCategoria(categoriaId: number) {
    try {
      const categoria = await this.catRepo.findOne({ where: { id: categoriaId } });
      if (!categoria) {
        throw new NotFoundException(`La categoría con ID ${categoriaId} no existe`);
      }

      const anuncios = await this.repo.find({ 
        where: { categoria: { id: categoriaId } }, 
        relations: ['categoria'],
        order: { fechaPublicacion: 'DESC' }
      });

      return {
        items: anuncios,
        total: anuncios.length,
        categoria: categoria.nombre,
        message: anuncios.length === 0 
          ? `No hay anuncios en la categoría "${categoria.nombre}"` 
          : `Se encontraron ${anuncios.length} anuncio(s) en "${categoria.nombre}"`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al listar anuncios por categoría ${categoriaId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al obtener anuncios de la categoría');
    }
  }

  async listForUser(userId: number) {
    try {
      const suscripciones = await this.susRepo.find({ 
        where: { user: { id: userId } },
        relations: ['categoria']
      });

      if (suscripciones.length === 0) {
        return {
          items: [],
          total: 0,
          message: 'No estás suscrito a ninguna categoría. Suscríbete para recibir anuncios.',
        };
      }

      const categoriaIds = suscripciones.map(s => s.categoria.id);
      const anuncios = await this.repo.find({ 
        where: { categoria: { id: In(categoriaIds) } }, 
        order: { fechaPublicacion: 'DESC' }, 
        relations: ['categoria'] 
      });

      return {
        items: anuncios,
        total: anuncios.length,
        categoriasSubscritas: suscripciones.map(s => s.categoria.nombre),
        message: anuncios.length === 0 
          ? 'No hay anuncios nuevos en tus categorías suscritas' 
          : `Se encontraron ${anuncios.length} anuncio(s) en tus categorías suscritas`,
      };
    } catch (error) {
      this.logger.error(`Error al listar anuncios para usuario ${userId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al obtener tus anuncios');
    }
  }
}
