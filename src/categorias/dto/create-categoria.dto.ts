import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty({ example: 'Tecnología', description: 'Nombre único de la categoría' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre no debe superar 50 caracteres' })
  nombre: string;

  @ApiProperty({ example: 'Categoría para anuncios de tecnología', required: false })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La descripción no debe superar 255 caracteres' })
  descripcion?: string;
}
