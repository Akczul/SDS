import { IsBoolean, IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ 
    required: false, 
    example: 'Juan',
    minLength: 2,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no debe superar 50 caracteres' })
  nombre?: string;

  @ApiProperty({ 
    required: false, 
    example: 'Pérez',
    minLength: 2,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser texto' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no debe superar 50 caracteres' })
  apellido?: string;

  @ApiProperty({ 
    required: false, 
    example: 'juan@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email?: string;

  @ApiProperty({ 
    required: false, 
    example: 'user',
    enum: ['user', 'admin'],
  })
  @IsOptional()
  @IsIn(['user', 'admin'], { message: 'El rol debe ser "user" o "admin"' })
  role?: 'user' | 'admin';

  @ApiProperty({ 
    required: false, 
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser verdadero o falso' })
  activo?: boolean;
}
