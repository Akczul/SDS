import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private users: UsersService) {}

  @Get(':id')
  @Roles('admin')
  @ApiBearerAuth()
  findOne(@Param('id') id: number) {
    return this.users.findById(Number(id));
  }

  @Patch(':id')
  @Roles('admin')
  @ApiBearerAuth()
  update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.users.update(Number(id), dto);
  }
}
