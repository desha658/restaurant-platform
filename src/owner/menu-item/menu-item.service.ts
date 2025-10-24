import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MenuItemService {
  constructor(private prisma: PrismaService) {}

  async createMenuItem(dto: CreateMenuItemDto) {
    // تحقق لو الاسم موجود مسبقًا في نفس التصنيف
    const existing = await this.prisma.menuItem.findFirst({
      where: { name: dto.name },
    });

    if (existing) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'اسم العنصر موجود بالفعل',
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const item = await this.prisma.menuItem.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        imageUrl: dto.imageUrl,
        isAvailable: dto.isAvailable ?? true,
        subCategory: dto.subCategoryId
          ? { connect: { id: dto.subCategoryId } }
          : undefined,
        // ✅ ربط العنصر بعدة منيوهات
        menus:
          dto.menuIds && dto.menuIds.length > 0
            ? {
                connect: dto.menuIds.map((menuId) => ({ id: menuId })),
              }
            : undefined,
      },
      include: {
        menus: true,
        subCategory: true,
      },
    });

    return {
      message: 'تم إنشاء العنصر بنجاح',
      data: item,
    };
  }

  async getAll() {
    const items = await this.prisma.menuItem.findMany({
      include: { menus: true, subCategory: true },
      orderBy: { id: 'desc' },
    });

    return {
      message: 'تم جلب جميع العناصر بنجاح',
      data: items,
    };
  }

  async getById(id: number) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: { menus: true, subCategory: true },
    });

    if (!item) {
      throw new HttpException('العنصر غير موجود', HttpStatus.NOT_FOUND);
    }

    return {
      message: 'تم جلب العنصر بنجاح',
      data: item,
    };
  }

  async update(dto: UpdateMenuItemDto) {
    const id = dto.id;
    const existing = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpException('العنصر غير موجود', HttpStatus.NOT_FOUND);
    }

    const updated = await this.prisma.menuItem.update({
      where: { id },
      data: {
        name: dto.name ?? existing.name,
        description: dto.description ?? existing.description,
        price: dto.price ?? existing.price,
        imageUrl: dto.imageUrl ?? existing.imageUrl,
        isAvailable: dto.isAvailable ?? existing.isAvailable,
        subCategoryId: dto.subCategoryId ?? existing.subCategoryId,

        // ✅ لو المستخدم أرسل قائمة من IDs للمنيوهات
        ...(dto.menuIds && dto.menuIds.length > 0
          ? {
              menus: {
                set: dto.menuIds.map((menuId) => ({ id: menuId })),
              },
            }
          : {}),
      },
      include: {
        menus: true,
        subCategory: true,
      },
    });

    return {
      message: 'تم تعديل العنصر بنجاح',
      data: updated,
    };
  }

  async delete(id: number) {
    const existing = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpException('العنصر غير موجود', HttpStatus.NOT_FOUND);
    }

    await this.prisma.menuItem.delete({ where: { id } });

    return {
      message: 'تم حذف العنصر بنجاح',
    };
  }
}
