import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength, Matches, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsString() @IsNotEmpty() @MinLength(2) @MaxLength(50) nombre: string;
  @IsString() @IsNotEmpty() @MinLength(2) @MaxLength(50) apellido: string;
  @IsString() @IsNotEmpty() @MinLength(3) @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_.]+$/, { message: 'nombreUsuario solo puede contener letras, números, guion bajo y punto' })
  nombreUsuario: string;
  @IsEmail() email: string;
  @IsString() @MinLength(8) @Matches(/(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/, {
    message: 'La contraseña debe tener mayúscula, número y símbolo',
  }) password: string;
  @IsIn(['user', 'admin']) role: 'user' | 'admin';
}
