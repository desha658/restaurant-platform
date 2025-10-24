import { Module } from '@nestjs/common';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from 'prisma/prisma.service';
import { CategoryModule } from './category/category.module';
import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';
import { BranchModule } from './branch/branch.module';
import { SubCategoryController } from './sub-category/sub-category.controller';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { SubCategoryService } from './sub-category/sub-category.service';
import { MenuService } from './menu/menu.service';
import { MenuController } from './menu/menu.controller';
import { MenuModule } from './menu/menu.module';
@Module({
  imports: [
    UsersModule,
    CategoryModule,
    BranchModule,
    SubCategoryModule,
    MenuModule,
  ],
  controllers: [
    SuperAdminController,
    UsersController,
    CategoryController,
    SubCategoryController,
    MenuController,
  ],
  providers: [
    SuperAdminService,
    UsersService,
    PrismaService,
    CategoryService,
    SubCategoryService,
    MenuService,
  ],
})
export class SuperAdminModule {}
