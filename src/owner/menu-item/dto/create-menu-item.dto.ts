import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsInt,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';

export const transformToNumber = ({ value }: { value: any }) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
};

export const transformToBoolean = ({ value }: { value: any }) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value === 'true' || value === '1';
  }
  return undefined;
};

export const transformToNumberArray = ({ value }: { value: any }) => {
  if (Array.isArray(value)) {
    return value
      .map((val) => Number(val))
      .filter((num) => !Number.isNaN(num));
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed
          .map((val) => Number(val))
          .filter((num) => !Number.isNaN(num));
      }
    } catch {
      return value
        .split(',')
        .map((val) => Number(val.trim()))
        .filter((num) => !Number.isNaN(num));
    }
  }
  return undefined;
};

export class CreateMenuItemDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Transform(transformToNumber)
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Transform(transformToBoolean)
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean = true;

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
