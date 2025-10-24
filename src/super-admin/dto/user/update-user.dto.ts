import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { Role } from 'src/common/utils/roles.enum';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsInt()
  id: number;
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsEnum(Role, {
    message:
      'Role must be one of: SUPER_ADMIN, OWNER, OWNER_BRANCH, CASHIER OR CUSTOMER',
  })
  role: Role;
}
