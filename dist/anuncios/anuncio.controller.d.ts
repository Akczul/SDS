import { AnunciosService } from './anuncio.service';
import { CreateAnuncioDto } from './dto/create-anuncio.dto';
export declare class AnuncioController {
    private anuncios;
    constructor(anuncios: AnunciosService);
    getAll(categoria?: string): Promise<import("./anuncio.entity").Anuncio[]>;
    getOne(id: number): Promise<import("./anuncio.entity").Anuncio>;
    create(dto: CreateAnuncioDto): Promise<import("./anuncio.entity").Anuncio>;
    update(id: number, dto: Partial<CreateAnuncioDto>): Promise<import("./anuncio.entity").Anuncio>;
    remove(id: number): Promise<{
        ok: boolean;
    }>;
}
