import { Test } from '@nestjs/testing';
import { SuscripcionesService } from './suscripcion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Suscripcion } from './suscripcion.entity';
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
        { provide: UsersService, useValue: usersMock },
        { provide: MailService, useValue: mailMock },
      ],
    }).compile();
    service = moduleRef.get(SuscripcionesService);
    jest.clearAllMocks();
  });

  it('suscribirse crea preferencia si no existe y envia confirmación', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);
    const res = await service.suscribirse(1, 'Tec');
    expect(res).toMatchObject({ id: 1, categoria: 'Tec' });
    // @ts-ignore
    expect(mailMock.enviarConfirmacionSuscripcion).toHaveBeenCalledTimes(1);
  });

  it('suscribirse falla si ya existe', async () => {
    repoMock.findOne.mockResolvedValueOnce({ id: 2, categoria: 'Tec' });
    await expect(service.suscribirse(1, 'Tec')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('desuscribirse elimina si existe y envia confirmación', async () => {
    repoMock.findOne.mockResolvedValueOnce({ id: 2, categoria: 'Tec' });
    const res = await service.desuscribirse(1, 'Tec');
    expect(res).toEqual({ ok: true });
    // @ts-ignore
    expect(mailMock.enviarConfirmacionSuscripcion).toHaveBeenCalledTimes(1);
  });
});
