import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn(async () => 'hashed'),
  compare: jest.fn(async () => true),
}));

describe('AuthService', () => {
  let service: AuthService;
  const usersMock = {
    findByEmailOrUsername: jest.fn(),
    create: jest.fn(),
  };
  const jwtMock = {
    signAsync: jest.fn(async () => 'token'),
  } as unknown as JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();
    service = moduleRef.get(AuthService);
    jest.clearAllMocks();
  });

  it('rechaza login si usuario no existe', async () => {
    usersMock.findByEmailOrUsername.mockResolvedValueOnce(null);
    await expect(service.login('nope', 'x')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rechaza login si usuario inactivo', async () => {
    usersMock.findByEmailOrUsername.mockResolvedValueOnce({ id: 1, email: 'a', role: 'user', activo: false, passwordHash: 'h' });
    await expect(service.login('a', 'x')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('emite token si credenciales correctas y activo', async () => {
    usersMock.findByEmailOrUsername.mockResolvedValueOnce({ id: 1, email: 'a', role: 'user', activo: true, passwordHash: 'h' });
    const res = await service.login('a', 'x');
    expect(res).toHaveProperty('access_token', 'token');
  });
});
