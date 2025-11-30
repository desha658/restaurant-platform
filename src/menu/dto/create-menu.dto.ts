import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateMenuDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // فرعي: فقط OWNER أو SUPER_ADMIN يقدر يحدد branchId
  @IsOptional()
  @IsInt()
  branchId?: number;

  // IDs للأصناف المرتبطة بالمنيو
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  menuItemIds?: number[];

  // IDs للأقسام المرتبطة بالمنيو
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];
}
