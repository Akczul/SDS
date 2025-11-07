import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
  constructor(
    @InjectRepository(Anuncio) private readonly repo: Repository<Anuncio>,
    @InjectRepository(Suscripcion) private readonly susRepo: Repository<Suscripcion>,
    @InjectRepository(Categoria) private readonly catRepo: Repository<Categoria>, 
    private readonly mail: MailService,
  ) {}

  async create(dto: CreateAnuncioDto) {
    const categoria = await this.catRepo.findOne({ where: { id: dto.categoriaId } });
    if (!categoria) throw new BadRequestException('La categoría especificada no existe');
    const anuncio = this.repo.create({
      titulo: dto.titulo,
      contenido: dto.contenido,
      categoria,
      fechaPublicacion: new Date(),
    });
    const saved = await this.repo.save(anuncio);

    // Notificar a suscriptores de la categoría
    const suscriptores = await this.susRepo.find({ where: { categoria: { id: categoria.id } }, relations: ['user'] });
    await Promise.all(
      suscriptores.map(s => this.mail.enviarNuevoAnuncio(s.user.email, s.user.nombre, saved))
    );

    return saved;
  }

  async findAllPaged(q: ListAnunciosQueryDto) {
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
    };
  }
  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['categoria'] });
  }

  async update(id: number, dto: UpdateAnuncioDto) {
    const anuncio = await this.findOne(id);
    if (!anuncio) throw new NotFoundException('Anuncio no encontrado');
    if (dto.categoriaId) {
      const categoria = await this.catRepo.findOne({ where: { id: dto.categoriaId } });
      if (!categoria) throw new BadRequestException('La categoría especificada no existe');
      anuncio.categoria = categoria;
    }
    if (dto.titulo) anuncio.titulo = dto.titulo;
    if (dto.contenido) anuncio.contenido = dto.contenido;
    return this.repo.save(anuncio);
  }

  async remove(id: number) {
    await this.repo.delete({ id });
    return { ok: true };
  }

  listByCategoria(categoriaId: number) {
    return this.repo.find({ where: { categoria: { id: categoriaId } }, relations: ['categoria'] });
  }

  async listForUser(userId: number) {
  const sus = await this.susRepo.find({ where: { user: { id: userId } } });
  if (!sus.length) return [];

  const categoriaIds = sus.map(s => s.categoria.id);
  return this.repo.find({
    where: { categoria: { id: In(categoriaIds) } }, // Filtro de id's
    order: { fechaPublicacion: 'DESC' },
    relations: ['categoria'],
  });
  }
}
