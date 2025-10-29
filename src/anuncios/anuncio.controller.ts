import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnunciosService } from './anuncio.service';
import { CreateAnuncioDto } from './dto/create-anuncio.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { ListAnunciosQueryDto } from './dto/list-anuncios.dto';

@ApiTags('anuncios')
@Controller('anuncios')
export class AnuncioController {
  constructor(private anuncios: AnunciosService) {}

  @Get()
  getAll(@Query() q: ListAnunciosQueryDto) {
    return this.anuncios.findAllPaged(q);
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.anuncios.findOne(Number(id));
  }

  @Get('mis')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  mis(@Req() req: any) {
    return this.anuncios.listForUser(req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  create(@Body() dto: CreateAnuncioDto) {
    return this.anuncios.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  update(@Param('id') id: number, @Body() dto: Partial<CreateAnuncioDto>) {
    return this.anuncios.update(Number(id), dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  remove(@Param('id') id: number) {
    return this.anuncios.remove(Number(id));
  }
}
