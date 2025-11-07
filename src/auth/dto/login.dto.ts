import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    example: 'usuario123', 
    description: 'Email o nombre de usuario',
  })
  @IsString({ message: 'El identificador debe ser texto' })
  @IsNotEmpty({ message: 'El identificador es obligatorio' })
  identifier: string;

  @ApiProperty({ 
    example: 'Password123!', 
    description: 'Contraseña del usuario',
    minLength: 1,
  })
  @IsString({ message: 'La contraseña debe ser texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(1, { message: 'La contraseña no puede estar vacía' })
  password: string;
}
