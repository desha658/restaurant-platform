import { Module } from '@nestjs/common';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { PrismaService } from 'prisma/prisma.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { RestaurantController } from './restaurant/restaurant.controller';
import { RestaurantService } from './restaurant/restaurant.service';

@Module({
  imports: [RestaurantModule],
  controllers: [SuperAdminController, RestaurantController],
  providers: [SuperAdminService, RestaurantService, PrismaService],
})
export class SuperAdminModule {}
