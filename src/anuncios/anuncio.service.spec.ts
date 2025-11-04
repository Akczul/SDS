import { Test } from '@nestjs/testing';
import { AnunciosService } from './anuncio.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Anuncio } from './anuncio.entity';
import { Categoria } from '../categorias/categoria.entity';
import { Suscripcion } from '../suscripciones/suscripcion.entity';
import { MailService } from '../mail/mail.service';

describe('AnunciosService', () => {
  let service: AnunciosService;
  const repoMock = {
    create: jest.fn((x) => x),
    save: jest.fn(async (x) => ({ id: 1, ...x })),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const susRepoMock = {
    find: jest.fn(),
  };
  const catRepoMock = {
    findOne: jest.fn(),
  };
  const mailMock = {
    enviarNuevoAnuncio: jest.fn(async () => undefined),
  } as unknown as MailService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AnunciosService,
        { provide: getRepositoryToken(Anuncio), useValue: repoMock },
        { provide: getRepositoryToken(Suscripcion), useValue: susRepoMock },
        { provide: getRepositoryToken(Categoria), useValue: catRepoMock },
        { provide: MailService, useValue: mailMock },
      ],
    }).compile();
    service = moduleRef.get(AnunciosService);
    jest.clearAllMocks();
  });

  it('crea anuncio y notifica a suscriptores de la categoría', async () => {
    // Mock de categoría existente
    const categoriaMock: Categoria = { id: 5, nombre: 'Tec', descripcion: 'desc', createdAt: new Date(), updatedAt: new Date() };
    catRepoMock.findOne.mockResolvedValueOnce(categoriaMock);
    susRepoMock.find.mockResolvedValueOnce([
      { user: { email: 'u1@mail.com', nombre: 'U1' }, categoria: 'Tec' },
      { user: { email: 'u2@mail.com', nombre: 'U2' }, categoria: 'Tec' },
    ]);
    const dto = { titulo: 'T', contenido: 'C', categoriaId: 5 };
    const saved = await service.create(dto);
    expect(saved).toMatchObject({ id: 1, titulo: 'T', contenido: 'C', categoria: categoriaMock });
    expect(susRepoMock.find).toHaveBeenCalledWith({ where: { categoria: categoriaMock.nombre }, relations: ['user'] });
    // mail enviado 2 veces
    // @ts-ignore
    expect(mailMock.enviarNuevoAnuncio).toHaveBeenCalledTimes(2);
  });
});
