import { Module } from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { MenuItemController } from './menu-item.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [MenuItemController],
  providers: [MenuItemService, PrismaService],
})
export class MenuItemModule {}
