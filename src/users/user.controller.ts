import { Controller, Get, Patch, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private users: UsersService) {}

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Obtener un usuario por ID (solo admin)' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.users.findById(id);
    const { passwordHash, ...safeUser } = user as any;
    return safeUser;
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar un usuario (solo admin)' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    const user = await this.users.update(id, dto);
    const { passwordHash, ...safeUser } = user as any;
    return {
      ...safeUser,
      message: 'Usuario actualizado correctamente',
    };
  }
}
