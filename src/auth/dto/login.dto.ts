import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString() @IsNotEmpty() identifier: string; // email o nombreUsuario
  @IsString() @IsNotEmpty() password: string;
}
