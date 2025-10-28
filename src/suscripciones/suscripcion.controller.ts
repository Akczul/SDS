import { Body, Controller, Delete, Get, Post, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SuscripcionesService } from './suscripcion.service';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';

@Controller('suscripciones')
@UseGuards(JwtAuthGuard)
export class SuscripcionController {
  constructor(private sus: SuscripcionesService) {}

  @Get()
  mis(@Req() req: any) {
    return this.sus.listarPreferencias(req.user.id);
  }

  @Post()
  add(@Req() req: any, @Body() dto: CreateSuscripcionDto) {
    return this.sus.suscribirse(req.user.id, dto.categoria);
  }

  @Delete()
  remove(@Req() req: any, @Body() dto: CreateSuscripcionDto) {
    return this.sus.desuscribirse(req.user.id, dto.categoria);
  }
}
