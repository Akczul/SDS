import { IsNotEmpty, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuscripcionDto {
  @ApiProperty({ example: 1, description: 'ID de la categoría a suscribirse' })
  @IsInt({ message: 'El id de categoría debe ser un número' })
  @IsPositive({ message: 'El id de categoría debe ser positivo' })
  @IsNotEmpty({ message: 'El id de categoría es obligatorio' })
  categoriaId: number;
}
