import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const existsEmail = await this.users.findByEmailOrUsername(dto.email);
    const existsUser = await this.users.findByEmailOrUsername(dto.nombreUsuario);
    if (existsEmail || existsUser) throw new BadRequestException('Email o nombreUsuario ya están en uso');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const created = await this.users.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      nombreUsuario: dto.nombreUsuario,
      email: dto.email,
      passwordHash,
      role: dto.role,
      activo: false,
    });
    return { id: created.id, email: created.email, nombreUsuario: created.nombreUsuario };
  }

  async login(identifier: string, password: string) {
    const user = await this.users.findByEmailOrUsername(identifier);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    if (!user.activo) throw new UnauthorizedException('Usuario inactivo');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'secret',
      expiresIn: process.env.JWT_EXPIRES || '3600s',
    });
    return { access_token };
  }
}
