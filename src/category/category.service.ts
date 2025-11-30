import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(dto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: dto as any,
      include: { subCategories: true },
    });

    return {
      message: 'تم إنشاء التصنيف بنجاح',
      data: category,
    };
  }

  async getAllCategories() {
    const categories = await this.prisma.category.findMany({
      include: { subCategories: true },
    });

    return {
      message: 'تم جلب جميع التصنيفات بنجاح',
      data: categories,
    };
  }

  async getCategoryById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { subCategories: true },
    });

    if (!category) {
      throw new NotFoundException('لم يتم العثور على هذا التصنيف');
    }

    return {
      message: 'تم جلب التصنيف بنجاح',
      data: category,
    };
  }

  async updateCategory(dto: UpdateCategoryDto) {
    const id = dto.id;
    const category = await this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name ?? undefined,
      },
      include: { subCategories: true },
    });

    return {
      message: 'تم تعديل التصنيف بنجاح',
      data: category,
    };
  }

  async deleteCategory(id: number) {
    await this.prisma.category.delete({ where: { id } });
    return { message: 'تم حذف التصنيف بنجاح' };
  }
}
