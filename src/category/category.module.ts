import { Module } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { SubCategoryModule } from 'src/sub-category/sub-category.module';

@Module({
  imports: [SubCategoryModule],
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService],
  exports: [CategoryService],
})
export class CategoryModule {}
