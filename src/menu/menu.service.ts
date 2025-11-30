import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async createMenu(dto: CreateMenuDto, user: any) {
    let branchConnect;

    if (user.role === 'OWNER_BRANCH') {
      // جيب الـ branch اللي المالك بتاعه هو user.id
      const branch = await this.prisma.branch.findFirst({
        where: { ownerBranchId: user.id },
      });

      if (!branch) {
        throw new HttpException('الفرع الخاص بالمستخدم غير موجود', 404);
      }

      branchConnect = { connect: { id: branch.id } };
    } else if (user.role === 'OWNER' || user.role === 'SUPER_ADMIN') {
      branchConnect = dto.branchId
        ? { connect: { id: dto.branchId } }
        : undefined;
    }

    return this.prisma.menu.create({
      data: {
        name: dto.name,
        description: dto.description,
        imageUrl: dto.imageUrl,
        isActive: dto.isActive ?? true,
        branch: branchConnect,
        menuItems: dto.menuItemIds
          ? { connect: dto.menuItemIds.map((id) => ({ id })) }
          : undefined,
        categories: dto.categoryIds
          ? { connect: dto.categoryIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { menuItems: true, categories: true },
    });
  }

  async updateMenu(dto: UpdateMenuDto, user: any) {
    const existing = await this.prisma.menu.findUnique({
      where: { id: dto.id },
      include: { menuItems: true, categories: true },
    });

    if (!existing) {
      throw new HttpException('المنيو غير موجود', 404);
    }

    // تحديد branch حسب الدور
    let branchConnect;
    if (user.role === 'OWNER_BRANCH') {
      // جيب الـ branch اللي المالك بتاعه هو user.id
      const branch = await this.prisma.branch.findFirst({
        where: { ownerBranchId: user.id },
      });

      if (!branch) {
        throw new HttpException('الفرع الخاص بالمستخدم غير موجود', 404);
      }

      branchConnect = { connect: { id: branch.id } };
    } else if (user.role === 'OWNER' || user.role === 'SUPER_ADMIN') {
      branchConnect = dto.branchId
        ? { connect: { id: dto.branchId } }
        : undefined;
    }

    return this.prisma.menu.update({
      where: { id: dto.id },
      data: {
        name: dto.name ?? existing.name,
        description: dto.description ?? existing.description,
        imageUrl: dto.imageUrl ?? existing.imageUrl,
        isActive: dto.isActive ?? existing.isActive,
        branch: branchConnect,
        menuItems: dto.menuItemIds
          ? {
              set: dto.menuItemIds.map((id) => ({ id })),
            }
          : undefined,
        categories: dto.categoryIds
          ? {
              set: dto.categoryIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: { menuItems: true, categories: true },
    });
  }

  async getAllMenus() {
    return this.prisma.menu.findMany({
      include: {
        menuItems: {
          include: {
            subCategory: true,
          },
        },
        branch: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
