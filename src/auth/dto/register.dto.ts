import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    example: 'Juan', 
    description: 'Nombre del usuario',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no debe superar 50 caracteres' })
  nombre: string;

  @ApiProperty({ 
    example: 'Pérez', 
    description: 'Apellido del usuario',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'El apellido debe ser texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no debe superar 50 caracteres' })
  apellido: string;

  @ApiProperty({ 
    example: 'juanperez', 
    description: 'Nombre de usuario único (solo letras, números, guion bajo y punto)',
    minLength: 3,
    maxLength: 20,
  })
  @IsString({ message: 'El nombre de usuario debe ser texto' })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
  @MaxLength(20, { message: 'El nombre de usuario no debe superar 20 caracteres' })
  @Matches(/^[a-zA-Z0-9_.]+$/, { 
    message: 'El nombre de usuario solo puede contener letras, números, guion bajo y punto' 
  })
  nombreUsuario: string;

  @ApiProperty({ 
    example: 'juan@example.com', 
    description: 'Email único del usuario',
  })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @ApiProperty({ 
    example: 'Password123!', 
    description: 'Contraseña (mínimo 8 caracteres, debe incluir mayúscula, número y símbolo)',
    minLength: 8,
  })
  @IsString({ message: 'La contraseña debe ser texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/, {
    message: 'La contraseña debe contener al menos una mayúscula, un número y un símbolo',
  })
  password: string;

  @ApiProperty({ 
    example: 'user', 
    description: 'Rol del usuario',
    enum: ['user', 'admin'],
  })
  @IsIn(['user', 'admin'], { message: 'El rol debe ser "user" o "admin"' })
  @IsNotEmpty({ message: 'El rol es obligatorio' })
  role: 'user' | 'admin';
}
