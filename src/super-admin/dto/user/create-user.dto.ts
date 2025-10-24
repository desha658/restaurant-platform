import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Role } from 'src/common/utils/roles.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsEnum(Role, {
    message:
      'Role must be one of: SUPER_ADMIN, OWNER, OWNER_BRANCH, CASHIER OR CUSTOMER',
  })
  role: Role;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
