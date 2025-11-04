import { Test } from '@nestjs/testing';
import { SuscripcionesService } from './suscripcion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Suscripcion } from './suscripcion.entity';
import { Categoria } from '../categorias/categoria.entity';
import { UsersService } from '../users/user.service';
import { MailService } from '../mail/mail.service';
import { BadRequestException } from '@nestjs/common';

describe('SuscripcionesService', () => {
  let service: SuscripcionesService;
  const repoMock = {
    findOne: jest.fn(),
    save: jest.fn(async (x) => ({ id: 1, ...x })),
    delete: jest.fn(async () => undefined),
    find: jest.fn(async () => []),
  };
  const catRepoMock = {
    findOne: jest.fn(),
  };
  const usersMock = {
    findById: jest.fn(async (id) => ({ id, email: 'u@mail.com', nombre: 'U' })),
  } as unknown as UsersService;
  const mailMock = {
    enviarConfirmacionSuscripcion: jest.fn(async () => undefined),
  } as unknown as MailService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SuscripcionesService,
        { provide: getRepositoryToken(Suscripcion), useValue: repoMock },
        { provide: getRepositoryToken(Categoria), useValue: catRepoMock },
        { provide: UsersService, useValue: usersMock },
        { provide: MailService, useValue: mailMock },
      ],
    }).compile();
    service = moduleRef.get(SuscripcionesService);
    jest.clearAllMocks();
  });

  it('suscribirse crea preferencia si no existe y envia confirmación', async () => {
    const categoriaMock: Categoria = { id: 5, nombre: 'Tec', descripcion: 'desc', createdAt: new Date(), updatedAt: new Date() };
    catRepoMock.findOne.mockResolvedValueOnce(categoriaMock);
    repoMock.findOne.mockResolvedValueOnce(null);
    const res = await service.suscribirse(1, 5);
    expect(res).toMatchObject({ id: 1, categoria: categoriaMock });
    // @ts-ignore
    expect(mailMock.enviarConfirmacionSuscripcion).toHaveBeenCalledTimes(1);
  });

  it('suscribirse falla si ya existe', async () => {
    const categoriaMock: Categoria = { id: 5, nombre: 'Tec', descripcion: 'desc', createdAt: new Date(), updatedAt: new Date() };
    catRepoMock.findOne.mockResolvedValueOnce(categoriaMock);
    repoMock.findOne.mockResolvedValueOnce({ id: 2, categoria: categoriaMock });
    await expect(service.suscribirse(1, 5)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('desuscribirse elimina si existe y envia confirmación', async () => {
    const categoriaMock: Categoria = { id: 5, nombre: 'Tec', descripcion: 'desc', createdAt: new Date(), updatedAt: new Date() };
    catRepoMock.findOne.mockResolvedValueOnce(categoriaMock);
    repoMock.findOne.mockResolvedValueOnce({ id: 2, categoria: categoriaMock });
    const res = await service.desuscribirse(1, 5);
    expect(res).toEqual({ ok: true });
    // @ts-ignore
    expect(mailMock.enviarConfirmacionSuscripcion).toHaveBeenCalledTimes(1);
  });
});
