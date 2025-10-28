import { Suscripcion } from '../suscripciones/suscripcion.entity';
export type UserRole = 'user' | 'admin';
export declare class User {
    id: number;
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    activo: boolean;
    suscripciones: Suscripcion[];
    createdAt: Date;
    updatedAt: Date;
}
