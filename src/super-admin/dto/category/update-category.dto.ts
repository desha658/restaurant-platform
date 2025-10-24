import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsInt()
  id: number;
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  restaurantIds?: number[];
}
