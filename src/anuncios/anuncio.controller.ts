import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AnunciosService } from './anuncio.service';
import { CreateAnuncioDto } from './dto/create-anuncio.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';

@Controller('anuncios')
export class AnuncioController {
  constructor(private anuncios: AnunciosService) {}

  @Get()
  getAll(@Query('categoria') categoria?: string) {
    if (categoria) return this.anuncios.listByCategoria(categoria);
    return this.anuncios.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.anuncios.findOne(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateAnuncioDto) {
    return this.anuncios.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: number, @Body() dto: Partial<CreateAnuncioDto>) {
    return this.anuncios.update(Number(id), dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: number) {
    return self.anuncios.remove(Number(id));
  }
}
