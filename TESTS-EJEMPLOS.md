# Ejemplos de Pruebas Unitarias

Este archivo contiene ejemplos de cómo podrían implementarse pruebas unitarias para el sistema.

## Estructura de Pruebas Existente

Ya existen archivos de prueba generados:
- `src/auth/auth.service.spec.ts`
- `src/anuncios/anuncio.service.spec.ts`
- `src/suscripciones/suscripcion.service.spec.ts`
- `test/app.e2e-spec.ts`

## Ejemplo 1: Pruebas de AuthService

```typescript
// src/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    findByEmailOrUsername: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('debe registrar un nuevo usuario exitosamente', async () => {
      const registerDto = {
        nombre: 'Juan',
        apellido: 'Pérez',
        nombreUsuario: 'juanp',
        email: 'juan@example.com',
        password: 'Password123!',
        role: 'user' as const,
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.findByUsername.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({
        id: 1,
        ...registerDto,
        passwordHash: 'hashedpassword',
        activo: true,
      });

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email', registerDto.email);
      expect(result).toHaveProperty('message');
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith(registerDto.nombreUsuario);
    });

    it('debe lanzar BadRequestException si el email ya existe', async () => {
      const registerDto = {
        nombre: 'Juan',
        apellido: 'Pérez',
        nombreUsuario: 'juanp',
        email: 'existente@example.com',
        password: 'Password123!',
        role: 'user' as const,
      };

      mockUsersService.findByEmail.mockResolvedValue({ id: 1, email: registerDto.email });

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
      await expect(service.register(registerDto)).rejects.toThrow('El email ya está registrado');
    });

    it('debe lanzar BadRequestException si el nombreUsuario ya existe', async () => {
      const registerDto = {
        nombre: 'Juan',
        apellido: 'Pérez',
        nombreUsuario: 'existente',
        email: 'juan@example.com',
        password: 'Password123!',
        role: 'user' as const,
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.findByUsername.mockResolvedValue({ id: 1, nombreUsuario: registerDto.nombreUsuario });

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
      await expect(service.register(registerDto)).rejects.toThrow('El nombre de usuario ya está en uso');
    });
  });

  describe('login', () => {
    it('debe autenticar usuario exitosamente', async () => {
      const user = {
        id: 1,
        email: 'juan@example.com',
        nombreUsuario: 'juanp',
        nombre: 'Juan',
        apellido: 'Pérez',
        passwordHash: '$2b$10$hashedpassword',
        role: 'user' as const,
        activo: true,
      };

      mockUsersService.findByEmailOrUsername.mockResolvedValue(user);
      mockJwtService.signAsync.mockResolvedValue('mock-jwt-token');

      // Mock bcrypt.compare
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true);

      const result = await service.login('juanp', 'Password123!');

      expect(result).toHaveProperty('access_token', 'mock-jwt-token');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('message');
    });

    it('debe lanzar UnauthorizedException si el usuario no existe', async () => {
      mockUsersService.findByEmailOrUsername.mockResolvedValue(null);

      await expect(service.login('noexiste', 'password')).rejects.toThrow(UnauthorizedException);
      await expect(service.login('noexiste', 'password')).rejects.toThrow('Credenciales inválidas');
    });

    it('debe lanzar UnauthorizedException si el usuario está inactivo', async () => {
      const user = {
        id: 1,
        email: 'inactivo@example.com',
        activo: false,
      };

      mockUsersService.findByEmailOrUsername.mockResolvedValue(user);

      await expect(service.login('inactivo@example.com', 'password')).rejects.toThrow(UnauthorizedException);
      await expect(service.login('inactivo@example.com', 'password')).rejects.toThrow('Tu cuenta está inactiva');
    });

    it('debe lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      const user = {
        id: 1,
        email: 'juan@example.com',
        passwordHash: '$2b$10$hashedpassword',
        activo: true,
      };

      mockUsersService.findByEmailOrUsername.mockResolvedValue(user);
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(false);

      await expect(service.login('juan@example.com', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    });
  });
});
```

## Ejemplo 2: Pruebas de SuscripcionesService

