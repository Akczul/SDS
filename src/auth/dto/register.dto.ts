import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString() @IsNotEmpty() nombre: string;
  @IsString() @IsNotEmpty() apellido: string;
  @IsString() @IsNotEmpty() nombreUsuario: string;
  @IsEmail() email: string;
  @IsString() @MinLength(8) @Matches(/(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/, {
    message: 'La contraseña debe tener mayúscula, número y símbolo',
  }) password: string;
  @IsIn(['user', 'admin']) role: 'user' | 'admin';
}
