import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateSubCategoryDto } from '../dto/subCategory/update-subCategory.dto';
import { PrismaService } from 'prisma/prisma.service';
import { CreateSubCategoryDto } from '../dto/subCategory/create-subCategory.dto';

@Injectable()
export class SubCategoryService {
  constructor(private prisma: PrismaService) {}

  async createSubCategory(dto: CreateSubCategoryDto) {
    const subCategory = await this.prisma.subCategory.create({
      data: {
        name: dto.name,
        category: {
          connect: { id: dto.categoryId },
        },
      },
      include: { category: true },
    });

    return {
      message: 'تم إنشاء التصنيف الفرعي بنجاح',
      data: subCategory,
    };
  }

  async getAllSubCategories() {
    const subCategories = await this.prisma.subCategory.findMany({
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      orderBy: { id: 'desc' },
    });

    return {
      message: 'تم جلب جميع التصنيفات الفرعية بنجاح',
      data: subCategories,
    };
  }

  async getSubCategoryById(id: number) {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    if (!subCategory) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'لم يتم العثور على التصنيف الفرعي',
          data: null,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      message: 'تم جلب التصنيف الفرعي بنجاح',
      data: subCategory,
    };
  }

  async updateSubCategory(dto: UpdateSubCategoryDto) {
    const id = dto.id;
    const existingSubCategory = await this.prisma.subCategory.findUnique({
      where: { id },
    });

    if (!existingSubCategory) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'لم يتم العثور على التصنيف الفرعي',
          data: null,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const updated = await this.prisma.subCategory.update({
      where: { id },
      data: {
        name: dto.name,
        category: {
          connect: { id: dto.categoryId },
        },
      },
      include: { category: true },
    });

    return {
      message: 'تم تحديث التصنيف الفرعي بنجاح',
      data: updated,
    };
  }

  async deleteSubCategory(id: number) {
    const existingSubCategory = await this.prisma.subCategory.findUnique({
      where: { id },
    });

    if (!existingSubCategory) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'لم يتم العثور على التصنيف الفرعي',
          data: null,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.subCategory.delete({
      where: { id },
    });

    return {
      message: 'تم حذف التصنيف الفرعي بنجاح',
      data: null,
    };
  }
}
