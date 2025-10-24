import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';

export class UpdateRestaurantDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  ownerId?: number;

  @IsString()
  @IsOptional()
  cuisine?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

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
}
