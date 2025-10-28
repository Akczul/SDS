import { Repository } from 'typeorm';
import { Anuncio } from './anuncio.entity';
import { CreateAnuncioDto } from './dto/create-anuncio.dto';
import { MailService } from '../mail/mail.service';
import { Suscripcion } from '../suscripciones/suscripcion.entity';
export declare class AnunciosService {
    private repo;
    private susRepo;
    private mail;
    constructor(repo: Repository<Anuncio>, susRepo: Repository<Suscripcion>, mail: MailService);
    create(dto: CreateAnuncioDto): Promise<Anuncio>;
    findAll(): Promise<Anuncio[]>;
    findOne(id: number): Promise<Anuncio>;
    update(id: number, dto: Partial<CreateAnuncioDto>): Promise<Anuncio>;
    remove(id: number): Promise<{
        ok: boolean;
    }>;
    listByCategoria(categoria: string): Promise<Anuncio[]>;
}
