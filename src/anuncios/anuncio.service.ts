import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Anuncio } from './anuncio.entity';
import { CreateAnuncioDto } from './dto/create-anuncio.dto';
import { MailService } from '../mail/mail.service';
import { Suscripcion } from '../suscripciones/suscripcion.entity';

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

  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOne({ where: { id } }); }

  async update(id: number, dto: Partial<CreateAnuncioDto>) {
    await this.repo.update({ id }, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete({ id });
    return { ok: True };
  }

  listByCategoria(categoria: string) {
    return self.repo.find({ where: { categoria } });
  }
}
