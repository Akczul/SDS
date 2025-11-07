import { Body, Controller, Delete, Get, Post, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SuscripcionesService } from './suscripcion.service';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('suscripciones')
@Controller('suscripciones')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SuscripcionController {
  constructor(private sus: SuscripcionesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener las suscripciones del usuario autenticado' })
  mis(@Req() req: any) {
    return this.sus.listarPreferencias(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Suscribirse a una categoría' })
  add(@Req() req: any, @Body() dto: CreateSuscripcionDto) {
    return this.sus.suscribirse(req.user.id, dto.categoriaId);
  }

  @Delete()
  @ApiOperation({ summary: 'Desuscribirse de una categoría' })
  remove(@Req() req: any, @Body() dto: CreateSuscripcionDto) {
    return this.sus.desuscribirse(req.user.id, dto.categoriaId);
  }
}
