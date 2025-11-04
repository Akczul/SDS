import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Suscripcion } from './suscripcion.entity';
import { UsersService } from '../users/user.service';
import { MailService } from '../mail/mail.service';
import { Categoria } from '../categorias/categoria.entity';

@Injectable()
export class SuscripcionesService {
  constructor(
    @InjectRepository(Suscripcion) private repo: Repository<Suscripcion>,
    @InjectRepository(Categoria) private catRepo: Repository<Categoria>,
    private users: UsersService,
    private mail: MailService,
  ) {}

  async suscribirse(userId: number, categoriaId: number) {
    const user = await this.users.findById(userId);
    const categoria = await this.catRepo.findOne({ where: { id: categoriaId } });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');
    const existing = await this.repo.findOne({ where: { user, categoria } });
    if (existing) throw new BadRequestException('Ya estás suscrito a esta categoría');
    const saved = await this.repo.save({ user, categoria });
    await this.mail.enviarConfirmacionSuscripcion(user.email, user.nombre, await this.listarPreferencias(userId));
    return saved;
  }

  async desuscribirse(userId: number, categoriaId: number) {
    const user = await this.users.findById(userId);
    const categoria = await this.catRepo.findOne({ where: { id: categoriaId } });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');
    const existing = await this.repo.findOne({ where: { user, categoria } });
    if (!existing) throw new BadRequestException('No estabas suscrito a esta categoría');
    await this.repo.delete(existing.id);
    await this.mail.enviarConfirmacionSuscripcion(user.email, user.nombre, await this.listarPreferencias(userId));
    return { ok: true };
  }

  listarPreferencias(userId: number) {
    return this.repo.find({ where: { user: { id: userId } }, relations: ['categoria'] });
  }
}
