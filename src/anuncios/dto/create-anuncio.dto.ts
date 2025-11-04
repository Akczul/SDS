import { IsNotEmpty, IsString, MaxLength, MinLength, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnuncioDto {
  @ApiProperty({ example: 'Oferta de empleo', minLength: 3, maxLength: 100 })
  @IsString({ message: 'El título debe ser texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El título no debe superar 100 caracteres' })
  titulo: string;

  @ApiProperty({ example: 'Se busca desarrollador...', minLength: 1, maxLength: 5000 })
  @IsString({ message: 'El contenido debe ser texto' })
  @IsNotEmpty({ message: 'El contenido es obligatorio' })
  @MinLength(1, { message: 'El contenido no puede estar vacío' })
  @MaxLength(5000, { message: 'El contenido no debe superar 5000 caracteres' })
  contenido: string;

  @ApiProperty({ example: 1, description: 'ID de la categoría a la que pertenece el anuncio' })
  @IsInt({ message: 'El id de categoría debe ser un número' })
  @IsPositive({ message: 'El id de categoría debe ser positivo' })
  categoriaId: number;
}
