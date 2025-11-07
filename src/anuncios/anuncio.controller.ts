import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnunciosService } from './anuncio.service';
import { CreateAnuncioDto } from './dto/create-anuncio.dto';
import { UpdateAnuncioDto } from './dto/update-anuncio.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { ListAnunciosQueryDto } from './dto/list-anuncios.dto';

@ApiTags('anuncios')
@Controller('anuncios')
export class AnuncioController {
  constructor(private anuncios: AnunciosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los anuncios con paginación (público)' })
  getAll(@Query() q: ListAnunciosQueryDto) {
    return this.anuncios.findAllPaged(q);
  }

  @Get('mis-anuncios')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener anuncios de categorías suscritas por el usuario autenticado' })
  mis(@Req() req: any) {
    return this.anuncios.listForUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un anuncio por ID (público)' })
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.anuncios.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo anuncio (solo admin)' })
  create(@Body() dto: CreateAnuncioDto) {
    return this.anuncios.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un anuncio (solo admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAnuncioDto) {
    return this.anuncios.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un anuncio (solo admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.anuncios.remove(id);
  }
}
