import { BadRequestException, Injectable, UnauthorizedException, InternalServerErrorException, Logger } from '@nestjs/common';
import { UsersService } from '../users/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    try {
      const existsEmail = await this.users.findByEmail(dto.email);
      const existsUser = await this.users.findByUsername(dto.nombreUsuario);
      
      if (existsEmail) {
        throw new BadRequestException('El email ya está registrado');
      }
      if (existsUser) {
        throw new BadRequestException('El nombre de usuario ya está en uso');
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);
      const created = await this.users.create({
        nombre: dto.nombre,
        apellido: dto.apellido,
        nombreUsuario: dto.nombreUsuario,
        email: dto.email,
        passwordHash,
        role: dto.role,
        activo: true,
      });

      this.logger.log(`Usuario registrado: ${created.nombreUsuario}`);

      return { 
        id: created.id, 
        email: created.email, 
        nombreUsuario: created.nombreUsuario,
        message: 'Usuario registrado exitosamente',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error en registro: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al registrar el usuario');
    }
  }

  async login(identifier: string, password: string) {
    try {
      const user = await this.users.findByEmailOrUsername(identifier);
      
      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      if (!user.activo) {
        throw new UnauthorizedException('Tu cuenta está inactiva. Contacta al administrador');
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const payload = { 
        sub: user.id, 
        email: user.email, 
        role: user.role,
        nombreUsuario: user.nombreUsuario,
      };

      const access_token = await this.jwt.signAsync(payload, {
        secret: process.env.JWT_SECRET || 'secret',
        expiresIn: process.env.JWT_EXPIRES || '3600s',
      });

      this.logger.log(`Usuario autenticado: ${user.nombreUsuario}`);

      return { 
        access_token,
        user: {
          id: user.id,
          email: user.email,
          nombreUsuario: user.nombreUsuario,
          nombre: user.nombre,
          apellido: user.apellido,
          role: user.role,
        },
        message: 'Inicio de sesión exitoso',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Error en login: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al iniciar sesión');
    }
  }
}
