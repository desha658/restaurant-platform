import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsInt,
} from 'class-validator';

export class UpdateMenuDto {
  @IsInt()
  id: number; // ضروري لتحديد المنيو المراد تحديثها

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // فقط OWNER أو SUPER_ADMIN يمكنه تحديث branchId
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
