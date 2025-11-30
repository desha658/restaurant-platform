import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsInt()
  id: number;
  @IsOptional()
  @IsString()
  name: string;
}
