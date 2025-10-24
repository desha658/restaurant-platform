import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMenuDto } from '../dto/menu/create-menu.dto';
import { UpdateMenuDto } from '../dto/menu/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async createMenu(dto: CreateMenuDto) {
    return this.prisma.menu.create({
      data: {
        name: dto.name,
        description: dto.description,
        imageUrl: dto.imageUrl,
        isActive: dto.isActive ?? true,
        restaurantId: dto.restaurantId,
        branchId: dto.branchId,
        menuItems: dto.menuItemIds
          ? {
              connect: dto.menuItemIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: { menuItems: true },
    });
  }

  async updateMenu(dto: UpdateMenuDto) {
    const existing = await this.prisma.menu.findUnique({
      where: { id: dto.id },
    });
    if (!existing) {
      throw new HttpException('المنيو غير موجود', 404);
    }

    return this.prisma.menu.update({
      where: { id: dto.id },
      data: {
        name: dto.name ?? existing.name,
        description: dto.description ?? existing.description,
        imageUrl: dto.imageUrl ?? existing.imageUrl,
        isActive: dto.isActive ?? existing.isActive,
        restaurantId: dto.restaurantId ?? existing.restaurantId,
        branchId: dto.branchId ?? existing.branchId,
        menuItems: dto.menuItemIds
          ? {
              set: dto.menuItemIds.map((id) => ({ id })), // لتحديث العلاقة بالكامل
            }
          : undefined,
      },
      include: { menuItems: true },
    });
  }

  async getAllMenus() {
    return this.prisma.menu.findMany({
      include: {
        menuItems: {
          include: {
            subCategory: true, // لو عايز تجيب كمان الـ subCategory بتاعة كل item
          },
        },
        restaurant: {
          select: { id: true, name: true },
        },
        branch: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
