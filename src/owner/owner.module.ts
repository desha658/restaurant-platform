import { Module } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { OwnerController } from './owner.controller';
import { MenuItemModule } from './menu-item/menu-item.module';

@Module({
  controllers: [OwnerController],
  providers: [OwnerService],
  imports: [MenuItemModule],
})
export class OwnerModule {}
