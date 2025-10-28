import { Repository } from 'typeorm';
import { Suscripcion } from './suscripcion.entity';
import { UsersService } from '../users/user.service';
import { MailService } from '../mail/mail.service';
export declare class SuscripcionesService {
    private repo;
    private users;
    private mail;
    constructor(repo: Repository<Suscripcion>, users: UsersService, mail: MailService);
    suscribirse(userId: number, categoria: string): Promise<{
        user: import("../users/user.entity").User;
        categoria: string;
    } & Suscripcion>;
    desuscribirse(userId: number, categoria: string): Promise<{
        ok: boolean;
    }>;
    listarPreferencias(userId: number): Promise<Suscripcion[]>;
}
