import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateRestaurantDto } from './dto/restaurant/update-restaurant.dto';
import { CreateRestaurantDto } from './dto/restaurant/create-restaurant.dto';
@Injectable()
export class SuperAdminService {
  constructor(private readonly prisma: PrismaService) {}

  /// Restaurant
  async createRestaurant(dto: CreateRestaurantDto) {
    const existingRestaurant = await this.prisma.restaurant.findUnique({
      where: { name: dto.name },
    });

    if (existingRestaurant) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'اسم المطعم موجود بالفعل',
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const restaurant = await this.prisma.restaurant.create({
      data: {
        name: dto.name,
        owner: { connect: { id: dto.ownerId } },
        cuisine: dto.cuisine,
        imageUrl: dto.imageUrl,
      },
    });

    return {
      message: 'تم إنشاء المطعم بنجاح',
      data: restaurant,
    };
  }

  async updateRestaurant(dto: UpdateRestaurantDto) {
    const id = dto.id;
    const existing = await this.prisma.restaurant.findUnique({ where: { id } });

    if (!existing) throw new NotFoundException('هذا المطعم غير موجود');

    const restaurant = await this.prisma.restaurant.update({
      where: { id },
      data: {
        name: dto.name ?? existing.name,
        ownerId: dto.ownerId ?? existing.ownerId,
        cuisine: dto.cuisine ?? existing.cuisine,
        imageUrl: dto.imageUrl ?? existing.imageUrl,
      },
    });

    return {
      message: 'تم تعديل المطعم بنجاح',
      data: restaurant,
    };
  }

  async deleteRestaurant(id: number) {
    const exists = await this.prisma.restaurant.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('هذا المطعم غير موجود');

    await this.prisma.restaurant.delete({ where: { id } });
    return { message: 'تم حذف المطعم بنجاح' };
  }
}
