import { IsIn, IsInt, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class ListAnunciosQueryDto {
  @IsOptional() @IsString() categoria?: string;
  @IsOptional() @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @IsInt() @IsPositive() @Max(100) limit?: number = 10;
  @IsOptional() @IsIn(['fechaPublicacion', 'createdAt']) sortBy?: 'fechaPublicacion' | 'createdAt' = 'fechaPublicacion';
  @IsOptional() @IsIn(['ASC', 'DESC']) sortDir?: 'ASC' | 'DESC' = 'DESC';
}
