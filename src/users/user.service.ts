import { Injectable, NotFoundException, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findByEmailOrUsername(identifier: string): Promise<User | null> {
    try {
      return await this.repo.findOne({ 
        where: [{ email: identifier }, { nombreUsuario: identifier }] 
      });
    } catch (error) {
      this.logger.error(`Error al buscar usuario por identificador: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al buscar el usuario');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.repo.findOne({ where: { email } });
    } catch (error) {
      this.logger.error(`Error al buscar usuario por email: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al buscar el usuario');
    }
  }

  async findByUsername(nombreUsuario: string): Promise<User | null> {
    try {
      return await this.repo.findOne({ where: { nombreUsuario } });
    } catch (error) {
      this.logger.error(`Error al buscar usuario por nombre de usuario: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al buscar el usuario');
    }
  }

  async findById(id: number): Promise<User> {
    try {
      const user = await this.repo.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`No se encontró el usuario con ID ${id}`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al buscar usuario por ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al buscar el usuario');
    }
  }

  async create(user: Partial<User>): Promise<User> {
    try {
      const entity = this.repo.create(user);
      const saved = await this.repo.save(entity);
      this.logger.log(`Usuario creado: ${saved.nombreUsuario} (ID: ${saved.id})`);
      return saved;
    } catch (error) {
      this.logger.error(`Error al crear usuario: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findById(id);
      
      // Si se actualiza el email, verificar que no exista
      if (dto.email && dto.email !== user.email) {
        const existingEmail = await this.findByEmail(dto.email);
        if (existingEmail) {
          throw new BadRequestException('El email ya está en uso');
        }
      }

      await this.repo.update({ id }, dto);
      this.logger.log(`Usuario ${id} actualizado correctamente`);
      return this.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error al actualizar usuario ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }
}
