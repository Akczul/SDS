import { Body, Controller, Delete, Get, Post, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SuscripcionesService } from './suscripcion.service';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('suscripciones')
@Controller('suscripciones')
@UseGuards(JwtAuthGuard)
export class SuscripcionController {
  constructor(private sus: SuscripcionesService) {}

  @Get()
  @ApiBearerAuth()
  mis(@Req() req: any) {
    return this.sus.listarPreferencias(req.user.id);
  }

  @Post()
  @ApiBearerAuth()
  add(@Req() req: any, @Body() dto: CreateSuscripcionDto) {
    return this.sus.suscribirse(req.user.id, dto.categoriaId);
  }

  @Delete()
  @ApiBearerAuth()
  remove(@Req() req: any, @Body() dto: CreateSuscripcionDto) {
    return this.sus.desuscribirse(req.user.id, dto.categoriaId);
  }
}
