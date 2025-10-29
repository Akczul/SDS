import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findByEmailOrUsername(identifier: string) {
    return this.repo.findOne({ where: [{ email: identifier }, { nombreUsuario: identifier }] });
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findByUsername(nombreUsuario: string) {
    return this.repo.findOne({ where: { nombreUsuario } });
  }

  async findById(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async create(user: Partial<User>) {
    const entity = this.repo.create(user);
    return this.repo.save(entity);
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.repo.update({ id }, dto);
    return this.findById(id);
  }
}
