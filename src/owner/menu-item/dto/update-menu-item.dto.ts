import { PartialType } from '@nestjs/mapped-types';
import {
  CreateMenuItemDto,
  transformToBoolean,
  transformToNumber,
  transformToNumberArray,
} from './create-menu-item.dto';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {
  @Transform(transformToNumber)
  @IsNotEmpty()
  @IsInt()
  id: number;
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Transform(transformToNumber)
  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Transform(transformToBoolean)
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @Transform(transformToNumberArray)
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  menuIds?: number[];

  @Transform(transformToNumber)
  @IsOptional()
  @IsInt()
  subCategoryId?: number;
}
