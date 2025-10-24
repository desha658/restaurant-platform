import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateBranchDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
  @IsArray()
  @IsOptional()
  cashierIds?: number[];
  @IsInt()
  @IsNotEmpty()
  ownerBranchId: number;
  @IsString()
  @IsOptional()
  @MinLength(2)
  name?: string;
  @IsString()
  @IsOptional()
  @MinLength(2)
  address?: string;
  @IsString()
  @IsOptional()
  @MinLength(11)
  phone?: string;

  @IsString()
  @IsOptional()
  deliveryTime?: string;

  @IsBoolean()
  @IsOptional()
  hasOffer?: boolean;

  @IsInt()
  @IsOptional()
  offer?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  minOrder?: number;

  @IsInt()
  @IsOptional()
  restaurantId?: number;
}
