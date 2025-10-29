import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAnuncioDto {
  @IsString() @IsNotEmpty() @MinLength(3) @MaxLength(100) titulo: string;
  @IsString() @IsNotEmpty() @MinLength(1) @MaxLength(5000) contenido: string;
  @IsString() @IsNotEmpty() @MinLength(3) @MaxLength(50) categoria: string;
}
