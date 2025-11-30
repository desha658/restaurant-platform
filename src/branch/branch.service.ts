import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchService {
  private readonly BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

  constructor(private prisma: PrismaService) {}
  async createBranch(dto: CreateBranchDto) {
    const existing = await this.prisma.branch.findFirst({
      where: { name: dto.name },
    });

    if (existing) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'اسم الفرع موجود بالفعل',
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const branch = await this.prisma.branch.create({
      data: {
        name: dto.name,
        address: dto.address,
        phone: dto.phone,
        deliveryTime: dto.deliveryTime,
        hasOffer: dto.hasOffer,
        offer: dto.offer,
        minOrder: dto.minOrder,
        restaurant: { connect: { id: dto.restaurantId } },
        ownerBranch: { connect: { id: dto.ownerBranchId } },
        cashiers: dto.cashierIds
          ? { connect: dto.cashierIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        restaurant: true,
        ownerBranch: true,
        cashiers: true,
      },
    });

    return {
      message: 'تم إنشاء الفرع بنجاح',
      data: branch,
    };
  }

  async getAllBranches() {
    const branches = await this.prisma.branch.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        createdAt: true,
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
        ownerBranch: {
          select: {
            id: true,
            name: true,
          },
        },
        cashiers: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      message: 'تم جلب جميع الفروع بنجاح',
      data: branches,
    };
  }

  async getBranchById(id: number) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        createdAt: true,
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
        ownerBranch: {
          select: {
            id: true,
            name: true,
          },
        },
        cashiers: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!branch) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'الفرع غير موجود',
          data: null,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      message: `تم جلب بيانات الفرع (${branch.name}) بنجاح`,
      data: branch,
    };
  }

  async updateBranch(dto: UpdateBranchDto) {
    const { id } = dto;
    const branch = await this.prisma.branch.findUnique({
      where: { id },
      include: { cashiers: true },
    });

    if (!branch) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'الفرع غير موجود',
          data: null,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // تحديث البيانات
    const updatedBranch = await this.prisma.branch.update({
      where: { id },
      data: {
        name: dto.name,
        address: dto.address,
        phone: dto.phone,
        deliveryTime: dto.deliveryTime,
        hasOffer: dto.hasOffer,
        offer: dto.offer,
        minOrder: dto.minOrder,
        restaurant: dto.restaurantId
          ? { connect: { id: dto.restaurantId } }
          : undefined,
        ownerBranch: dto.ownerBranchId
          ? { connect: { id: dto.ownerBranchId } }
          : undefined,
        // تحديث الكاشيرين (استبدالهم بالكامل)
        cashiers: dto.cashierIds
          ? {
              set: [], // نحذف الكاشيرين الحاليين
              connect: dto.cashierIds.map((id) => ({ id })), // ونضيف الجديدين
            }
          : undefined,
      },
      include: {
        restaurant: true,
        ownerBranch: true,
        cashiers: true,
      },
    });

    return {
      message: 'تم تحديث بيانات الفرع بنجاح',
      data: updatedBranch,
    };
  }

  async deleteBranch(id: number) {
    const exists = await this.prisma.branch.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Branch not found');

    await this.prisma.branch.delete({ where: { id } });
    return { message: 'تم حذف الفرع بنجاح' };
  }

  private resolveImageUrl(imagePath?: string | null): string {
    if (!imagePath) {
      return '';
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    return `${this.BASE_URL}${imagePath}`;
  }

  async getBranchMenu(branchId: number) {
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        menu: {
          include: {
            categories: {
              include: {
                subCategories: true,
              },
            },
            menuItems: {
              include: {
                subCategory: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!branch || !branch.menu) {
      return { message: 'No menu found for this branch' };
    }

    const menu = branch.menu;

    // 🎯 1) Format Categories
    const categories = menu.categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
    }));

    // 🎯 2) Format SubCategories
    const subCategories = menu.categories.flatMap((cat) =>
      cat.subCategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
        categoryId: cat.id,
      })),
    );

    // 🎯 3) Format MenuItems
    const menuItems = menu.menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: this.resolveImageUrl(item.imageUrl),
      available: item.isAvailable,
      categoryId: item.subCategory?.categoryId ?? null,
      subCategoryId: item.subCategoryId ?? null,
    }));

    return {
      id: menu.id,
      name: menu.name,
      description: menu.description,
      categories,
      subCategories,
      menuItems,
      branch: {
        id: branch.id,
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        deliveryTime: branch.deliveryTime,
        isOpen: branch.isOpen,
        hasOffer: branch.hasOffer,
        createdAt: branch.createdAt,
      },
    };
  }
}