```typescript
// src/suscripciones/suscripcion.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { SuscripcionesService } from './suscripcion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Suscripcion } from './suscripcion.entity';
import { Categoria } from '../categorias/categoria.entity';
import { UsersService } from '../users/user.service';
import { MailService } from '../mail/mail.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('SuscripcionesService', () => {
  let service: SuscripcionesService;

  const mockSuscripcionRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockCategoriaRepo = {
    findOne: jest.fn(),
  };

  const mockUsersService = {
    findById: jest.fn(),
  };

  const mockMailService = {
    enviarConfirmacionSuscripcion: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuscripcionesService,
        { provide: getRepositoryToken(Suscripcion), useValue: mockSuscripcionRepo },
        { provide: getRepositoryToken(Categoria), useValue: mockCategoriaRepo },
        { provide: UsersService, useValue: mockUsersService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<SuscripcionesService>(SuscripcionesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('suscribirse', () => {
    it('debe suscribir usuario a categoría exitosamente', async () => {
      const user = { id: 1, email: 'user@example.com', nombre: 'Usuario' };
      const categoria = { id: 1, nombre: 'Tecnología' };

      mockUsersService.findById.mockResolvedValue(user);
      mockCategoriaRepo.findOne.mockResolvedValue(categoria);
      mockSuscripcionRepo.findOne.mockResolvedValue(null);
      mockSuscripcionRepo.create.mockReturnValue({ user, categoria });
      mockSuscripcionRepo.save.mockResolvedValue({ id: 1, user, categoria });
      mockSuscripcionRepo.find.mockResolvedValue([{ id: 1, categoria }]);

      const result = await service.suscribirse(1, 1);

      expect(result).toHaveProperty('message');
      expect(result.message).toContain('Tecnología');
      expect(mockMailService.enviarConfirmacionSuscripcion).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si la categoría no existe', async () => {
      const user = { id: 1, email: 'user@example.com', nombre: 'Usuario' };

      mockUsersService.findById.mockResolvedValue(user);
      mockCategoriaRepo.findOne.mockResolvedValue(null);

      await expect(service.suscribirse(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar BadRequestException si ya está suscrito', async () => {
      const user = { id: 1, email: 'user@example.com', nombre: 'Usuario' };
      const categoria = { id: 1, nombre: 'Tecnología' };

      mockUsersService.findById.mockResolvedValue(user);
      mockCategoriaRepo.findOne.mockResolvedValue(categoria);
      mockSuscripcionRepo.findOne.mockResolvedValue({ id: 1, user, categoria });

      await expect(service.suscribirse(1, 1)).rejects.toThrow(BadRequestException);
      await expect(service.suscribirse(1, 1)).rejects.toThrow('Ya estás suscrito');
    });
  });

  describe('listarPreferencias', () => {
    it('debe retornar lista vacía con mensaje si no hay suscripciones', async () => {
      mockSuscripcionRepo.find.mockResolvedValue([]);

      const result = await service.listarPreferencias(1);

      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.message).toContain('No tienes suscripciones activas');
    });

    it('debe retornar suscripciones con mensaje', async () => {
      const suscripciones = [
        { id: 1, categoria: { nombre: 'Tecnología' } },
        { id: 2, categoria: { nombre: 'Deportes' } },
      ];

      mockSuscripcionRepo.find.mockResolvedValue(suscripciones);

      const result = await service.listarPreferencias(1);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.message).toContain('2 suscripción(es) activa(s)');
    });
  });
});
```

## Ejemplo 3: Pruebas E2E de Autenticación

```typescript
// test/auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('debe registrar un nuevo usuario', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          nombre: 'Test',
          apellido: 'User',
          nombreUsuario: `testuser_${Date.now()}`,
          email: `test_${Date.now()}@example.com`,
          password: 'Test123!',
          role: 'user',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email');
          expect(res.body).toHaveProperty('message');
        });
    });

    it('debe rechazar registro con contraseña débil', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          nombre: 'Test',
          apellido: 'User',
          nombreUsuario: 'testuser2',
          email: 'test2@example.com',
          password: '123',
          role: 'user',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBeInstanceOf(Array);
        });
    });
  });

  describe('/auth/login (POST)', () => {
    let createdUser: any;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          nombre: 'Login',
          apellido: 'Test',
          nombreUsuario: `logintest_${Date.now()}`,
          email: `login_${Date.now()}@example.com`,
          password: 'Login123!',
          role: 'user',
        });
      createdUser = response.body;
    });

    it('debe autenticar usuario con credenciales válidas', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identifier: createdUser.email,
          password: 'Login123!',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('email', createdUser.email);
        });
    });

    it('debe rechazar login con contraseña incorrecta', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identifier: createdUser.email,
          password: 'WrongPassword123!',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('Credenciales inválidas');
        });
    });
  });

  describe('/auth/perfil (GET)', () => {
    let token: string;

    beforeAll(async () => {
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          nombre: 'Perfil',
          apellido: 'Test',
          nombreUsuario: `perfiltest_${Date.now()}`,
          email: `perfil_${Date.now()}@example.com`,
          password: 'Perfil123!',
          role: 'user',
        });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identifier: registerResponse.body.email,
          password: 'Perfil123!',
        });

      token = loginResponse.body.access_token;
    });

    it('debe obtener perfil con token válido', () => {
      return request(app.getHttpServer())
        .get('/auth/perfil')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('email');
          expect(res.body).toHaveProperty('nombre');
          expect(res.body).not.toHaveProperty('passwordHash');
        });
    });

    it('debe rechazar acceso sin token', () => {
      return request(app.getHttpServer())
        .get('/auth/perfil')
        .expect(401);
    });
  });
});
```

## Comandos para Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas unitarias
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:cov

# Ejecutar pruebas E2E
npm run test:e2e
```

## Configuración de Jest

El archivo `jest.config.js` ya está configurado:

```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
```

## Notas Importantes

1. **Mocks**: Usa mocks para dependencias externas (repositorios, servicios)
2. **Aislamiento**: Cada prueba debe ser independiente
3. **Clean Up**: Limpia datos de prueba después de cada test
4. **Coverage**: Apunta a >80% de cobertura de código
5. **Casos Edge**: Prueba casos límite y errores

## Recursos Adicionales

- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest](https://github.com/visionmedia/supertest)
