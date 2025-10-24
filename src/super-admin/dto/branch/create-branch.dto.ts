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

export class CreateBranchDto {
  @IsArray()
  @IsOptional()
  cashierIds?: number[];
  @IsInt()
  @IsNotEmpty()
  ownerBranchId: number;
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  address: string;
  @IsString()
  @IsOptional()
  @MinLength(11)
  phone: string;

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
  @IsNotEmpty()
  restaurantId: number;
}
