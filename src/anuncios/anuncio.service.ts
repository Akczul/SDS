import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Anuncio } from './anuncio.entity';
import { CreateAnuncioDto } from './dto/create-anuncio.dto';
import { MailService } from '../mail/mail.service';
import { Suscripcion } from '../suscripciones/suscripcion.entity';
import { ListAnunciosQueryDto } from './dto/list-anuncios.dto';

@Injectable()
export class AnunciosService {
  constructor(
    @InjectRepository(Anuncio) private repo: Repository<Anuncio>,
    @InjectRepository(Suscripcion) private susRepo: Repository<Suscripcion>,
    private mail: MailService,
  ) {}

  async create(dto: CreateAnuncioDto) {
    const anuncio = this.repo.create({ ...dto, fechaPublicacion: new Date() });
    const saved = await this.repo.save(anuncio);

    const suscriptores = await this.susRepo.find({ where: { categoria: saved.categoria }, relations: ['user'] });
    await Promise.all(
      suscriptores.map(s => this.mail.enviarNuevoAnuncio(s.user.email, s.user.nombre, saved))
    );

    return saved;
  }

  async findAllPaged(q: ListAnunciosQueryDto) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 10;
    const where: any = q.categoria ? { categoria: q.categoria } : {};
    const [items, total] = await this.repo.findAndCount({
      where,
      order: { [q.sortBy ?? 'fechaPublicacion']: q.sortDir ?? 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 1,
    };
  }
  findOne(id: number) { return this.repo.findOne({ where: { id } }); }

  async update(id: number, dto: Partial<CreateAnuncioDto>) {
    await this.repo.update({ id }, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete({ id });
    return { ok: true };
  }

  listByCategoria(categoria: string) {
    return this.repo.find({ where: { categoria } });
  }

  async listForUser(userId: number) {
    const sus = await this.susRepo.find({ where: { user: { id: userId } } });
    const categorias = sus.map(s => s.categoria);
    if (categorias.length === 0) return [];
    return this.repo.find({ where: { categoria: In(categorias) }, order: { fechaPublicacion: 'DESC' } });
  }
}
