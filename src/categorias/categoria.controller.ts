import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('categorias')
@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva categoría (solo admin)' })
  create(@Body() dto: CreateCategoriaDto) {
    return this.categoriaService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las categorías (público)' })
  findAll() {
    return this.categoriaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por ID (público)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una categoría (solo admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoriaDto) {
    return this.categoriaService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una categoría (solo admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.remove(id);
  }
}
