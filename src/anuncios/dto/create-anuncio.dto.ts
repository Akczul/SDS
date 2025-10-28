import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnuncioDto {
  @IsString() @IsNotEmpty() titulo: string;
  @IsString() @IsNotEmpty() contenido: string;
  @IsString() @IsNotEmpty() categoria: string;
}
