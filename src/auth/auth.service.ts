import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/super-admin/dto/user/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateUserDto) {
    const { name, email, password, phone, role } = createAuthDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      const message = 'Email already exists';
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message,
          data: null,
        },
        200,
      );
    }

    if (
      !['SUPER_ADMIN', 'OWNER', 'CASHIER', 'CUSTOMER', 'OWNER_BRANCH'].includes(
        createAuthDto.role,
      )
    ) {
      const message =
        'Role must be one of: SUPER_ADMIN, OWNER, OWNER_BRANCH, CASHIER, or CUSTOMER';
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message,
          data: null,
        },
        200,
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
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
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(loginDto: { email: string; password: string }) {
    const { email, password } = loginDto;

    if (!email) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'الإيميل مطلوب',
          data: null,
        },
        HttpStatus.OK,
      );
    }

    if (!password) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'كلمة المرور مطلوبة',
          data: null,
        },
        HttpStatus.OK,
      );
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'الإيميل غير موجود',
          data: null,
        },
        HttpStatus.OK,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'كلمة المرور غير صحيحة',
          data: null,
        },
        HttpStatus.OK,
      );
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    };
  }
}
