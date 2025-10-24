import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/user/create-user.dto';
import * as bcrypt from 'bcrypt'; // أو 'bcryptjs' لو مثبته
import { PrismaService } from 'prisma/prisma.service';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { Role } from 'src/common/utils/roles.enum';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createAuthDto: CreateUserDto) {
    const { name, email, password, phone, role } = createAuthDto;
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      const message = 'الإيميل موجود من قبل';
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message,
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      !['SUPER_ADMIN', 'OWNER', 'CASHIER', 'CUSTOMER', 'OWNER_BRANCH'].includes(
        createAuthDto.role,
      )
    ) {
      const message =
        'Role must be one of: SUPER_ADMIN, OWNER, CASHIER, or CUSTOMER';
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message,
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await this.prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashPassword,
        role,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'تم إنشاء المستخدم بنجاح',
      data: null,
    };
  }

  async updateUser(dto: UpdateUserDto) {
    const id = dto.id;
    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
    });

    return {
      message: 'تم تعديل المستخدم بنجاح',
      data: user,
    };
  }

  async getUsers(role?: Role) {
    const where = role ? { role } : {};
    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
      },
    });

    return {
      message: role ? `تم جلب ${role} بنجاح` : 'تم جلب جميع المستخدمين بنجاح',
      data: users,
    };
  }

  async deleteUser(id: number) {
    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('المستخدم غير موجود');

    await this.prisma.user.delete({ where: { id } });
    return { message: 'تم حذف المستخدم بنجاح' };
  }
}
