import { IsIn, IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ListAnunciosQueryDto {
  @ApiProperty({ 
    required: false, 
    description: 'ID de la categoría para filtrar',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La categoría debe ser un número entero' })
  @IsPositive({ message: 'La categoría debe ser un número positivo' })
  categoria?: number;

  @ApiProperty({ 
    required: false, 
    description: 'Número de página',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(1, { message: 'La página debe ser al menos 1' })
  page?: number = 1;

  @ApiProperty({ 
    required: false, 
    description: 'Cantidad de elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero' })
  @IsPositive({ message: 'El límite debe ser positivo' })
  @Max(100, { message: 'El límite máximo es 100' })
  limit?: number = 10;

  @ApiProperty({ 
    required: false, 
    description: 'Campo por el cual ordenar',
    example: 'fechaPublicacion',
    enum: ['fechaPublicacion', 'createdAt'],
  })
  @IsOptional()
  @IsIn(['fechaPublicacion', 'createdAt'], { 
    message: 'El campo de ordenamiento debe ser "fechaPublicacion" o "createdAt"' 
  })
  sortBy?: 'fechaPublicacion' | 'createdAt' = 'fechaPublicacion';

  @ApiProperty({ 
    required: false, 
    description: 'Dirección del ordenamiento',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'], { 
    message: 'La dirección debe ser "ASC" o "DESC"' 
  })
  sortDir?: 'ASC' | 'DESC' = 'DESC';
}
