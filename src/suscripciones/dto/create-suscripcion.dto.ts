import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSuscripcionDto {
  @IsString() @IsNotEmpty() categoria: string;
}
