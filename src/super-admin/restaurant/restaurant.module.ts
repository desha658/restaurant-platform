import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';

@Module({
  providers: [RestaurantService, PrismaService],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
