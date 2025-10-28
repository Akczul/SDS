import { SuscripcionesService } from './suscripcion.service';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';
export declare class SuscripcionController {
    private sus;
    constructor(sus: SuscripcionesService);
    mis(req: any): Promise<import("./suscripcion.entity").Suscripcion[]>;
    add(req: any, dto: CreateSuscripcionDto): Promise<{
        user: import("../users/user.entity").User;
        categoria: string;
    } & import("./suscripcion.entity").Suscripcion>;
    remove(req: any, dto: CreateSuscripcionDto): Promise<{
        ok: boolean;
    }>;
}
