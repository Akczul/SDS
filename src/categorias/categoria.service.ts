import { Injectable, NotFoundException, InternalServerErrorException, Logger, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriaService {
  private readonly logger = new Logger(CategoriaService.name);

  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,
  ) {}

  async create(dto: CreateCategoriaDto): Promise<Categoria> {
    try {
      // Verificar si ya existe una categoría con ese nombre
      const existing = await this.categoriaRepo.findOne({ 
        where: { nombre: dto.nombre } 
      });

      if (existing) {
        throw new ConflictException(`Ya existe una categoría con el nombre "${dto.nombre}"`);
      }

      const categoria = this.categoriaRepo.create(dto);
      const saved = await this.categoriaRepo.save(categoria);
      this.logger.log(`Categoría creada: ${saved.nombre} (ID: ${saved.id})`);
      return saved;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Error al crear categoría: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al crear la categoría');
    }
  }

  async findAll(): Promise<any> {
    try {
      const categorias = await this.categoriaRepo.find({
        order: { nombre: 'ASC' }
      });

      return {
        items: categorias,
        total: categorias.length,
        message: categorias.length === 0 
          ? 'No hay categorías registradas' 
          : `Se encontraron ${categorias.length} categoría(s)`,
      };
    } catch (error) {
      this.logger.error(`Error al listar categorías: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al obtener las categorías');
    }
  }

  async findOne(id: number): Promise<Categoria> {
    try {
      const categoria = await this.categoriaRepo.findOneBy({ id });
      if (!categoria) {
        throw new NotFoundException(`No se encontró la categoría con ID ${id}`);
      }
      return categoria;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al buscar categoría ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al obtener la categoría');
    }
  }

  async update(id: number, dto: UpdateCategoriaDto): Promise<Categoria> {
    try {
      const categoria = await this.findOne(id);

      // Si se actualiza el nombre, verificar que no exista otra categoría con ese nombre
      if (dto.nombre && dto.nombre !== categoria.nombre) {
        const existing = await this.categoriaRepo.findOne({ 
          where: { nombre: dto.nombre } 
        });
        if (existing) {
          throw new ConflictException(`Ya existe una categoría con el nombre "${dto.nombre}"`);
        }
      }

      Object.assign(categoria, dto);
      const updated = await this.categoriaRepo.save(categoria);
      this.logger.log(`Categoría ${id} actualizada correctamente`);
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Error al actualizar categoría ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al actualizar la categoría');
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const categoria = await this.findOne(id);
      await this.categoriaRepo.remove(categoria);
      this.logger.log(`Categoría ${id} eliminada correctamente`);
      return {
        success: true,
        message: `La categoría "${categoria.nombre}" fue eliminada exitosamente`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Si hay restricción de FK (hay anuncios o suscripciones usando esta categoría)
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException(
          'No se puede eliminar esta categoría porque tiene anuncios o suscripciones asociadas'
        );
      }
      this.logger.error(`Error al eliminar categoría ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al eliminar la categoría');
    }
  }
}
