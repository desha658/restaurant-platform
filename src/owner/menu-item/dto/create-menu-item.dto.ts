import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsInt,
  IsArray,
} from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean = true;
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  menuIds?: number[];

  @IsOptional()
  @IsInt()
  subCategoryId?: number;
}
