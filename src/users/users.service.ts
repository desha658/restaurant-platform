import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'; // أو 'bcryptjs' لو مثبته
import { PrismaService } from 'prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/common/utils/roles.enum';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private getAssignableRoles(role: Role): Role[] {
    switch (role) {
      case Role.SUPER_ADMIN:
        return [
          Role.SUPER_ADMIN,
          Role.OWNER,
          Role.OWNER_BRANCH,
          Role.CASHIER,
          Role.CUSTOMER,
        ];
      case Role.OWNER:
        return [Role.OWNER_BRANCH, Role.CASHIER];
      case Role.OWNER_BRANCH:
        return [Role.CASHIER];
      default:
        return [];
    }
  }

  private ensureCanManageTarget(
    currentUserRole: Role,
    targetRole: Role,
    action: string,
  ) {
    if (currentUserRole === Role.SUPER_ADMIN) {
      return;
    }

    const allowedRoles = this.getAssignableRoles(currentUserRole);
    if (!allowedRoles.includes(targetRole)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: `لا يمكنك ${action} مستخدم بهذا الدور`,
          data: null,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async createUser(dto: CreateUserDto, currentUser: any) {
    const { name, email, password, phone, role } = dto;

    // تحقق من الإيميل
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'الإيميل موجود من قبل',
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // السماح فقط حسب الدور
    const allowedRoles = this.getAssignableRoles(currentUser.role);
    if (!allowedRoles.includes(role)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.FORBIDDEN,
            message: 'لا يمكنك إنشاء هذا النوع من المستخدمين',
          data: null,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        role,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'تم إنشاء المستخدم بنجاح',
      data: user,
    };
  }

  async updateUser(dto: UpdateUserDto, currentUser: any) {
    const { id, email, password, role: newRole, ...rest } = dto;

    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('هذا المستخدم غير موجود');
    }

    this.ensureCanManageTarget(currentUser.role, existingUser.role as Role, 'تعديل');
    const allowedRoles = this.getAssignableRoles(currentUser.role);

    // 🔹 تأكد إن الإيميل الجديد مش مستخدم من قبل
    if (email) {
      const emailUsed = await this.prisma.user.findUnique({ where: { email } });
      if (emailUsed && emailUsed.id !== id) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'الإيميل مستخدم بالفعل من قبل مستخدم آخر',
            data: null,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (newRole && !allowedRoles.includes(newRole)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'لا يمكنك إعطاء هذا الدور',
          data: null,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 🔹 تشفير الباسورد لو اتبعت
    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...rest,
        ...(newRole ? { role: newRole } : {}),
        ...(email ? { email } : {}),
        ...(hashedPassword ? { password: hashedPassword } : {}),
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'تم تعديل المستخدم بنجاح',
      data: updatedUser,
    };
  }

  async getUsers(currentUser: any, role?: Role) {
    const allowedRoles = this.getAssignableRoles(currentUser.role);
    if (
      currentUser.role !== Role.SUPER_ADMIN &&
      role &&
      !allowedRoles.includes(role)
    ) {
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'لا يمكنك عرض هذا الدور',
          data: null,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const where: Prisma.UserWhereInput = {};
    if (role) {
      where.role = role;
    } else if (currentUser.role !== Role.SUPER_ADMIN) {
      if (!allowedRoles.length) {
        return {
          message: 'لا يوجد مستخدمين متاحين لهذا الدور',
          data: [],
        };
      }
      where.role = { in: allowedRoles };
    }

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
      message: role
        ? `تم جلب ${role} بنجاح`
        : 'تم جلب المستخدمين المسموح بهم بنجاح',
      data: users,
    };
  }

  async getUser(id: number, currentUser: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'المستخدم غير موجود',
          data: null,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    this.ensureCanManageTarget(currentUser.role, user.role as Role, 'عرض');

    return {
      statusCode: HttpStatus.OK,
      message: 'تم جلب المستخدم بنجاح',
      data: user,
    };
  }

  async deleteUser(id: number, currentUser: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'المستخدم غير موجود',
          data: null,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    this.ensureCanManageTarget(currentUser.role, user.role as Role, 'حذف');

    await this.prisma.user.delete({ where: { id } });

    return {
      statusCode: HttpStatus.OK,
      message: 'تم حذف المستخدم بنجاح',
      data: null,
    };
  }
}
