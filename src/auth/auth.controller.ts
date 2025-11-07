import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../users/user.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private users: UsersService) {}

  @Post('register')
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Iniciar sesión con email o nombre de usuario' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.identifier, dto.password);
  }

  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
  async perfil(@Req() req: any) {
    const user = await this.users.findById(req.user.id);
    const { passwordHash, ...safeUser } = user as any;
    return {
      ...safeUser,
      message: 'Perfil obtenido correctamente',
    };
  }
}
